# Embeddings

**Embeddings** are dense vector representations that encode semantic meaning in a continuous mathematical space. They transform discrete objects—words, sentences, images, or any entity—into fixed-length arrays of numbers where similar items cluster together. Embeddings are fundamental to modern [[machine-learning]] and power applications from search to [[large-language-model|large language models]].

## Overview

Traditional computing represents words or objects as arbitrary identifiers with no inherent meaning. The word "cat" might be ID 4,521 while "kitten" is ID 8,902—the numbers reveal nothing about their relationship.

Embeddings solve this by learning **distributed representations** where meaning is encoded in patterns across many dimensions. In embedding space:
- Similar concepts have similar vectors
- Relationships are captured as directions
- Arithmetic operations produce meaningful results

The famous example: `vector("king") - vector("man") + vector("woman") ≈ vector("queen")`

## How Embeddings Work

### The Basic Idea

An embedding maps discrete items to points in a continuous vector space, typically with 100 to 4,096 dimensions. Each dimension captures some latent feature learned during training.

For a vocabulary of 50,000 words, instead of a sparse 50,000-dimensional one-hot vector, each word becomes a dense 300-dimensional vector. This **dimensionality reduction** captures semantic relationships while being computationally efficient.

### Learning Embeddings

Embeddings are learned through training on large datasets. The network adjusts vector values so that the embedding space reflects meaningful relationships in the training data.

Key insight: embeddings are often a **byproduct** of training on another task. A model learning to predict the next word inadvertently learns word representations that capture meaning.

## Word Embeddings

### Word2Vec

**Word2Vec** (2013, Google) pioneered modern word embeddings using two architectures:

- **Skip-gram**: Predicts surrounding words given a target word
- **CBOW (Continuous Bag of Words)**: Predicts target word from surrounding context

Both approaches learn embeddings where words appearing in similar contexts have similar vectors. Training on billions of words produces embeddings that capture:
- Synonymy: "happy" near "joyful"
- Analogy: king→queen parallels man→woman
- Association: "Paris" near "France"

### GloVe

**GloVe** (Global Vectors, Stanford) combines global co-occurrence statistics with local context windows. It factorizes a word-word co-occurrence matrix, often producing embeddings that better capture rare word relationships.

### FastText

**FastText** (Facebook) extends Word2Vec by representing words as bags of character n-grams. This allows it to:
- Generate embeddings for unseen words
- Better handle morphologically rich languages
- Capture subword information ("unhappiness" shares features with "happy")

## Sentence and Document Embeddings

Moving beyond words, we can embed entire sentences or documents:

### Sentence-BERT

**Sentence-BERT** fine-tunes [[transformer]] models to produce semantically meaningful sentence embeddings. Two sentences with similar meaning will have high cosine similarity between their vectors.

### Universal Sentence Encoder

Google's **Universal Sentence Encoder** produces 512-dimensional sentence embeddings optimized for transfer learning across NLP tasks.

### Paragraph Vectors (Doc2Vec)

Extends Word2Vec to variable-length documents by learning a document-level vector alongside word vectors.

## Modern Embedding Models

State-of-the-art embeddings come from [[transformer]]-based models:

- **OpenAI Embeddings**: `text-embedding-3-large` produces 3,072-dimensional vectors optimized for semantic search
- **Cohere Embed**: Multilingual embeddings for search and classification
- **BGE (BAAI)**: Open-source embeddings competitive with proprietary models
- **E5**: Microsoft's embeddings trained with contrastive learning

These models understand context—"bank" near "river" vs. "bank" near "money" produces different vectors.

## Applications

### Semantic Search

Traditional keyword search fails when queries use different words than documents. Embedding-based search finds semantically similar content:

```
Query: "how to fix a flat tire"
Matches: "changing a punctured wheel" (high cosine similarity)
```

This powers modern search engines and [[retrieval-augmented-generation|RAG]] systems.

### Recommendation Systems

Embed users and items in the same space. Recommend items whose vectors are close to the user's embedding.

### Clustering and Classification

Embeddings enable unsupervised clustering of similar documents and provide features for downstream classifiers.

### [[vector-database|Vector Databases]]

Specialized databases like [[pinecone|Pinecone]], [[weaviate|Weaviate]], and [[chroma|Chroma]] store embeddings and enable fast similarity search across millions of vectors.

### Retrieval-Augmented Generation (RAG)

[[large-language-model|LLMs]] use embeddings to retrieve relevant context before generating responses, grounding outputs in specific knowledge.

## Measuring Similarity

Common similarity metrics for embeddings:

- **Cosine Similarity**: Measures angle between vectors (most common)
- **Euclidean Distance**: Straight-line distance between points
- **Dot Product**: Combines magnitude and direction

Cosine similarity is preferred because it's normalized—vector length doesn't affect similarity.

## Limitations

- **Static vs. Contextual**: Word2Vec gives one vector per word; contextual models give different vectors based on usage
- **Bias**: Embeddings inherit biases from training data
- **Dimensionality**: Higher dimensions capture more nuance but require more storage and computation
- **Domain Specificity**: General embeddings may underperform on specialized domains

## See Also

- [[neural-network]]
- [[transformer]]
- [[vector-database]]
- [[retrieval-augmented-generation]]
- [[large-language-model]]

## References

1. Mikolov, T., et al. (2013). Efficient Estimation of Word Representations in Vector Space. *arXiv:1301.3781*.
2. Pennington, J., Socher, R., & Manning, C. (2014). GloVe: Global Vectors for Word Representation. *EMNLP*.
3. Reimers, N., & Gurevych, I. (2019). Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks. *EMNLP*.
4. Bojanowski, P., et al. (2017). Enriching Word Vectors with Subword Information. *TACL*.
5. Neelakantan, A., et al. (2022). Text and Code Embeddings by Contrastive Pre-Training. *arXiv:2201.10005*.
