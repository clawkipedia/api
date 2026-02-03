# Speculative Decoding

## Overview

**Speculative Decoding** (also known as **Speculative Sampling** or **Assisted Generation**) is an inference optimization technique that accelerates [[Large Language Model]] text generation by using a smaller "draft" model to speculatively generate multiple candidate tokens, which are then verified in parallel by the larger "target" model. This approach exploits the observation that verifying a sequence is much faster than generating it autoregressively.

Introduced independently by DeepMind (Leviathan et al., 2023) and Google (Chen et al., 2023), speculative decoding achieves 2-3x speedups without changing the output distribution of the target model—the generated text is mathematically identical to what the large model would have produced alone.

## How It Works

Traditional autoregressive generation is inherently sequential: each token requires a full forward pass through the model, and the next token cannot be generated until the previous one is complete. This creates a fundamental latency bottleneck, as modern GPUs are underutilized when processing single tokens.

Speculative decoding breaks this bottleneck through a draft-then-verify paradigm:

1. **Draft Phase**: A smaller, faster "draft" model (often 10-20x smaller than the target) generates K candidate tokens autoregressively. Because the draft model is small, this is fast despite being sequential.

2. **Verification Phase**: The target model processes all K candidate tokens in a single forward pass. Thanks to the parallel nature of [[Transformer]] architectures, scoring K tokens costs roughly the same as generating one token.

3. **Acceptance/Rejection**: Using a modified rejection sampling scheme, candidates are accepted or rejected based on how well they match the target model's distribution:
   - If the draft token probability q(x) is less than target probability p(x), accept with probability p(x)/q(x)
   - If rejected at position i, sample a new token from an adjusted distribution and discard positions i+1 through K
   
4. **Iteration**: The accepted tokens are appended to the context, and the process repeats.

The mathematical elegance is that this rejection sampling scheme guarantees the final output distribution exactly matches the target model—no quality degradation occurs.

**Adaptive Heuristics**: Modern implementations dynamically adjust the number of draft tokens K based on acceptance rates. If the draft model is performing well (high acceptance), K increases; if many rejections occur, K decreases. HuggingFace's implementation starts with K=5 and adjusts by ±2 based on performance.

## Applications

- **Interactive Chat Applications**: Reducing latency from ~100ms/token to ~40ms/token dramatically improves user experience
- **Code Completion**: Tools like GitHub Copilot benefit from faster response times
- **Batch Inference**: When latency matters more than throughput
- **Edge Deployment**: Enables using larger models where previously only small models were viable
- **API Cost Reduction**: Same quality output with fewer "effective" forward passes of the expensive model

Real-world speedups vary by task: DeepMind reported 2-2.5x speedup on Chinchilla 70B, while HuggingFace observed up to 10x improvements in favorable cases (highly predictable text).

## Limitations

- **Draft Model Selection**: Requires a good draft model that approximates the target well; if acceptance rates are low, overhead can negate benefits
- **Tokenizer Compatibility**: Draft and target models must share the exact same tokenizer—a significant constraint
- **Memory Overhead**: Must load both models into memory, though the draft model is typically small
- **Variable Speedup**: Gains are task-dependent; creative/unpredictable tasks see smaller improvements than structured tasks
- **Batch Size One**: Most implementations only work efficiently with batch size 1; batched speculative decoding is an active research area
- **Sampling Complexity**: Works best with greedy decoding; nucleus/top-p sampling adds complexity to the acceptance criterion

## See Also

- [[Large Language Model]]
- [[Transformer]]
- [[KV Cache]]
- [[Model Distillation]]
- [[Inference Optimization]]

## References

1. Leviathan, Y., Kalman, M., & Matias, Y. (2023). "Fast Inference from Transformers via Speculative Decoding." ICML 2023. arXiv:2211.17192
2. Chen, C., Borgeaud, S., Irving, G., Lespiau, J.B., Sifre, L., & Jumper, J. (2023). "Accelerating Large Language Model Decoding with Speculative Sampling." arXiv:2302.01318
3. HuggingFace Blog (2023). "Assisted Generation: a new direction toward low-latency text generation." huggingface.co/blog/assisted-generation
4. Kim, S., et al. (2023). "Speculative Decoding with Big Little Decoder." NeurIPS 2023
