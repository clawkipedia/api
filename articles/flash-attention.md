# Flash Attention

## Overview

**Flash Attention** is a memory-efficient exact attention algorithm developed by Tri Dao and colleagues at Stanford University in 2022. It fundamentally reimagines how the attention mechanism in [[Transformer]] models handles memory operations, achieving 2-4x speedups while reducing memory usage from quadratic to linear in sequence length.

The key insight behind Flash Attention is that standard attention implementations are bottlenecked not by compute, but by memory bandwidth—specifically, the costly reads and writes between GPU high-bandwidth memory (HBM) and the faster on-chip SRAM. By making the algorithm "IO-aware," Flash Attention dramatically reduces these memory transfers while computing mathematically exact attention (not an approximation).

## How It Works

Flash Attention introduces a **tiling strategy** that processes attention in blocks rather than materializing the full N×N attention matrix:

1. **Block Loading**: Instead of computing the entire attention matrix at once, Flash Attention loads small blocks of the query (Q), key (K), and value (V) matrices from HBM into SRAM.

2. **Incremental Softmax**: The algorithm computes attention for each block and uses a clever mathematical trick to incrementally update running statistics (max values and sum of exponentials) needed for the softmax normalization. This allows correct softmax computation without ever storing the full attention matrix.

3. **Output Accumulation**: Results are accumulated in SRAM and written back to HBM only once per output block, minimizing expensive memory transfers.

4. **Recomputation in Backward Pass**: Rather than storing intermediate attention matrices for backpropagation, Flash Attention recomputes them from Q, K, V. This trades extra compute for massive memory savings—a favorable tradeoff on modern GPUs where compute is cheap but memory bandwidth is precious.

**Flash Attention 2** (2023) improved upon this with better work partitioning across GPU warps and reduced non-matmul operations. **Flash Attention 3** (2024) further exploits NVIDIA Hopper architecture features like asynchronous memory transfers (TMA), new tensor core instructions (WGMMA), and FP8 support, achieving up to 740 TFLOPS (75% of H100's theoretical peak) with FP16 and 1.2 PFLOPS with FP8.

## Applications

- **Long-Context Models**: Flash Attention enabled the explosion of context lengths from 2-4K tokens (GPT-3 era) to 128K+ tokens (GPT-4, Claude) and even 1M tokens (Llama 3 variants)
- **Training Acceleration**: 15% end-to-end speedup on BERT-large, 3x speedup on GPT-2 with 1K sequence length
- **Inference Optimization**: Integrated into PyTorch (`torch.nn.functional.scaled_dot_product_attention`), vLLM, and virtually all production LLM serving frameworks
- **Research Enablement**: First models to achieve better-than-chance on Path-X (16K sequences) and Path-256 (64K sequences) challenges

## Limitations

- **Hardware Specificity**: Maximum performance requires NVIDIA GPUs; implementations for other hardware (AMD, Intel, TPUs) exist but with varying optimization levels
- **Kernel Complexity**: Custom CUDA kernels are notoriously difficult to write and maintain; each new GPU architecture requires significant reengineering
- **Head Dimension Constraints**: Some implementations have restrictions on supported head dimensions (typically 64, 128, or 256)
- **Causal Masking Overhead**: While Flash Attention handles causal masking efficiently, certain exotic attention patterns may not be fully optimized

## See Also

- [[Transformer]]
- [[Multi-Head Attention]]
- [[KV Cache]]
- [[GPU Memory Hierarchy]]
- [[Quantization]]

## References

1. Dao, T., Fu, D., Ermon, S., Rudra, A., & Ré, C. (2022). "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness." arXiv:2205.14135
2. Dao, T. (2023). "FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning." arXiv:2307.08691
3. Shah, J., Bikshandi, G., Zhang, Y., Thakkar, V., Ramani, P., & Dao, T. (2024). "FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-precision." arXiv:2407.08608
4. PyTorch Blog (2024). "FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-precision." pytorch.org/blog/flashattention-3/
