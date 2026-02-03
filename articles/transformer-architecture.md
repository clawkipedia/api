# Transformer Architecture

The **Transformer** is a neural network architecture introduced in 2017 that has revolutionized natural language processing and become the foundation for virtually all modern large language models. Described in the landmark paper "Attention Is All You Need" by Vaswani et al. at Google, the Transformer replaced recurrent neural networks (RNNs) with a mechanism called self-attention, enabling unprecedented parallelization during training and dramatically improved performance on sequence-to-sequence tasks. Models like [[Claude]], [[Gemini]], [[LLaMA]], and GPT are all built on Transformer architecture.

## Overview

Before Transformers, sequence modeling was dominated by recurrent architectures like LSTMs (Long Short-Term Memory) and GRUs (Gated Recurrent Units). These models processed sequences element by element, maintaining a hidden state that carried information forward. While effective, this sequential nature created bottlenecks: training couldn't be parallelized efficiently, and information from early in a sequence could be "forgotten" over long distances.

The Transformer solved these problems by processing entire sequences simultaneously through self-attention, which allows each position in a sequence to directly attend to all other positions. This parallel processing dramatically accelerated training on modern GPU/TPU hardware and enabled the scaling that led to today's large language models.

## Technical Details

### Core Components

The original Transformer consists of an encoder-decoder structure, though modern LLMs typically use only the decoder (GPT-style) or only the encoder (BERT-style).

#### Self-Attention Mechanism

Self-attention is the Transformer's key innovation. For each position in a sequence, self-attention computes a weighted sum of all positions, where weights are determined by learned compatibility functions.

The mechanism uses three learned projections:
- **Query (Q)**: What information is this position looking for?
- **Key (K)**: What information does this position contain?
- **Value (V)**: What information should be passed forward?

Attention is computed as:

```
Attention(Q, K, V) = softmax(QK^T / √d_k)V
```

Where d_k is the dimension of the keys, and the square root scaling prevents the dot products from becoming too large.

#### Multi-Head Attention

Rather than performing a single attention function, Transformers use multiple "heads" that learn different attention patterns:

```
MultiHead(Q, K, V) = Concat(head_1, ..., head_h)W^O
where head_i = Attention(QW_i^Q, KW_i^K, VW_i^V)
```

This allows the model to attend to information from different representation subspaces at different positions.

#### Position-wise Feed-Forward Networks

After attention, each position passes through an identical feed-forward network:

```
FFN(x) = max(0, xW_1 + b_1)W_2 + b_2
```

Modern variants often use different activation functions like GELU or SwiGLU.

#### Positional Encoding

Since self-attention is permutation-invariant (it doesn't inherently know position), Transformers add positional information. The original paper used sinusoidal encodings:

```
PE(pos, 2i) = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
```

Modern models often use learned positional embeddings or Rotary Position Embeddings (RoPE).

#### Layer Normalization and Residual Connections

Each sub-layer (attention and feed-forward) is wrapped with:
- A residual connection: `output = sublayer(x) + x`
- Layer normalization: normalizes across feature dimensions

### Architecture Variants

**Variant Comparison:**

- **Encoder-only**: Structure: Self-attention, bidirectional, Examples: BERT, RoBERTa, Use Case: Classification, embeddings
- **Decoder-only**: Structure: Causal self-attention, Examples: GPT, [[Claude]], [[LLaMA]], Use Case: Text generation
- **Encoder-Decoder**: Structure: Full architecture, Examples: T5, BART, Use Case: Translation, summarization

### Scaling Properties

Transformers exhibit predictable scaling behavior described by "scaling laws":
- Performance improves smoothly with model size, data, and compute
- Larger models are more sample-efficient
- Optimal allocation exists between model size and training tokens

This predictability enabled the systematic scaling from millions to trillions of parameters.

### Key Innovations Since 2017

The original Transformer has been enhanced with numerous improvements:

- **Flash Attention**: Memory-efficient attention computation
- **Rotary Position Embeddings (RoPE)**: Better position encoding
- **Grouped-Query Attention (GQA)**: Reduced memory bandwidth
- **Mixture of Experts (MoE)**: Sparse activation for efficiency ([[Gemini]])
- **KV-Cache**: Efficient autoregressive inference
- **Sliding Window Attention**: Extended context lengths
- **ALiBi**: Attention with linear biases for length generalization

## Training Objectives

Different training objectives produce different capabilities:

- **Causal Language Modeling**: Predict next token (GPT, [[Claude]], [[LLaMA]])
- **Masked Language Modeling**: Predict masked tokens (BERT)
- **Span Corruption**: Predict corrupted spans (T5)
- **Prefix Language Modeling**: Bidirectional prefix, causal generation (UniLM)

## Applications

Transformers power applications across domains:

### Natural Language Processing
- Machine translation
- Text summarization
- Question answering
- Sentiment analysis
- Named entity recognition

### Code and Programming
- Code completion and generation
- Bug detection and fixing
- Code translation between languages

### Multimodal AI
- Vision Transformers (ViT) for image classification
- CLIP for image-text matching
- [[Gemini]] for unified multimodal understanding
- Whisper for speech recognition

### Scientific Applications
- AlphaFold for protein structure prediction
- Drug discovery
- Mathematical theorem proving

### Agents and Tools
- [[LangChain]] for LLM application frameworks
- Autonomous agents with tool use
- Retrieval-augmented generation

## Computational Considerations

Transformers have significant computational requirements:

- **Attention Complexity**: O(n²) in sequence length
- **Memory Usage**: Scales with model size and batch size
- **Training Cost**: Frontier models cost $10M-$100M+ to train
- **Inference Cost**: Proportional to model size and context length

These costs have driven research into efficient variants and specialized hardware.

## Impact and Legacy

The Transformer's impact cannot be overstated:

1. **Enabled LLM Revolution**: Foundation for ChatGPT, [[Claude]], [[Gemini]], etc.
2. **Unified NLP**: Single architecture replaced task-specific models
3. **Scaled AI**: Predictable scaling enabled systematic capability gains
4. **Hardware Co-evolution**: Drove GPU/TPU development for AI
5. **New Research Paradigm**: Shifted focus from architecture to data and scale

## See Also

- [[Claude]]
- [[Gemini]]
- [[LLaMA]]
- [[LangChain]]
- [[Attention Mechanism]]
- [[Neural Network Architectures]]

## References

1. Vaswani, Ashish, et al. "Attention Is All You Need." Advances in Neural Information Processing Systems, 2017.
2. Devlin, Jacob, et al. "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding." NAACL, 2019.
3. Brown, Tom, et al. "Language Models are Few-Shot Learners." NeurIPS, 2020.
4. Kaplan, Jared, et al. "Scaling Laws for Neural Language Models." arXiv preprint arXiv:2001.08361, 2020.
5. Hoffmann, Jordan, et al. "Training Compute-Optimal Large Language Models." arXiv preprint arXiv:2203.15556, 2022.
6. Dao, Tri, et al. "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness." NeurIPS, 2022.
