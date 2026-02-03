# Cross-Chain Token Launch Specification

**Version:** 0.1.0  
**Status:** Draft  
**Author:** Custos  
**Date:** 2026-02-03

---

## Overview

A fair token launch mechanism combining Clanker (Base) + Raydium (Solana) with USDC as the unified pair token. Features 24h soft launch for price discovery, 24h batch auction, and automated cross-chain LP seeding.

---

## Token Distribution

| Allocation | Tokens | % of Supply |
|------------|--------|-------------|
| Base LP (Clanker) | 50B | 50% |
| Auction bidders | 27.78B | 27.78% |
| Solana LP (Raydium) | 22.22B | 22.22% |
| **Total** | **100B** | **100%** |

## Auction USDC Distribution

| Recipient | % | Purpose |
|-----------|---|---------|
| Solana LP seed | 80% | Cross-chain liquidity |
| Deployer | 15% | Project runway |
| Protocol | 5% | Infrastructure |

---

## Timeline

```
T+0h: CLANKER LAUNCH
├── Deploy token via Clanker SDK
├── 50B tokens → TOKEN/USDC pool (one-sided LP)
├── 50B tokens → Auction contract (locked)
├── Trading begins immediately
└── TWAP accumulation starts

T+0 to T+24h: SOFT LAUNCH
├── Free trading on Base
├── Market establishes USDC price
└── 24h TWAP calculated

T+24h: AUCTION STARTS
├── TWAP locked (becomes auction price)
├── Bidders deposit USDC
└── Bids non-withdrawable

T+24h to T+48h: AUCTION PERIOD
├── USDC bids accumulate
├── Everyone pays TWAP price
└── Pro-rata if oversubscribed

T+48h: SETTLEMENT
├── Calculate token distribution
├── Burn unsold tokens (if undersubscribed)
├── USDC split: 80/15/5
├── Bridge tokens via Wormhole NTT
├── Bridge USDC via Circle CCTP
└── Trigger Solana seeding

T+48h + ~15min: SOLANA LP LIVE
├── Tokens + USDC arrive on Solana
├── Raydium CPMM pool created at TWAP price
└── LP tokens burned (permanent liquidity)
```

---

## Contract Addresses (To Be Deployed)

### Base Mainnet
| Contract | Address | Notes |
|----------|---------|-------|
| AuctionLaunch | TBD | Main auction contract |
| USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` | Native USDC on Base |
| Circle CCTP TokenMessenger | `0x1682Ae6375C4E4A97e4B583BC394c861A46D8962` | For USDC bridging |
| Wormhole NTT Manager | TBD | Per-token deployment |
| Clanker Factory | `0xE85A59c628F7d27878ACeB4bf3b35733630083a9` | Clanker v4 |

### Solana Mainnet
| Contract | Address | Notes |
|----------|---------|-------|
| SolanaSeeder | TBD | Receives + seeds LP |
| USDC | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` | Native USDC on Solana |
| Circle CCTP MessageTransmitter | `CCTPmbSD7gX1bxKPAmg77w8oFzNFpaQiQUWD43TKaecd` | For USDC receiving |
| Wormhole NTT Manager | TBD | Per-token deployment |
| Raydium CPMM Program | `CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C` | Pool creation |

---

## Base Contract: AuctionLaunch.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// Uniswap V4 for TWAP
import {IPoolManager} from "@uniswap/v4-core/contracts/interfaces/IPoolManager.sol";
import {Oracle} from "@uniswap/v4-core/contracts/libraries/Oracle.sol";

// Circle CCTP
import {ITokenMessenger} from "./interfaces/ITokenMessenger.sol";

// Wormhole NTT
import {INttManager} from "./interfaces/INttManager.sol";

/**
 * @title AuctionLaunch
 * @notice Fair token launch with TWAP-priced auction and cross-chain LP seeding
 * @dev Integrates Clanker, Circle CCTP, Wormhole NTT, and Raydium
 */
