# Retrieval-Augmented Generation (RAG)

**Retrieval-Augmented Generation (RAG)** is a technique that enhances [[large language model|large language models]] by grounding their responses in external knowledge retrieved at query time. Rather than relying solely on information encoded during pretraining, RAG systems retrieve relevant documents and provide them as context, enabling accurate responses about private data, recent events, and specialized domains.

## Overview

LLMs have inherent limitations: their knowledge is frozen at training time, they cannot access private or proprietary data, and they may hallucinate plausible-sounding but incorrect information. RAG addresses these challenges by combining the generative capabilities of LLMs with the precision of information retrieval systems.

The core RAG workflow:
1. **User submits a query**
2. **Retrieval system finds relevant documents** from an external knowledge base
3. **Retrieved documents are added to the LLM prompt** as context
4. **LLM generates a response** grounded in the retrieved information

This approach provides several benefits: reduced hallucinations, access to current information, ability to cite sources, and adaptation to domain-specific knowledge without [[fine-tuning]].

## RAG Architecture

### Data Ingestion

External data must be processed and indexed before retrieval:

1. **Document loading**: Ingest data from various sources (PDFs, databases, APIs, websites)
2. **Chunking**: Split documents into smaller segments that fit within context windows
3. **Embedding**: Convert text chunks into dense vector representations using embedding models
4. **Indexing**: Store vectors in a database optimized for similarity search

### Retrieval

When a query arrives:

1. **Query embedding**: Convert the user's question to a vector using the same embedding model
2. **Similarity search**: Find the k most similar document chunks via vector database queries
3. **Optional reranking**: Use a cross-encoder or reranker model to refine results
4. **Context construction**: Format retrieved chunks for inclusion in the LLM prompt

### Generation

The augmented prompt combines the user query with retrieved context:

```
Context: [Retrieved documents]
Question: [User query]
Answer based on the provided context.
```

The LLM generates a response grounded in this context, ideally citing relevant sources.

## Key Components

### Embedding Models

Popular choices include:
- **OpenAI text-embedding-3**: Strong general-purpose embeddings
- **Cohere Embed v3**: Multilingual with compression options
- **BGE/E5**: Open-source alternatives with competitive performance
- **Domain-specific models**: For legal, medical, or scientific content

### Vector Databases

Systems optimized for storing and querying high-dimensional vectors:
- **Pinecone**: Managed service with hybrid search
- **Weaviate**: Open-source with built-in vectorization
- **Qdrant**: High-performance with filtering capabilities
- **Chroma**: Lightweight, embedded option
- **pgvector**: PostgreSQL extension for existing databases

### Chunking Strategies

How documents are split significantly impacts retrieval quality:
- **Fixed-size chunks**: Simple but may break context
- **Semantic chunking**: Split on meaningful boundaries
- **Recursive chunking**: Hierarchical approach for long documents
- **Sliding window**: Overlapping chunks to preserve context

## Advanced RAG Techniques

### Query Enhancement
- **Query rewriting**: Use LLM to reformulate queries for better retrieval
- **HyDE**: Generate hypothetical documents to improve similarity matching
- **Multi-query**: Generate multiple query variations and aggregate results

### Retrieval Improvements
- **Hybrid search**: Combine vector similarity with keyword (BM25) search
- **Multi-vector retrieval**: Index documents with multiple embeddings (summaries, questions)
- **Parent-child indexing**: Retrieve small chunks but include surrounding context
- **Reranking**: Use cross-encoders to reorder candidates by relevance

### Generation Optimization
- **Self-RAG**: Model decides when retrieval is needed and critiques its own responses
- **CRAG (Corrective RAG)**: Evaluates retrieval quality and triggers web search for poor results
- **Citation generation**: Train models to explicitly cite sources
- **Compression**: Summarize retrieved context to fit within token limits

## RAG Frameworks

Major frameworks for building RAG applications:

- **LlamaIndex**: Comprehensive data framework with extensive indexing options
- **LangChain**: Modular framework for LLM applications
- **Haystack**: Production-ready pipelines with strong search integration
- **Semantic Kernel**: Microsoft's SDK for enterprise RAG

## Evaluation

RAG systems require evaluation of both retrieval and generation:

- **Retrieval metrics**: Precision@k, Recall@k, MRR, NDCG
- **Generation metrics**: Faithfulness, relevance, answer correctness
- **End-to-end**: RAGAS, TruLens for holistic evaluation

## Current Best Practices (Early 2026)

1. **Start simple**: Basic RAG with good chunking often outperforms complex architectures
2. **Iterate on data quality**: Clean, well-structured documents matter more than retrieval tricks
3. **Use hybrid search**: Combine semantic and keyword retrieval
4. **Implement reranking**: Cross-encoders significantly improve precision
5. **Monitor and evaluate**: Track retrieval and generation quality in production
6. **Consider agentic RAG**: Let the LLM decide when and what to retrieve

## Use Cases

- **Enterprise knowledge management**: Query internal documents, wikis, policies
- **Customer support**: Ground responses in product documentation
- **Research assistants**: Navigate scientific literature
- **Code assistants**: Context from codebases and documentation
- **Legal/compliance**: Search contracts, regulations, precedents

## See Also

- [[prompt-engineering]] - Crafting effective prompts for RAG
- [[fine-tuning]] - Alternative approach for domain adaptation
- [[chain-of-thought]] - Reasoning techniques for complex queries

## References

1. AWS. "What is RAG (Retrieval-Augmented Generation)?" https://aws.amazon.com/what-is/retrieval-augmented-generation/
2. LlamaIndex. "High-Level Concepts." https://docs.llamaindex.ai/en/stable/getting_started/concepts/
3. Lewis, Patrick, et al. "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks." NeurIPS 2020.
4. Gao, Yunfan, et al. "Retrieval-Augmented Generation for Large Language Models: A Survey." arXiv:2312.10997, 2023.
