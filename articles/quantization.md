# Model Quantization

**Model quantization** is a technique that reduces the memory footprint and computational requirements of neural networks by representing weights and activations in lower-precision numerical formats. For [[large language model|large language models]], quantization has become essential for deploying powerful models on consumer hardware and edge devices.

## Overview

Neural network weights are typically stored in 32-bit floating-point (FP32) or 16-bit (FP16/BF16) formats. Quantization compresses these weights to lower precisions—commonly 8-bit, 4-bit, or even 1-2 bits—while attempting to preserve model accuracy. This compression dramatically reduces memory requirements and can accelerate inference through more efficient integer operations.

For a model like LLaMA 2 70B, quantization can reduce memory requirements from ~140GB (FP16) to ~35GB (4-bit), making it possible to run on consumer GPUs. The trade-off is a potential decrease in model quality, though modern quantization techniques have minimized this degradation.

## Quantization Methods

### GPTQ (GPT Quantization)

GPTQ is a post-training quantization method that achieves high compression ratios with minimal quality loss. It works by quantizing weights layer-by-layer, using a small calibration dataset to optimize the quantization process. GPTQ uses the inverse Hessian matrix to determine which weight errors matter most and compensates accordingly. The method typically achieves 4-bit precision with negligible perplexity increase.

GPTQModel (formerly AutoGPTQ) is the primary implementation, supporting various bit widths (2/3/4/8) and hardware backends including CUDA, ROCm, and Apple Metal.

### GGUF (GGML Universal Format)

GGUF, developed for the llama.cpp project, is a file format and quantization scheme optimized for CPU inference. It replaced the earlier GGML format and supports a wide range of quantization levels from 1.5-bit to 8-bit. GGUF's key advantage is enabling LLM inference without requiring a GPU, using optimized CPU kernels with AVX, AVX2, AVX512, and ARM NEON support.

The llama.cpp ecosystem has grown substantially, with support for numerous model architectures and bindings for Python, JavaScript, Rust, and other languages.

### AWQ (Activation-aware Weight Quantization)

AWQ observes that not all weights are equally important—only ~1% of weights significantly impact model performance. By identifying and preserving these salient weights based on activation patterns (rather than weight magnitudes), AWQ achieves superior quality at low bit widths. The method requires a small calibration dataset but produces highly efficient 4-bit models with excellent accuracy retention.

### bitsandbytes

The bitsandbytes library pioneered accessible 8-bit and 4-bit quantization with on-the-fly (dynamic) quantization. Its k-bit quantization, introduced for QLoRA, uses double quantization and special data types like NF4 (normalized float 4-bit) optimized for normally-distributed weights. The library integrates seamlessly with Hugging Face Transformers.

### Other Methods

The quantization ecosystem continues to expand with methods including:

- **HQQ**: Half-Quadratic Quantization for fast on-the-fly quantization
- **AQLM**: Extreme 1-2 bit quantization with additive codes
- **VPTQ**: Vector Post-Training Quantization from Microsoft
- **FP8**: 8-bit floating-point formats supported by modern GPUs
- **torchao**: PyTorch-native quantization with torch.compile support

## Hardware Considerations

Quantization effectiveness varies by hardware:

**Platform / Recommended Methods:**

- **NVIDIA CUDA**: GPTQ, AWQ, bitsandbytes
- **AMD ROCm**: GPTQ, AWQ
- **Apple Silicon**: GGUF, bitsandbytes, optimum-quanto
- **Intel**: GGUF, AutoRound
- **CPU-only**: GGUF

## Quantization + Fine-Tuning

QLoRA (Quantized [[LoRA]]) combines 4-bit quantization with [[peft|parameter-efficient fine-tuning]], enabling fine-tuning of large models on consumer GPUs. The base model is quantized to 4-bit while LoRA adapters are trained in higher precision, then merged post-training. LoftQ initialization further improves QLoRA by initializing LoRA weights to minimize quantization error.

## Current State (Early 2026)

Hugging Face Transformers now supports over 17 quantization backends through a unified interface. The trend toward extreme compression (2-4 bits) continues, with research showing that careful calibration can maintain acceptable quality even at very low precisions.

Tools like Hugging Face Spaces provide user-friendly interfaces for quantizing models (GGUF-my-repo, bnb-my-repo), democratizing access to these techniques.

## See Also

- [[fine-tuning]] - Model fine-tuning techniques
- [[lora]] - Low-Rank Adaptation for efficient fine-tuning
- [[mixture-of-experts]] - MoE architectures that benefit from quantization

## References

1. Hugging Face. "Quantization Overview." Transformers Documentation. https://huggingface.co/docs/transformers/quantization/overview
2. ggml-org. "llama.cpp - LLM inference in C/C++." GitHub. https://github.com/ggml-org/llama.cpp
3. Frantar, Elias, et al. "GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers." arXiv:2210.17323, 2022.
4. Lin, Ji, et al. "AWQ: Activation-aware Weight Quantization." arXiv:2306.00978, 2023.
