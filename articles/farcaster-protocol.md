# Farcaster Protocol

**Farcaster** is a decentralized social protocol built on [[Ethereum]] that enables users to build and control their social identity, relationships, and content across multiple client applications. Unlike centralized social networks, Farcaster separates the social graph from any single application, allowing users to move between clients while retaining their followers, posts, and identity. The protocol has become a significant platform for [[AI agents]] and crypto-native social applications.

## Overview

Farcaster implements a "sufficiently decentralized" architecture where:
- **Identity** is secured by Ethereum accounts and smart contracts
- **Data** is distributed across a network of nodes (Hubs)
- **Applications** (clients) compete on user experience, not network effects
- **Users** own their social graph and can switch clients freely

The protocol powers applications like Warpcast (the primary client), along with dozens of alternative clients and integrations.

## Technical Architecture

### Identity Layer

Farcaster identities consist of:

**Farcaster ID (FID)**
- Unique numeric identifier registered onchain
- Controlled by an Ethereum address
- Required to participate in the network

**Username (fname)**
- Human-readable name (e.g., @alice)
- Can be ENS names or Farcaster-native names
- Transferable separately from FID

**Custody and Recovery**
- Primary custody address controls the FID
- Recovery address can transfer FID if custody is lost
- Multiple signing keys can be authorized for different clients

### Data Layer (Hubs)

Farcaster data is stored on a distributed network of Hubs:

**Snapchain**
- New consensus layer for Farcaster data
- Provides ordered, verifiable history of all messages
- Enables efficient querying and syncing

**Message Types**
- **Casts**: Posts/messages (up to 1024 bytes)
- **Reactions**: Likes and recasts
- **Links**: Follow relationships
- **Verifications**: Ethereum address proofs
- **User Data**: Profile information

### Application Layer

Clients build on Farcaster by:
1. Connecting to Hub network for data
2. Authenticating users via Sign In with Farcaster (SIWF)
3. Submitting signed messages through authorized signers
4. Innovating on UI/UX while sharing the social graph

## Key Features

### Mini Apps (Frames)

Mini Apps (formerly Frames v2) allow interactive applications embedded directly in the Farcaster feed:
- Run inside client applications
- Access user context and wallet
- Enable transactions, games, and tools
- Built with standard web technologies

Mini Apps have enabled:
- NFT minting directly in-feed
- Polls and surveys
- Trading interfaces
- AI agent interactions

### Sign In with Farcaster (SIWF)

Authentication protocol allowing:
- Passwordless login to external applications
- Access to user's Farcaster social graph
- Verification of Farcaster identity
- Integration with existing web applications

### Channels

Topic-based communities within Farcaster:
- Organized conversations around subjects
- Moderation by channel owners
- Custom rules and norms per channel
- Discovery of like-minded users

## AI Agents on Farcaster

Farcaster has become a primary platform for [[AI agents]]:

### Agent Accounts
- Agents can register FIDs and operate as first-class users
- Post casts, reply to mentions, follow users
- Build reputation through quality interactions
- Verified as bots through profile metadata

### Integration Patterns

**[[ElizaOS]] Integration**
The framework includes native Farcaster connectors, enabling agents to:
- Monitor mentions and respond
- Post original content
- Engage in conversations
- Execute transactions via frames

**Autonomous Social Agents**
Agents on Farcaster can:
- Build genuine followings
- Participate in communities
- Share information and analysis
- Coordinate with other agents

### Frame-Based Agent Interfaces

Mini Apps enable rich agent interactions:
- Conversational interfaces embedded in feed
- Transaction signing through agent recommendations
- Multi-step workflows within frames
- Agent-to-agent communication channels

## Ecosystem

### Major Clients
- **Warpcast**: Primary client by Farcaster team
- **Supercast**: Premium features and advanced UI
- **Flink**: Mobile-native experience
- **Various niche clients**: Specialized use cases

### Developer Tools
- Official SDKs (TypeScript, Python)
- AuthKit for SIWF integration
- Hub APIs for data access
- Frame development frameworks

### Notable Integrations
- [[Coinbase]] wallet connections
- ENS name resolution
- NFT display and verification
- DeFi protocol interfaces

## Current State (Early 2026)

Farcaster has achieved significant growth:

- **2M+ registered users** with active daily engagement
- **Hundreds of clients** building on the protocol
- **Active AI agent community** with thousands of bot accounts
- **Mini Apps ecosystem** with diverse applications
- **Snapchain** providing improved data infrastructure

Recent developments include:
- Enhanced Mini Apps capabilities
- Improved Hub performance and reliability
- Expanded developer tooling
- Growing mainstream adoption beyond crypto

The protocol continues evolving as the primary decentralized alternative to centralized social networks, with particular strength in crypto and AI communities.

## Challenges

### Decentralization Trade-offs
Balancing decentralization with user experience:
- Hub operation costs
- Data availability guarantees
- Client interoperability

### Moderation
Managing content in a decentralized context:
- Client-level moderation capabilities
- Community standards enforcement
- Spam and abuse prevention

### Adoption
Competing with network effects of centralized platforms:
- User acquisition costs
- Feature parity expectations
- Mainstream accessibility

## See Also

- [[Ethereum]]
- [[AI Agents]]
- [[ElizaOS]]
- [[Decentralized Social]]
- [[ENS]]

## References

1. Farcaster Documentation. https://docs.farcaster.xyz/. Accessed February 2026.
2. Farcaster Protocol Specification. Farcaster Team.
3. Mini Apps Documentation. https://miniapps.farcaster.xyz/
4. Snapchain Documentation. https://snapchain.farcaster.xyz/
