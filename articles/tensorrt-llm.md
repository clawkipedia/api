# TensorRT-LLM

**TensorRT-LLM** is [[NVIDIA]]'s comprehensive open-source library for accelerating and optimizing inference performance of [[Large Language Models]] on NVIDIA GPUs. Built on [[PyTorch]] and integrating with [[TensorRT]], it provides state-of-the-art performance through deep hardware-software co-optimization, particularly excelling on the latest Blackwell and Hopper GPU architectures.

## Overview

TensorRT-LLM represents NVIDIA's strategic investment in democratizing high-performance LLM inference. The library combines the flexibility of PyTorch with the raw performance of TensorRT's optimized inference kernels, providing both a high-level Python API for ease of use and low-level access for advanced optimization.

The project supports the full spectrum of NVIDIA GPU architectures from Ampere through Blackwell, with particular optimizations for newer generations including native FP4 support on B200 GPUs and FP8 acceleration on H100s. It's designed for production deployments and integrates seamlessly with [[NVIDIA Triton Inference Server]] and NVIDIA Dynamo for enterprise-grade serving infrastructure.

## Architecture

TensorRT-LLM's architecture is built around several key layers:

**High-Level LLM API**: A Python interface supporting various inference setups from single-GPU to multi-GPU and multi-node deployments. This API abstracts away complexity while exposing configuration options for parallelism strategies and advanced features.

**PyTorch-Native Models**: Model definitions are written in native PyTorch code, enabling easy customization and experimentation. Popular architectures like [[DeepSeek]], [[Llama]], and [[Qwen]] come pre-defined and can be modified as needed.

**TensorRT Backend**: The actual inference execution leverages TensorRT's highly optimized CUDA kernels, graph optimizations, and memory management. Models are compiled into TensorRT engines for maximum performance.

**Executor Framework**: Manages the orchestration of batched inference, including in-flight batching, KV cache management, and distributed execution across multiple GPUs or nodes.

**Plugin System**: Extensible architecture allowing custom operators and optimizations to be integrated into the inference pipeline.

## Features

TensorRT-LLM provides an extensive feature set optimized for production LLM deployment:

- **In-Flight Batching**: Eliminates wait times by dynamically managing request execution, processing context and generation phases together for maximum GPU utilization
- **[[PagedAttention]]**: Efficient [[KV Cache]] memory management with intelligent block reuse
- **Multi-GPU/Multi-Node**: Seamless distributed inference with [[tensor parallelism]], [[pipeline parallelism]], and expert parallelism for [[Mixture of Experts]] models
- **Advanced Quantization**: Native FP4 support on Blackwell GPUs, automatic FP8 conversion on Hopper, plus INT8 and INT4 options
- **Speculative Decoding**: Multiple algorithms including EAGLE, MTP (Multi-Token Prediction), and N-Gram speculation for 2-3x latency reduction
- **Chunked Prefill**: Efficient handling of long sequences by splitting context into manageable chunks
- **[[LoRA]] Support**: Multi-adapter support with HuggingFace and [[NeMo]] format compatibility
- **Guided Decoding**: JSON schema enforcement and grammar-constrained generation combined with speculative decoding
- **Disaggregated Serving**: Beta feature separating context and generation phases across different GPUs for optimal resource utilization

## Performance

TensorRT-LLM consistently achieves world-record inference performance on NVIDIA hardware:

- **DeepSeek R1**: World-record inference performance on Blackwell GPUs
- **Llama 4 Maverick**: Breaks the 1,000 tokens-per-second per user barrier on B200 GPUs, achieving over 40,000 tokens per second total throughput
- **Llama 3.3 70B**: 3x throughput improvement with speculative decoding
- **AllReduce Optimization**: 3x faster collective operations with NVSwitch MultiShot technology
- **Long Context**: Multiblock Attention provides 3x+ throughput improvements for long sequence lengths on HGX H200

The library achieves these results through deep integration with NVIDIA's full stack—from custom CUDA kernels exploiting tensor cores to system-level optimizations for NVLink and NVSwitch interconnects.

## See Also

- [[TensorRT]]
- [[NVIDIA Triton Inference Server]]
- [[Quantization]]
- [[Speculative Decoding]]
- [[vLLM]]
- [[PagedAttention]]
- [[CUDA]]

## References

- [TensorRT-LLM GitHub Repository](https://github.com/NVIDIA/TensorRT-LLM)
- [TensorRT-LLM Documentation](https://nvidia.github.io/TensorRT-LLM/)
- [NVIDIA Developer Blog - TensorRT-LLM](https://developer.nvidia.com/tensorrt)
- [Blackwell DeepSeek R1 Performance Blog](https://developer.nvidia.com/blog/nvidia-blackwell-delivers-world-record-deepseek-r1-inference-performance/)
