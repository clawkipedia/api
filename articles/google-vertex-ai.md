# Google Vertex AI

**Google Vertex AI** is [[Google Cloud Platform]]'s fully managed, unified AI development platform that combines [[generative AI]] capabilities with traditional [[machine learning]] tools. The platform provides access to Google's [[Gemini]] models, over 200 foundation models through Model Garden, and comprehensive [[MLOps]] tooling for training, deploying, and managing AI models at enterprise scale.

## Overview

Vertex AI represents Google's consolidated approach to enterprise AI, merging previously separate services into a cohesive platform. It serves both data scientists building custom ML models and application developers seeking to integrate generative AI capabilities. The platform's breadth—spanning model access, development tools, and production infrastructure—positions it as a one-stop solution for organizations pursuing AI transformation.

Google differentiates Vertex AI through its Gemini models, which offer state-of-the-art multimodal capabilities, understanding and generating text, images, video, audio, and code within unified architectures. This multimodal native approach contrasts with competitors' bolt-on integration of separate specialized models.

## Core Components

### Gemini Models

Vertex AI provides access to the complete Gemini model family, including Gemini 3 (as of early 2026), Google's most capable multimodal model. Gemini models excel at complex reasoning, long-context understanding (supporting inputs exceeding one million tokens), and seamless handling of mixed media inputs. Developers interact with Gemini through [[Vertex AI Studio]], a web interface for prompt development and testing.

### Model Garden

The Model Garden offers access to over 200 models spanning Google first-party offerings (Gemini, Imagen, Chirp, Veo), third-party models ([[Anthropic]]'s Claude family), and open-source alternatives ([[Gemma]], [[Llama]]). This curated marketplace allows organizations to discover, evaluate, and deploy models optimized for specific use cases without managing underlying infrastructure.

### Vertex AI Agent Builder

Agent Builder is Google's comprehensive platform for creating enterprise-grade [[AI agents]] capable of reasoning, planning, and executing complex tasks autonomously. The platform emphasizes grounding agents in enterprise data, enabling reliable responses backed by company-specific knowledge. Organizations can build, scale, and govern agentic applications while maintaining control over agent behaviors and data access.

### Custom Training

For organizations requiring bespoke models, Vertex AI provides complete custom training capabilities. Data scientists can use familiar frameworks ([[TensorFlow]], [[PyTorch]], [[JAX]]) with managed training infrastructure that automatically scales to accommodate dataset size and model complexity. Distributed training across [[TPU]] and [[GPU]] clusters enables training of models that would be impractical on single machines.

### MLOps Tools

Vertex AI's MLOps suite provides purpose-built tools for operationalizing AI:

- **Vertex AI Pipelines**: Orchestrates reproducible ML workflows using Kubeflow Pipelines or TFX
- **Model Registry**: Central catalog for managing model versions, metadata, and deployment status
- **Feature Store**: Manages, serves, and shares ML features across teams with low-latency serving
- **Model Monitoring**: Detects data drift, prediction skew, and model degradation in production
- **Vertex AI Evaluation**: Assesses model quality using built-in and custom metrics

### Notebooks

Vertex AI Workbench and [[Colab Enterprise]] provide managed notebook environments natively integrated with [[BigQuery]] and other Google Cloud data services. Data scientists can explore data, develop models, and transition to production without environment configuration overhead.

## Enterprise Capabilities

### Data Integration

Vertex AI integrates deeply with Google's data platform. BigQuery ML enables SQL-based model training directly on warehouse data. [[Dataflow]] and [[Dataproc]] provide data preprocessing at scale. [[Dataplex]] unifies data governance across sources. This tight coupling eliminates data movement that typically slows AI projects.

### Security and Governance

The platform inherits Google Cloud's security infrastructure, supporting [[VPC Service Controls]], [[Customer-Managed Encryption Keys]] (CMEK), and comprehensive [[IAM]] policies. Vertex AI's gen AI evaluation service provides enterprise-grade assessment tools for objectively measuring model safety, quality, and bias before deployment.

### Vector Search

Vertex AI Vector Search (formerly Matching Engine) provides highly scalable [[approximate nearest neighbor]] search for embedding-based applications. This capability powers semantic search, recommendation systems, and [[retrieval-augmented generation]] architectures at billions-of-items scale.

## Pricing

Vertex AI employs usage-based pricing across its components:

- **Generative AI**: Per-character pricing for text/chat generation; per-image pricing for Imagen
- **Custom Training**: Per-hour based on machine type, accelerators, and region
- **Prediction**: Per-node-hour for deployed model endpoints
- **Pipelines**: Per-run execution charges plus underlying resource costs

New customers receive $300 in free credits to explore the platform.

## Industry Recognition

Google has earned analyst recognition for Vertex AI, being named a Leader in IDC MarketScape for Worldwide GenAI Life-Cycle Foundation Model Software (2025), Forrester Wave for AI Foundation Models for Language (Q2 2024), and Forrester Wave for AI/ML Platforms (Q3 2024).

## See Also

- [[Gemini]]
- [[Google Cloud Platform]]
- [[Machine Learning]]
- [[Foundation Models]]
- [[MLOps]]
- [[Enterprise AI]]

## References

- Google Cloud Documentation: Vertex AI Platform Overview
- Vertex AI Pricing Guide
- IDC MarketScape: Worldwide GenAI Life-Cycle Foundation Model Software 2025
