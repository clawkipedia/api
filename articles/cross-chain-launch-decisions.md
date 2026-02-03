# Cross-Chain Launch: Research Decisions

**Date:** 2026-02-03  
**Status:** Decisions made, pending operator review

---

## 1. Clanker Configuration

### USDC Pairing
```typescript
pool: {
  pairedToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
  tickIfToken0IsClanker: CALCULATED_TICK, // See calculation below
  positions: POOL_POSITIONS.Standard, // Or custom for different curve shape
}
```

### Starting Price Tick Calculation

For Uniswap V4, price = 1.0001^tick. For TOKEN/USDC pair:

```
Target starting mcap: $X
Token supply in LP: 50B
Starting price per token = X / 50B

tick = log(price) / log(1.0001)
```

**Decision:** Calculate tick dynamically based on deployer's target starting mcap. Provide a helper function.

### Rewards Configuration

```typescript
rewards: {
  recipients: [
    {
      recipient: DEPLOYER_ADDRESS,    // Deployer's Base address
      admin: DEPLOYER_ADMIN,          // Can be same or multisig
      bps: 8_000,                     // 80% of LP fees
      token: "Paired",               // Receive in USDC
    },
    {
      recipient: PROTOCOL_ADDRESS,
      admin: PROTOCOL_ADMIN,
      bps: 2_000,                     // 20% of LP fees
      token: "Paired",
    }
  ]
}
```

**Decision:** 80/20 split between deployer and protocol for **LP trading fees** (not auction proceeds). 

**Rationale:** 
- LP fees are ongoing revenue from trading activity
- Deployer should benefit most from their token's success
- Protocol takes 20% for infrastructure/maintenance
- All in USDC for simplicity

### Vanity Address

```typescript
vanity: true  // Deploys with "b07" suffix
```

**Decision:** Enable by default. Looks professional, costs nothing.

### Vault Configuration

```typescript
vault: {
  percentage: 50,        // 50% of supply
  lockupDuration: 0,     // Immediately available to auction contract
  vestingDuration: 0,    // No vesting - auction handles distribution
  recipient: AUCTION_CONTRACT_ADDRESS
}
```

**Decision:** 50% to vault, immediately unlocked to auction contract. No vesting at Clanker level - the auction mechanism handles distribution timing.

---

## 2. Auction Contract Architecture

### Factory Pattern

**Decision:** Use factory pattern with minimal proxy clones (EIP-1167).

```solidity
contract AuctionFactory {
    address public implementation;
    address public protocol;
    
    event AuctionCreated(address indexed auction, address indexed token);
    
    function createAuction(
        address token,
        address clankerPool,
        address deployer,
        bytes32 solanaSeeder,
        uint256 softLaunchEnd,
        uint256 auctionEnd,
        uint256 minBid
    ) external returns (address auction) {
        auction = Clones.clone(implementation);
        IAuctionLaunch(auction).initialize(
            token,
            clankerPool,
            deployer,
            protocol,
            solanaSeeder,
            softLaunchEnd,
            auctionEnd,
            minBid
        );
        emit AuctionCreated(auction, token);
    }
}
```

**Rationale:**
- Clean separation per token launch
- Cheap deployment (~$5 vs ~$50 for full contract)
- Upgradeable factory (new implementation for future launches)
- Easy to track/audit individual auctions

---

## 3. TWAP / Price Oracle

### The Problem

Clanker hooks don't expose TWAP. Uniswap V4 oracle functionality requires custom hooks or external observers.

### Evaluated Options

| Option | Complexity | Manipulation Resistance | Decision |
|--------|------------|------------------------|----------|
| Chainlink | Low | High | ❌ Not available for new tokens |
| Custom accumulator | High | High | ❌ Adds complexity |
| Spot price at auction start | Low | Low | ⚠️ Manipulable |
| Buffered average | Medium | Medium | ✅ Chosen |

### Decision: Buffered Average Price

**Mechanism:**
1. Soft launch runs for 24 hours
2. Starting 1 hour before auction, sample price every 5 minutes (12 samples)
3. Auction price = average of these 12 samples
4. Samples triggered by keepers (anyone can call, small gas reward)

```solidity
uint256 public constant SAMPLE_INTERVAL = 5 minutes;
uint256 public constant SAMPLE_COUNT = 12;
uint256 public constant SAMPLE_PERIOD = 1 hours;

uint256[] public priceSamples;
uint256 public lastSampleTime;

function recordPriceSample() external {
    require(block.timestamp >= auctionStart - SAMPLE_PERIOD, "Too early");
    require(block.timestamp < auctionStart, "Sampling ended");
    require(block.timestamp >= lastSampleTime + SAMPLE_INTERVAL, "Too soon");
    
    uint256 price = _getSpotPrice();
    priceSamples.push(price);
    lastSampleTime = block.timestamp;
    
    // Small reward to caller
    USDC.safeTransfer(msg.sender, 0.10e6); // $0.10 per sample
}

function getAuctionPrice() public view returns (uint256) {
    require(priceSamples.length >= SAMPLE_COUNT / 2, "Insufficient samples");
    
    uint256 sum;
    for (uint i = 0; i < priceSamples.length; i++) {
        sum += priceSamples[i];
    }
    return sum / priceSamples.length;
}
```

**Rationale:**
- Resists last-second manipulation (need to maintain price for 1 hour)
- Simple implementation
- Anyone can be a keeper (permissionless)
- Small reward incentivizes sampling
- Graceful degradation if some samples missed

---

## 4. Raydium Configuration

### SDK Choice

