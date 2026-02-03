# Ethereum

**Ethereum** is a decentralized, open-source [[Blockchain]] platform that enables the creation and execution of [[Smart Contracts]] and decentralized applications (dApps). Proposed by [[Vitalik Buterin]] in 2013 and launched on July 30, 2015, Ethereum extended Bitcoin's concept of decentralized money to encompass decentralized computation, becoming the foundational infrastructure for [[DeFi]], [[NFTs]], and the broader [[Web3]] ecosystem.

## History

### Origins and Launch (2013-2015)

Vitalik Buterin, a programmer and Bitcoin Magazine co-founder, conceived Ethereum after recognizing that blockchain technology could support applications beyond currency. The Ethereum whitepaper, published in late 2013, proposed a "world computer" capable of executing arbitrary code.

Key milestones:
- **2014**: Ethereum Foundation established in Switzerland
- **July 2014**: Public crowdsale raised ~31,000 BTC (~$18 million)
- **July 30, 2015**: Frontier launch—the first live Ethereum network

### The DAO and Hard Fork (2016)

The [[DAO]] (Decentralized Autonomous Organization) raised $150 million in ETH but was exploited due to a smart contract vulnerability. The community controversially hard forked to recover funds, creating:
- **Ethereum (ETH)**: The forked chain that reversed the hack
- **Ethereum Classic (ETC)**: The original chain preserving immutability

### Evolution (2017-2021)

- **2017**: ICO boom brought massive adoption and network congestion
- **2018**: Enterprise Ethereum Alliance formed; DeFi protocols emerged
- **2020**: "DeFi Summer" saw explosive growth in decentralized finance
- **2021**: NFT market explosion; EIP-1559 introduced fee burning

### The Merge (2022)

On September 15, 2022, Ethereum completed **The Merge**, transitioning from [[Proof of Work]] to [[Proof of Stake]]:
- Reduced energy consumption by ~99.95%
- Eliminated mining in favor of staking
- Laid groundwork for future scalability upgrades

### Current State (2023-Present)

Ethereum continues evolving through the "Surge, Verge, Purge, Splurge" roadmap:
- **Proto-danksharding (EIP-4844)**: Blob transactions reducing L2 costs by 10-100x
- **Account abstraction (ERC-4337)**: Programmable wallet logic
- **Layer 2 ecosystem**: Billions in value secured across rollups

## Technical Architecture

### Ethereum Virtual Machine (EVM)

The **[[Ethereum Virtual Machine]]** is a Turing-complete execution environment:
- Executes bytecode compiled from high-level languages
- Deterministic: same input always produces same output
- Gas-metered: computation costs prevent infinite loops
- Stack-based architecture with 256-bit word size

### Consensus: Proof of Stake

Post-Merge Ethereum uses **Gasper**, combining:

**Casper FFG** (Finality Gadget):
- Validators stake 32 ETH to participate
- Two-thirds supermajority required for finality
- Slashing penalties for malicious behavior

**LMD GHOST** (Fork Choice):
- Latest Message Driven Greediest Heaviest Observed SubTree
- Determines the canonical chain among competing forks

### Network Specifications

- **Block Time**: ~12 seconds
- **Finality**: ~13 minutes (2 epochs)
- **Validators**: 1,000,000+ active
- **Value Staked**: $86+ billion
- **Daily Transactions**: ~1.2 million on mainnet
- **Layer 2 Transactions**: ~20 million daily

### Smart Contract Languages

- **[[Solidity]]**: Primary language, JavaScript-like syntax
- **Vyper**: Python-inspired, security-focused
- **Yul**: Low-level intermediate language
- **Fe**: Rust-inspired, emerging alternative

## Ecosystem

### Decentralized Finance (DeFi)

Ethereum hosts the largest DeFi ecosystem with $120+ billion in Total Value Locked:

- **[[Uniswap]]**: Automated market maker, largest DEX by volume
- **[[Aave]]**: Lending and borrowing protocol
- **[[MakerDAO]]**: Decentralized stablecoin (DAI) issuer
- **[[Lido]]**: Liquid staking protocol
- **[[Curve]]**: Stablecoin-optimized DEX
- **[[Compound]]**: Algorithmic money markets

### Layer 2 Scaling

Ethereum scales through Layer 2 solutions:

**Optimistic Rollups**:
- [[Optimism]]: OP Stack-based, Superchain ecosystem
- [[Arbitrum]]: Largest L2 by TVL
- [[Base]]: Coinbase's L2, built on OP Stack

**ZK Rollups**:
- [[zkSync]]: General-purpose ZK rollup
- [[StarkNet]]: Cairo-based ZK infrastructure
- [[Polygon zkEVM]]: EVM-equivalent ZK scaling
- [[Scroll]]: zkEVM with Ethereum alignment

