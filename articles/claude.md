# Claude

**Claude** is a family of [[large language models]] (LLMs) developed by [[Anthropic]], an AI safety company founded in 2021. Named after Claude Shannon, the father of information theory, Claude is designed to be helpful, harmless, and honest—a framework Anthropic calls "HHH." As of late 2025, Claude has become one of the most widely deployed AI assistants globally, powering enterprise applications, developer tools, and consumer products.

## Overview

Claude was first released to the public in March 2023 and has undergone rapid iteration, with the Claude 4.5 series representing the current frontier as of late 2025. Anthropic has positioned Claude as an AI assistant that balances performance with safety considerations, trained using [[Constitutional AI]] (CAI) which allows the model to self-improve based on a set of principles rather than relying solely on human feedback.

Claude is available through multiple interfaces: the Claude.ai consumer web application, Claude mobile apps, Claude Code (a terminal-based coding agent), and the Anthropic API for developers. Enterprise customers can also access Claude through cloud partnerships with Amazon Web Services (AWS Bedrock) and Google Cloud Platform (Vertex AI).

## Technical Details

### Architecture

Claude is built on the [[Transformer Architecture]] that underlies most modern LLMs. The model uses a decoder-only architecture similar to GPT, processing text as sequences of tokens and generating responses autoregressively.

### Training Methodology

Anthropic employs a multi-stage training process:

1. **Pretraining**: The base model is trained on a large corpus of text data from the internet, books, and other sources to develop general language understanding.

2. **Constitutional AI (CAI)**: Rather than relying exclusively on [[Reinforcement Learning from Human Feedback]] (RLHF), Claude uses CAI where the model critiques and revises its own outputs based on a set of constitutional principles.

3. **RLHF Fine-tuning**: Human feedback is incorporated to refine helpfulness and conversational abilities.

4. **Safety Training**: Extensive red-teaming and safety evaluations, including CBRN (chemical, biological, radiological, nuclear) risk assessments under ASL-3 protocols.

### Model Versions

**Version / Release Date / Key Features:**

- **Claude 1.0**: Release Date: March 2023, Key Features: Initial public release
- **Claude 2**: Release Date: July 2023, Key Features: 100K context window, improved coding
- **Claude 2.1**: Release Date: November 2023, Key Features: 200K context window, reduced hallucination
- **Claude 3 (Haiku/Sonnet/Opus)**: Release Date: March 2024, Key Features: Vision capabilities, tiered model family
- **Claude 3.5 Sonnet**: Release Date: June 2024, Key Features: Significant performance improvements
- **Claude 3.5 Opus**: Release Date: October 2024, Key Features: Enhanced reasoning, computer use capabilities
- **Claude Sonnet 4**: Release Date: May 2025, Key Features: Improved coding, agentic capabilities
- **Claude Opus 4**: Release Date: May 2025, Key Features: Frontier reasoning, extended thinking
- **Claude Sonnet 4.5**: Release Date: September 2025, Key Features: SOTA on SWE-bench, Claude Agent SDK, 61.4% on OSWorld
- **Claude Opus 4.5**: Release Date: November 2025, Key Features: Best model for coding/agents/computer use, effort parameter

### Claude 4.5 Series (Current)

**Claude Sonnet 4.5** (September 2025) represents a significant leap in capabilities:
- State-of-the-art on SWE-bench Verified for real-world software engineering
- 61.4% on OSWorld benchmark for computer use (up from 42.2% four months prior)
- Can maintain focus for 30+ hours on complex, multi-step tasks
- Introduced alongside the **Claude Agent SDK** for building autonomous agents
- Pricing: $3/$15 per million tokens (input/output)

**Claude Opus 4.5** (November 2025) is Anthropic's flagship model:
- Described as "the best model in the world for coding, agents, and computer use"
- Scored higher than any human candidate on Anthropic's internal performance engineering exam
- Features the **effort parameter** allowing developers to trade off speed vs. capability
- At medium effort, matches Sonnet 4.5's best SWE-bench score using 76% fewer tokens
- Pricing: $5/$25 per million tokens (input/output)
- Most robustly aligned frontier model, with industry-leading prompt injection resistance

### Context Window

Claude models support up to 200,000 tokens of context (approximately 150,000 words), allowing users to upload entire books, codebases, or document collections for analysis.

### Multimodal Capabilities

Starting with Claude 3, the model gained vision capabilities for analyzing images, charts, diagrams, and documents. Claude 4.5 models can integrate images directly into their reasoning process for computer use tasks.

## Products and Tools

### Claude Code
A terminal-based coding agent that can autonomously work on codebases. Features include checkpoints for saving/rolling back progress, VS Code extension integration, and the ability to run for 30+ hours on complex tasks.

### Claude Agent SDK
Released alongside Sonnet 4.5 (September 2025), the Claude Agent SDK provides the same infrastructure that powers Claude Code, enabling developers to build their own autonomous agents with features like:
- Memory management across long-running tasks
- Permission systems balancing autonomy with user control
- Subagent coordination for complex workflows

### Claude for Chrome
Browser extension enabling Claude to navigate websites, fill spreadsheets, and complete tasks directly in the browser using computer use capabilities.

## Safety and Alignment

Anthropic places significant emphasis on AI safety. Claude Sonnet 4.5 and Opus 4.5 are described as the "most aligned frontier models" ever released:

- **ASL-3 Protections**: Advanced safety protocols including CBRN classifiers
- **Reduced Misalignment**: Lower scores on sycophancy, deception, power-seeking, and encouragement of delusional thinking
- **Prompt Injection Resistance**: Industry-leading robustness against adversarial attacks
- **Constitutional AI**: Self-improvement based on explicit principles

## Corporate Milestones

- **September 2025**: Anthropic raised $13B Series F at $183B post-money valuation
- Revenue grew from $1B to over $5B in eight months (early 2025)
- Major partnerships with Amazon, Google, and enterprise customers

## See Also

- [[Anthropic]]
- [[Dario Amodei]]
- [[Constitutional AI]]
- [[Transformer Architecture]]
- [[GPT-4]]
- [[Gemini]]
- [[LLaMA]]
- [[AI Safety]]

## References

1. Anthropic. "Introducing Claude Opus 4.5." Anthropic News, November 24, 2025.
2. Anthropic. "Introducing Claude Sonnet 4.5." Anthropic News, September 29, 2025.
3. Anthropic. "Anthropic raises $13B Series F at $183B post-money valuation." Anthropic News, September 2, 2025.
4. Anthropic. "Claude Opus 4.5 System Card." Anthropic, 2025.
5. Anthropic. "Claude Sonnet 4.5 System Card." Anthropic, 2025.
6. Bai, Yuntao, et al. "Constitutional AI: Harmlessness from AI Feedback." arXiv preprint arXiv:2212.08073, 2022.
