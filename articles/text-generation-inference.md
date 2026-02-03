# Text Generation Inference (TGI)

**Text Generation Inference (TGI)** is [[Hugging Face]]'s production-ready toolkit for deploying and serving [[Large Language Models]]. Written in Rust and Python with gRPC communication, TGI powers Hugging Face's own infrastructure including HuggingChat, the Inference API, and Inference Endpoints, demonstrating its battle-tested reliability at scale.

## Overview

TGI was developed by Hugging Face to solve the challenges of serving LLMs in production environments. It introduced several innovations that have since been adopted across the inference ecosystem, including the implementation of [[PagedAttention]] (in collaboration with the [[vLLM]] project) and production-grade features like distributed tracing and Prometheus metrics.

As of 2026, TGI is in maintenance mode, with Hugging Face recommending downstream engines like vLLM, [[SGLang]], [[llama.cpp]], and MLX for new deployments. However, TGI remains significant both as production infrastructure and for its architectural influence on the field—its approach of optimizing transformer architectures for inference is now standard practice across inference engines.

## Architecture

TGI employs a multi-component architecture optimized for production serving:

**Rust Router/Server**: The frontend HTTP server is implemented in Rust for maximum performance and safety. It handles request routing, batching logic, and serves both a custom API and an [[OpenAI API]]-compatible Messages endpoint.

**Python Model Server**: Model execution occurs in Python processes, enabling seamless integration with the [[PyTorch]] and [[Transformers]] ecosystem. The server communicates with the router via gRPC for efficient inter-process communication.

**Scheduler**: Implements continuous batching for dynamic request management. Unlike static batching where all requests in a batch must complete before new ones can be processed, continuous batching allows requests to exit as they finish, maintaining high GPU utilization.

**Custom Kernels**: Optimized CUDA kernels for attention computation, including [[FlashAttention]] integration and custom implementations for specific architectures.

**Tensor Parallelism**: Distributed execution across multiple GPUs using NCCL for inter-GPU communication, with configurable parallelism strategies.

**Observability Stack**: Production-ready monitoring via OpenTelemetry distributed tracing and Prometheus metrics endpoints for comprehensive operational visibility.

## Features

TGI provides enterprise-grade features for LLM deployment:

- **Continuous Batching**: Dynamic request batching for increased throughput without sacrificing latency
- **[[PagedAttention]]**: Efficient [[KV Cache]] memory management, pioneered alongside vLLM
- **Token Streaming**: Server-Sent Events (SSE) for real-time token delivery to clients
- **Tensor Parallelism**: Multi-GPU inference for models exceeding single-GPU memory
- **Speculative Decoding**: ~2x latency improvement through draft model prediction
- **Comprehensive Quantization**: Support for [[bitsandbytes]], [[GPTQ]], EETQ, [[AWQ]], Marlin, and FP8 formats
- **Guided Decoding**: JSON schema and grammar constraints for structured output generation
- **Watermarking**: Implementation of "A Watermark for Large Language Models" paper
- **Logits Processing**: Temperature scaling, top-p, top-k, repetition penalty, and custom processors
- **Multi-Hardware Support**: NVIDIA GPUs, AMD GPUs (ROCm), AWS Inferentia, Intel GPUs, Intel Gaudi, and Google TPUs

## Performance

TGI achieves strong production performance through its optimizations:

- **High Throughput**: Continuous batching and PagedAttention enable serving hundreds of concurrent requests efficiently
- **Low Latency**: Flash Attention integration and speculative decoding minimize time-to-first-token and inter-token latency
- **Memory Efficiency**: Paged attention implementation achieves near-optimal KV cache utilization
- **Horizontal Scaling**: Tensor parallelism enables linear scaling across multiple GPUs

TGI has been battle-tested serving millions of requests daily on Hugging Face's infrastructure, demonstrating reliability at scale. The system supports models from small (1B parameters) to very large (70B+ parameters) across diverse hardware configurations.

Production deployments typically achieve:
- Time-to-first-token under 500ms for most models
- Sustained throughput of thousands of tokens/second per GPU
- 99th percentile latency suitable for interactive applications

## See Also

- [[Hugging Face]]
- [[PagedAttention]]
- [[Continuous Batching]]
- [[vLLM]]
- [[FlashAttention]]
- [[Transformers]]
- [[SGLang]]

## References

- [TGI GitHub Repository](https://github.com/huggingface/text-generation-inference)
- [TGI Documentation](https://huggingface.co/docs/text-generation-inference)
- [Hugging Face Inference Endpoints](https://huggingface.co/inference-endpoints)
- [LLM Inference at Scale with TGI (Adyen Technical Blog)](https://www.adyen.com/knowledge-hub/llm-inference-at-scale-with-tgi)
