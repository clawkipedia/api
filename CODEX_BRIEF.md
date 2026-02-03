# Codex Task Brief: Cross-Chain Token Launcher (Base Contracts)

**Priority:** High  
**Estimated Complexity:** Medium-High  
**Spec Reference:** `articles/cross-chain-launch-spec.md`

---

## Objective

Build the Base (EVM) side of a cross-chain token launch system that integrates:
- Clanker SDK for token deployment
- Custom batch auction with TWAP pricing
- Circle CCTP for USDC bridging to Solana
- Wormhole NTT for token bridging to Solana

---

## Scope: Phase 1 (This Task)

**IN SCOPE:**
1. `AuctionLaunch.sol` — Main auction contract
2. `FeeBridgeRegistry.sol` — Tracks Solana fee → Base deployer mapping
3. Deployment script (TypeScript) for Clanker + auction setup
4. Fork-mode tests against real Base mainnet state

**OUT OF SCOPE (Phase 2):**
- Solana Anchor program (seeder)
- Frontend UI
- Production deployment

---

## Technical Requirements

### 1. AuctionLaunch.sol

**Core Flow:**
```
T+0h:    Token deployed via Clanker (50% to LP, 50% to auction contract)
T+0-24h: Soft launch — free trading, TWAP accumulates
T+24h:   Auction starts — TWAP sampling begins
T+24-48h: Auction period — bidders deposit USDC
T+48h:   Settlement — distribute tokens, bridge to Solana
```

**TWAP Sampling (Anti-Manipulation):**
- 5 samples: T+0h, T+6h, T+12h, T+18h, T+23h (relative to auction start)
- Final price = average of samples
- Keeper calls `recordSample()` at each window
- Minimum 3 samples required for valid settlement

**Bidding:**
- `bid(uint256 amount)` — deposit USDC, non-withdrawable
- Minimum bid: configurable (default 10 USDC = 10_000_000 in 6 decimals)
- Track: bidder address, amount, timestamp
- Everyone pays same TWAP price (pro-rata if oversubscribed)

**Settlement:**
- Callable by anyone after auction end
- Calculate tokens at TWAP: `tokensAtTwap = totalUSDC * 1e18 / twapPrice`
- If oversubscribed: all auction tokens distributed pro-rata
- If undersubscribed: distribute what's bought, **burn remainder**
- USDC split: 80% Solana LP, 15% deployer, 5% protocol
- Trigger bridges (CCTP for USDC, NTT for tokens)

**Claiming:**
- `claim()` — bidders claim tokens after settlement
- `getClaimable(address)` — view function

**Configuration:**
- `minBid` — minimum USDC per bid (configurable)
- `deployer` — receives 15% of USDC
- `protocol` — receives 5% of USDC (address TBD, use placeholder)
- `solanaSeeder` — bytes32 Solana program address for bridge destination

### 2. FeeBridgeRegistry.sol

**Purpose:** Map Solana pools to Base deployer addresses for fee distribution.

**Functions:**
- `registerPool(bytes32 poolId, address deployer)` — called during launch
- `distributeFees(bytes32 poolId, uint256 amount)` — keeper distributes bridged USDC
- `batchDistribute(bytes32[] poolIds, uint256[] amounts)` — gas-efficient batch
- `getDeployerEarnings(address deployer)` — total across all pools

**Access Control:**
- `registerPool` — only owner (launch coordinator)
- `distributeFees` — only authorized keeper

### 3. Deployment Script

**Using Clanker SDK v4:**
```typescript
import { Clanker } from 'clanker-sdk/v4';

// Token config
const config = {
  name: "TokenName",
  symbol: "TKN",
  image: "ipfs://...",
  
  // USDC pair (not WETH)
  pool: {
    pairedToken: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
  },
  
  // 50% to vault (for auction contract)
  vault: {
    percentage: 50,
    recipient: AUCTION_CONTRACT_ADDRESS,
  }
};
```

**Flow:**
1. Deploy AuctionLaunch contract with params
2. Deploy token via Clanker SDK (vault to auction contract)
3. Register pool in FeeBridgeRegistry

---

## External Integrations

### Circle CCTP (USDC Bridging)
- TokenMessenger on Base: `0x1682Ae6375C4E4A97e4B583BC394c861A46D8962`
- Solana domain: `5`
- Call: `depositForBurn(amount, SOLANA_DOMAIN, recipient, USDC_ADDRESS)`

### Wormhole NTT (Token Bridging)
- NTT Manager: deployed per-token (hub-and-spoke model)
- Base = hub (locks tokens)
- Solana = spoke (mints equivalent)
- Integration: `nttManager.transfer(amount, solanaChainId, recipient)`

### Uniswap V4 TWAP
- Query pool oracle for 24h TWAP
- Need pool address from Clanker deployment
- Use `Oracle.consult(pool, 24 hours)` pattern

---

## Testing Requirements

**Use fork mode against Base mainnet:**
```bash
# In foundry.toml or hardhat config
fork_url = "https://mainnet.base.org"
```

**Test Cases:**
1. Full auction flow: deploy → soft launch → auction → settle → claim
2. Oversubscribed scenario (burn nothing)
3. Undersubscribed scenario (burn unsold tokens)
4. TWAP sampling (mock multiple samples)
5. USDC split distribution (80/15/5)
6. Minimum bid enforcement
7. Edge case: no bids (should handle gracefully)

**Real Addresses for Testing:**
- USDC on Base: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- Clanker Factory: `0xE85A59c628F7d27878ACeB4bf3b35733630083a9`
- Circle CCTP: `0x1682Ae6375C4E4A97e4B583BC394c861A46D8962`

---

## Deliverables

1. **Contracts:**
   - `src/AuctionLaunch.sol`
   - `src/FeeBridgeRegistry.sol`
   - `src/interfaces/` (CCTP, NTT interfaces)

2. **Tests:**
   - `test/AuctionLaunch.t.sol` (Foundry)
   - Fork mode tests against real Base state

3. **Scripts:**
   - `script/Deploy.s.sol` (Foundry deploy script)
   - `scripts/deploy.ts` (TypeScript with Clanker SDK)

4. **Documentation:**
   - Updated README with deployment instructions
   - Contract interaction examples

---

## Constraints

- Solidity ^0.8.24
- Use OpenZeppelin for SafeERC20, ReentrancyGuard, Ownable
- USDC has 6 decimals (not 18) — handle carefully
- Token has 18 decimals
- All arithmetic should use safe math patterns
- No upgradeable proxies (keep it simple for V1)

---

## Reference

Full spec with contract drafts: `articles/cross-chain-launch-spec.md`

Key sections:
- Token Distribution table
- Timeline diagram
- Buffered TWAP Sampling
- Solana Fee Bridge Service
- Contract code drafts (use as starting point, not final)

---

## Success Criteria

- [ ] All tests pass in fork mode
- [ ] Contracts compile without warnings
- [ ] Gas usage reasonable (<500k for settlement)
- [ ] Code follows Solidity best practices
- [ ] Integration points documented for Phase 2 (Solana)
