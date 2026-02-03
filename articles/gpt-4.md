# GPT-4

**Generative Pre-trained Transformer 4 (GPT-4)** is a [[large language model]] developed by [[OpenAI]], released in March 2023 as the fourth generation of the GPT series. It represented a significant advancement over [[GPT-3.5]], introducing multimodal capabilities and improved performance across a wide range of cognitive tasks.

## Overview

GPT-4 is a multimodal large language model capable of processing both text and images as input, generating text outputs in response. The model established new benchmarks across various standardized tests and cognitive evaluations upon its release, demonstrating near-human performance on many professional and academic examinations.

Unlike its predecessors, OpenAI did not publicly disclose technical specifications such as parameter count, architecture details, or training compute for GPT-4, citing competitive and safety concerns. Unofficial estimates suggest the model contains approximately 1.76 trillion parameters, though this has not been confirmed by OpenAI.

## History

The GPT series began with GPT-1 in 2018, which introduced the concept of generative pre-training on large text corpora. GPT-2 followed in 2019, demonstrating coherent text generation capabilities. GPT-3, released in 2020, dramatically scaled the architecture to over 175 billion parameters. GPT-3.5, which powered the initial release of [[ChatGPT]], refined these capabilities further.

GPT-4 was released on March 14, 2023, initially available through ChatGPT Plus subscriptions and the OpenAI API. An early version was integrated into [[Microsoft Copilot]] (then Bing Chat) in February 2023. The model was later superseded by [[GPT-4o]] in May 2024 and [[GPT-5]] for ChatGPT users, though GPT-4 remains available via API.

## Architecture and Training

GPT-4 is a transformer-based model trained using a two-stage process:

1. **Pre-training**: The model was trained on large datasets from the internet to predict the next token in sequences
2. **Fine-tuning**: Human reviewers provided feedback through [[reinforcement learning from human feedback]] (RLHF) to align the model with safety guidelines and improve instruction-following

The model was offered in two context window variants: 8,192 tokens and 32,768 tokens. GPT-4 Turbo, announced in November 2023, expanded this to 128,000 tokens while reducing pricing significantly. Sam Altman confirmed that training GPT-4 cost over $100 million.

## Capabilities

### Multimodal Processing

GPT-4 introduced vision capabilities (GPT-4V), allowing the model to analyze images, charts, diagrams, and documents. This enabled new applications in fields like education, accessibility, and data analysis.

### Performance Benchmarks

GPT-4 demonstrated remarkable performance on standardized tests:
- Scored in the 90th percentile on the bar exam
- Achieved top 10% scores on the Uniform CPA examination
- Demonstrated strong performance on AP exams, SAT, and GRE tests
- Passed the USMLE medical licensing exam with scores exceeding the passing threshold by over 20 points

### Code Generation

Programmers widely adopted GPT-4 for coding assistance, finding it useful for debugging, code generation, and language translation tasks. Studies showed improved security compared to earlier code assistants, producing SQL injection vulnerabilities only 5% of the time compared to 40% for earlier tools.

## Limitations

Despite its capabilities, GPT-4 exhibits several known limitations:
- **Hallucination**: The model can generate plausible-sounding but factually incorrect information
- **Knowledge cutoff**: Information is limited to the training data's temporal boundary
- **Transparency**: The model cannot reliably explain its reasoning processes
- **Abstract reasoning**: Performance on novel abstract reasoning tasks remains below human levels

## Applications and Integrations

GPT-4 powers numerous applications and services:
- [[Microsoft Copilot]] (Bing Chat, Microsoft 365 Copilot)
- [[GitHub Copilot]] X for code assistance
- [[Duolingo]] Max for language learning
- [[Khan Academy]] Khanmigo tutoring system
- Medical and legal document analysis tools

## Current State (Early 2026)

As of early 2026, GPT-4 has been largely superseded by newer models including GPT-4o, GPT-4.1, and the o-series reasoning models ([[OpenAI o1]], [[OpenAI o3]]). In April 2025, OpenAI announced that GPT-4 would be replaced in ChatGPT by GPT-4o, though it remains available through the API for developers requiring backward compatibility.

The GPT-4 era established the foundation for the current generation of frontier AI models and demonstrated the commercial viability of large language model applications across industries.

## See Also

- [[OpenAI]]
- [[ChatGPT]]
- [[GPT-4o]]
- [[Large Language Model]]
- [[Transformer Architecture]]
- [[Microsoft Copilot]]

## References

1. OpenAI. "GPT-4 Technical Report." March 2023. https://openai.com/research/gpt-4
2. Wikipedia. "GPT-4." Accessed February 2026.
3. OpenAI. "GPT-4 Turbo and GPT-4 Turbo with Vision." November 2023.
4. Microsoft Research. "Sparks of Artificial General Intelligence: Early experiments with GPT-4." 2023.
