# Reinforcement Learning from Human Feedback (RLHF)

**Reinforcement Learning from Human Feedback (RLHF)** is a training methodology that aligns [[large language model|large language models]] with human preferences by using human judgments as a reward signal. RLHF transformed raw language models into helpful assistants and was a key technique behind breakthrough systems like ChatGPT, Claude, and Gemini.

## Overview

Language models trained with standard objectives (like next-token prediction) learn to generate statistically likely text but don't inherently understand what humans find helpful, accurate, or appropriate. RLHF bridges this gap by directly optimizing models to produce outputs that humans prefer.

The insight is powerful: rather than trying to explicitly specify what makes a good response (which is notoriously difficult), we collect human judgments and let the model learn from them. This enables training for subjective qualities like helpfulness, tone, and safety that resist formal specification.

## The RLHF Pipeline

RLHF consists of three core stages:

### Stage 1: Pretraining

Start with a language model pretrained on large text corpora. This base model has broad knowledge and linguistic capabilities but no specific alignment to human preferences. Companies like OpenAI, Anthropic, and Google begin with models ranging from tens of billions to hundreds of billions of parameters.

Some practitioners first perform supervised [[fine-tuning]] (SFT) on high-quality demonstrations of desired behavior before RLHF, creating a stronger starting point.

### Stage 2: Reward Model Training

Build a model that scores outputs according to human preferences:

1. **Collect comparison data**: Present human annotators with a prompt and multiple model responses
2. **Gather rankings**: Annotators rank responses from best to worst (or compare pairs)
3. **Train reward model**: Learn to predict which response humans prefer

Rankings are preferred over absolute scores because humans find comparisons easier and more consistent than assigning numerical ratings. The Bradley-Terry model or similar approaches convert pairwise comparisons into scalar rewards.

The reward model is typically a language model (often smaller than the policy model) that outputs a single scalar for any input-output pair.

### Stage 3: Reinforcement Learning

Optimize the language model using the reward model as a signal:

1. **Generate**: The policy (language model) produces responses to prompts
2. **Score**: The reward model evaluates the responses
3. **Update**: Use RL algorithms (typically PPO) to increase probability of high-scoring responses

A critical addition is the **KL divergence penalty**—the policy is penalized for straying too far from the original pretrained model. This prevents "reward hacking" where the model learns to exploit quirks in the reward model while generating nonsensical text:

**Reward = R_preference - λ × KL(policy || reference)**

## Key Technical Details

### Why PPO?

Proximal Policy Optimization (PPO) has become the standard RL algorithm for RLHF due to:
- Stability across diverse tasks
- Robustness to hyperparameter choices
- Compatibility with large-scale distributed training
- Established infrastructure from traditional RL

Other algorithms like A2C and ILQL have been explored, but PPO remains dominant.

### Reward Hacking

Without the KL penalty, models discover "shortcuts" that score highly with the reward model but produce poor outputs:
- Excessively long responses (if the reward model favors verbosity)
- Repetitive phrases that trigger high reward
- Confident-sounding but incorrect statements

The KL penalty anchors the policy to sensible text generation while allowing beneficial optimization.

### Scaling Challenges

Training requires maintaining multiple large models simultaneously:
- Policy model (being trained)
- Reference model (for KL computation)
- Reward model
- Sometimes a value function for PPO

This multiplies memory requirements and complicates distributed training.

## Alternatives and Extensions

### Direct Preference Optimization (DPO)

Bypasses explicit reward modeling by directly optimizing the policy on preference pairs. Simpler and more stable, DPO has gained significant adoption since its 2023 introduction.

### RLAIF (RL from AI Feedback)

Used in [[constitutional-ai]], replaces human annotators with AI-generated preferences, enabling better scaling while maintaining oversight through explicit principles.

### Iterative RLHF

Continuously collect human feedback on the current policy and retrain, creating a cycle of improvement. Requires deployed systems with engaged users.

### RLHF + SFT Mixing

OpenAI and others found that mixing SFT gradients with RL updates during training improves stability and final quality.

## Historical Context

- **2017**: OpenAI demonstrates learning from human preferences for simple tasks
- **2020**: OpenAI fine-tunes GPT-3 with human feedback, creating InstructGPT
- **2022**: ChatGPT launches, bringing RLHF to public attention
- **2023-2024**: RLHF becomes standard for production LLM training; DPO emerges as an alternative
- **2025-2026**: Hybrid approaches combining RLHF, DPO, Constitutional AI, and automated feedback become common

## Open Source Implementations

- **TRL (Transformers Reinforcement Learning)**: Hugging Face library for RLHF
- **TRLX**: Scaled fork of TRL for larger models
- **RL4LMs**: Allen AI library with multiple RL algorithms
- **DeepSpeed-Chat**: Microsoft's framework for distributed RLHF

## Current State (Early 2026)

RLHF remains fundamental to LLM alignment, though the landscape has evolved:
- **DPO and variants** have simplified preference learning for many use cases
- **Constitutional AI** complements RLHF with scalable AI feedback
- **Process reward models** train on step-by-step reasoning quality
- **Multi-objective RLHF** balances helpfulness, harmlessness, and other criteria

The field continues advancing toward more efficient, stable, and effective alignment techniques.

## See Also

- [[constitutional-ai]] - AI feedback based alignment
- [[fine-tuning]] - Supervised model adaptation
- [[prompt-engineering]] - Steering models through input design

## References

1. Hugging Face. "Illustrating Reinforcement Learning from Human Feedback (RLHF)." Blog, December 2022. https://huggingface.co/blog/rlhf
2. Ouyang, Long, et al. "Training language models to follow instructions with human feedback." NeurIPS 2022.
3. Christiano, Paul, et al. "Deep reinforcement learning from human preferences." NeurIPS 2017.
4. Rafailov, Rafael, et al. "Direct Preference Optimization: Your Language Model is Secretly a Reward Model." NeurIPS 2023.
5. Stiennon, Nisan, et al. "Learning to summarize from human feedback." NeurIPS 2020.
