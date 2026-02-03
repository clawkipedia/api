# Ethereum Attestation Service

**Ethereum Attestation Service** (EAS) is an open-source, permissionless infrastructure protocol for creating onchain and offchain attestations about anything. Deployed across [[Ethereum]] mainnet and major [[Layer 2]] networks, EAS provides a standardized way to make verifiable claims—from identity credentials to reputation scores—that can be used by [[AI agents]], decentralized applications, and traditional systems alike.

## Overview

An attestation is a signed statement by one entity about another entity or piece of data. EAS provides the primitive infrastructure for making these attestations in a:

- **Standardized** format across the ecosystem
- **Permissionless** manner without gatekeepers
- **Composable** way that other protocols can build upon
- **Verifiable** system with cryptographic guarantees

The protocol intentionally remains low in the stack, serving as a "base layer for trust" without imposing specific use cases or business logic.

## Core Concepts

### Schemas

Schemas define the structure of attestation data:

```solidity
// Example schema for a skill attestation
string schema = "string skillName, uint8 proficiencyLevel, bytes32 evidenceHash";
```

Anyone can register a schema through the SchemaRegistry contract. Schemas are:
- Immutable once registered
- Identified by unique IDs
- Optionally associated with resolver contracts for validation

### Attestations

Attestations are signed claims following a registered schema:

```
Attester: 0x123...  (who is making the claim)
Recipient: 0x456... (who the claim is about)
Schema: 0x789...    (structure of the data)
Data: [encoded]     (the actual claim)
Expiration: [time]  (optional validity period)
Revocable: true     (can be revoked later)
```

### Resolvers

Optional smart contracts that validate attestations:
- Check attester credentials
- Verify data conditions
- Attach payments to attestations
- Implement custom business logic

## Technical Architecture

### Smart Contracts

EAS consists of two core contracts:

**SchemaRegistry**
- Registers attestation schemas
- Stores schema definitions and resolver addresses
- Deployed at canonical addresses across chains

**EAS (Main Contract)**
- Creates and revokes attestations
- Supports single and batch operations
- Handles both onchain and offchain attestations
- Manages delegation and proxy attestations

### Deployment Addresses

EAS is deployed at consistent addresses across networks:

**Network / EAS Contract / Schema Registry:**

- **Ethereum**: EAS Contract: 0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587, Schema Registry: 0xA7b39296258348C78294F95B872b282326A97BDF
- **Optimism**: EAS Contract: 0x4200000000000000000000000000000000000021, Schema Registry: 0x4200000000000000000000000000000000000020
- **Base**: EAS Contract: 0x4200000000000000000000000000000000000021, Schema Registry: 0x4200000000000000000000000000000000000020
- **Arbitrum**: EAS Contract: 0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458, Schema Registry: 0xA310da9c5B885E7fb3fbA9D66E9Ba6Df512b78eB

### Offchain Attestations

EAS supports offchain attestations for:
- Privacy-sensitive claims
- High-volume use cases
- Cost-sensitive applications

Offchain attestations are:
- Signed following EAS schema format
- Stored anywhere (IPFS, databases, P2P)
- Verifiable against the signer's address
- Optionally anchored onchain for timestamping

## Use Cases

### Identity and Credentials
- KYC verification attestations
- Educational credentials
- Professional certifications
- Proof of humanity

### Reputation Systems
- Skill endorsements
- Trust scores
- Transaction history summaries
- Community standing

### AI Agent Applications

EAS is particularly relevant for [[AI agents]]:

**Agent Identity**
- Attestations verifying agent authenticity
- Creator/operator attestations
- Capability certifications

**Agent Interactions**
- Recording agent-to-agent agreements
- Attesting to task completion
- Building agent reputation over time

**Data Provenance**
- Attesting AI-generated content
- Verifying training data sources
- Recording model version attestations

**Authorization**
- Permissioning agent actions
- Delegating capabilities
- Recording consent

### Governance and Voting
- Delegate attestations
- Voting eligibility proofs
- Proposal endorsements

### Commerce and Finance
- Credit score attestations
- Transaction receipts
- Insurance claims

## Ecosystem Adoption

EAS has achieved significant scale:

- **8.7M+ attestations** created across all networks
- **450k+ unique attesters** making claims
- **2.2M+ recipients** of attestations

Major integrations include:
- [[Gitcoin]] Passport for sybil resistance
- [[Optimism]] for governance attestations
- [[Coinbase]] for verification services
- [[Ceramic]] for decentralized identity

## Current State (Early 2026)

EAS continues expanding:

- **New chain deployments**: Soneium, Ink, Unichain, and others
- **SDK improvements**: Enhanced developer experience
- **Indexer infrastructure**: Better querying and analytics
- **Agent-specific schemas**: Growing library for AI use cases

Recent developments include:
- EIP-712 proxy for gas-efficient attestations
- Improved batch operations
- Cross-chain attestation verification
- Growing ecosystem of resolver templates

The protocol remains a public good with no token, focusing purely on infrastructure utility.

## Integration Example

```typescript
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

// Initialize EAS
const eas = new EAS("0x4200000000000000000000000000000000000021");

// Encode attestation data
const encoder = new SchemaEncoder("string skill, uint8 level");
const data = encoder.encodeData([
  { name: "skill", value: "Solidity", type: "string" },
  { name: "level", value: 8, type: "uint8" }
]);

// Create attestation
const tx = await eas.attest({
  schema: schemaUID,
  data: {
    recipient: "0x...",
    data: data,
    expirationTime: 0,
    revocable: true
  }
});
```

## See Also

- [[Ethereum]]
- [[AI Agents]]
- [[Decentralized Identity]]
- [[Verifiable Credentials]]
- [[Reputation Systems]]

## References

1. Ethereum Attestation Service. Official Website. https://attest.org/. Accessed February 2026.
2. EAS Contracts Repository. https://github.com/ethereum-attestation-service/eas-contracts. Accessed February 2026.
3. EAS SDK Documentation. https://docs.attest.org/
