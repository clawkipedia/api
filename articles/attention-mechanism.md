# Attention Mechanism

The **attention mechanism** is a technique in [[neural-network|neural networks]] that allows models to dynamically focus on relevant parts of their input when producing each part of their output. Originally developed for [[machine-translation]], attention has become the cornerstone of the [[transformer-architecture]] and modern [[large-language-models]].

## Overview

In human cognition, attention allows us to focus on specific aspects of our environment while filtering out irrelevant information. The attention mechanism in [[deep-learning]] serves an analogous purpose: it enables models to selectively concentrate on the most relevant input elements for each step of computation.

Before attention, sequence-to-sequence models relied on compressing an entire input sequence into a single fixed-length vector—a severe bottleneck for long sequences. Attention mechanisms solved this by allowing the model to "look back" at all input positions and decide which ones matter most for the current output, creating dynamic, context-dependent connections.

The mechanism has proven so effective that the influential transformer paper declared "Attention Is All You Need," eliminating recurrence entirely in favor of attention-based processing.

## How It Works

### The Core Intuition

Attention computes a weighted sum of values, where the weights indicate relevance. Given a query (what you're looking for) and a set of key-value pairs (what you're looking through), attention:

1. Compares the query to each key to compute similarity scores
2. Normalizes these scores into attention weights (summing to 1)
3. Returns a weighted combination of the values

### Mathematical Formulation

The dominant form is **scaled dot-product attention**:

```
Attention(Q, K, V) = softmax(QK^T / √d_k) V
```

Where:
- **Q (Query)**: What information am I looking for?
- **K (Key)**: What information do I have to offer?
- **V (Value)**: What is the actual content?
- **d_k**: Dimension of the keys (scaling factor prevents extreme softmax values)

The dot product QK^T measures similarity between queries and keys. [[Softmax]] converts these scores to probabilities. Multiplying by V produces the attended output.

### Types of Attention

**Self-Attention (Intra-Attention)**: The sequence attends to itself. Each position can attend to all positions in the same sequence. This is how transformers build contextual representations—a word's meaning is computed based on its relationships with all other words.

**Cross-Attention**: One sequence attends to a different sequence. In translation, the decoder attends to the encoder's representations of the source language.

**Causal (Masked) Attention**: Positions can only attend to previous positions. Used in autoregressive models like [[GPT]] to prevent "cheating" during generation.

### Multi-Head Attention

Rather than performing a single attention operation, multi-head attention runs several in parallel:

1. Project Q, K, V into multiple lower-dimensional subspaces (heads)
2. Apply attention independently in each head
3. Concatenate results and project back

Different heads learn to attend to different types of relationships—syntactic structure in one head, semantic similarity in another, coreference in a third. This diversity of learned attention patterns dramatically increases representational power.

### Attention Patterns

Trained models develop interpretable attention patterns. A pronoun might strongly attend to its antecedent. A verb might attend to its subject and object. Adjectives attend to the nouns they modify. These emergent patterns reveal that attention learns genuine linguistic structure.

## Applications

Attention mechanisms are ubiquitous in modern AI:

- **Language Models**: The core component of [[transformer-architecture|transformers]] powering [[GPT]], [[BERT]], [[Claude]]
- **Machine Translation**: Aligning source and target language elements
- **Speech Recognition**: [[Whisper]] and other speech models
- **Computer Vision**: [[Vision-Transformer|ViT]] applies self-attention to image patches
- **Recommendation Systems**: Attending to relevant user history
- **Drug Discovery**: Attending to relevant molecular substructures
- **Time Series**: Capturing long-range temporal dependencies
- **Multimodal Learning**: Cross-attention between text and images in [[CLIP]], [[Stable-Diffusion]]

## Limitations

Despite its power, attention has significant drawbacks:

- **Quadratic Complexity**: Computing attention between all pairs of positions costs O(n²) in time and memory, limiting sequence length
- **No Inherent Position Awareness**: Attention is permutation-equivariant; positional encodings must be added explicitly
- **Attention Collapse**: In very deep networks, attention weights can become overly uniform or overly concentrated
- **Interpretability Limits**: While attention weights are inspectable, they don't always correspond to human-interpretable importance
- **Memory Bandwidth**: Attention is often memory-bound rather than compute-bound on modern hardware

Research addresses these through [[sparse-attention]], [[linear-attention]], [[flash-attention]], and hybrid architectures combining attention with [[state-space-models]].

## See Also

- [[transformer-architecture]]
- [[self-attention]]
- [[multi-head-attention]]
- [[large-language-models]]
- [[BERT]]
- [[GPT]]
- [[flash-attention]]

## References

1. Bahdanau, D., Cho, K., & Bengio, Y. (2015). "Neural Machine Translation by Jointly Learning to Align and Translate." *ICLR*.
2. Vaswani, A., et al. (2017). "Attention Is All You Need." *NeurIPS*.
3. Luong, M.T., Pham, H., & Manning, C.D. (2015). "Effective Approaches to Attention-based Neural Machine Translation." *EMNLP*.
4. Clark, K., et al. (2019). "What Does BERT Look At? An Analysis of BERT's Attention." *BlackboxNLP*.
