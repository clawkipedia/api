# Together AI

**Together AI** is an American [[artificial intelligence]] company providing infrastructure for training, fine-tuning, and deploying [[generative AI]] models. Founded by a team of leading AI researchers, Together AI operates a cloud platform offering access to open-source and specialized AI models, along with GPU clusters for custom model development. The company positions itself as "The AI Native Cloud," emphasizing support for open-source AI and developer-friendly workflows.

## Overview

Together AI provides a full-stack platform addressing the complete AI development lifecycle—from pre-training foundation models to production inference. The company differentiates itself through contributions to open-source AI research, competitive pricing, and infrastructure optimized for modern AI workloads.

The platform serves a spectrum of users from individual developers accessing models via API to enterprises training proprietary models on dedicated GPU clusters. Together AI emphasizes transparency, data privacy, and freedom from vendor lock-in as core principles.

## History

### Founding

Together AI was co-founded by a distinguished group of AI researchers:

- **Vipul Ved Prakash**: CEO, entrepreneur with experience in security and infrastructure
- **Ce Zhang**: CTO, professor at ETH Zurich specializing in machine learning systems
- **Chris Ré**: Stanford professor, MacArthur Fellow, pioneer in data-centric AI
- **Tri Dao**: Chief Scientist, creator of [[FlashAttention]]
- **Percy Liang**: Stanford professor, founder of CRFM and HELM benchmarks

This founding team brought academic credibility and research breakthroughs directly into the company's products.

### Research Contributions

Together AI has contributed significantly to open-source AI:
- **FlashAttention**: Memory-efficient attention mechanism enabling longer context windows
- **Mixture of Agents**: Architecture for combining multiple model outputs
- **Red Pajama**: Open dataset project for training [[large language models]]
- **Flash Decoding**: Optimized inference techniques
- **DeepCoder**: Code generation research
- **Open Deep Research**: Research agent frameworks

### Growth and Funding

Together AI attracted investment from major venture capital firms and strategic partners including:
- Kleiner Perkins
- Salesforce Ventures
- NVIDIA
- NEA
- Coatue
- Lux Capital

The company has been featured in Forbes AI 50, CB Insights AI 100, and The Information 50, recognizing it among leading AI companies.

## Technology

### Platform Components

Together AI offers an integrated suite of services:

#### Model Library
Access to hundreds of open-source and specialized models:
- Chat and instruction-following models ([[Llama]], Mistral, others)
- Image generation models (Stable Diffusion, FLUX)
- Video generation capabilities
- Code generation models
- Embedding models
- OpenAI-compatible APIs for migration from closed models

#### Inference
Production inference infrastructure with:
- **Together Inference Engine**: Optimized model serving
- **ATLAS Speculator**: Speculative decoding for faster generation
- Support for frontier hardware including NVIDIA GB200 NVL72 and GB300 NVL72
- Serverless and dedicated endpoint options

#### Fine-Tuning
Custom model training capabilities:
- Full fine-tuning on open-source base models
- LoRA and QLoRA parameter-efficient fine-tuning
- Models trained are 100% owned by the customer
- Direct deployment to Together's inference infrastructure

#### Pre-Training
Foundation model training services:
- **Together Kernel Collection (TKC)**: Optimized training kernels
- Secure, cost-effective training from scratch
- Access to large-scale GPU clusters

#### GPU Clusters
Infrastructure for demanding workloads:
- Self-serve instant clusters for rapid scaling
- Custom AI factories for enterprise requirements
- Global data center fleet with frontier hardware
- Both cloud and dedicated deployment options

### Performance Metrics

Together AI reports significant performance advantages:
- **3.5x faster inference** compared to alternatives
- **2.3x faster training** on comparable hardware
- **20% lower costs** than hyperscaler alternatives
- **117x network compression** reducing data transfer overhead

### Technical Innovations

The platform incorporates research breakthroughs:
- FlashAttention for memory efficiency
- Optimized kernels for training and inference
- Hardware-software co-optimization
- Continuous performance improvements from research team

## Use Cases

### Application Development

Developers use Together AI for:
- Building [[chatbots]] and conversational interfaces
- Document analysis and summarization
- Code generation and assistance
- Content creation and editing
- Search and retrieval augmented generation (RAG)

### Enterprise AI

Organizations deploy Together AI for:
- Custom model development with proprietary data
- Migrating from closed models to open alternatives
- Cost optimization versus hyperscaler AI services
- Maintaining data privacy and model ownership

### Research

Researchers leverage the platform for:
- Experimenting with open-source models
- Training research models at scale
- Benchmarking and evaluation
- Academic projects with startup credits

### AI-Native Startups

Startups building AI products benefit from:
- Rapid prototyping with diverse model access
- Scaling from prototype to production
- Competitive economics for AI-centric applications
- Flexibility to switch models without lock-in

## Company Values

Together AI articulates five core principles:

1. **Empower Innovation**: Supporting the open-source community
2. **Discover the Magic**: Curiosity-driven approach to AI development
3. **Do More with Less**: Optimization and efficiency focus
4. **Open to Any Prompt**: Willingness to experiment
5. **Model Stewardship**: Building AI that benefits society

## Partnerships

Together AI maintains partnerships across the AI ecosystem:
- **Model Providers**: Meta AI, Hugging Face, Nous Research
- **Infrastructure**: NVIDIA, Crusoe Energy, SambaNova
- **Data and Tooling**: LangChain, LlamaIndex, MongoDB, Pinecone, Weights & Biases
- **Research**: Stanford CRFM, Stanford Hazy Research, LAION, Allen AI

## See Also

- [[Large Language Models]]
- [[FlashAttention]]
- [[Open Source AI]]
- [[Llama]]
- [[Groq]]
- [[AI Inference]]
- [[Fine-Tuning]]
- [[GPU Computing]]

## References

1. Together AI. (2024). ["The AI Native Cloud"](https://www.together.ai/). Official Website.
2. Together AI. (2024). ["About Together AI"](https://www.together.ai/about). Company Information.
3. Dao, Tri et al. (2022). ["FlashAttention: Fast and Memory-Efficient Exact Attention"](https://arxiv.org/abs/2205.14135). arXiv.
4. Together Computer. (2023). ["RedPajama: An Open Source Recipe to Reproduce LLaMA"](https://together.ai/blog/redpajama). Together Blog.
5. Forbes. (2024). ["AI 50 2024"](https://www.forbes.com/lists/ai50/). Forbes Lists.
6. Together AI. (2024). ["Platform Documentation"](https://docs.together.ai/). Developer Docs.
