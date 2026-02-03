# Parameter-Efficient Fine-Tuning (PEFT)

**Parameter-Efficient Fine-Tuning (PEFT)** refers to a family of techniques that adapt large pretrained models to downstream tasks by training only a small subset of parameters, rather than updating all model weights. These methods have become essential for making [[large language model|LLM]] customization practical and accessible.

## Overview

As models have grown to billions or trillions of parameters, full [[fine-tuning]] has become prohibitively expensive. Training all parameters of a 70B model requires hundreds of gigabytes of GPU memory and significant compute resources. PEFT methods address this by keeping most pretrained weights frozen and only training a small number of additional or modified parameters.

The key insight is that task-specific adaptation can often be achieved with far fewer parameters than the full model. PEFT methods typically reduce trainable parameters by 90-99.99% while achieving performance comparable to full fine-tuning.

Hugging Face's PEFT library has become the standard implementation, integrating with Transformers, Diffusers, and Accelerate for seamless training workflows.

## Categories of PEFT Methods

### Additive Methods

These methods add new trainable parameters to the model while keeping original weights frozen:

**Adapters**: Small bottleneck modules inserted between transformer layers. The original adapter architecture adds a down-projection, nonlinearity, and up-projection after attention and feedforward blocks. Variants include Parallel Adapters and LLaMA-Adapter.

**Soft Prompts**: Learnable continuous vectors prepended to input embeddings:
- **Prefix Tuning**: Adds learnable prefix tokens to each transformer layer
- **Prompt Tuning**: Adds learnable tokens only to the input layer
- **P-Tuning**: Uses an LSTM to generate soft prompts

### Reparameterization Methods

These methods represent weight updates in a parameter-efficient form:

**[[LoRA]] (Low-Rank Adaptation)**: Decomposes weight updates into low-rank matrices. The most popular PEFT method, LoRA adds trainable matrices A and B such that ΔW = AB, where the rank of the decomposition is much smaller than the weight dimensions.

**LoHa (Low-Rank Hadamard Product)**: Uses Hadamard (element-wise) products to achieve higher expressivity than LoRA with similar parameter counts.

**LoKr (Low-Rank Kronecker Product)**: Employs Kronecker products for decomposition, preserving rank while reducing parameters.

### Orthogonal Methods

**OFT (Orthogonal Fine-Tuning)**: Learns orthogonal transformations that preserve the hyperspherical energy between neurons, maintaining pretrained knowledge while adapting to new tasks.

**BOFT (Butterfly OFT)**: Uses butterfly matrix factorization for more parameter-efficient orthogonal transformations.

### Selective Methods

**BitFit**: Trains only bias terms, achieving competitive results with minimal parameters.

**IA³**: Learns scaling vectors that modulate activations in attention and feedforward layers.

### Adaptive Methods

**AdaLoRA**: Dynamically allocates rank budget across layers based on importance scores, pruning less important adapters while giving more capacity to critical ones.

**X-LoRA**: Mixture of LoRA experts with learned gating for dynamic adapter selection.

## Comparison of Methods

**Method Comparison:**

- **LoRA**: Trainable Parameters: Very low (0.01-0.1%), Inference Latency: None (mergeable), Best For: General purpose
- **Adapters**: Trainable Parameters: Low (0.5-3%), Inference Latency: Small increase, Best For: Multi-task
- **Prefix Tuning**: Trainable Parameters: Very low, Inference Latency: Small increase, Best For: Generation tasks
- **OFT**: Trainable Parameters: Low, Inference Latency: None (mergeable), Best For: Preserving capabilities
- **QLoRA**: Trainable Parameters: Very low, Inference Latency: None, Best For: Memory-constrained

## Combining PEFT with Quantization

[[Quantization]] and PEFT are highly complementary:

**QLoRA**: The most impactful combination, using 4-bit quantized base models with LoRA adapters trained in higher precision. This enables fine-tuning 70B+ models on a single consumer GPU.

**LoftQ**: Initializes LoRA weights to compensate for quantization error, improving quality of quantized fine-tuned models.

## PEFT in Practice

The Hugging Face PEFT library provides a unified interface:

```python
from peft import get_peft_model, LoraConfig

config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
)
peft_model = get_peft_model(base_model, config)
```

Key considerations for choosing a PEFT method:
1. **Memory constraints**: QLoRA for consumer hardware
2. **Multi-task serving**: LoRA with adapter swapping
3. **Maximum quality**: AdaLoRA with higher ranks
4. **Diffusion models**: LoRA, LoHa, or LoKr
5. **Preserving capabilities**: OFT or BOFT

## Current State (Early 2026)

PEFT has matured significantly, with [[lora|LoRA]] emerging as the dominant method due to its simplicity, effectiveness, and zero inference overhead. Research continues on optimal hyperparameter selection, automatic rank adaptation, and combining multiple PEFT methods.

The ecosystem now includes specialized training tools (Axolotl, LlamaFactory, Unsloth) that simplify PEFT workflows, and inference frameworks (vLLM, TGI) that support efficient multi-adapter serving.

## See Also

- [[lora]] - Low-Rank Adaptation
- [[fine-tuning]] - General fine-tuning approaches
- [[quantization]] - Model compression techniques

## References

1. Hugging Face. "PEFT: State-of-the-art Parameter-Efficient Fine-Tuning." https://huggingface.co/docs/peft
2. Hu, Edward J., et al. "LoRA: Low-Rank Adaptation of Large Language Models." arXiv:2106.09685, 2021.
3. Houlsby, Neil, et al. "Parameter-Efficient Transfer Learning for NLP." ICML 2019.
4. Dettmers, Tim, et al. "QLoRA: Efficient Finetuning of Quantized LLMs." arXiv:2305.14314, 2023.