contract AuctionLaunch is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // ═══════════════════════════════════════════════════════════════════════
    // CONSTANTS
    // ═══════════════════════════════════════════════════════════════════════

    /// @notice USDC on Base
    IERC20 public constant USDC = IERC20(0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913);
    
    /// @notice Circle CCTP TokenMessenger on Base
    ITokenMessenger public constant CCTP = ITokenMessenger(0x1682Ae6375C4E4A97e4B583BC394c861A46D8962);
    
    /// @notice Solana domain for CCTP
    uint32 public constant SOLANA_DOMAIN = 5;
    
    /// @notice Basis points denominator
    uint256 public constant BPS = 10_000;
    
    /// @notice Solana LP share (80%)
    uint256 public constant SOLANA_LP_BPS = 8_000;
    
    /// @notice Deployer share (15%)
    uint256 public constant DEPLOYER_BPS = 1_500;
    
    /// @notice Protocol share (5%)
    uint256 public constant PROTOCOL_BPS = 500;

    // ═══════════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════════

    /// @notice Token being auctioned
    IERC20 public token;
    
    /// @notice Uniswap V4 pool for TWAP
    address public clankerPool;
    
    /// @notice Wormhole NTT Manager for token bridging
    INttManager public nttManager;
    
    /// @notice Solana seeder program address (32 bytes)
    bytes32 public solanaSeeder;
    
    /// @notice Tokens allocated to auction bidders
    uint256 public auctionTokens;
    
    /// @notice Tokens allocated to Solana LP
    uint256 public solanaTokens;
    
    /// @notice Soft launch end / auction start timestamp
    uint256 public auctionStart;
    
    /// @notice Auction end timestamp
    uint256 public auctionEnd;
    
    /// @notice Minimum bid in USDC (6 decimals)
    uint256 public minBid;
    
    /// @notice Fee recipients
    address public deployer;
    address public protocol;
    
    /// @notice TWAP price locked at auction start (6 decimals, USDC per token)
    uint256 public twapPrice;
    
    /// @notice Total USDC bid
    uint256 public totalBid;
    
    /// @notice Tokens to distribute to bidders
    uint256 public tokensDistributed;
    
    /// @notice Tokens burned (unsold)
    uint256 public tokensBurned;
    
    /// @notice Settlement complete flag
    bool public settled;
    
    /// @notice Bidder data
    mapping(address => uint256) public bids;
    address[] public bidders;
    mapping(address => bool) public hasBid;
    mapping(address => bool) public hasClaimed;

    // ═══════════════════════════════════════════════════════════════════════
    // EVENTS
    // ═══════════════════════════════════════════════════════════════════════

    event Launched(address indexed token, uint256 auctionTokens, uint256 solanaTokens);
    event TwapLocked(uint256 price);
    event Bid(address indexed bidder, uint256 amount);
    event Settled(uint256 twapPrice, uint256 totalBid, uint256 distributed, uint256 burned);
    event Claimed(address indexed bidder, uint256 tokens);
    event BridgedToSolana(uint256 tokens, uint256 usdc);

    // ═══════════════════════════════════════════════════════════════════════
    // ERRORS
    // ═══════════════════════════════════════════════════════════════════════

    error NotStarted();
    error AuctionEnded();
    error AuctionNotEnded();
    error AlreadySettled();
    error BidTooSmall();
    error NothingToClaim();
    error AlreadyClaimed();
    error TwapAlreadyLocked();
    error TwapNotLocked();

    // ═══════════════════════════════════════════════════════════════════════
    // CONSTRUCTOR
    // ═══════════════════════════════════════════════════════════════════════

    constructor(
        address _token,
        address _clankerPool,
        address _nttManager,
        bytes32 _solanaSeeder,
        uint256 _auctionTokens,
        uint256 _solanaTokens,
        uint256 _auctionStart,
        uint256 _auctionEnd,
        uint256 _minBid,
        address _deployer,
        address _protocol
    ) Ownable(msg.sender) {
        token = IERC20(_token);
        clankerPool = _clankerPool;
        nttManager = INttManager(_nttManager);
        solanaSeeder = _solanaSeeder;
        auctionTokens = _auctionTokens;
        solanaTokens = _solanaTokens;
        auctionStart = _auctionStart;
        auctionEnd = _auctionEnd;
        minBid = _minBid;
        deployer = _deployer;
        protocol = _protocol;
        
        emit Launched(_token, _auctionTokens, _solanaTokens);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // TWAP
    // ═══════════════════════════════════════════════════════════════════════

    /// @notice Lock TWAP at auction start
    /// @dev Can be called by anyone once auction starts
    function lockTwap() external {
        if (block.timestamp < auctionStart) revert NotStarted();
        if (twapPrice != 0) revert TwapAlreadyLocked();
        
        twapPrice = _getCurrentTwap();
        
        emit TwapLocked(twapPrice);
    }
    
    /// @notice Get current TWAP from Uniswap V4 oracle
    /// @return price USDC per token (6 decimals)
    function _getCurrentTwap() internal view returns (uint256 price) {
        // Query Uniswap V4 oracle for 24h TWAP
        // Implementation depends on pool structure
        // Placeholder - actual implementation needs pool-specific logic
        
        (int24 arithmeticMeanTick,) = Oracle.consult(
            clankerPool,
            24 hours
        );
        
        // Convert tick to price
        // This is simplified - real implementation needs proper math
        price = _tickToPrice(arithmeticMeanTick);
    }
    
    function _tickToPrice(int24 tick) internal pure returns (uint256) {
        // Convert Uniswap V4 tick to price
        // Simplified placeholder
        return uint256(int256(tick + 887272)) * 1e6 / 887272;
    }
    
    /// @notice Get current TWAP (view function for UI)
    function getCurrentTwap() external view returns (uint256) {
        return _getCurrentTwap();
    }

    // ═══════════════════════════════════════════════════════════════════════
    // BIDDING
    // ═══════════════════════════════════════════════════════════════════════

    /// @notice Place a bid with USDC
    /// @param amount USDC amount (6 decimals)
    function bid(uint256 amount) external nonReentrant {
        if (block.timestamp < auctionStart) revert NotStarted();
        if (block.timestamp >= auctionEnd) revert AuctionEnded();
        if (amount < minBid) revert BidTooSmall();
        
        // Lock TWAP on first bid if not already locked
        if (twapPrice == 0) {
            twapPrice = _getCurrentTwap();
            emit TwapLocked(twapPrice);
        }
        
        // Transfer USDC from bidder
        USDC.safeTransferFrom(msg.sender, address(this), amount);
        
        // Record bid
        if (!hasBid[msg.sender]) {
            bidders.push(msg.sender);
            hasBid[msg.sender] = true;
        }
        bids[msg.sender] += amount;
        totalBid += amount;
        
        emit Bid(msg.sender, amount);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // SETTLEMENT
    // ═══════════════════════════════════════════════════════════════════════

    /// @notice Settle the auction after end time
    /// @dev Calculates distribution, burns unsold, triggers cross-chain bridge
    function settle() external nonReentrant {
        if (block.timestamp < auctionEnd) revert AuctionNotEnded();
        if (settled) revert AlreadySettled();
        if (twapPrice == 0) revert TwapNotLocked();
        
        settled = true;
        
        // Calculate tokens at TWAP price
        // tokensAtTwap = totalBid / twapPrice (adjusting for decimals)
        // USDC has 6 decimals, token has 18 decimals
        uint256 tokensAtTwap = (totalBid * 1e18) / twapPrice;
        
        if (tokensAtTwap >= auctionTokens) {
            // Oversubscribed: all auction tokens distributed
            tokensDistributed = auctionTokens;
            tokensBurned = 0;
        } else {
            // Undersubscribed: partial distribution, burn remainder
            tokensDistributed = tokensAtTwap;
            tokensBurned = auctionTokens - tokensAtTwap;
            
            // Burn unsold tokens
            token.safeTransfer(address(0xdead), tokensBurned);
        }
        
        // USDC distribution
        uint256 solanaUsdc = (totalBid * SOLANA_LP_BPS) / BPS;     // 80%
        uint256 deployerUsdc = (totalBid * DEPLOYER_BPS) / BPS;   // 15%
        uint256 protocolUsdc = totalBid - solanaUsdc - deployerUsdc; // 5%
        
        // Transfer to deployer & protocol
        USDC.safeTransfer(deployer, deployerUsdc);
        USDC.safeTransfer(protocol, protocolUsdc);
        
        // Bridge to Solana
        _bridgeToSolana(solanaUsdc);
        
        emit Settled(twapPrice, totalBid, tokensDistributed, tokensBurned);
    }
    
    /// @notice Bridge tokens and USDC to Solana
    function _bridgeToSolana(uint256 usdcAmount) internal {
        // 1. Bridge tokens via Wormhole NTT
        token.approve(address(nttManager), solanaTokens);
        nttManager.transfer(
            solanaTokens,
            5, // Solana chain ID for Wormhole
            solanaSeeder
        );
        
        // 2. Bridge USDC via Circle CCTP
        USDC.approve(address(CCTP), usdcAmount);
        CCTP.depositForBurn(
            usdcAmount,
            SOLANA_DOMAIN,
            solanaSeeder, // Recipient on Solana
            address(USDC)
        );
        
        emit BridgedToSolana(solanaTokens, usdcAmount);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // CLAIMING
    // ═══════════════════════════════════════════════════════════════════════

    /// @notice Claim tokens after settlement
    /// @return tokens Amount of tokens claimed
    function claim() external nonReentrant returns (uint256 tokens) {
        if (!settled) revert AuctionNotEnded();
        if (bids[msg.sender] == 0) revert NothingToClaim();
        if (hasClaimed[msg.sender]) revert AlreadyClaimed();
        
        hasClaimed[msg.sender] = true;
        
        // Pro-rata share of distributed tokens
        tokens = (bids[msg.sender] * tokensDistributed) / totalBid;
        
        token.safeTransfer(msg.sender, tokens);
        
        emit Claimed(msg.sender, tokens);
    }
    
    /// @notice Get claimable tokens for an address
    function getClaimable(address bidder) external view returns (uint256) {
        if (!settled || hasClaimed[bidder] || bids[bidder] == 0) {
            return 0;
        }
        return (bids[bidder] * tokensDistributed) / totalBid;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // VIEW FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════

    /// @notice Get auction state
    function getAuctionState() external view returns (
        uint256 _twapPrice,
        uint256 _totalBid,
        uint256 _bidderCount,
        uint256 _tokensDistributed,
        uint256 _tokensBurned,
        bool _settled
    ) {
        return (
            twapPrice,
            totalBid,
            bidders.length,
            tokensDistributed,
            tokensBurned,
            settled
        );
    }
    
    /// @notice Get all bidders
    function getBidders() external view returns (address[] memory) {
        return bidders;
    }
    
    /// @notice Check if auction is active
    function isActive() external view returns (bool) {
        return block.timestamp >= auctionStart && 
               block.timestamp < auctionEnd && 
               !settled;
    }
}
```

---

## Solana Program: solana_seeder

```rust
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, Transfer, Burn};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("SEEDER_PROGRAM_ID_HERE");

/// Seeds Raydium CPMM pool with bridged tokens and USDC
#[program]
pub mod solana_seeder {
    use super::*;

    /// Initialize the seeder with expected token mint
    pub fn initialize(
        ctx: Context<Initialize>,
        expected_token_mint: Pubkey,
        twap_price: u64,
    ) -> Result<()> {
        let seeder = &mut ctx.accounts.seeder;
        seeder.authority = ctx.accounts.authority.key();
        seeder.token_mint = expected_token_mint;
        seeder.usdc_mint = ctx.accounts.usdc_mint.key();
        seeder.twap_price = twap_price;
        seeder.tokens_received = false;
        seeder.usdc_received = false;
        seeder.pool_seeded = false;
        Ok(())
    }

    /// Called after Wormhole NTT delivers tokens
    pub fn receive_tokens(ctx: Context<ReceiveTokens>) -> Result<()> {
        let seeder = &mut ctx.accounts.seeder;
        require!(!seeder.tokens_received, SeederError::TokensAlreadyReceived);
        
        seeder.tokens_received = true;
        seeder.token_amount = ctx.accounts.token_account.amount;
        
        emit!(TokensReceived {
            amount: seeder.token_amount,
        });
        
        // Check if we can seed the pool
        if seeder.usdc_received {
            msg!("Both assets received, ready to seed pool");
        }
        
        Ok(())
    }

    /// Called after Circle CCTP delivers USDC
    pub fn receive_usdc(ctx: Context<ReceiveUsdc>) -> Result<()> {
        let seeder = &mut ctx.accounts.seeder;
        require!(!seeder.usdc_received, SeederError::UsdcAlreadyReceived);
        
        seeder.usdc_received = true;
        seeder.usdc_amount = ctx.accounts.usdc_account.amount;
        
        emit!(UsdcReceived {
            amount: seeder.usdc_amount,
        });
        
        // Check if we can seed the pool
        if seeder.tokens_received {
            msg!("Both assets received, ready to seed pool");
        }
        
        Ok(())
    }

    /// Create Raydium CPMM pool and burn LP tokens
    pub fn seed_pool(ctx: Context<SeedPool>) -> Result<()> {
        let seeder = &ctx.accounts.seeder;
        
        require!(seeder.tokens_received, SeederError::TokensNotReceived);
        require!(seeder.usdc_received, SeederError::UsdcNotReceived);
        require!(!seeder.pool_seeded, SeederError::PoolAlreadySeeded);
        
        // Calculate amounts to seed (should match TWAP price)
        let token_amount = ctx.accounts.token_account.amount;
        let usdc_amount = ctx.accounts.usdc_account.amount;
        
        // CPI to Raydium CPMM to create pool
        // This is simplified - actual Raydium CPI is more complex
        let cpi_accounts = raydium_cpmm::cpi::accounts::Initialize {
            creator: ctx.accounts.seeder.to_account_info(),
            amm_config: ctx.accounts.amm_config.to_account_info(),
            authority: ctx.accounts.pool_authority.to_account_info(),
            pool_state: ctx.accounts.pool_state.to_account_info(),
            token_0_mint: ctx.accounts.token_mint.to_account_info(),
            token_1_mint: ctx.accounts.usdc_mint.to_account_info(),
            creator_token_0: ctx.accounts.token_account.to_account_info(),
            creator_token_1: ctx.accounts.usdc_account.to_account_info(),
            token_0_vault: ctx.accounts.token_vault.to_account_info(),
            token_1_vault: ctx.accounts.usdc_vault.to_account_info(),
            lp_mint: ctx.accounts.lp_mint.to_account_info(),
            creator_lp_token: ctx.accounts.lp_token_account.to_account_info(),
            token_program: ctx.accounts.token_program.to_account_info(),
            associated_token_program: ctx.accounts.associated_token_program.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            rent: ctx.accounts.rent.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.raydium_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        raydium_cpmm::cpi::initialize(
            cpi_ctx,
            token_amount,
            usdc_amount,
            0, // open_time (immediate)
        )?;
        
        // Burn LP tokens (permanent liquidity)
        let lp_amount = ctx.accounts.lp_token_account.amount;
        
        let burn_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.lp_mint.to_account_info(),
                from: ctx.accounts.lp_token_account.to_account_info(),
                authority: ctx.accounts.seeder.to_account_info(),
            },
        );
        token::burn(burn_ctx, lp_amount)?;
        
        // Update state
        let seeder = &mut ctx.accounts.seeder;
        seeder.pool_seeded = true;
        
        emit!(PoolSeeded {
            token_amount,
            usdc_amount,
            lp_burned: lp_amount,
            pool: ctx.accounts.pool_state.key(),
        });
        
        Ok(())
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// ACCOUNTS
// ═══════════════════════════════════════════════════════════════════════════

#[account]
pub struct Seeder {
    pub authority: Pubkey,
    pub token_mint: Pubkey,
    pub usdc_mint: Pubkey,
    pub twap_price: u64,
    pub token_amount: u64,
    pub usdc_amount: u64,
    pub tokens_received: bool,
    pub usdc_received: bool,
    pub pool_seeded: bool,
    pub bump: u8,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + std::mem::size_of::<Seeder>(),
        seeds = [b"seeder", authority.key().as_ref()],
        bump
    )]
    pub seeder: Account<'info, Seeder>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub usdc_mint: Account<'info, Mint>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ReceiveTokens<'info> {
    #[account(mut)]
    pub seeder: Account<'info, Seeder>,
    
    #[account(
        constraint = token_account.mint == seeder.token_mint
    )]
    pub token_account: Account<'info, TokenAccount>,
}

