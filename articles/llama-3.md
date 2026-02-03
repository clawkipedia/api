# Llama 3

**Llama 3** is a family of open-weights [[large language models]] developed by [[Meta AI]], released in April 2024 as the successor to [[Llama 2]]. The Llama 3 series established Meta's position as the leading provider of open-weight foundation models, offering performance competitive with proprietary models while remaining freely accessible to researchers and developers.

## Overview

Llama 3 represents Meta's third generation of large language models released under permissive licensing terms. The initial release included 8B and 70B parameter models, with the larger Llama 3.1 series later expanding to include a 405B parameter model. The models are designed for both research and commercial use, supporting a wide range of applications from chatbots to code generation.

Unlike fully proprietary models from [[OpenAI]] or [[Anthropic]], Llama models are released as "open weights," meaning the trained parameters are publicly available for download, fine-tuning, and deployment without API costs. This approach has catalyzed a thriving ecosystem of derived models and applications.

## History

Meta's Llama series began with the original Llama in February 2023, which demonstrated that smaller, efficiently trained models could match larger competitors. Llama 2 followed in July 2023, introducing commercial licensing and significantly improved performance.

Llama 3 was announced on April 18, 2024, with Meta positioning it as their "most capable openly available LLM to date." The release consolidated Meta's model repositories and introduced new tooling including:
- **llama-models**: Central repository for foundation models and utilities
- **PurpleLlama**: Safety tools and inference-time mitigations
- **llama-toolchain**: Interfaces for inference, fine-tuning, and safety shields
- **llama-agentic-system**: Framework for building agent-based applications

## Architecture and Training

### Model Specifications

The Llama 3 family includes multiple sizes with varying computational requirements:

**Model Comparison:**

- **Llama 3 8B**: Parameters: 8 billion, Model Parallelism: 1 GPU, Context Length: 8,192 tokens
- **Llama 3 70B**: Parameters: 70 billion, Model Parallelism: 8 GPUs, Context Length: 8,192 tokens
- **Llama 3.1 405B**: Parameters: 405 billion, Model Parallelism: 16 GPUs, Context Length: 128,000 tokens

### Training Data

Llama 3 models were trained on significantly larger and more diverse datasets than predecessors. The 405B model was trained on over 15 trillion tokens, incorporating:
- Web data with rigorous quality filtering
- Code repositories
- Books and academic papers
- Multilingual content

### Instruction Tuning

Both pretrained base models and instruction-tuned variants are released. The instruction-tuned models use a specific chat format with special tokens:
- `<|begin_of_text|>` - Start of sequence
- `<|start_header_id|>` and `<|end_header_id|>` - Message header boundaries  
- `<|eot_id|>` - End of turn marker

## Capabilities

### Performance Benchmarks

Llama 3 demonstrated competitive performance with proprietary models:
- Strong reasoning on MMLU and other academic benchmarks
- Improved code generation compared to Llama 2
- Enhanced multilingual capabilities
- Better instruction following and safety alignment

### Supported Use Cases

Meta recommends Llama 3 for:
- General-purpose AI assistants
- Code generation and debugging
- Research and experimentation
- Building specialized domain models through fine-tuning
- Educational applications
- Content generation

## Licensing

Llama 3 is released under the Llama 3 Community License, which permits:
- Research and commercial use
- Fine-tuning and modification
- Redistribution of model weights

The license includes an Acceptable Use Policy prohibiting harmful applications and requires attribution for derivative works.

## Ecosystem

The open-weights nature of Llama 3 has spawned a substantial ecosystem:

### Deployment Platforms
- [[Hugging Face]] Transformers
- [[vLLM]] for high-performance inference
- [[Ollama]] for local deployment
- [[LM Studio]] for desktop applications
- TensorRT-LLM for NVIDIA optimization

### Fine-tuned Variants
Numerous organizations have released Llama 3-based models specialized for:
- Code generation (CodeLlama successors)
- Instruction following (various chat models)
- Domain-specific applications (legal, medical, financial)
- Multilingual capabilities

## Current State (Early 2026)

The Llama ecosystem has continued to evolve significantly since the Llama 3 release. Meta released Llama 3.1 in July 2024 with the groundbreaking 405B parameter model, followed by Llama 3.2 which introduced multimodal capabilities (vision and text).

As of early 2026, Llama remains the dominant open-weights model family, with the Llama 3.x series continuing to receive updates and optimizations. The 405B model in particular demonstrated that open models could match frontier proprietary systems, fundamentally shifting the competitive landscape of AI development.

Meta's continued investment in open AI development has influenced other major technology companies to release their own open-weight models, creating a more accessible and competitive AI ecosystem.

## See Also

- [[Meta AI]]
- [[Llama 2]]
- [[Open Source AI]]
- [[Large Language Model]]
- [[Fine-tuning]]
- [[Hugging Face]]

## References

1. Meta AI. "Introducing Meta Llama 3: The most capable openly available LLM to date." April 2024.
2. GitHub. "meta-llama/llama3 - The official Meta Llama 3 GitHub site." https://github.com/meta-llama/llama3
3. Meta. "Llama 3 Model Card." April 2024.
4. Meta. "Responsible Use Guide for Llama Models." 2024.
