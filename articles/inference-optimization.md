# Inference Optimization

**Inference optimization** refers to the techniques, hardware innovations, and software strategies used to maximize the speed, efficiency, and cost-effectiveness of running trained [[machine learning]] models in production. As [[generative AI]] applications have scaled to serve billions of users, inference has become the dominant cost and performance consideration for AI deployments, driving a specialized field of engineering focused on extracting maximum throughput from [[AI accelerator]]s.

## Overview

While training a [[large language model]] may require thousands of [[GPU]]s for weeks or months, that model must then serve millions of inference requests indefinitely. For companies like [[OpenAI]], [[Anthropic]], and [[Google]], inference compute costs can exceed training costs within months of deployment. This economic reality has made inference optimization a critical competency, spawning specialized hardware ([[Groq LPU]], [[AWS Trainium|AWS Inferentia]]), software frameworks ([[TensorRT-LLM]], vLLM), and architectural innovations.

## Key Metrics

### Throughput

Measured in tokens per second (for LLMs) or inferences per second:
- **Per-GPU throughput**: How many tokens/inferences a single accelerator produces
- **Cluster throughput**: Aggregate capacity across multiple devices
- **Cost-normalized throughput**: Tokens per dollar spent

### Latency

Critical for user-facing applications:
- **Time to First Token (TTFT)**: Delay before response begins
- **Inter-Token Latency (ITL)**: Time between successive tokens
- **End-to-end latency**: Total request completion time

### Efficiency

- **Tokens per watt**: Energy efficiency
- **Tokens per dollar**: Economic efficiency
- **GPU utilization**: Percentage of theoretical compute used

## Hardware Optimization

### Precision Reduction

Lower numerical precision reduces memory and compute requirements:

**Precision Comparison:**

- **FP32**: Bits: 32, Memory Savings: Baseline, Accuracy Impact: None
- **FP16/BF16**: Bits: 16, Memory Savings: 2×, Accuracy Impact: Minimal
- **INT8**: Bits: 8, Memory Savings: 4×, Accuracy Impact: Small (with calibration)
- **FP8**: Bits: 8, Memory Savings: 4×, Accuracy Impact: Small (modern architectures)
- **INT4/FP4**: Bits: 4, Memory Savings: 8×, Accuracy Impact: Moderate (requires careful quantization)

Modern accelerators like [[NVIDIA B200|Blackwell]] support FP4 natively with micro-tensor scaling to maintain accuracy.

### Quantization Techniques

**Post-Training Quantization (PTQ)**:
- Applied after training without retraining
- GPTQ, AWQ, SmoothQuant algorithms
- Fast deployment but may impact quality

**Quantization-Aware Training (QAT)**:
- Model trained with quantization in mind
- Better accuracy preservation
- Requires additional training compute

**Mixed Precision**:
- Different precisions for different layers
- Critical layers in higher precision
- Optimizes accuracy/efficiency tradeoff

### Inference-Specific Hardware

**Hardware / Optimization Focus:**

- **[[Groq LPU]]**: Deterministic latency, no batching required
- **[[AWS Trainium\**: AWS Inferentia]]
- **[[NVIDIA H100]]**: Transformer Engine, FP8
- **[[NVIDIA B200]]**: FP4, micro-tensor scaling
- **[[Cerebras]]**: Extreme throughput (millions of tokens/sec)

### Memory Optimization

Memory bandwidth often limits inference performance:

- **KV Cache**: Store key-value pairs to avoid recomputation
- **PagedAttention**: Efficient memory management for KV cache
- **Flash Attention**: Fused attention operations reducing memory access
- **Memory offloading**: CPU/storage for less-accessed data

## Software Frameworks

### NVIDIA TensorRT-LLM

NVIDIA's inference optimization library:
- Automatic kernel fusion
- Quantization support (FP8, INT8, INT4)
- Multi-GPU parallelism
- Continuous batching
- In-flight batching

### vLLM

Open-source LLM serving framework:
- PagedAttention for efficient memory
- Continuous batching
- Tensor parallelism
- Supports multiple hardware backends (GPU, TPU)
- Integration with [[OpenAI]] API format

### SGLang

Emerging framework with advanced features:
- RadixAttention for prefix caching
- Speculative decoding
- Structured generation optimization

### Other Frameworks

