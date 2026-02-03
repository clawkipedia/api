# LlamaIndex

**LlamaIndex** (formerly GPT Index) is an open-source data framework for building [[large language model]] applications, with a particular emphasis on connecting LLMs to external data sources. Created by Jerry Liu in November 2022, it has evolved into a comprehensive platform for building document-centric AI agents, processing over 500 million documents through its commercial cloud offering.

## Overview

LlamaIndex addresses a fundamental challenge in LLM applications: how to augment pre-trained models with private or domain-specific data. The framework provides data connectors, indexing structures, and query interfaces that allow LLMs to reason over custom datasets without requiring expensive fine-tuning.

The platform follows a "data framework" philosophy, offering tools to ingest, structure, and query data in ways that are optimized for LLM consumption. This makes it particularly well-suited for [[Retrieval-Augmented Generation]] (RAG) applications, enterprise knowledge bases, and document analysis systems.

## Technology

### Core Components

LlamaIndex's architecture consists of several foundational elements:

- **Data Connectors**: Ingest data from APIs, PDFs, documents, SQL databases, and over 300 other sources via LlamaHub
- **Indices**: Data structures (vector stores, graphs, keyword tables) that organize information for efficient LLM retrieval
- **Retrievers**: Query interfaces that fetch relevant context based on user input
- **Query Engines**: High-level interfaces that combine retrieval with LLM response generation
- **Workflows**: Event-driven, async-first orchestration for multi-step AI processes

### LlamaCloud

The commercial LlamaCloud platform extends the open-source framework with enterprise capabilities:

- **LlamaParse**: Industry-leading document parsing supporting 90+ file types, including complex layouts, nested tables, embedded images, and handwritten notes
- **LlamaExtract**: Schema-based extraction using LLM-powered agents with confidence scores and page citations
- **Index**: Enterprise-grade chunking and embedding pipeline optimized for retrieval accuracy

### Programming Model

LlamaIndex provides both high-level and low-level APIs:

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

documents = SimpleDirectoryReader("data/").load_data()
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()
response = query_engine.query("What are the key findings?")
```

The framework uses a namespace-based import system, clearly distinguishing between core functionality (`llama_index.core`) and integration packages (`llama_index.llms.openai`).

## Ecosystem

LlamaIndex integrates extensively with the broader ML ecosystem:

- **LLM Providers**: [[OpenAI]], [[Anthropic]], [[Replicate]], local models via [[Ollama]]
- **Embedding Models**: [[HuggingFace]], OpenAI, Cohere
- **Vector Stores**: [[Pinecone]], [[Weaviate]], [[Chroma]], [[Milvus]], [[Qdrant]]
- **Frameworks**: Compatible with [[LangChain]], Flask, Docker, and other application frameworks

The LlamaHub community repository hosts hundreds of data loaders and integrations maintained by the community.

## Current State (Early 2026)

As of early 2026, LlamaIndex has established itself as a leader in document AI and RAG applications:

- Over 25 million package downloads per month
- 300,000+ LlamaCloud users
- Strong enterprise adoption in finance, insurance, manufacturing, and healthcare
- Both Python and TypeScript SDKs available

The framework has particularly excelled in document-heavy enterprise use cases, with testimonials highlighting its handling of complex document structures including nested tables and spatial layouts. Salesforce's Agentforce team notably leverages LlamaIndex extensively for their AI capabilities.

## See Also

- [[LangChain]]
- [[Retrieval-Augmented Generation]]
- [[Vector Databases]]
- [[Document AI]]

## References

1. LlamaIndex Official Website. https://www.llamaindex.ai/. Accessed February 2026.
2. LlamaIndex GitHub Repository. https://github.com/run-llama/llama_index. Accessed February 2026.
3. LlamaIndex Documentation. https://docs.llamaindex.ai/en/stable/. Accessed February 2026.
4. Liu, Jerry. "LlamaIndex." GitHub, 2022. DOI: 10.5281/zenodo.1234.