#[derive(Accounts)]
pub struct ReceiveUsdc<'info> {
    #[account(mut)]
    pub seeder: Account<'info, Seeder>,
    
    #[account(
        constraint = usdc_account.mint == seeder.usdc_mint
    )]
    pub usdc_account: Account<'info, TokenAccount>,
}

#[derive(Accounts)]
pub struct SeedPool<'info> {
    #[account(mut)]
    pub seeder: Account<'info, Seeder>,
    
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub usdc_account: Account<'info, TokenAccount>,
    
    pub token_mint: Account<'info, Mint>,
    pub usdc_mint: Account<'info, Mint>,
    
    // Raydium accounts
    /// CHECK: Raydium config
    pub amm_config: AccountInfo<'info>,
    /// CHECK: Pool authority PDA
    pub pool_authority: AccountInfo<'info>,
    /// CHECK: Pool state
    #[account(mut)]
    pub pool_state: AccountInfo<'info>,
    #[account(mut)]
    pub token_vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub usdc_vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub lp_mint: Account<'info, Mint>,
    #[account(mut)]
    pub lp_token_account: Account<'info, TokenAccount>,
    
    /// CHECK: Raydium CPMM program
    pub raydium_program: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

// ═══════════════════════════════════════════════════════════════════════════
// EVENTS
// ═══════════════════════════════════════════════════════════════════════════

