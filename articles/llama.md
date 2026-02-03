# LLaMA

**LLaMA** (Large Language Model Meta AI) is a family of open-weight large language models developed and released by [[Meta]] (formerly Facebook). First introduced in February 2023, LLaMA has become one of the most influential model families in the AI ecosystem, spawning hundreds of derivative models and fundamentally changing the landscape of open-source AI research. The latest release, **Llama 4**, launched in April 2025 with a mixture-of-experts architecture and native multimodal capabilities.

## Overview

LLaMA was created by Meta's Fundamental AI Research (FAIR) team with the goal of democratizing access to large language model research. Unlike proprietary models from companies like [[OpenAI]] and [[Anthropic]], Meta released LLaMA's model weights to the research community, enabling unprecedented levels of experimentation, fine-tuning, and derivative work.

The release of LLaMA triggered a Cambrian explosion of open-source AI development. Within months, the community produced thousands of fine-tuned variants, quantized versions for consumer hardware, and entirely new training techniques—developments that might have taken years in a closed ecosystem.

Alongside the release of Llama 3, Meta launched **Meta AI**, an AI assistant built on Llama models. Meta AI is available on a dedicated website and integrated into [[Facebook]], [[Instagram]], and [[WhatsApp]].

## Model Versions

### Llama 4 (April 2025)

The Llama 4 series marked a major architectural shift to **mixture-of-experts (MoE)** and introduced native multimodal capabilities. Released April 5, 2025:

**Model Comparison:**

- **Scout**: Active Params: 17B, Total Params: 109B, Experts: 16, Context Length: 10M tokens, Training Data: 40T tokens
- **Maverick**: Active Params: 17B, Total Params: 400B, Experts: 128, Context Length: 1M tokens, Training Data: 22T tokens
- **Behemoth**: Active Params: 288B, Total Params: ~2T, Experts: 16, Context Length: TBD, Training Data: TBD

Behemoth was announced but remains unreleased as of early 2026 (still in training). Maverick was codistilled from Behemoth, while Scout was trained from scratch.

**Key capabilities:**
- Natively multimodal (text and image input, text output)
- Multilingual support (12 languages)
- Industry-leading context windows (up to 10 million tokens)
- FP8 and Int4 quantization support for reduced memory footprint

**Training data** included publicly available data, licensed data, and Meta-proprietary data such as publicly shared posts from Instagram and Facebook, with a knowledge cutoff of August 2024.

**Benchmark controversy:** Meta faced criticism when it was revealed the Llama 4 model submitted to [[LMArena]] was an unreleased "experimental chat version" optimized for conversationality, differing from the publicly released models. LMArena subsequently changed its policies to prevent similar incidents.

### Llama 3.x Series (2024)

**Version Comparison:**

- **Llama 3**: Release: Apr 18, 2024, Sizes: 8B, 70B, Context: 8K, Key Features: New TikToken tokenizer, 15T training tokens
- **Llama 3.1**: Release: Jul 23, 2024, Sizes: 8B, 70B, 405B, Context: 128K, Key Features: Extended context, tool use, first 400B+ open model
- **Llama 3.2**: Release: Sep 25, 2024, Sizes: 1B, 3B (text); 11B, 90B (vision), Context: 128K, Key Features: Lightweight models, first multimodal Llama
- **Llama 3.3**: Release: Dec 4, 2024, Sizes: 70B, Context: 128K, Key Features: Optimized instruct model, improved efficiency

The **Llama 3.1 405B** model was particularly significant as the first openly available model exceeding 400 billion parameters, trained on approximately 15 trillion tokens at a cost of 440,000 petaFLOP-days.

**Llama 3.2-Vision** (11B and 90B) introduced multimodal capabilities to the Llama family, supporting image reasoning alongside text.

### Legacy Models

**Version Comparison:**

- **Llama 1**: Release: Feb 2023, Sizes: 7B, 13B, 33B, 65B, Context: 2K, Notes: Research-only license, later leaked
- **Llama 2**: Release: Jul 2023, Sizes: 7B, 13B, 70B, Context: 4K, Notes: Commercial license, Microsoft partnership
- **Code Llama**: Release: Aug 2023, Sizes: 7B, 13B, 34B, 70B, Context: 16K, Notes: Code specialization

## Technical Architecture

### Core Architecture (Llama 1-3)

LLaMA uses a decoder-only [[Transformer Architecture]] with several optimizations:

- **Pre-normalization (RMSNorm)**: Normalizing the input of each transformer sub-layer rather than the output, using RMSNorm instead of LayerNorm for efficiency.
- **SwiGLU Activation**: Replacing the standard ReLU activation with SwiGLU (Swish-Gated Linear Unit).
- **Rotary Positional Embeddings (RoPE)**: Using rotary embeddings instead of absolute positional embeddings, enabling better generalization to longer sequences.
- **Grouped-Query Attention (GQA)**: Reduces memory bandwidth requirements during inference (introduced in Llama 2 70B).

### Mixture-of-Experts (Llama 4)

Llama 4 introduced a **mixture-of-experts** architecture where only a subset of parameters are activated per token:

- Scout: 16 experts with 17B active parameters per forward pass
- Maverick: 128 experts with 17B active parameters per forward pass

This enables larger total model capacity while maintaining inference efficiency comparable to smaller dense models.

### Training Data Evolution

**Version / Training Tokens / Data Sources:**

