# KV Cache

## Overview

**KV Cache** (Key-Value Cache) is a fundamental optimization technique for [[Transformer]] inference that stores previously computed key and value tensors from the attention mechanism, eliminating redundant computation during autoregressive text generation. Without KV caching, generating each new token would require recomputing attention over all previous tokens—a quadratic cost that makes long-sequence generation impractical.

The technique exploits a key property of causal attention: when generating token N+1, the key and value projections for tokens 1 through N are identical to what was computed when generating token N. By caching these intermediate results, inference shifts from O(n²) to O(n) complexity per token, enabling the long-context models that power modern [[Large Language Model]] applications.

## How It Works

In a standard Transformer decoder, the self-attention mechanism computes:

```
Attention(Q, K, V) = softmax(QK^T / √d_k) × V
```

Where Q (query), K (key), and V (value) are linear projections of the input embeddings. During autoregressive generation:

**Without KV Cache (Naive Approach)**:
1. For each new token, concatenate it with all previous tokens
2. Recompute K and V projections for the entire sequence
3. Compute attention and generate the next token
4. Cost: O(n) computation per token, O(n²) total for n tokens

**With KV Cache**:
1. **Prefill Phase**: Process the input prompt, computing and caching K and V for all prompt tokens in each attention layer
2. **Decode Phase**: For each new token:
   - Compute Q, K, V only for the new token
   - Append new K, V to the cache
   - Compute attention using cached K, V from all previous positions
3. Cost: O(1) new computation per token (plus O(n) for attending to cache)

**Memory Layout**: The KV cache stores tensors of shape `[batch_size, num_layers, num_heads, sequence_length, head_dim]`. For a typical 7B parameter model with 32 layers and 32 attention heads:
- Per-token cache: ~0.5 MB (fp16)
- 4K context: ~2 GB
- 128K context: ~64 GB

This memory footprint often exceeds the model weights themselves for long contexts, making KV cache management a critical optimization target.

## Applications

- **Production LLM Serving**: Every major inference framework (vLLM, TensorRT-LLM, llama.cpp) implements KV caching as foundational infrastructure
- **Continuous Batching**: Systems like vLLM use PagedAttention to efficiently manage KV cache memory across many concurrent requests
- **Long-Context Models**: 128K+ context windows are only practical because of KV caching; without it, each token would require processing the full history
- **Streaming Applications**: Chatbots maintain conversation history in the KV cache rather than re-encoding entire conversations

**Advanced Techniques**:
- **Multi-Query Attention (MQA)** and **Grouped-Query Attention (GQA)**: Reduce KV cache size by sharing keys/values across attention heads
- **KV Cache Compression**: Techniques like H2O (Heavy-Hitter Oracle) evict less important cached entries
- **Quantized KV Cache**: Store cached values in INT8 or INT4 to reduce memory footprint

## Limitations

- **Memory Consumption**: KV cache often becomes the primary memory bottleneck, especially with long contexts and large batch sizes. A 70B model with 8K context can require 40+ GB just for KV cache
- **Memory Bandwidth Bound**: During decode, loading the KV cache from GPU memory dominates latency—this is why Memory Bandwidth Utilization (MBU) is a key metric for inference performance
- **Scaling with Batch Size**: Cache size scales linearly with batch size, limiting concurrent request capacity
- **Variable Sequence Lengths**: Managing cache memory efficiently when requests have different lengths requires sophisticated memory management (PagedAttention, etc.)
- **Prefill-Decode Imbalance**: The prefill phase (prompt processing) is compute-bound, while decode is memory-bound, making hardware utilization challenging

## See Also

- [[Transformer]]
- [[Flash Attention]]
- [[Multi-Head Attention]]
- [[Grouped-Query Attention]]
- [[Inference Optimization]]
- [[PagedAttention]]

## References

1. Vaswani, A., et al. (2017). "Attention Is All You Need." NeurIPS 2017. arXiv:1706.03762
2. Kwon, W., et al. (2023). "Efficient Memory Management for Large Language Model Serving with PagedAttention." SOSP 2023
3. Pope, R., et al. (2022). "Efficiently Scaling Transformer Inference." MLSys 2023. arXiv:2211.05102
4. Databricks Engineering Blog (2023). "LLM Inference Performance Engineering: Best Practices." databricks.com/blog/llm-inference-performance-engineering-best-practices
5. Shazeer, N. (2019). "Fast Transformer Decoding: One Write-Head is All You Need." arXiv:1911.02150
