# LoRA (Low-Rank Adaptation)

**LoRA** (Low-Rank Adaptation) is a [[peft|parameter-efficient fine-tuning]] technique that dramatically reduces the computational cost of adapting large pretrained models to new tasks. Introduced by researchers at Microsoft in 2021, LoRA has become one of the most widely adopted methods for customizing [[large language model|large language models]] and diffusion models.

## Overview

The fundamental insight behind LoRA is that the weight updates during [[fine-tuning]] have a low intrinsic rank—meaning they can be represented by much smaller matrices without significant information loss. Instead of updating the full weight matrix W (which may have millions or billions of parameters), LoRA decomposes the weight update ΔW into two smaller matrices:

**ΔW = A × B**

Where A is a matrix of shape (d × r) and B is (r × d), with rank r being much smaller than d. For a weight matrix with millions of parameters, r might be as small as 4, 8, or 16.

This approach offers several compelling advantages:

- **Reduced trainable parameters**: LoRA can reduce trainable parameters by 10,000× compared to full fine-tuning
- **Lower memory requirements**: GPU memory usage can be reduced by 3× or more
- **No inference latency**: Adapter weights can be merged with base model weights
- **Multiple task support**: Different LoRA adapters can share the same base model
- **Comparable performance**: Quality matches or exceeds full fine-tuning on many tasks

## How It Works

During training, the original pretrained weights W₀ are frozen (no gradient updates). Only the low-rank matrices A and B are trained. The forward pass computes:

**h = W₀x + ΔWx = W₀x + ABx**

Matrix A is typically initialized with random Gaussian values, while B is initialized to zeros, ensuring that ΔW = AB starts as a zero matrix (identity transform). This means training begins from the pretrained model's exact behavior.

A scaling factor α/r is applied to ΔW to control the magnitude of updates. The hyperparameter α (lora_alpha) determines how much the adapter influences the output relative to the original weights.

## Key Hyperparameters

**Parameter / Description / Typical Values:**

- **r (rank)**: Description: Dimension of low-rank matrices, Typical Values: 4, 8, 16, 32, 64
- **lora_alpha**: Description: Scaling factor, Typical Values: Often equal to r, or 16-32
- **target_modules**: Description: Which layers to apply LoRA, Typical Values: Attention layers (q_proj, v_proj, k_proj, o_proj)
- **lora_dropout**: Description: Dropout probability, Typical Values: 0.0 - 0.1

Higher rank allows more expressive updates but increases parameter count. Research has shown that relatively low ranks (8-16) are sufficient for many tasks.

## Rank-Stabilized LoRA (rsLoRA)

Recent research introduced rsLoRA, which uses the scaling factor α/√r instead of α/r. This stabilizes training dynamics across different rank values and enables better performance from higher ranks. Set `use_rslora=True` in PEFT to enable this.

## Variants and Extensions

The success of LoRA has spawned numerous variants:

- **QLoRA**: Combines 4-bit [[quantization]] with LoRA for memory-efficient fine-tuning on consumer GPUs
- **LoRA+**: Assigns different learning rates to A and B matrices
- **DoRA**: Decomposes weight updates into magnitude and direction components
- **LoHa**: Uses Hadamard product for more expressive low-rank updates
- **LoKr**: Employs Kronecker product decomposition
- **AdaLoRA**: Adaptively allocates rank budget across layers based on importance
- **X-LoRA**: Mixture of LoRA experts with dynamic gating

## LoftQ Initialization

For quantized base models, LoftQ initialization improves performance by initializing LoRA weights to minimize quantization error. Rather than starting from zeros, the LoRA matrices are set to approximate the difference between full-precision and quantized weights.

## Merging and Deployment

After training, LoRA weights can be:

1. **Merged**: Combine adapter with base model for deployment without overhead
2. **Kept separate**: Load adapters dynamically for multi-task serving
3. **Combined**: Merge multiple LoRA adapters with weighted averaging

The Hugging Face PEFT library provides utilities like `merge_and_unload()`, `merge_adapter()`, and `add_weighted_adapter()` for these operations.

## Applications

LoRA is used extensively across domains:

- **LLM instruction tuning**: Adapting base models to follow instructions
- **Domain adaptation**: Specializing models for legal, medical, or technical domains
- **Stable Diffusion**: Training custom styles, characters, and concepts
- **Multi-lingual adaptation**: Adding language capabilities efficiently
- **Task-specific models**: Creating focused models for classification, summarization, etc.

## Current State (Early 2026)

LoRA has become the de facto standard for efficient fine-tuning. The technique is fully integrated into major frameworks including Hugging Face PEFT, PyTorch, and various inference engines. Tools like Axolotl, LlamaFactory, and Unsloth provide streamlined LoRA training workflows.

Research continues on optimal rank selection, layer targeting strategies, and combining LoRA with other efficiency techniques like [[quantization]] and pruning.

## See Also

- [[peft]] - Parameter-Efficient Fine-Tuning methods
- [[fine-tuning]] - General fine-tuning techniques
- [[quantization]] - Model compression for efficient inference

## References

1. Hu, Edward J., et al. "LoRA: Low-Rank Adaptation of Large Language Models." arXiv:2106.09685, 2021. https://arxiv.org/abs/2106.09685
2. Hugging Face. "LoRA Conceptual Guide." PEFT Documentation. https://huggingface.co/docs/peft/conceptual_guides/lora
3. Dettmers, Tim, et al. "QLoRA: Efficient Finetuning of Quantized LLMs." arXiv:2305.14314, 2023.
4. Kalajdzievski, Damjan. "Rank-Stabilized LoRA." arXiv:2312.03732, 2023.
