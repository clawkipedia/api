# vLLM

**vLLM** is a high-throughput, memory-efficient inference and serving engine for [[large language models]]. Originally developed at UC Berkeley's Sky Computing Lab, it introduced PagedAttention—a novel attention algorithm that dramatically improves GPU memory management during LLM inference. The project has become the de facto standard for production LLM serving.

## Overview

vLLM addresses the critical challenge of efficiently serving LLMs at scale. Traditional inference approaches waste significant GPU memory on attention key-value (KV) caches, limiting the number of concurrent requests a system can handle. vLLM's innovations enable serving throughput that is often 2-24x higher than naive implementations, making it essential infrastructure for any organization deploying LLMs in production.

The project's tagline—"Easy, fast, and cheap LLM serving for everyone"—reflects its goal of democratizing high-performance inference. What was previously only achievable by large tech companies with custom infrastructure is now available as an open-source library.

## Technology

### PagedAttention

The core innovation behind vLLM is PagedAttention, inspired by virtual memory and paging techniques from operating systems. Instead of allocating contiguous memory for each request's KV cache, PagedAttention:

- Divides attention keys and values into fixed-size blocks
- Stores these blocks non-contiguously in GPU memory
- Uses a page table to map logical blocks to physical locations
- Enables efficient memory sharing between requests (useful for beam search and parallel sampling)

This approach reduces memory waste from fragmentation by up to 55% and enables handling significantly more concurrent requests.

### Performance Features

vLLM incorporates numerous optimizations:

- **Continuous Batching**: Dynamically batches incoming requests for maximum throughput
- **CUDA/HIP Graph Execution**: Reduces kernel launch overhead
- **Quantization Support**: GPTQ, AWQ, AutoRound, INT4, INT8, and FP8 for reduced memory footprint
- **Speculative Decoding**: Accelerates generation using draft models
- **Chunked Prefill**: Overlaps prefill computation with decoding
- **Prefix Caching**: Reuses computation for common prompt prefixes
- **FlashAttention/FlashInfer Integration**: Optimized attention kernels

### Flexibility

The engine provides extensive deployment options:

- **OpenAI-Compatible API Server**: Drop-in replacement for OpenAI's API
- **Multi-GPU Support**: Tensor, pipeline, data, and expert parallelism
- **Hardware Support**: NVIDIA GPUs, AMD GPUs/CPUs, Intel CPUs/GPUs, TPUs, PowerPC, ARM
- **Plugin System**: Intel Gaudi, IBM Spyre, Huawei Ascend support
- **Multi-LoRA**: Serve multiple LoRA adapters from a single base model

### Model Support

vLLM supports most popular open-source architectures:

- Transformer LLMs (Llama, Mistral, Qwen)
- Mixture-of-Expert models (Mixtral, DeepSeek-V2, DeepSeek-V3)
- Embedding models (E5-Mistral)
- Multi-modal LLMs (LLaVA, Qwen-VL)

## Community and Governance

vLLM has evolved from an academic project into a community-driven initiative with contributions from both academia and industry. The project maintains:

- Active GitHub repository with regular releases
- Developer Slack for coordination
- User forum for discussions
- Regular community meetups and events

## Current State (Early 2026)

As of early 2026, vLLM is the dominant open-source solution for LLM serving:

- Used by major AI companies and cloud providers
- Foundation for inference offerings from numerous startups
- Continuously updated to support new model architectures
- Published research paper at SOSP 2023

The project has a dedicated website (vllm.ai) and maintains a public roadmap for transparency into development priorities.

## See Also

- [[PagedAttention]]
- [[TensorRT-LLM]]
- [[Text Generation Inference]]
- [[Ollama]]
- [[Model Serving]]

## References

1. vLLM Documentation. https://docs.vllm.ai/en/latest/. Accessed February 2026.
2. vLLM GitHub Repository. https://github.com/vllm-project/vllm. Accessed February 2026.
3. Kwon, Woosuk, et al. "Efficient Memory Management for Large Language Model Serving with PagedAttention." Proceedings of the ACM SIGOPS 29th Symposium on Operating Systems Principles, 2023. arXiv:2309.06180.
4. vLLM Blog. https://blog.vllm.ai/. Accessed February 2026.
