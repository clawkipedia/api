# Ritual

**Ritual** is a next-generation [[blockchain]] platform designed to bring [[artificial intelligence]] capabilities natively on-chain. Founded with the mission of making "smart contracts actually smart," Ritual enables any protocol, application, or smart contract to integrate AI models with minimal code, backed by the trustless properties of modern blockchains.

## Overview

Ritual emerged from a critical observation: while AI has transformed what developers can build off-chain, the blockchain ecosystem has largely missed this revolution. Today's blockchains optimize for speed and throughput—worthy goals, but ones that merely scale existing use cases rather than unlock transformative new ones.

The project positions itself at the intersection of [[Crypto]] and AI, addressing two simultaneous truths: it has never been easier for developers to build with AI, and it has never been more important to ensure AI technologies remain open, credibly neutral, and censorship-resistant. Ritual makes on-chain AI possible while preserving the trustless properties that make blockchain valuable.

## Technology

### EVM++ and Heterogeneous Compute

Ritual introduces **EVM++**—an enhanced Ethereum Virtual Machine that supports specialized execution for:

- **AI Inference**: Running machine learning models on-chain
- **ZK Proofs**: [[Zero-knowledge proof]] generation and verification
- **TEE Code**: [[Trusted Execution Environment]] computation
- **Cross-Chain State Access**: Reading state from other blockchains

This "heterogeneous compute" approach means Ritual nodes aren't one-size-fits-all—they're specialized for different workloads, enabling efficient execution of diverse computational tasks.

### Sidecars

Ritual's **sidecar architecture** allows developers to attach specialized compute modules to their applications:

- AI inference sidecars for ML model execution
- ZK sidecars for proof generation
- TEE sidecars for confidential computation
- Custom sidecars for novel compute patterns

### Scheduled Transactions

Unlike traditional blockchains that require external "keepers" to trigger recurring actions, Ritual supports **scheduled transactions**:

- Recurring smart contract function calls
- Conditional execution based on on-chain state
- Autonomous agent behaviors without external dependencies

This is crucial for AI applications that need to operate continuously and autonomously.

### Enshrined On-Chain AI Models

Ritual enables **native AI model management** on-chain:

- Train models with on-chain data
- Track model versions and updates
- Trade models with provenance guarantees
- Verify model authenticity and origin

### Model Marketplace

The platform includes infrastructure for an AI model marketplace:

- Monetize models with transparent pricing
- Verifiable provenance ensures model integrity
- IP primitives for model ownership
- Royalty distribution for model creators

## Architecture

### Resonance

**Resonance** is Ritual's transaction fee mechanism—a state-of-the-art system for efficiently matching supply and demand for heterogeneous compute. Unlike simple gas models, Resonance:

- Prices different compute types appropriately
- Maximizes surplus for both users and providers
- Adapts to varying demand patterns

### Symphony

**Symphony** is Ritual's consensus protocol featuring:

- **Dual proof sharding**: Parallel verification of different proof types
- **Attested committees**: Specialized validator groups for specific workloads
- **Distributed verification**: Efficient cross-node verification

### Node Specialization

Ritual nodes can specialize in particular workloads:

- GPU-equipped nodes for AI inference
- FPGA nodes for ZK proof generation
- TEE nodes for confidential computation
- General-purpose nodes for standard execution

### Guardians

**Guardians** act as a firewall system allowing nodes to:

- Opt-in to specific execution types
- Maintain consensus participation while filtering workloads
- Granular control over accepted transactions

### Infernet Integration

Ritual nodes are backed by **Infernet**, a compute oracle network that:

- Provides off-chain AI model execution
- Delivers verified results back on-chain
- Scales compute capacity elastically

## AI Primitives

### Verifiable Provenance

Ritual provides immutable records of:

- Model origin and training data
- Update history and transformations
- Ownership transfers
- Derivative model relationships

### Modular Computational Integrity

Developers can opt-in to different integrity guarantees:

- **Provenance verification**: Prove model origin
- **Privacy preservation**: Confidential inference
- **Computational integrity**: Verify correct execution

### Modular Storage

Storage-agnostic architecture supporting:

- Web2 sources (HuggingFace, cloud storage)
- Web3 storage (Arweave, IPFS, Filecoin)
- Hybrid approaches

## Use Cases

### Smart DeFi

- AI-powered trading strategies executed on-chain
- Dynamic risk assessment for lending protocols
- Intelligent yield optimization
- Fraud detection in real-time

### Autonomous Agents

- On-chain AI agents with scheduled behaviors
- Multi-agent coordination through smart contracts
- Trustless agent-to-agent transactions

### Content Verification

- AI-generated content with provenance
- Deepfake detection services
- Content authenticity verification

### Gaming and Metaverse

- Intelligent NPCs with on-chain AI
- Dynamic game mechanics
- AI-powered content generation

## Ecosystem Integrations

Ritual is designed to benefit the broader blockchain ecosystem:

### Prover Networks

High-performance chains requiring proof generation (MegaETH, Movement, etc.) can use Ritual for efficient prover infrastructure.

### Rollup-as-a-Service

RaaS providers (Conduit, Caldera) can leverage Ritual for heterogeneous compute execution in their rollup offerings.

### IP Monetization

Platforms focused on intellectual property (Story, Sentient) can use Ritual's model marketplace for verifiable AI IP trading.

## Tokenomics

As of early 2026, Ritual's token economics center on:

- **Network Access**: Tokens required for compute services
- **Staking**: Node operators stake to participate in consensus
- **Governance**: Token holders guide protocol development
- **Compute Payments**: Users pay for AI inference and other services

The economic model aligns incentives across:
- AI model creators seeking monetization
- Node operators providing compute
- Developers building AI-enhanced applications
- Users consuming AI services

## Vision

Ritual's broader vision extends beyond any single use case:

> "It's about the collective potential of a decentralized, intelligent, and secure computational fabric. It's infrastructure for a world where powerful technologies are accessible, interoperable, and trustworthy by default."

By making AI native to blockchain, Ritual aims to ensure that as AI becomes more powerful, it remains open, verifiable, and resistant to centralized control.

## See Also

- [[Blockchain]]
- [[Artificial Intelligence]]
- [[Smart Contracts]]
- [[Zero-Knowledge Proofs]]
- [[Trusted Execution Environment]]
- [[AI Inference]]
- [[Decentralized AI]]

## External Links

- [Official Website](https://ritual.net)
- [Documentation](https://docs.ritual.net)
- [Ritual Foundation](https://ritualfoundation.org)
