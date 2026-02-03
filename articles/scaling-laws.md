# Scaling Laws

## Overview

**Scaling Laws** are empirical relationships that describe how [[Large Language Model]] performance improves as a function of model size, dataset size, and compute budget. These power-law relationships, discovered through systematic experiments across orders of magnitude, provide a scientific foundation for predicting model capabilities and optimally allocating training resources.

The field was transformed by two landmark studies: OpenAI's "Scaling Laws for Neural Language Models" (Kaplan et al., 2020) and DeepMind's "Chinchilla" paper (Hoffmann et al., 2022). While both confirmed that loss decreases predictably with scale, they reached different conclusions about optimal resource allocation—a debate that continues to shape how frontier models are trained.

## How It Works

### The Basic Scaling Law

Cross-entropy loss L scales as a power law with three factors:

```
L(N, D, C) = A/N^α + B/D^β + L_∞
```

Where:
- **N** = number of model parameters
- **D** = dataset size (tokens)
- **C** = compute budget (FLOPs, approximately 6ND for transformers)
- **L_∞** = irreducible loss (entropy of natural language)

The exponents α and β are remarkably consistent across architectures. Other hyperparameters (depth vs. width, learning rate, batch size) have minimal effect within reasonable ranges—scale dominates.

### OpenAI Scaling Laws (2020)

Kaplan et al. trained over 1000 models ranging from 768 to 1.5 billion parameters and found:
- Loss scales as ~N^(-0.076) with model size
- Larger models are dramatically more **sample-efficient**: they extract more learning from each training example
- Optimal training involves using very large models and stopping well before convergence
- Recommendation: Scale model size faster than data size (~N^0.74)

This led to GPT-3's design: 175B parameters trained on ~300B tokens.

### Chinchilla Scaling Laws (2022)

Hoffmann et al. at DeepMind challenged the OpenAI prescription by training 400+ models from 70M to 16B parameters on 5B to 500B tokens:
- Found that compute-optimal training scales **N and D equally**: for every doubling of model size, double the training data
- Demonstrated that most LLMs were severely **undertrained**
- The 70B parameter **Chinchilla** model, trained on 1.4T tokens (4x more than Gopher's 300B), outperformed the 280B parameter Gopher on virtually every benchmark

The Chinchilla-optimal ratio: ~20 tokens per parameter. This implies:
- GPT-3 (175B params, 300B tokens) should have been trained on ~3.5T tokens
- Or equivalently, a 15B model trained on 300B tokens would match GPT-3's performance at 10x lower inference cost

### Beyond Chinchilla

Recent research suggests the optimal ratio depends on deployment constraints:
- **Inference-Heavy Workloads**: Train smaller models on more data (Llama approach)—the 7B Llama trained on 2T tokens outperforms many larger models
- **Data-Constrained Settings**: When high-quality data is limited, the equation shifts
- **Emergent Capabilities**: Some abilities appear discontinuously at specific scales, not captured by smooth scaling curves

## Applications

- **Compute Budgeting**: Given a fixed training budget, scaling laws predict the optimal model size and data quantity
- **Capability Forecasting**: Extrapolating curves to estimate performance of future models
- **Architecture Search**: Confirming that scale matters more than most architectural innovations
- **Training Efficiency**: Identifying when models are under/over-trained relative to their size
- **Investment Decisions**: Frontier labs use scaling laws to justify billion-dollar compute investments

**Practical Impact**:
- Llama 1/2/3: Deliberately trained "beyond Chinchilla optimal" for better inference economics
- Modern practice: 7B models trained on 2-15T tokens are common
- GPT-4/Claude: Rumored to use extensive scaling law experiments to optimize architecture-compute tradeoffs

## Limitations

- **Emergent Abilities**: Some capabilities (chain-of-thought, in-context learning) emerge unpredictably and aren't captured by loss-based scaling laws
- **Downstream vs. Loss**: Scaling laws predict cross-entropy loss, but downstream task performance doesn't always correlate
- **Data Quality**: Laws assume IID data; real data quality variations aren't captured
- **Compute Definition**: FLOPs accounting varies; actual hardware efficiency differs from theoretical
- **Saturation**: Eventually, returns diminish—the laws may not hold at extreme scales
- **Non-Transformer Architectures**: Laws may differ for state-space models, mixture-of-experts, etc.
- **Post-Training**: Scaling laws for RLHF, instruction tuning, and other post-training are less understood

## See Also

- [[Large Language Model]]
- [[Transformer]]
- [[Chinchilla]]
- [[Emergent Abilities]]
- [[Training Compute]]

## References

1. Kaplan, J., et al. (2020). "Scaling Laws for Neural Language Models." OpenAI. arXiv:2001.08361
2. Hoffmann, J., et al. (2022). "Training Compute-Optimal Large Language Models." DeepMind. arXiv:2203.15556
3. Touvron, H., et al. (2023). "LLaMA: Open and Efficient Foundation Language Models." Meta AI. arXiv:2302.13971
4. Wei, J., et al. (2022). "Emergent Abilities of Large Language Models." arXiv:2206.07682
5. Henighan, T., et al. (2020). "Scaling Laws for Autoregressive Generative Modeling." arXiv:2010.14701