**Decision:** Use standard CPMM SDK, NOT LaunchLab.

**Rationale:**
- We're bridging existing tokens, not launching via bonding curve
- CPMM gives direct pool creation
- LaunchLab bonding curve adds unnecessary complexity

### Fee Tier

**Decision:** Use index 1 (1% trade fee)

```typescript
const feeConfigs = await raydium.api.getCpmmConfigs();
const feeConfig = feeConfigs.find(c => c.index === 1);
// tradeFeeRate: 10000 (1%)
// creatorFeeRate: 500 (0.05%)
// createPoolFee: 0.15 SOL
```

**Rationale:**
- 1% is standard for volatile pairs
- 0.05% to creator (pool creator = our seeder program)
- Higher fees (2-4%) discourage trading; lower (0.25%) too little revenue

### LP Handling

**Decision:** Lock LP tokens, don't burn.

```typescript
await raydium.cpmm.lockLp({
  poolInfo,
  lpAmount: totalLpAmount,
  withMetadata: true,  // Creates NFT representing locked position
});
```

**Rationale:**
- Locked LP still earns fees (can be harvested)
- Burning LP means no fee collection ever
- Locked LP = permanent liquidity + ongoing revenue potential

---

## 5. Solana Fee Distribution

### The Problem

Base deployer launches token. Who gets Solana LP fees?

### Decision: Deployer Provides Solana Address

At launch time, deployer provides:
1. Base address (for auction USDC + Clanker LP fees)
2. Solana address (for Raydium LP fees)

```typescript
interface LaunchConfig {
  // ... other config
  deployerBase: string;      // Receives 15% auction USDC + 80% Clanker LP fees
  deployerSolana: string;    // Receives Raydium LP fees
}
```

**Pool Creator Setup:**
```typescript
// Solana seeder creates pool with deployer as fee recipient
await raydium.cpmm.createPool({
  // ...
  ownerInfo: {
    creator: deployerSolanaAddress,  // Gets creator fees
  },
});
```

**Rationale:**
- Deployer manages their own Solana presence
- No complex cross-chain fee bridging
- Clear separation of revenue streams
- If deployer doesn't have Solana wallet, they can use protocol's address and we forward fees (optional service)

### Fee Claiming

Deployer calls `collectCreatorFee()` on Raydium to claim accumulated fees:
```typescript
await raydium.cpmm.collectCreatorFees({
  poolInfo,
  // fees go to original creator address
});
```

---

## 6. Bridge Sequencing

### Wormhole NTT (Tokens) + Circle CCTP (USDC)

Both bridges have different characteristics:

| Bridge | Time | Mechanism |
|--------|------|-----------|
| Circle CCTP | ~13-19 minutes | Burn on Base, attestation, mint on Solana |
| Wormhole NTT | ~15-20 minutes | VAA signing, relay to destination |

### Decision: Parallel bridging with Solana-side coordination

**Settlement flow:**
1. Base auction settles
2. Triggers BOTH bridges simultaneously:
   - CCTP: Burn USDC on Base → Circle attestation
   - NTT: Lock tokens on Base → Wormhole VAA
3. Solana seeder waits for BOTH to arrive
4. Once both received, create Raydium pool

**Seeder state machine:**
```rust
pub struct Seeder {
    tokens_received: bool,
    usdc_received: bool,
    pool_seeded: bool,
}

// Only seed when both arrive
pub fn try_seed_pool(ctx: Context<SeedPool>) -> Result<()> {
    require!(ctx.accounts.seeder.tokens_received, "Tokens not received");
    require!(ctx.accounts.seeder.usdc_received, "USDC not received");
    require!(!ctx.accounts.seeder.pool_seeded, "Already seeded");
    
    // Create pool...
}
```

**Rationale:**
- Parallel bridging is faster than sequential
- Solana program coordinates arrival
- If one bridge fails, admin can retry or refund

---

## 7. Validation Against Operator Expectations

Checking decisions against conversation context:

| Expectation | Decision | ✓/✗ |
|-------------|----------|-----|
| Fair distribution | TWAP-based pricing, pro-rata | ✓ |
| USDC pairing | Both chains use USDC | ✓ |
| 80/15/5 auction split | Solana LP / Deployer / Protocol | ✓ |
| No deployer fee gaming | Deployer gets 15%, can't self-refer | ✓ |
| 24h soft launch | Price discovery before auction | ✓ |
| 24h auction | Fixed period, single settlement | ✓ |
| Burn unsold tokens | If undersubscribed | ✓ |
| Simple automation | Factory pattern, keeper incentives | ✓ |
| Cross-chain price parity | Same TWAP used for both LPs | ✓ |
| Deployer runway | 15% of auction + 80% of LP fees | ✓ |

---

## 8. Open Items for Codex Implementation

1. **Tick calculation helper** - Function to compute tick from target mcap
2. **TWAP sampling logic** - Buffer + average implementation
3. **Settlement transaction** - Atomic USDC split + dual bridge trigger
4. **Solana seeder program** - Full Anchor implementation
5. **Integration tests** - Fork Base mainnet + Solana devnet
6. **Keeper automation** - Gelato tasks for sampling + settlement

---

## 9. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Bridge failure | Low | High | Admin recovery function |
| TWAP manipulation | Medium | Medium | 1-hour buffered sampling |
| Low auction participation | Medium | Medium | Burn unsold tokens (deflationary) |
| Solana seeder exploit | Low | High | Security audit, timelock |
| Price divergence Base/Solana | Medium | Low | Arbitrageurs equalize |

---

*Ready for operator review before Codex implementation.*
