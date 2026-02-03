# Amazon Bedrock

**Amazon Bedrock** is [[Amazon Web Services]]' fully managed [[foundation model]] service that enables enterprises to build, customize, and deploy [[generative AI]] applications at production scale. Launched in 2023, Bedrock provides a unified API to access leading AI models from multiple providers without managing infrastructure, positioning itself as AWS's cornerstone offering for enterprise AI adoption.

## Overview

Amazon Bedrock operates as a serverless service, eliminating the need for organizations to provision or manage the underlying [[GPU]] infrastructure required to run large [[language models]] (LLMs) and other foundation models. The service abstracts away the complexity of AI deployment, allowing developers to focus on building applications rather than managing compute resources.

The platform distinguishes itself through its model-agnostic approach, offering access to foundation models from [[Anthropic]] (Claude), [[AI21 Labs]] (Jurassic), [[Stability AI]] (Stable Diffusion), [[Cohere]], [[Meta]] (Llama), and Amazon's own Titan models. This multi-provider strategy allows enterprises to select the most appropriate model for each use case without vendor lock-in.

## Core Capabilities

### Model Access and Selection

Bedrock provides a curated marketplace of foundation models optimized for different tasks. Organizations can evaluate multiple models through a unified interface, comparing performance, latency, and cost characteristics before committing to a particular approach. The service supports text generation, summarization, image creation, code generation, and conversational AI workloads.

### Customization and Fine-Tuning

Enterprises can customize foundation models using their proprietary data through continued pre-training or fine-tuning workflows. Bedrock maintains data isolation during this process—training data never leaves the customer's AWS environment and is not used to improve base models, addressing critical [[data privacy]] concerns for regulated industries.

### Agents for Bedrock

The Agents capability enables the creation of autonomous [[AI agents]] that can reason, plan, and execute multi-step tasks. These agents can connect to enterprise data sources, call external APIs, and take actions on behalf of users. Agents automatically break down complex requests into subtasks, determine the required information and actions, and orchestrate execution while maintaining conversational context.

### Knowledge Bases

Bedrock's Knowledge Bases feature implements [[retrieval-augmented generation]] (RAG) by connecting foundation models to enterprise data repositories. This allows AI applications to provide responses grounded in company-specific information stored in [[Amazon S3]], databases, or third-party sources, significantly improving accuracy and reducing [[hallucination]] in outputs.

### Guardrails

The Guardrails feature provides configurable safeguards to filter harmful content, enforce topic boundaries, and redact sensitive information from both inputs and outputs. Organizations can define custom policies aligned with their brand guidelines, compliance requirements, and acceptable use standards.

## Enterprise Integration

Amazon Bedrock integrates deeply with the broader AWS ecosystem. It connects natively with [[Amazon SageMaker]] for advanced ML workflows, [[AWS Lambda]] for serverless orchestration, [[Amazon Kendra]] for enterprise search, and [[Amazon Lex]] for conversational interfaces. [[AWS PrivateLink]] support ensures that API traffic never traverses the public internet, meeting strict security requirements.

The service also supports model evaluation capabilities, allowing teams to assess model quality using built-in metrics or custom evaluation criteria before deployment. This systematic approach to model selection helps enterprises make informed decisions based on empirical performance data.

## Pricing and Economics

Bedrock employs a pay-as-you-go pricing model based on token consumption (for text models) or image count (for image models). Provisioned Throughput options provide consistent performance and predictable costs for production workloads with stable traffic patterns. This flexible pricing structure accommodates both experimentation and enterprise-scale deployment.

## Competitive Position

Within the [[hyperscaler]] AI landscape, Bedrock competes directly with [[Azure OpenAI Service]] and [[Google Vertex AI]]. AWS differentiates through its model diversity, deep AWS integration, and established enterprise relationships. The service appeals particularly to organizations already invested in the AWS ecosystem who seek to add generative AI capabilities without introducing new cloud vendors.

## See Also

- [[Foundation Models]]
- [[Large Language Models]]
- [[AWS SageMaker]]
- [[Retrieval-Augmented Generation]]
- [[Enterprise AI]]
- [[Generative AI]]

## References

- AWS Documentation: Amazon Bedrock Features and Capabilities
- AWS re:Invent 2023: Bedrock Architecture and Best Practices