- **Text Generation Inference (TGI)**: Hugging Face's serving solution
- **llama.cpp**: Efficient CPU/GPU inference for Llama models
- **MLC LLM**: Cross-platform deployment
- **NVIDIA Dynamo**: Distributed inference orchestration

## Serving Strategies

### Batching

Combining multiple requests improves GPU utilization:

**Strategy / Description / Trade-off:**

- **Static batching**: Description: Fixed batch size, Trade-off: Simple but inflexible
- **Dynamic batching**: Description: Variable batch based on queue, Trade-off: Better utilization
- **Continuous batching**: Description: Requests join/leave mid-generation, Trade-off: Optimal for LLMs
- **In-flight batching**: Description: TensorRT-LLM's continuous batching, Trade-off: Maximum throughput

### Caching

Reducing redundant computation:

- **Prompt caching**: Reuse KV cache for common prefixes
- **Semantic caching**: Return cached responses for similar queries
- **Speculative decoding**: Use smaller model to draft tokens

### Model Parallelism

Distributing large models across devices:

**Strategy / Use Case / Communication:**

- **Tensor parallelism**: Use Case: Single layer across GPUs, Communication: High bandwidth needed
- **Pipeline parallelism**: Use Case: Layers across GPUs, Communication: Lower bandwidth okay
- **Expert parallelism**: Use Case: MoE models, Communication: Route-dependent
- **Data parallelism**: Use Case: Multiple copies of model, Communication: Batch distribution

## Architecture Optimizations

### Speculative Decoding

Using a smaller "draft" model to propose tokens:
1. Draft model generates candidate tokens quickly
2. Target model verifies multiple tokens in parallel
3. Accepts correct predictions, regenerates from first mismatch

Can provide 2-3× speedup depending on acceptance rate.

### Mixture of Experts (MoE)

MoE models activate only a subset of parameters per token:
- [[Mixtral]], [[GPT-4]] use MoE architectures
- Reduces compute per token
- Requires efficient expert routing
- Memory for full model but compute for subset

### Prefix Caching

Reusing computation for shared prefixes:
- System prompts cached across requests
- Common conversation starts reused
- Significant savings for structured applications

### Structured Generation

Optimizing constrained output:
- JSON schema enforcement
- Grammar-constrained decoding
- Reduces wasted tokens
- Enables more efficient attention

## Cost Optimization

### Cloud vs. On-Premises

**Factor / Cloud / On-Premises:**

- **Capital cost**: Cloud: Low, On-Premises: High
- **Variable cost**: Cloud: High (per-token), On-Premises: Low (after purchase)
- **Utilization risk**: Cloud: Transferred to provider, On-Premises: Self-managed
- **Latest hardware**: Cloud: Immediately available, On-Premises: Procurement lag

### Reserved vs. On-Demand

- Reserved instances: Lower hourly rate, capacity guarantee
- On-demand: Flexibility, higher cost
- Spot/preemptible: Lowest cost, interruption risk

### Model Selection

Smaller models optimized for specific tasks often outperform larger general models:
- Task-specific fine-tuning
- Distillation from larger models
- Appropriate model sizing

## Performance Benchmarks

### Industry Standards

- **MLPerf Inference**: Industry benchmark suite
- **NVIDIA MLPerf submissions**: Reference performance
- **Artificial Analysis**: LLM inference benchmarking

### Typical Performance (Late 2025)

**Hardware / Model / Throughput:**

- **H100 SXM**: Model: Llama 70B, Throughput: ~2,000-3,000 tokens/sec
- **[[NVIDIA B200\**: Model: GB200 NVL72]], Throughput: Llama 405B, ~30,000+ tokens/sec
- **[[Groq]] LPU cluster**: Model: Llama 70B, Throughput: ~500+ tokens/sec/user (low latency)
- **[[Cerebras]] CS-3**: Model: Llama 70B, Throughput: Millions tokens/sec aggregate

## See Also

- [[AI chips market]]
- [[NVIDIA H100]]
- [[NVIDIA B200]]
- [[Groq LPU]]
- [[Cerebras]]
- [[AI data centers]]

## References

1. NVIDIA TensorRT-LLM Documentation.
2. vLLM Project. https://github.com/vllm-project/vllm
3. Various MLPerf Inference benchmark results.
4. Academic papers on quantization, speculative decoding, and attention optimization.
5. Artificial Analysis LLM benchmarks.
