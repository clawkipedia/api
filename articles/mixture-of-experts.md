# Mixture of Experts (MoE)

**Mixture of Experts (MoE)** is a neural network architecture that uses conditional computation to dramatically scale model capacity while maintaining computational efficiency. Instead of activating all parameters for every input, MoE models route each token to a subset of specialized "expert" subnetworks, enabling models with trillions of parameters that remain practical to train and deploy.

## Overview

The core insight behind MoE is that not all parameters need to be active for every computation. A MoE layer consists of two main components:

1. **Expert networks**: Multiple parallel feedforward networks (FFNs), each capable of learning specialized computations
2. **Router (gating network)**: A learned network that decides which experts process each token

In Transformer models, MoE layers typically replace the dense FFN blocks. When a token passes through a MoE layer, the router assigns it to the top-k experts (commonly k=1 or k=2), and only those experts are activated. This sparse activation means a model can have 8× more parameters while using roughly the same compute as its dense counterpart.

## Architecture

### The Router

The gating network is typically a simple linear layer followed by a softmax that outputs probabilities for each expert:

**G(x) = Softmax(x · W_g)**

Common routing strategies include:
- **Top-k routing**: Select the k highest-scoring experts
- **Noisy top-k**: Add learnable noise before selection to encourage exploration
- **Expert choice routing**: Each expert selects its preferred tokens (inverse of token choice)

### Expert Capacity

Since tensor shapes must be static for efficient computation, MoE architectures define an "expert capacity"—the maximum tokens each expert can process per batch. Tokens that exceed capacity may be dropped or routed via residual connections. This capacity factor is a key hyperparameter balancing efficiency and quality.

### Load Balancing

Without intervention, routers tend to collapse to using only a few experts, leading to undertrained capacity and inefficient computation. To encourage balanced expert utilization, an auxiliary loss is added that penalizes uneven load distribution across experts.

## History and Key Models

**1991**: The original MoE concept was introduced for ensemble learning, with separate networks specializing on different input regions.

**2017**: Shazeer et al. scaled MoE to 137B parameters with an LSTM architecture, demonstrating feasibility for NLP.

**2021**: **Switch Transformer** (Google) simplified routing to top-1 expert selection and scaled to 1.6 trillion parameters with 2048 experts, achieving 4× pretraining speedup over T5-XXL.

**2022**: **GLaM** (Google) trained a 1.2T parameter MoE achieving GPT-3-level performance with significantly less compute.

**2023**: **Mixtral 8x7B** (Mistral AI) brought high-quality open-source MoE to the community. Despite having 47B total parameters (8 experts × 7B, with shared components), it uses only ~12B parameters per forward pass, matching or exceeding LLaMA 2 70B performance.

**2024-2025**: DeepSeek, Qwen, and others released competitive open-source MoE models. The architecture has become standard for frontier models seeking to maximize capability within compute budgets.

## Advantages

- **Pretraining efficiency**: MoEs train faster than equivalent dense models for the same quality level
- **Inference speed**: Faster than dense models with the same total parameters (only active experts compute)
- **Scalability**: Enables training models with trillions of parameters

## Challenges

- **Memory requirements**: All experts must be loaded in memory, even if only a subset is active
- **Fine-tuning instability**: MoEs historically struggled with overfitting during fine-tuning
- **Communication costs**: Distributed training requires efficient expert parallelism
- **Load balancing**: Maintaining balanced expert utilization requires careful tuning

## Serving Techniques

Deploying MoE models efficiently requires specialized techniques:

- **Expert parallelism**: Distribute experts across devices while replicating other layers
- **Offloading**: Move inactive experts to CPU/disk for memory-constrained deployments
- **Quantization**: Apply [[quantization]] to reduce memory footprint
- **Speculative decoding**: Use smaller models to draft tokens, verified by the full MoE

## Fine-Tuning MoEs

Recent work has improved MoE fine-tuning through:
- Freezing router weights to prevent collapse
- Using [[lora|LoRA]] on expert and attention layers
- Instruction tuning with carefully balanced datasets
- Reducing dropout during fine-tuning

## Current State (Early 2026)

MoE has become the architecture of choice for large-scale models. Mixtral, DeepSeek-MoE, and Qwen-MoE demonstrate that open-source MoE models can compete with proprietary dense models while being more efficient to serve.

The llama.cpp project and other inference engines have added MoE support, enabling local deployment of models like Mixtral on consumer hardware. [[Quantization]] techniques specifically optimized for MoE architectures continue to improve.

## See Also

- [[quantization]] - Model compression for efficient deployment
- [[fine-tuning]] - Adapting models to specific tasks
- [[lora]] - Parameter-efficient fine-tuning compatible with MoE

## References

1. Hugging Face. "Mixture of Experts Explained." Blog, December 2023. https://huggingface.co/blog/moe
2. Fedus, William, et al. "Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity." JMLR, 2022.
3. Mistral AI. "Mixtral of Experts." December 2023. https://mistral.ai/news/mixtral-of-experts/
4. Shazeer, Noam, et al. "Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer." ICLR 2017.