#[event]
pub struct TokensReceived {
    pub amount: u64,
}

#[event]
pub struct UsdcReceived {
    pub amount: u64,
}

#[event]
pub struct PoolSeeded {
    pub token_amount: u64,
    pub usdc_amount: u64,
    pub lp_burned: u64,
    pub pool: Pubkey,
}

// ═══════════════════════════════════════════════════════════════════════════
// ERRORS
// ═══════════════════════════════════════════════════════════════════════════

#[error_code]
pub enum SeederError {
    #[msg("Tokens already received")]
    TokensAlreadyReceived,
    #[msg("USDC already received")]
    UsdcAlreadyReceived,
    #[msg("Tokens not yet received")]
    TokensNotReceived,
    #[msg("USDC not yet received")]
    UsdcNotReceived,
    #[msg("Pool already seeded")]
    PoolAlreadySeeded,
}
```

---

## Deployment Script (TypeScript)

```typescript
import { Clanker } from 'clanker-sdk/v4';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { ethers } from 'ethers';

interface LaunchConfig {
  // Token metadata
  name: string;
  symbol: string;
  image: string;
  
  // Timing (Unix timestamps)
  auctionStart: number;  // 24h after launch
  auctionEnd: number;    // 48h after launch
  
  // Amounts
  totalSupply: bigint;   // 100B tokens (100_000_000_000n * 10n**18n)
  minBid: bigint;        // 1 USDC (1_000_000n)
  
