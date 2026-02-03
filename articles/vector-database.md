# Vector Database

A **vector database** is a specialized database designed to store, index, and query high-dimensional [[embeddings|vector embeddings]]. Unlike traditional databases that search by exact matches or text patterns, vector databases find items by **semantic similarity**—returning results that are conceptually close to a query, even if they share no common keywords.

## Overview

The rise of [[machine-learning]] and [[large-language-model|large language models]] has created massive demand for similarity search. When you convert text, images, or other data into embeddings, you need a way to efficiently ask: "What items in my database are most similar to this query vector?"

Vector databases solve this problem at scale, handling millions or billions of vectors while returning results in milliseconds. They form the backbone of semantic search, recommendation systems, and [[retrieval-augmented-generation|retrieval-augmented generation (RAG)]].

## How Vector Databases Work

### Storing Vectors

Each record in a vector database contains:
- A **vector**: A fixed-length array of floats (e.g., 1,536 dimensions from OpenAI embeddings)
- **Metadata**: Associated information like source text, timestamps, categories
- An **ID**: Unique identifier for the record

### Similarity Search

When you query with a vector, the database finds the **k-nearest neighbors (kNN)**—the k vectors most similar to your query. Similarity is typically measured by:

- **Cosine Similarity**: Angle between vectors (most common)
- **Euclidean Distance**: Straight-line distance
- **Dot Product**: Combines magnitude and direction

### The Challenge of Scale

Exact nearest-neighbor search requires comparing the query to every vector in the database—O(n) complexity. With millions of vectors at thousands of dimensions, this becomes prohibitively slow.

Vector databases use **Approximate Nearest Neighbor (ANN)** algorithms that trade perfect accuracy for massive speed improvements, typically finding 95-99% of the true nearest neighbors in a fraction of the time.

## Indexing Algorithms

### HNSW (Hierarchical Navigable Small World)

The most popular indexing algorithm. HNSW builds a multi-layer graph where:
- Upper layers contain sparse, long-range connections for fast navigation
- Lower layers add density for precise local search
- Search starts at the top and "zooms in" through layers

HNSW offers excellent query speed with high recall, making it the default choice for most vector databases.

### IVF (Inverted File Index)

Clusters vectors into groups (Voronoi cells). During search:
1. Find the clusters closest to the query
2. Search only within those clusters

IVF is memory-efficient but may miss neighbors in adjacent clusters. Often combined with product quantization (IVF-PQ) for compression.

### Annoy (Approximate Nearest Neighbors Oh Yeah)

Builds random projection trees that recursively split the vector space. Fast to build and query, with a small memory footprint. Popular for static datasets.

### ScaNN (Scalable Nearest Neighbors)

Google's algorithm uses learned quantization and asymmetric hashing. Excels at very high recall rates with large datasets.

## Major Vector Databases

### Pinecone

A fully managed cloud-native vector database. Key features:
- Serverless and pod-based deployment options
- Automatic scaling and replication
- Metadata filtering with vector search
- Sparse-dense hybrid search

Best for: Teams wanting a managed solution without infrastructure overhead.

### Weaviate

Open-source vector database with built-in ML model integration:
- Vectorizes data automatically using integrated models
- GraphQL API with semantic search
- Hybrid keyword + vector search
- Multi-modal support (text, images)

Best for: Applications needing built-in vectorization and flexibility.

### Chroma

Lightweight, developer-friendly open-source database:
- Embeds directly in Python applications
- Minimal setup—great for prototyping
- Persistent and in-memory modes
- Growing ecosystem of integrations

Best for: Local development, prototyping, and smaller-scale applications.

### Milvus

High-performance open-source database built for scale:
- Handles billions of vectors
- Supports multiple index types (HNSW, IVF, DiskANN)
- GPU acceleration available
- Distributed architecture with Kubernetes support

Best for: Large-scale production deployments requiring fine-grained control.

### Others

- **Qdrant**: Rust-based, emphasizes filtering and payloads
- **pgvector**: PostgreSQL extension—use vectors alongside relational data
- **Elasticsearch**: Added vector search to its existing capabilities
- **Redis**: Vector similarity via Redis Stack

## Use Cases

### Semantic Search

Traditional search fails when queries and documents use different vocabulary. Vector search finds conceptually similar content:

```
Query: "affordable places to stay in Paris"
Finds: "budget hotels near the Eiffel Tower" (no keyword overlap)
```

### Retrieval-Augmented Generation (RAG)

[[large-language-model|LLMs]] have knowledge cutoffs and can hallucinate. RAG systems:
1. Convert user queries to embeddings
2. Search vector database for relevant documents
3. Include retrieved context in the LLM prompt
4. Generate grounded, accurate responses

Vector databases make RAG possible at scale.

### Recommendation Systems

Embed users and items (products, movies, articles) in the same vector space. Recommend items whose vectors are close to user preferences.

### Duplicate Detection

Find near-duplicate images, documents, or records by identifying vectors that are suspiciously similar.

### Anomaly Detection

Normal data clusters together in embedding space. Outlier vectors may indicate fraud, errors, or novel events.

## Practical Considerations

### Choosing Dimensions

Higher dimensions capture more nuance but cost more storage and compute. Common ranges:
- 256-512: Lightweight, fast
- 1,024-1,536: Standard for most applications
- 3,072+: Maximum semantic precision

### Metadata Filtering

Most queries combine vector similarity with filters: "Find similar products, but only in category X, under $50." Efficient metadata filtering is crucial for real applications.

### Indexing Trade-offs

**Factor Comparison:**

- **HNSW M parameter**: More Accuracy: Higher, Faster Queries: Lower, Less Memory: Lower
- **IVF clusters**: More Accuracy: More, Faster Queries: Fewer, Less Memory: More
- **Quantization**: More Accuracy: None, Faster Queries: Yes, Less Memory: Yes

### Freshness vs. Performance

Indexes optimize for the data at build time. Frequent updates may require re-indexing or databases designed for streaming updates.

## See Also

- [[embeddings]]
- [[retrieval-augmented-generation]]
- [[large-language-model]]
- [[semantic-search]]
- [[machine-learning]]

## References

1. Malkov, Y. A., & Yashunin, D. A. (2018). Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs. *IEEE TPAMI*.
2. Johnson, J., Douze, M., & Jégou, H. (2019). Billion-scale similarity search with GPUs. *IEEE Transactions on Big Data*.
3. Pinecone Documentation. https://docs.pinecone.io/
4. Weaviate Documentation. https://weaviate.io/developers/weaviate
5. Milvus Documentation. https://milvus.io/docs
6. Lewis, P., et al. (2020). Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. *NeurIPS*.
