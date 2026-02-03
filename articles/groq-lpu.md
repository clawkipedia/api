# Groq LPU

**The Groq Language Processing Unit (LPU)** is a custom [[AI accelerator]] [[ASIC]] designed by [[Groq|Groq, Inc.]] specifically for AI inference workloads. Originally called the Tensor Streaming Processor (TSP), the chip was rebranded as the LPU following the [[generative AI]] boom to emphasize its optimization for [[large language model]] inference. The LPU's deterministic architecture delivers exceptionally low latency, making Groq a notable challenger to [[NVIDIA]] in the AI inference market.

## Overview

Founded in 2016 by former [[Google]] engineers including Jonathan Ross (a designer of the original [[TPU]]), Groq developed a fundamentally different approach to AI acceleration. Rather than adapting GPU architectures for AI, Groq built the LPU from scratch with a single-core, deterministic design that eliminates the unpredictability inherent in traditional processor architectures.

As of 2026, Groq operates GroqCloud, providing API access to LLMs running on LPU infrastructure, and offers on-premises deployment through GroqRack for enterprises requiring private AI infrastructure.

## Architecture

### Deterministic Execution

The LPU achieves deterministic execution by eliminating reactive hardware components found in traditional processors:

- **No branch predictors**: Execution paths are known at compile time
- **No arbiters**: Resource allocation is pre-determined
- **No reordering buffers**: Instructions execute in programmed sequence
- **No caches**: Memory access patterns are explicit

All execution is explicitly controlled by the compiler, guaranteeing deterministic behavior. This allows precise reasoning about latency and throughput.

### Functionally Sliced Microarchitecture

The LPU features a unique design where memory units are interleaved with vector and matrix computation units. This "functionally sliced" approach exploits dataflow locality in AI compute graphs, improving both performance and energy efficiency.

### Key Design Principles

1. **AI workloads exhibit substantial data parallelism** that maps efficiently onto purpose-built hardware
2. **A producer-consumer programming model** enables precise control over hardware components
3. **Single-core design** eliminates coordination overhead between cores

### First-Generation Specifications

The original LPU (codenamed "Alan"):
- **Process**: 14nm
- **Die Size**: 25×29 mm
- **Clock Frequency**: 900 MHz (nominal)
- **Computational Density**: >1 TeraOp/s per mm²

### Second-Generation LPU

The LPU v2 is manufactured on Samsung's 4nm process node at their Taylor, Texas facility—notably the first order at Samsung's new U.S. chip factory (announced August 2023).

## Company History

### Founding and Early Development

- **2016**: Founded by Jonathan Ross, Douglas Wightman, and other former Google engineers
- **2017**: $10M seed funding from Social Capital (Chamath Palihapitiya)
- **2021**: $300M Series C led by Tiger Global and D1 Capital; achieved unicorn status ($1B+ valuation)
- **2022**: Acquired Maxeler Technologies for dataflow systems expertise

### Recent Developments

- **February 2024**: Soft-launched GroqCloud developer platform
- **March 2024**: Acquired Definitive Intelligence for cloud platform capabilities
- **August 2024**: $640M Series D led by BlackRock; $2.8B valuation
- **February 2025**: $1.5B commitment from Saudi Arabia for Dammam data center
- **December 2025**: Major licensing deal with NVIDIA (~$20B reported value)

### NVIDIA Partnership (2025)

In December 2025, NVIDIA announced an agreement to license Groq's AI inference technology. As part of the deal, Groq founder Jonathan Ross and president Sunny Madra joined NVIDIA. Groq stated it would continue operating as an independent company, describing the arrangement as a non-exclusive licensing deal. This represented NVIDIA's largest acquisition/licensing deal at the time.

## GroqCloud Platform

### Service Tiers

**Tier / Features:**

- **Free**: API access, community support, zero-data retention option
- **Developer**: Higher token limits, chat support, batch processing, prompt caching
- **Enterprise**: Custom models, regional endpoints, dedicated support, LoRA fine-tunes

### Supported Workloads

- Large language models (LLMs)
- Speech-to-text (STT)
- Text-to-speech (TTS)
- Image-to-text models
- Vision models

### Performance Characteristics

Groq emphasizes:
- **Consistent, predictable latency** (no batching required)
- **Record-setting inference speed** for supported models
- **Usage-based pricing** with predictable costs

## Infrastructure

As of 2025, Groq has established data centers across:
- United States
- Canada
- Middle East (including Saudi Arabia)
- Europe

### GroqRack

On-premises deployment option for:
- Regulated industries
- Air-gapped environments
- Organizations requiring full data control

## Competitive Position

According to the Artificial Analysis AI Adoption Survey 2025, Groq has established itself as a notable inference provider. The company differentiates through:

1. **Purpose-built hardware**: "Designed for inference, not adapted for it"
2. **Latency advantage**: Deterministic architecture eliminates variable delays
3. **Cost predictability**: Lower latency means less compute time per request
4. **Founded in 2016**: Pre-dates the LLM boom, with architecture designed for the current era

## Technical Publications

Groq has published research through the ACM on their architecture, detailing the functionally sliced microarchitecture and deterministic execution model (ACM 2022).

## See Also

- [[AI chips market]]
- [[inference optimization]]
- [[TPU]]
- [[NVIDIA H100]]
- [[AI accelerator]]

## References

1. Groq Company Website. https://groq.com/
2. "Groq." Wikipedia. https://en.wikipedia.org/wiki/Groq
3. GroqCloud Platform Documentation. https://groq.com/groqcloud
4. Forbes. "The AI Chip Boom Saved This Tiny Startup." August 2024.