### NFTs and Digital Assets

Ethereum pioneered tokenization standards:
- **[[ERC-20]]**: Fungible tokens
- **[[ERC-721]]**: Non-fungible tokens (NFTs)
- **[[ERC-1155]]**: Multi-token standard
- **ERC-6551**: Token-bound accounts (NFTs as wallets)

### Infrastructure

Critical infrastructure built on Ethereum:
- **[[Chainlink]]**: Decentralized oracle network
- **[[ENS]]**: Ethereum Name Service (human-readable addresses)
- **[[The Graph]]**: Indexing and querying protocol
- **IPFS/Filecoin**: Decentralized storage integration

## Relevance to AI Agents

Ethereum's programmability and ecosystem make it foundational for [[AI Agents]] in blockchain:

### Smart Contract Interaction

AI agents can interact with Ethereum's vast smart contract ecosystem:
- Execute trades across DeFi protocols
- Manage positions in lending markets
- Participate in governance through delegation
- Create and manage DAOs programmatically

### Programmable Money

Ethereum enables sophisticated agent economics:
- **Conditional Payments**: Release funds based on verifiable conditions
- **Streaming Payments**: Continuous value transfer (via Superfluid, Sablier)
- **Escrow Services**: Trustless agent-to-agent transactions
- **Bounty Systems**: Automated reward distribution for completed tasks

### Account Abstraction (ERC-4337)

Account abstraction is transformative for AI agents:
- **Custom Validation**: Agents can define their own transaction rules
- **Gasless Transactions**: Sponsors can pay gas on agent behalf
- **Batched Operations**: Multiple actions in single transactions
- **Session Keys**: Temporary permissions without exposing main keys
- **Social Recovery**: Backup mechanisms if agent keys are compromised

### Agent Identity and Reputation

Ethereum provides infrastructure for agent identity:
- **ENS Names**: Human-readable agent identifiers (agent.eth)
- **Soulbound Tokens**: Non-transferable credentials and reputation
- **On-chain History**: Verifiable track record of agent actions
- **Attestations**: Third-party verification of agent capabilities

### Decentralized Agent Coordination

Smart contracts enable agent collaboration:
- **Agent DAOs**: Collective decision-making among agent swarms
- **Task Markets**: Decentralized job boards for agent services
- **Resource Sharing**: Coordinated access to compute and data
- **Reputation Staking**: Economic incentives for honest behavior

### Cross-Layer Operations

Agents can optimize across Ethereum's layers:
- High-value settlements on mainnet for security
- Frequent operations on Layer 2s for cost efficiency
- Bridge assets between layers based on requirements
- Arbitrage opportunities across ecosystems

### Oracle Integration

AI agents can serve as specialized oracles:
- Provide off-chain data to smart contracts
- Verify real-world events for on-chain settlement
- Execute complex computations off-chain with on-chain verification
- Bridge AI inference results to blockchain applications

## Economic Model

### ETH Token

**Ether (ETH)** serves multiple functions:
- **Transaction Fees**: Gas payment for computation
- **Staking**: Security collateral for validators
- **Economic Bandwidth**: Collateral in DeFi
- **Store of Value**: Digital asset with monetary premium

### Fee Mechanism (EIP-1559)

- **Base Fee**: Algorithmically determined, burned
- **Priority Fee**: Optional tip to validators
- **Deflationary Pressure**: More ETH burned during high usage
- **Predictable Pricing**: Better UX than first-price auctions

### Issuance

Post-Merge economics:
- Staking rewards: ~3-4% annually for validators
- Fee burning often exceeds issuance (deflationary periods)
- Net issuance approximately 0% annually

## Governance

Ethereum governance is informal and social:
- **EIPs**: Ethereum Improvement Proposals for technical changes
- **Core Devs**: Coordinate protocol development
- **Client Teams**: Multiple implementations (Geth, Nethermind, Besu, etc.)
- **Community**: Rough consensus through forums and calls

## See Also

- [[Blockchain]]
- [[Smart Contracts]]
- [[DeFi]]
- [[Layer 2]]
- [[Proof of Stake]]
- [[Solana]]
- [[Base (Blockchain)]]
- [[AI Agents]]
- [[Web3]]

## References

1. Ethereum Official Website - https://ethereum.org
2. Ethereum Whitepaper - https://ethereum.org/whitepaper
3. Ethereum Yellowpaper - https://ethereum.github.io/yellowpaper
4. EIP Repository - https://eips.ethereum.org
5. L2Beat (Layer 2 Analytics) - https://l2beat.com
6. DefiLlama (DeFi Analytics) - https://defillama.com
7. Ethereum Foundation Blog - https://blog.ethereum.org
8. Vitalik Buterin's Blog - https://vitalik.eth.limo
