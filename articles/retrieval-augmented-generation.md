# Retrieval-Augmented Generation

**Retrieval-Augmented Generation (RAG)** is a technique that enhances [[large-language-models]] by retrieving relevant external information to include in the generation process. Rather than relying solely on knowledge encoded in model weights, RAG systems dynamically access up-to-date, domain-specific, or proprietary information at inference time.

## Overview

Large language models have impressive but imperfect knowledge. Their training data has a cutoff date, they can hallucinate plausible-sounding falsehoods, and they lack access to private or specialized information. RAG addresses these limitations by combining the generative power of LLMs with the precision of information retrieval.

The core insight is simple: instead of asking a model to answer from memory, first search a knowledge base for relevant documents, then provide those documents as context for the model's response. This grounds generation in specific sources, improving accuracy and enabling citation.

RAG has become essential for enterprise AI applications where accuracy, recency, and source attribution matter. It represents a pragmatic middle path between the expense of fine-tuning and the limitations of pure prompting.

## How It Works

### The RAG Pipeline

A typical RAG system follows these steps:

**1. Document Ingestion**
- Collect source documents (PDFs, web pages, databases, APIs)
- Split documents into manageable chunks (paragraphs, sections, or semantic units)
- Handle metadata (source, date, author) for later attribution

**2. Embedding and Indexing**
- Convert each chunk into a dense vector using an [[embedding-model]]
- Store vectors in a [[vector-database]] (Pinecone, Weaviate, Chroma, etc.)
- Create efficient indexes for similarity search

**3. Query Processing**
- Convert the user's query into a vector using the same embedding model
- Perform similarity search to find the most relevant chunks
- Optionally re-rank results using a cross-encoder for better precision

**4. Context Assembly**
- Format retrieved chunks into context for the LLM
- Manage context window limits by selecting top-k chunks
- Include source metadata for attribution

**5. Generation**
- Prompt the LLM with the query and retrieved context
- The model generates a response grounded in the provided information
- Include citations or source references in the output

### Key Components

**Embedding Models**: Convert text to dense vectors capturing semantic meaning. Models like [[OpenAI-embeddings]], [[Sentence-BERT]], or [[E5]] produce vectors where semantically similar texts have high cosine similarity.

**Vector Databases**: Specialized stores optimized for approximate nearest neighbor search on high-dimensional vectors. They enable fast retrieval even with millions of documents.

**Chunking Strategies**: How documents are split significantly affects retrieval quality. Options include:
- Fixed-size chunks (simple but may break context)
- Semantic chunking (split at natural boundaries)
- Hierarchical chunking (multiple granularities)
- Overlapping windows (preserve context at boundaries)

**Retrieval Methods**:
- Dense retrieval (embedding similarity)
- Sparse retrieval (BM25, keyword matching)
- Hybrid approaches combining both

### Advanced Techniques

**Query Expansion**: Using the LLM to generate related queries, improving recall by searching from multiple angles.

**Hypothetical Document Embedding (HyDE)**: Generate a hypothetical answer first, then search for documents similar to that answer.

**Parent Document Retrieval**: Retrieve small chunks for precision, but return larger parent documents for context.

**Self-RAG**: Train models to decide when to retrieve and how to use retrieved information.

**Agentic RAG**: Combine RAG with [[AI-agents]] that can iteratively search, evaluate, and refine their information gathering.

**Graph RAG**: Augment vector search with knowledge graphs for structured reasoning over entities and relationships.

## Applications

RAG is widely deployed across industries:

- **Customer Support**: Grounding chatbots in product documentation, FAQs, and policy documents
- **Enterprise Search**: Making internal knowledge bases conversationally accessible
- **Legal Research**: Retrieving relevant case law and statutes for legal questions
- **Medical Information**: Grounding responses in peer-reviewed literature and clinical guidelines
- **Code Assistance**: Retrieving relevant documentation, examples, and codebase context
- **Research Assistants**: Searching academic literature to answer research questions
- **Financial Analysis**: Grounding analysis in company filings, news, and market data
- **E-commerce**: Product recommendations and question-answering from catalogs
- **Education**: Tutoring systems grounded in course materials

## Limitations

RAG introduces its own challenges:

- **Retrieval Quality**: The system is only as good as its retrieval—if relevant documents aren't found, the answer suffers
- **Context Window Limits**: Limited space for retrieved content forces trade-offs between breadth and depth
- **Chunking Sensitivity**: Poor chunking strategies can fragment important information across pieces
- **Semantic Gap**: User queries and document language may not match well, causing relevant content to be missed
- **Hallucination Persistence**: Models can still hallucinate even with relevant context, or misinterpret retrieved information
- **Latency**: Retrieval adds latency to response time; real-time applications must optimize carefully
- **Stale Indexes**: Document collections require ongoing maintenance as information changes
- **Cost**: Embedding and storing large document collections, plus retrieval infrastructure, adds expense
- **Evaluation Difficulty**: Measuring RAG system quality requires assessing both retrieval and generation
- **Source Conflicts**: Retrieved documents may contain contradictory information

Despite these challenges, RAG remains the most practical approach for grounding LLMs in specific, current, or private knowledge.

## See Also

- [[large-language-models]]
- [[embedding-model]]
- [[vector-database]]
- [[semantic-search]]
- [[prompt-engineering]]
- [[AI-agents]]
- [[knowledge-graph]]

## References

1. Lewis, P., et al. (2020). "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks." *NeurIPS*.
2. Gao, Y., et al. (2024). "Retrieval-Augmented Generation for Large Language Models: A Survey." *arXiv*.
3. Izacard, G., & Grave, E. (2021). "Leveraging Passage Retrieval with Generative Models for Open Domain Question Answering." *EACL*.
4. Asai, A., et al. (2023). "Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection." *NeurIPS*.