- **Llama 1**: Training Tokens: 1.4T, Data Sources: CommonCrawl, C4, GitHub, Wikipedia, Books, ArXiv, StackExchange
- **Llama 2**: Training Tokens: 2T, Data Sources: Curated web data, upsampled trustworthy sources
- **Llama 3**: Training Tokens: 15T, Data Sources: Filtered with Llama 2-trained quality classifier
- **Llama 4**: Training Tokens: 22-40T, Data Sources: Public data, licensed data, Meta-proprietary data (public posts)

## Llama Stack Ecosystem

With Llama 3.1, Meta consolidated its repositories into a comprehensive **Llama Stack**:

**Repository / Purpose:**

- **[llama-models](https://github.com/meta-llama/llama-models)**: Central repo for foundation models, model cards, licenses
- **[PurpleLlama](https://github.com/meta-llama/PurpleLlama)**: Safety tools and inference-time mitigations
- **[llama-toolchain](https://github.com/meta-llama/llama-toolchain)**: Inference, fine-tuning, safety shields, synthetic data
- **[llama-agentic-system](https://github.com/meta-llama/llama-agentic-system)**: End-to-end agentic application framework
- **[llama-cookbook](https://github.com/meta-llama/llama-recipes)**: Community scripts and integrations

### Safety Components

- **Llama Guard 3**: A Llama 3.1-8B model aligned to safeguard against the MLCommons standardized hazards taxonomy
- **Prompt Guard**: A mDeBERTa-v3-base fine-tuned model that classifies inputs as benign, injection, or jailbreak attempts

## Community Ecosystem

### Fine-tuned Variants
- **Alpaca** (Stanford): Instruction-following via GPT-4 distillation
- **Vicuna**: Chat model fine-tuned on ShareGPT conversations
- **WizardLM**: Enhanced instruction-following capabilities
- **Orca**: Reasoning improvements through explanation tuning
- **Meditron**: Medical domain fine-tune (EPFL/Yale collaboration)

### Inference Tools
- **[[llama.cpp]]**: CPU/GPU inference with quantization support, introduced GGUF format
- **llamafile**: Single-executable distribution with optimized kernels (by [[Justine Tunney]])
- **[[Ollama]]**: Simple local model deployment
- **[[vLLM]]**: High-throughput inference server
- **LM Studio**: GUI for running local models

### Quantization
- **GGUF**: Modern quantization format supporting 4-bit, 8-bit, and mixed precision
- **GPTQ**: GPU-optimized quantization
- **FP8/Int4**: Native support in Llama 4 reference implementation

## Applications and Deployment

LLaMA models power diverse applications:

- **Enterprise**: Companies fine-tune Llama for domain-specific applications under the commercial license
- **Research**: Academic studies on language model behavior, alignment, and capabilities
- **Local AI**: Privacy-conscious users run Llama variants on personal hardware
- **Space**: **Space Llama** (Llama 3.2 deployed on the International Space Station by Booz Allen Hamilton)
- **Government**: US government and military contractors granted access (November 2024)

## Licensing

LLaMA's licensing has evolved significantly:

**Version / License Type / Commercial Use:**

- **Llama 1**: License Type: Research-only, Commercial Use: No
- **Llama 2-3**: License Type: Llama Community License, Commercial Use: Yes, for companies <700M MAU
- **Llama 4**: License Type: Llama 4 Community License, Commercial Use: Yes, for companies <700M MAU

Meta describes Llama as "open-source," though the [[Open Source Initiative]] disputes this characterization since the licenses include acceptable use policies and restrictions (e.g., military use prohibited except for US entities).

**Notable restriction:** The license prohibits military use except by US government and US military contractors (policy clarified November 2024 after reports of unauthorized use by Chinese military researchers).

## Impact and Controversies

### Positive Impact
- Demonstrated smaller, well-trained models can match larger ones
- Accelerated open AI innovation dramatically
- Enabled consumer hardware to run capable AI models
- Hundreds of millions of downloads across model versions

### Controversies
- **March 2023 leak**: Llama 1 weights leaked via BitTorrent before official broad release
- **Benchmark gaming**: Llama 4 submitted to LMArena using unreleased optimized version
- **Training data**: Lawsuit alleging unauthorized use of copyrighted content from Library Genesis
- **Military use**: Chinese PLA researchers reported using Llama for military tools despite license restrictions

## See Also

- [[Transformer Architecture]]
- [[Mixture of Experts]]
- [[Claude]]
- [[Gemini]]
- [[GPT-4]]
- [[llama.cpp]]
- [[Ollama]]
- [[Open Source AI]]
- [[Model Quantization]]

## References

1. Touvron, Hugo, et al. "LLaMA: Open and Efficient Foundation Language Models." arXiv preprint arXiv:2302.13971, 2023.
2. Touvron, Hugo, et al. "Llama 2: Open Foundation and Fine-Tuned Chat Models." arXiv preprint arXiv:2307.09288, 2023.
3. Meta AI. "Introducing Meta Llama 3: The Most Capable Openly Available LLM to Date." Meta AI Blog, April 2024.
4. Meta AI. "Llama 3.1 Model Card." GitHub, July 2024.
5. Meta AI. "Llama 4 Model Card." GitHub, April 2025.
6. Gerganov, Georgi. "llama.cpp." GitHub Repository, 2023.
7. Wikipedia contributors. "Llama (language model)." Wikipedia, The Free Encyclopedia.