  // Recipients
  deployer: string;
  protocol: string;
}

async function deployLaunch(config: LaunchConfig) {
  // ═══════════════════════════════════════════════════════════════════════
  // STEP 1: Deploy token via Clanker (Base)
  // ═══════════════════════════════════════════════════════════════════════
  
  console.log('Step 1: Deploying token via Clanker...');
  
  const clanker = new Clanker({
    publicClient: basePublicClient,
    wallet: baseWallet,
  });
  
  // Calculate token allocations
  const baseLpTokens = config.totalSupply / 2n;        // 50B
  const auctionTokens = config.totalSupply * 2778n / 10000n;  // 27.78B
  const solanaTokens = config.totalSupply * 2222n / 10000n;   // 22.22B
  
  const { waitForTransaction } = await clanker.deploy({
    name: config.name,
    symbol: config.symbol,
    image: config.image,
    tokenAdmin: AUCTION_CONTRACT_ADDRESS,
    
    // USDC pair instead of WETH
    pool: {
      pairedToken: USDC_BASE,
      // Configure starting price tick for USDC
      tickIfToken0IsClanker: -276324, // Adjust based on desired starting mcap
      positions: POOL_POSITIONS.Standard,
    },
    
    // Vault 50% for auction + Solana
    vault: {
      percentage: 50,
      lockupDuration: 0,  // Immediately available to auction contract
      vestingDuration: 0,
      recipient: AUCTION_CONTRACT_ADDRESS,
    },
  });
  
  const { address: tokenAddress } = await waitForTransaction();
  console.log(`Token deployed: ${tokenAddress}`);
  
  // ═══════════════════════════════════════════════════════════════════════
  // STEP 2: Setup Wormhole NTT (Base side)
  // ═══════════════════════════════════════════════════════════════════════
  
  console.log('Step 2: Setting up Wormhole NTT on Base...');
  
  // Deploy NTT Manager for this token
  const nttManagerAddress = await deployNttManager({
    token: tokenAddress,
    mode: 'hub',
    chain: 'base',
  });
  
  console.log(`NTT Manager (Base): ${nttManagerAddress}`);
  
  // ═══════════════════════════════════════════════════════════════════════
  // STEP 3: Setup Wormhole NTT (Solana side)
  // ═══════════════════════════════════════════════════════════════════════
  
  console.log('Step 3: Setting up Wormhole NTT on Solana...');
  
  const { manager: solanaNttManager, mint: solanaTokenMint } = await deployNttManager({
    baseToken: tokenAddress,
    mode: 'spoke',
    chain: 'solana',
  });
  
  console.log(`NTT Manager (Solana): ${solanaNttManager}`);
  console.log(`Token Mint (Solana): ${solanaTokenMint}`);
  
  // Configure peers
  await configureNttPeers(nttManagerAddress, solanaNttManager);
  
  // ═══════════════════════════════════════════════════════════════════════
  // STEP 4: Deploy Solana Seeder program instance
  // ═══════════════════════════════════════════════════════════════════════
  
  console.log('Step 4: Initializing Solana Seeder...');
  
  const seederProgram = new Program(SEEDER_IDL, SEEDER_PROGRAM_ID, provider);
  
  const [seederPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('seeder'), authority.publicKey.toBuffer()],
    seederProgram.programId
  );
  
  await seederProgram.methods
    .initialize(new PublicKey(solanaTokenMint), 0) // TWAP set later
    .accounts({
      seeder: seederPda,
      authority: authority.publicKey,
      usdcMint: USDC_SOLANA,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
  
  console.log(`Seeder PDA: ${seederPda.toBase58()}`);
  
  // ═══════════════════════════════════════════════════════════════════════
  // STEP 5: Deploy Auction Contract (Base)
  // ═══════════════════════════════════════════════════════════════════════
  
  console.log('Step 5: Deploying Auction Contract...');
  
  const AuctionLaunch = await ethers.getContractFactory('AuctionLaunch');
  const auction = await AuctionLaunch.deploy(
    tokenAddress,
    clankerPoolAddress, // Get from Clanker deployment
    nttManagerAddress,
    solanaSeederBytes32, // Convert seederPda to bytes32
    auctionTokens,
    solanaTokens,
    config.auctionStart,
    config.auctionEnd,
    config.minBid,
    config.deployer,
    config.protocol
  );
  
  await auction.waitForDeployment();
  console.log(`Auction Contract: ${await auction.getAddress()}`);
  
  // ═══════════════════════════════════════════════════════════════════════
  // STEP 6: Transfer auction tokens to contract
  // ═══════════════════════════════════════════════════════════════════════
  
  console.log('Step 6: Transferring tokens to Auction Contract...');
  
  const token = new ethers.Contract(tokenAddress, ERC20_ABI, baseWallet);
  await token.transfer(await auction.getAddress(), auctionTokens + solanaTokens);
  
  console.log('Launch deployment complete!');
  
  return {
    token: tokenAddress,
    auction: await auction.getAddress(),
    nttManagerBase: nttManagerAddress,
    nttManagerSolana: solanaNttManager,
    solanaToken: solanaTokenMint,
    seeder: seederPda.toBase58(),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// AUTOMATION: Settlement + Seeding
// ═══════════════════════════════════════════════════════════════════════════

async function automateSettlement(auctionAddress: string) {
  const auction = new ethers.Contract(auctionAddress, AUCTION_ABI, baseWallet);
  
  // Wait for auction end
  const auctionEnd = await auction.auctionEnd();
  const now = Math.floor(Date.now() / 1000);
  
  if (now < auctionEnd) {
    const waitTime = (auctionEnd - now + 60) * 1000; // +1 min buffer
    console.log(`Waiting ${waitTime / 1000}s for auction to end...`);
    await sleep(waitTime);
  }
  
  // Settle auction (triggers bridge)
  console.log('Settling auction...');
  const tx = await auction.settle();
  await tx.wait();
  console.log('Auction settled, bridging in progress...');
  
  // Wait for bridge completion (~15 minutes)
  console.log('Waiting for bridge completion...');
  await sleep(20 * 60 * 1000); // 20 minutes
  
  // Trigger Solana pool seeding
  console.log('Seeding Solana pool...');
  await seedSolanaPool();
}

async function seedSolanaPool() {
  const seederProgram = new Program(SEEDER_IDL, SEEDER_PROGRAM_ID, provider);
  
  // Check if both assets received
  const seeder = await seederProgram.account.seeder.fetch(seederPda);
  
  if (!seeder.tokensReceived || !seeder.usdcReceived) {
    throw new Error('Assets not yet received from bridge');
  }
  
  // Seed the pool
  await seederProgram.methods
    .seedPool()
    .accounts({
      // ... all required accounts
    })
    .rpc();
  
  console.log('Solana pool seeded and LP burned!');
}
```

---

---

## Buffered TWAP Sampling

Single-point TWAP capture is gameable via last-block manipulation. Instead, use buffered sampling across the auction period.

### Sampling Strategy

```
AUCTION PERIOD (24h)
├── Sample 1: T+0h    (auction start)
├── Sample 2: T+6h
├── Sample 3: T+12h
├── Sample 4: T+18h
├── Sample 5: T+23h   (1h before end)
└── Final Price = Weighted Average of Samples
```

### Implementation

```solidity
struct TwapSample {
    uint256 price;
    uint256 timestamp;
}

TwapSample[5] public samples;
uint256 public sampleCount;

/// @notice Record TWAP sample (callable by keeper)
function recordSample() external {
    require(block.timestamp >= auctionStart, "Auction not started");
    require(block.timestamp < auctionEnd, "Auction ended");
    require(sampleCount < 5, "All samples recorded");
    
    uint256 expectedTime = auctionStart + (sampleCount * 6 hours);
    require(block.timestamp >= expectedTime, "Too early for sample");
    
    samples[sampleCount] = TwapSample({
        price: _getCurrentTwap(),
        timestamp: block.timestamp
    });
    sampleCount++;
    
    emit SampleRecorded(sampleCount, samples[sampleCount - 1].price);
}

/// @notice Get final weighted average price
function getFinalPrice() public view returns (uint256) {
    require(sampleCount >= 3, "Insufficient samples"); // Min 3 for validity
    
    uint256 totalPrice;
    for (uint i = 0; i < sampleCount; i++) {
        totalPrice += samples[i].price;
    }
    return totalPrice / sampleCount;
}
```

### Benefits

- **Manipulation resistant**: Attacker must sustain manipulation across multiple sampling windows
- **Graceful degradation**: Works with 3+ samples if keeper misses some
- **Transparent**: All samples on-chain, auditable
- **Keeper incentive**: Small reward (0.05%) per successful sample recording

---

## Solana Fee Bridge Service

Deployers launch on Base (EVM wallet) but need to receive their share of Solana LP trading fees. The **Solana Fee Bridge Service** handles this automatically.

### Problem

- Raydium CPMM gives creators 10% of LP trading fees
- Requires Fee Key NFT held by Solana wallet
- Most deployers don't have/want Solana wallets
- Manual bridging is friction that kills adoption

### Solution: Integrated Fee Bridge

The service is built into our cross-chain launch infrastructure — not a separate opt-in.

```
┌─────────────────────────────────────────────────────────────────┐
│                    SOLANA FEE BRIDGE SERVICE                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  Fee Key NFT │───▶│   Keeper     │───▶│ Circle CCTP  │      │
│  │  (Custody)   │    │  (Claims)    │    │  (Bridge)    │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                   │                   │               │
│         ▼                   ▼                   ▼               │
│  ┌──────────────────────────────────────────────────────┐      │
│  │              On-Chain Registry (Base)                 │      │
│  │  ┌─────────────────────────────────────────────────┐ │      │
│  │  │ Pool ID → Deployer EVM Address → Claimed Amount │ │      │
│  │  └─────────────────────────────────────────────────┘ │      │
│  └──────────────────────────────────────────────────────┘      │
│                              │                                  │
│                              ▼                                  │
│                    ┌──────────────────┐                        │
│                    │  USDC to Deployer │                        │
│                    │  (Base, minus 2%) │                        │
│                    └──────────────────┘                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Data Structures

**Solana (Seeder Program extension):**
```rust
#[account]
pub struct FeeConfig {
    pub pool: Pubkey,              // Raydium pool
    pub fee_key_nft: Pubkey,       // Fee Key NFT mint
    pub deployer_evm: [u8; 20],    // Base address for fee delivery
    pub total_claimed: u64,        // Lifetime claimed (USDC)
    pub last_claim: i64,           // Unix timestamp
    pub service_fee_bps: u16,      // 200 = 2%
}
```

**Base (Registry Contract):**
```solidity
struct FeeRecord {
    address deployer;
    bytes32 solanaPool;
    uint256 totalReceived;
    uint256 lastClaim;
}

mapping(bytes32 => FeeRecord) public feeRecords; // poolId => record
```

### Flow

1. **At Launch**: Seeder program stores deployer's EVM address alongside pool creation
2. **Ongoing**: Keeper monitors all pools for claimable fees (batch for gas efficiency)
3. **Weekly Claim**: Keeper calls `claimCreatorFee()` on Raydium for each pool
4. **Bridge**: USDC bridged to Base via Circle CCTP (batched across multiple pools)
5. **Distribute**: Registry contract distributes to each deployer, minus service fee

### Keeper Economics

| Item | Value |
|------|-------|
| Service fee | 2% of claimed fees |
| Claim frequency | Weekly (or when balance > $100) |
| Gas coverage | Service fee covers Solana + Base gas |
| Minimum claim | 10 USDC (accumulates otherwise) |

### Deployer Experience

```
1. Deploy token on Base (normal flow)
2. Provide EVM wallet address (already have it)
3. Never touch Solana
4. USDC appears in wallet periodically
5. View earnings on dashboard
```

### Contract: FeeBridgeRegistry.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract FeeBridgeRegistry is Ownable {
    using SafeERC20 for IERC20;
    
    IERC20 public constant USDC = IERC20(0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913);
    
    struct FeeRecord {
        address deployer;
        uint256 totalReceived;
        uint256 lastClaim;
        bool active;
    }
    
    // Solana pool pubkey (32 bytes) => record
    mapping(bytes32 => FeeRecord) public records;
    
    // Deployer => list of their pools
    mapping(address => bytes32[]) public deployerPools;
    
    // Authorized keeper that bridges fees
    address public keeper;
    
    event PoolRegistered(bytes32 indexed poolId, address indexed deployer);
    event FeesDistributed(bytes32 indexed poolId, address indexed deployer, uint256 amount);
    
    constructor(address _keeper) Ownable(msg.sender) {
        keeper = _keeper;
    }
    
    /// @notice Register a new pool (called during launch)
    function registerPool(bytes32 poolId, address deployer) external onlyOwner {
        require(!records[poolId].active, "Pool exists");
        
        records[poolId] = FeeRecord({
            deployer: deployer,
            totalReceived: 0,
            lastClaim: block.timestamp,
            active: true
        });
        
        deployerPools[deployer].push(poolId);
        
        emit PoolRegistered(poolId, deployer);
    }
    
    /// @notice Distribute bridged fees to deployer (called by keeper)
    function distributeFees(bytes32 poolId, uint256 amount) external {
        require(msg.sender == keeper, "Only keeper");
        require(records[poolId].active, "Pool not registered");
        
        FeeRecord storage record = records[poolId];
        
        // Transfer USDC to deployer
        USDC.safeTransfer(record.deployer, amount);
        
        record.totalReceived += amount;
        record.lastClaim = block.timestamp;
        
        emit FeesDistributed(poolId, record.deployer, amount);
    }
    
    /// @notice Batch distribute to multiple pools
    function batchDistribute(
        bytes32[] calldata poolIds,
        uint256[] calldata amounts
    ) external {
        require(msg.sender == keeper, "Only keeper");
        require(poolIds.length == amounts.length, "Length mismatch");
        
        for (uint i = 0; i < poolIds.length; i++) {
            if (records[poolIds[i]].active && amounts[i] > 0) {
                FeeRecord storage record = records[poolIds[i]];
                USDC.safeTransfer(record.deployer, amounts[i]);
                record.totalReceived += amounts[i];
                record.lastClaim = block.timestamp;
                emit FeesDistributed(poolIds[i], record.deployer, amounts[i]);
            }
        }
    }
    
    /// @notice Get deployer's total earnings across all pools
    function getDeployerEarnings(address deployer) external view returns (uint256 total) {
        bytes32[] memory pools = deployerPools[deployer];
        for (uint i = 0; i < pools.length; i++) {
            total += records[pools[i]].totalReceived;
        }
    }
    
    function setKeeper(address _keeper) external onlyOwner {
        keeper = _keeper;
    }
}
```

---

## Summary

| Component | Technology | Status |
|-----------|------------|--------|
| Token Launch | Clanker SDK v4 | Ready |
| Base Auction | Custom Solidity | Spec complete |
| TWAP Oracle | Uniswap V4 (buffered) | Spec complete |
| USDC Bridge | Circle CCTP | Ready (mainnet live) |
| Token Bridge | Wormhole NTT | Needs deployment |
| Solana Seeder | Anchor Program | Spec complete |
| Raydium Pool | CPMM via CPI | Needs integration testing |
| Fee Bridge Service | Keeper + Registry | Spec complete |
| Automation | TypeScript + Gelato | Spec complete |

---

## Next Steps

1. **Test on Testnet**: Deploy to Base Sepolia + Solana Devnet
2. **Implement buffered sampling**: Add keeper job for TWAP samples every 6h
3. **Deploy Fee Bridge Registry**: Base contract + keeper infrastructure
4. **Test CCTP flow**: Verify Circle bridge timing (both directions)
5. **Raydium CPI**: Get exact account structure for pool creation + fee claiming
6. **Security audit**: Full audit before mainnet (auction + registry + seeder)
