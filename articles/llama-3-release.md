# Meta Llama 3 Release (April 2024)

**Llama 3** is a family of [[large language models]] released by [[Meta AI]] on April 18, 2024. The release continued Meta's strategy of distributing powerful AI models with permissive licenses, enabling widespread adoption across research and commercial applications. Llama 3 represented a significant capability leap, with Meta claiming the 70B parameter model outperformed [[Google]]'s Gemini Pro 1.5 and [[Claude 3 Sonnet]] on most benchmarks at launch.

## Overview

Meta released Llama 3 in two initial sizes: 8 billion and 70 billion parameters. Both models were pre-trained on approximately 15 trillion tokens of text—dramatically more than previous Llama versions—and were available as both base foundation models and instruction-tuned versions optimized for chat and task completion.

The release was accompanied by the rollout of Meta AI, a consumer-facing AI assistant built on Llama technology and integrated across [[Facebook]], [[Instagram]], [[WhatsApp]], and a dedicated website. This marked Meta's transition from purely distributing models to offering AI products directly to its billions of users.

## Historical Context

Meta's Llama series began in February 2023 with the original LLaMA (Large Language Model Meta AI), which was initially distributed only to approved researchers. After the model weights were leaked via BitTorrent within days of release, spreading rapidly through AI communities, Meta shifted strategy with Llama 2 in July 2023 to embrace broader distribution with a permissive license allowing commercial use.

Llama 3 continued this open approach while substantially increasing capability. The model's wide availability made it a de facto standard for AI research and development outside the major API-only providers.

## Training and Architecture

Llama 3 maintained the transformer decoder architecture from previous versions but scaled training dramatically. The 15 trillion token training corpus represented a massive increase from Llama 2's 2 trillion tokens, compiled from publicly available sources with additional licensed content.

The instruction-tuned versions were fine-tuned on publicly available instruction datasets plus over 10 million human-annotated examples, improving the models' ability to follow complex instructions and engage in multi-turn conversations.

Regarding [[scaling laws]], Llama 3 demonstrated that training well beyond theoretically "optimal" data quantities continued to improve performance. The 8B model, for which the Chinchilla-optimal dataset would have been 200 billion tokens, continued to improve with log-linear scaling across the full 15 trillion tokens—75 times the theoretically optimal amount.

## Licensing and Open Source Debate

Meta distributed Llama 3 under a custom license that permitted commercial use but included an Acceptable Use Policy prohibiting certain applications. The license did not meet the strict definition of "open source" maintained by the [[Open Source Initiative]], leading to ongoing debate about terminology.

Meta's use of "open" language to describe Llama sparked criticism from open source advocates who argued it created confusion. However, the practical accessibility of the models—with downloadable weights that could be run, modified, and deployed without API costs—made them functionally open for most use cases, regardless of definitional debates.

The approach enabled a thriving ecosystem of Llama-derived models fine-tuned for specific purposes, including code generation (Code Llama), various languages, and specialized domains.

## Mark Zuckerberg's Vision

In interviews surrounding the launch, Meta CEO [[Mark Zuckerberg]] articulated his rationale for open distribution. He argued that AI would become fundamental infrastructure and that making models widely available would accelerate innovation while preventing any single company from controlling the technology.

Zuckerberg noted that the 8B version of Llama 3 achieved performance "nearly as powerful as the largest Llama 2," demonstrating rapid capability growth. The team was surprised to find the 70B model still improving at the end of its 15 trillion token training run, suggesting further scaling remained beneficial.

## Subsequent Releases

Meta continued rapid iteration following the April launch:

- **Llama 3.1 (July 2024)**: Added a 405 billion parameter model alongside updated 8B and 70B versions, with context windows expanded to 128,000 tokens
- **Llama 3.2 (September 2024)**: Introduced smaller 1B and 3B parameter models plus multimodal variants capable of processing images alongside text
- **Llama 3.3 (December 2024)**: Updated 70B model with further performance improvements

## Llama 4 and Architecture Evolution

In April 2025, Meta released Llama 4, representing a fundamental architecture change to [[mixture of experts]] and native multimodality. The Llama 4 series (Scout and Maverick variants) could process text and images, supported 12 languages, and offered context windows up to 10 million tokens.

The transition from Llama 3 to Llama 4 marked a shift from the scaling-focused approach of Llama 3 to architectural innovation in Llama 4.

## Impact on AI Ecosystem

Llama 3's release had substantial effects across the AI landscape:

**Research Accessibility**: Researchers without access to expensive compute or API credits could experiment with frontier-class models locally, enabling academic work that would otherwise require corporate partnerships.

**Commercial Adoption**: Companies built products on Llama without recurring API costs or dependence on external providers, particularly appealing for applications requiring data privacy or offline operation.

**Competition Dynamics**: The availability of powerful open models pressured API-based providers to justify their pricing and demonstrate capabilities beyond what open alternatives offered.

## Controversies

Llama 4's launch was marred by controversy when it was discovered that Meta used a specially optimized "experimental chat version" of the model for benchmark testing on [[LMArena]]—a version that differed from what was publicly released. LMArena updated its policies in response, and some users accused Meta of benchmark manipulation, though Meta denied training on test sets.

## See Also

- [[Meta AI]]
- [[Large Language Models]]
- [[Open Source AI]]
- [[Claude 3 Launch]]
- [[GPT-4 Launch]]
- [[Mixture of Experts]]

## References

1. Meta AI. "Introducing Meta Llama 3: The most capable openly available LLM to date." Meta AI Blog, April 18, 2024.
2. Zuckerberg, Mark. Interview with Dwarkesh Patel, April 2024.
3. Wikipedia contributors. "Llama (language model)." Wikipedia, accessed February 2026.
