# Qwen

**Qwen** (通义千问, Tongyi Qianwen) is a family of [[large language models]] developed by [[Alibaba Cloud]], representing one of China's most successful open-weight AI model series. The Qwen family encompasses general-purpose language models as well as specialized variants for coding (Qwen-Coder) and mathematics (Qwen-Math), available in sizes ranging from 0.5 billion to 72 billion parameters.

## Overview

Qwen is developed by the Qwen Team at Alibaba Cloud and has become one of the most widely adopted open-weight model families globally. The models are characterized by strong multilingual capabilities (supporting 29+ languages), competitive benchmark performance with frontier models, and broad availability across deployment platforms.

As of the Qwen2.5 release in September 2024, Alibaba described it as "the largest open-source release in history," providing models across multiple size points with Apache 2.0 licensing for most variants. The Qwen ecosystem supports both open-weight deployment and API access through Alibaba's Model Studio platform.

## History

### Version Timeline

- **Qwen-1** (2023): Initial release establishing the model family
- **Qwen-1.5** (Early 2024): CodeQwen1.5 for coding applications
- **Qwen2** (Mid 2024): Major architecture improvements
- **Qwen2-Math** (August 2024): Specialized mathematics models
- **Qwen2.5** (September 2024): Current generation with comprehensive model lineup
- **Qwen2.5-Coder** (September 2024): Enhanced coding models
- **Qwen2.5-Math** (September 2024): Improved mathematics reasoning

## Qwen2.5 Family

### Model Sizes

The Qwen2.5 release includes models at multiple scales:

**General Language Models (Qwen2.5)**
- 0.5B, 1.5B, 3B, 7B, 14B, 32B, and 72B parameters

**Coding Specialists (Qwen2.5-Coder)**
- 1.5B, 7B, and 32B parameters

**Mathematics Specialists (Qwen2.5-Math)**
- 1.5B, 7B, and 72B parameters

### Technical Specifications

- **Architecture**: Dense decoder-only transformer
- **Context length**: Up to 128K tokens input, 8K tokens output
- **Multilingual support**: 29+ languages including Chinese, English, French, Spanish, Portuguese, German, Italian, Russian, Japanese, Korean, Vietnamese, Thai, Arabic
- **Training data**: Up to 18 trillion tokens for largest models

## Capabilities

### Benchmark Performance

Qwen2.5-72B demonstrates leading performance among open-source models:

**Knowledge and Reasoning**
- MMLU: 85+ (undergraduate-level knowledge)
- Competitive with Llama-3.1-70B and Mistral-Large-V2

**Coding**
- HumanEval: 85+ (code generation)
- Strong multi-language programming support

**Mathematics**
- MATH benchmark: 80+ (mathematical reasoning)
- Chain-of-Thought, Program-of-Thought, and Tool-Integrated Reasoning support

### Key Improvements in Qwen2.5

**Knowledge Density**
Significantly expanded knowledge base through 18T token pretraining.

**Structured Data Understanding**
Enhanced ability to process and reason about tables, JSON, and other structured formats.

**Structured Output Generation**
Reliable generation of JSON, XML, and other structured formats.

**Long Text Generation**
Support for generating outputs exceeding 8,000 tokens.

**System Prompt Flexibility**
Improved handling of diverse system prompts for role-play and customization.

### Specialized Models

**Qwen2.5-Coder**
Trained on 5.5 trillion tokens of code-related data, delivering:
- Competitive performance with larger general-purpose models
- Support for multiple programming languages
- Strong code completion and generation

**Qwen2.5-Math**
Enhanced mathematical reasoning with:
- Chinese and English language support
- Multiple reasoning methodologies (CoT, PoT, TIR)
- Performance exceeding GPT-4o on math benchmarks

## API Models

Alibaba offers proprietary API models alongside open-weight releases:

**Qwen-Plus**
Higher-capability model competitive with GPT-4o and Claude-3.5-Sonnet on many tasks.

**Qwen-Turbo**
Cost-effective, fast inference for high-volume applications.

Both are available through Alibaba's Model Studio platform.

## Deployment and Ecosystem

### Official Support

Qwen2.5 is supported across major deployment frameworks:
- Hugging Face Transformers
- vLLM (including tool calling)
- Ollama
- TensorRT-LLM
- SGLang

### Integration Partners

The Qwen ecosystem benefits from extensive community support:

**Fine-tuning**: Peft, LLaMA-Factory, Axolotl, Swift, XTuner, Unsloth
**Quantization**: AutoGPTQ, AutoAWQ, Neural Compressor
**Deployment**: vLLM, TGI, Xinference, OpenVINO
**Local Execution**: MLX, llama.cpp, Ollama, LM Studio
**Agent Frameworks**: Dify, LlamaIndex, CrewAI

### Tool Calling

Qwen2.5 supports function calling through:
- vLLM built-in tool calling (Hermes-style)
- Ollama tool calling support
- Hugging Face Transformers tool use templates
- Qwen-Agent for native tool integration

## Licensing

Most Qwen2.5 models use Apache 2.0 licensing, enabling:
- Commercial and research use
- Modification and redistribution
- No royalty requirements

The 3B and 72B variants have separate license terms specified in their Hugging Face repositories.

## Vision and Multimodal

Beyond language models, the Qwen family includes:

**Qwen2-VL (Vision-Language)**
Multimodal models combining visual and language understanding, with Qwen2-VL-72B released alongside Qwen2.5.

## Current State (Early 2026)

Qwen has established itself as one of the premier open-weight model families, particularly strong in:
- Multilingual applications (especially Chinese-English)
- Mathematical and scientific reasoning
- Code generation and analysis
- Structured data processing

The models are widely deployed across industries in China and internationally, with the open-weight approach enabling extensive customization for domain-specific applications.

Alibaba continues active development, with the Qwen Team noting plans to integrate multimodal capabilities into a unified model and improve reasoning through reinforcement learning approaches inspired by models like [[OpenAI o1]].

The success of Qwen demonstrates that frontier AI development extends beyond US-based labs, with Chinese research teams producing globally competitive open models.

## See Also

- [[Alibaba Cloud]]
- [[Large Language Model]]
- [[Open Source AI]]
- [[Chinese AI Development]]
- [[Multilingual NLP]]

## References

1. Qwen Team. "Qwen2.5: A Party of Foundation Models!" September 2024. https://qwenlm.github.io/blog/qwen2.5/
2. Qwen Team. "Qwen2 Technical Report." 2024.
3. Hugging Face. "Qwen Organization." https://huggingface.co/Qwen
4. Alibaba Cloud. "Model Studio Documentation." https://modelscope.cn/organization/qwen
