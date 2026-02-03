# llama.cpp

**llama.cpp** is a high-performance C/C++ implementation for [[Large Language Model]] inference, designed to run LLMs efficiently on a wide variety of hardware with minimal dependencies. Created by Georgi Gerganov, the project pioneered practical local LLM inference and introduced the widely-adopted [[GGUF]] quantization format that enables running large models on consumer hardware.

## Overview

llama.cpp emerged from the goal of making LLM inference accessible without requiring expensive GPU clusters or complex software stacks. Written in plain C/C++ with zero external dependencies, it achieves remarkable performance through hand-optimized implementations for various CPU architectures and optional GPU acceleration.

The project is the reference implementation for the [[ggml]] tensor library and serves as the primary playground for developing new inference optimizations. Its influence extends far beyond its direct usage—the GGUF format has become a de facto standard for quantized model distribution, supported by numerous inference engines and hosting platforms including [[Hugging Face]].

## Architecture

llama.cpp follows a lean, modular architecture optimized for portability and performance:

**Core Engine (ggml)**: The underlying tensor library handles all mathematical operations. ggml is a minimalist tensor library written in C that supports automatic differentiation and various backend accelerators. It provides efficient implementations of operations critical for transformer inference.

**Model Loading**: Supports the GGUF file format, which stores model weights, tokenizer data, and metadata in a single self-contained file. The format supports various quantization levels from 1.5-bit to 8-bit integers, enabling flexible memory/quality tradeoffs.

**Backend System**: Modular acceleration backends include:
- **CPU**: Highly optimized with ARM NEON, AVX/AVX2/AVX512/AMX for x86, and RISC-V vector extensions
- **Apple Silicon**: First-class support via Accelerate framework and [[Metal]] compute shaders
- **NVIDIA GPUs**: Custom [[CUDA]] kernels
- **AMD GPUs**: Support via HIP and ROCm
- **Other GPUs**: Vulkan and SYCL backends for cross-platform GPU acceleration

**Server Component (llama-server)**: A lightweight HTTP server providing an [[OpenAI API]]-compatible interface, including recent additions for multimodal model support.

**Hybrid Inference**: CPU+GPU hybrid mode allows running models larger than VRAM by offloading layers between GPU and CPU memory, enabling inference on partially-fitting models.

## Features

llama.cpp provides comprehensive functionality for local LLM deployment:

- **Extensive Quantization**: 1.5-bit, 2-bit, 3-bit, 4-bit, 5-bit, 6-bit, and 8-bit integer quantization schemes, each with quality/performance tradeoffs
- **Broad Model Support**: Llama family, Mistral, Mixtral, Falcon, MPT, RWKV, Qwen, DeepSeek, Phi, Gemma, and 100+ other architectures including multimodal models (LLaVA, MiniCPM, Moondream)
- **Zero Dependencies**: Core functionality requires only a C/C++ compiler—no Python, no CUDA toolkit for CPU inference
- **Cross-Platform**: Runs on Linux, macOS, Windows, iOS, Android, and WebAssembly
- **Language Bindings**: Official and community bindings for Python, Go, Node.js, Rust, Ruby, C#, Java, and more
- **Development Tools**: VS Code extension and Vim/Neovim plugins for local code completion
- **Direct HuggingFace Integration**: Download and run models directly from HuggingFace with `-hf` flag

## Performance

llama.cpp achieves impressive performance through careful optimization:

- **Apple Silicon Excellence**: M1/M2/M3 Macs achieve inference speeds comparable to discrete GPUs through unified memory and Metal optimization
- **AVX-512 Utilization**: x86 CPUs with AVX-512 see significant speedups, with AMX support for Intel's latest processors
- **Memory Efficiency**: Quantization enables running 7B parameter models in under 4GB RAM, 70B models in 32-40GB
- **Prompt Processing**: Efficient batched prompt evaluation and KV cache management
- **Native FP4 Support**: Recent addition of MXFP4 format support in collaboration with NVIDIA for next-generation efficiency

Typical performance on Apple M2 Ultra achieves 30-50 tokens/second for 7B models and 10-20 tokens/second for 70B models (quantized), making interactive use practical on consumer hardware.

## See Also

- [[ggml]]
- [[GGUF]]
- [[Quantization]]
- [[Ollama]]
- [[Metal (Apple)]]
- [[Local LLM Inference]]

## References

- [llama.cpp GitHub Repository](https://github.com/ggml-org/llama.cpp)
- [GGUF Format Specification](https://github.com/ggml-org/ggml/blob/master/docs/gguf.md)
- [ggml Tensor Library](https://github.com/ggml-org/ggml)
- [Hugging Face GGUF Documentation](https://huggingface.co/docs/hub/gguf)
