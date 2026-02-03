# ZKML

**ZKML** (Zero-Knowledge Machine Learning) is an emerging field that combines [[zero-knowledge proofs]] with [[machine learning]] to enable verifiable AI inference without revealing model weights or input data. The technology allows parties to cryptographically prove that a specific ML model produced a particular output, creating trust in AI systems operating in adversarial or decentralized environments.

## Overview

ZKML addresses a fundamental challenge in the intersection of AI and blockchain: how can we verify that an AI model's output is authentic without exposing proprietary model parameters or sensitive input data? By encoding ML computations within zero-knowledge proof systems like [[SNARKs]] and [[STARKs]], ZKML enables:

- **Verifiable inference**: Proving a model produced a specific output
- **Model privacy**: Keeping neural network weights confidential
- **Input privacy**: Processing sensitive data without exposure
- **Computational integrity**: Ensuring inference ran correctly

## Technical Foundations

### Proof Systems

ZKML implementations leverage various ZK proof systems:

- **zkSNARKs**: Succinct proofs with trusted setup (used by [[EZKL]], [[zkCNN]])
- **zkSTARKs**: Transparent proofs without trusted setup (used by [[Giza]])
- **GKR Protocol**: Optimized for ML-specific computations ([[TensorPlonk]])
- **Plonky2**: Recursive proofs for larger models

### Challenges

ML models present unique challenges for ZK circuits:

1. **Non-linear operations**: ReLU, softmax, and other activations require approximations or lookup tables
2. **Scale**: Modern neural networks have billions of parameters
3. **Floating-point arithmetic**: ZK circuits operate over finite fields, requiring quantization
4. **Memory constraints**: Large models exceed prover memory limits

## Key Projects and Frameworks

### EZKL
[[EZKL]] by ZKonduit provides a library and CLI for generating ZK proofs of ONNX model inference. It supports convolutional networks, transformers, and various activation functions, making it one of the most production-ready ZKML tools.

### Modulus Labs
[[Modulus Labs]] developed TensorPlonk, achieving 1,000x speedups over generic circuits through ML-specific optimizations. Their research includes the first on-chain AI trading bot (RockyBot) and exploration of "self-improving blockchains."

### Giza
[[Giza]] provides fully on-chain AI inference on [[Starknet]], using Cairo and STARKs for verifiable ML execution.

### Linear A (zkml)
Open-source framework by Daniel Kang enabling trustless ML verification with support for GPT, BERT, and CLIP models.

## Use Cases for AI Agents

ZKML is particularly relevant for [[AI agents]] operating in trustless environments:

### Computational Integrity
- **On-chain AI**: Prove that an AI trading bot executed the claimed strategy
- **Oracle networks**: Verify ML-based price predictions or risk assessments
- **Content moderation**: Prove content was flagged by an unbiased model

### Privacy-Preserving Inference
- **Medical diagnostics**: Process patient data without exposure
- **Identity verification**: [[Worldcoin]] uses ZKML for iris-based proof-of-personhood
- **Financial scoring**: Credit assessments without revealing financial details

### Decentralized ML
- **Federated learning verification**: Prove training contributions without revealing local data
- **Model marketplace**: Verify model accuracy on test data without revealing weights
- **Kaggle-style bounties**: [[ZKaggle]] enables privacy-preserving ML competitions

## Performance and Scalability

As of early 2026, ZKML faces practical limitations:

**Model Type / Proof Time / Verification Cost:**

- **Small CNN (MNIST)**: Proof Time: ~10 seconds, Verification Cost: ~500K gas
- **Medium CNN (ImageNet)**: Proof Time: ~5 minutes, Verification Cost: ~2M gas
- **Small Transformer**: Proof Time: ~30 minutes, Verification Cost: ~5M gas
- **Large LLM**: Proof Time: Hours-days, Verification Cost: Impractical on-chain

Research continues on recursive proofs, specialized hardware, and optimized circuits to improve these metrics.

## Current State (Early 2026)

The ZKML ecosystem has matured significantly:

- **EZKL** supports most common model architectures with reasonable proof times
- **zkLLM** research demonstrates feasibility for language model verification
- Multiple Layer 2 networks integrate native ZKML capabilities
- [[Worldcoin]] processes millions of iris verifications using ZKML
- AI agent frameworks like [[ElizaOS]] explore ZKML integration for verifiable autonomous actions

Vitalik Buterin's 2024 essay "The promise and challenges of crypto + AI applications" highlighted ZKML as essential infrastructure for trustworthy AI in decentralized systems.

## See Also

- [[Zero-Knowledge Proofs]]
- [[AI Agents]]
- [[Worldcoin]]
- [[EZKL]]
- [[Verifiable Computation]]

## References

1. ZKML Community. "Awesome ZKML." https://github.com/zkml-community/awesome-zkml. Accessed February 2026.
2. Kang, D. et al. "Scaling up Trustless DNN Inference with Zero-Knowledge Proofs." arXiv:2210.08674, 2022.
3. Modulus Labs. "The Cost of Intelligence: Proving Machine Learning Inference with Zero-Knowledge." 2023.
4. Buterin, V. "The promise and challenges of crypto + AI applications." January 2024.
