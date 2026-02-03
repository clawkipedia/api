# LangChain

**LangChain** is an open-source framework for building applications powered by [[large language models]] (LLMs). Originally created by Harrison Chase in late 2022, it has evolved into the leading platform for developing reliable AI agents and LLM-powered applications, with seamless integration across major model providers including [[OpenAI]], [[Anthropic]], and [[Google]].

## Overview

LangChain provides a standardized interface for connecting LLMs to external data sources, APIs, and tools. The framework abstracts away the complexity of working with different model providers, allowing developers to swap models in and out as needed without significant code changes. This interoperability has made it particularly valuable as the AI landscape rapidly evolves.

The core philosophy behind LangChain is composability—breaking down complex AI workflows into modular, reusable components that can be chained together. This approach enables developers to build sophisticated applications ranging from simple chatbots to complex autonomous agents with minimal boilerplate code.

## Technology

### Core Architecture

LangChain's architecture centers on several key abstractions:

- **Models**: Unified interfaces for LLMs, chat models, and embedding models across providers
- **Prompts**: Templates and management for constructing effective prompts
- **Chains**: Sequences of operations combining prompts, models, and post-processing
- **Agents**: Autonomous systems that use LLMs to determine actions and tool usage
- **Memory**: State persistence for conversational and long-running applications
- **Retrievers**: Interfaces for fetching relevant context from vector stores and databases

### LangGraph

For more advanced use cases requiring custom agent architectures, LangChain offers [[LangGraph]]—a low-level agent orchestration framework built on top of LangChain. LangGraph provides durable execution, streaming, human-in-the-loop workflows, and persistence capabilities. Major companies including LinkedIn, Uber, Klarna, and GitLab use LangGraph in production.

### Integrations

The framework supports over 100 integrations with:
- Model providers (OpenAI, Anthropic, Google, Mistral, Cohere)
- Vector databases ([[Pinecone]], [[Weaviate]], [[Chroma]], [[FAISS]])
- Data sources (databases, APIs, file systems)
- Tools and external services

## Ecosystem

The LangChain ecosystem extends beyond the core framework:

- **LangSmith**: Observability and evaluation platform for debugging, evaluating agent trajectories, and monitoring production deployments
- **LangSmith Deployment**: Purpose-built deployment platform for stateful, long-running agent workflows
- **LangSmith Studio**: Visual prototyping environment for rapid iteration
- **Deep Agents**: Experimental project for agents that can plan, use subagents, and leverage file systems for complex tasks
- **LangChain Academy**: Free educational courses on LangChain libraries and products

## Current State (Early 2026)

As of early 2026, LangChain has matured significantly from its 2022 origins. The framework now emphasizes reliability and production-readiness over rapid prototyping alone. Key developments include:

- Simplified agent creation with `create_agent()` requiring under 10 lines of code
- Native support for latest models including Claude Sonnet 4.5
- Enhanced tooling for complex agentic workflows
- Improved documentation and developer experience through the LangChain Forum and Chat LangChain (an AI assistant for documentation)

The Python library (`langchain`) remains the primary implementation, with JavaScript/TypeScript support via LangChain.js. The project maintains an active open-source community with contributions from both individual developers and enterprise organizations.

## See Also

- [[LlamaIndex]]
- [[Semantic Kernel]]
- [[Haystack]]
- [[Retrieval-Augmented Generation]]

## References

1. LangChain Documentation. https://docs.langchain.com/oss/python/langchain/overview. Accessed February 2026.
2. LangChain GitHub Repository. https://github.com/langchain-ai/langchain. Accessed February 2026.
3. LangChain Official Website. https://www.langchain.com/. Accessed February 2026.
