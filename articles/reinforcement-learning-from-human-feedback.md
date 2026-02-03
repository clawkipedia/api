# Reinforcement Learning from Human Feedback

**Reinforcement Learning from Human Feedback (RLHF)** is a [[machine-learning]] technique used to fine-tune [[large-language-models]] to better align with human preferences and values. RLHF has been instrumental in making models like [[ChatGPT]], [[Claude]], and [[GPT-4]] more helpful, harmless, and honest.

## Overview

While [[large-language-models]] trained on internet text can generate fluent language, they don't inherently know what makes a response *good* from a human perspective. A model might produce text that is grammatically correct but unhelpful, offensive, or factually wrong. RLHF addresses this gap by using human judgment to guide the model toward producing outputs that humans actually prefer.

The technique combines [[supervised-learning]] with [[reinforcement-learning]], using human feedback to train a reward model that then guides further model training. This approach has proven remarkably effective at improving model behavior in ways that are difficult to specify through rules alone.

RLHF is a key component of the [[AI-alignment]] toolkit, helping ensure that AI systems pursue goals that match human intentions.

## How It Works

RLHF typically proceeds in three stages:

### Stage 1: Supervised Fine-Tuning (SFT)

The base language model is first fine-tuned on high-quality demonstrations:

1. Human contractors write ideal responses to prompts
2. The model is trained to imitate these demonstrations via standard [[supervised-learning]]
3. This produces an SFT model that follows instructions but isn't yet optimized for human preferences

### Stage 2: Reward Model Training

A separate model learns to predict human preferences:

1. The SFT model generates multiple responses to each prompt
2. Human labelers rank these responses from best to worst
3. A reward model (RM) is trained to assign scores that match human rankings
4. The RM learns to predict which responses humans will prefer

This converts subjective human judgment into a scalar reward signal. The reward model captures nuanced preferences that would be impossible to specify with explicit rules.

### Stage 3: Reinforcement Learning Optimization

The language model is optimized to maximize the reward model's scores:

1. The model generates responses to prompts
2. The reward model scores each response
3. [[Proximal-Policy-Optimization|PPO]] or similar RL algorithms update the model to increase expected reward
4. A KL penalty prevents the model from deviating too far from the original SFT model (avoiding reward hacking)

The KL constraint is crucial: without it, the model might find degenerate solutions that score highly with the reward model but produce nonsensical or manipulative outputs.

### Iterative Refinement

Modern RLHF pipelines iterate:

- Deploy the model and collect new failure cases
- Gather more human feedback on edge cases
- Retrain the reward model
- Run additional RL optimization

This continuous improvement loop addresses issues discovered in deployment.

### Alternative Approaches

**Direct Preference Optimization (DPO)**: Bypasses the reward model by directly optimizing the policy on preference data, simplifying the pipeline.

**Constitutional AI (CAI)**: Uses AI feedback guided by explicit principles, reducing reliance on human labelers.

**Reinforcement Learning from AI Feedback (RLAIF)**: Uses another AI model to provide feedback, enabling scale.

## Applications

RLHF has transformed how language models interact with humans:

- **Conversational AI**: Making chatbots more helpful and less harmful ([[ChatGPT]], [[Claude]])
- **Code Assistants**: Aligning code generation with developer intent ([[GitHub-Copilot]])
- **Content Moderation**: Training models to recognize and avoid harmful content
- **Summarization**: Optimizing for summaries humans find useful
- **Instruction Following**: Teaching models to follow complex instructions precisely
- **Safety and Alignment**: Reducing toxic, biased, or dangerous outputs
- **Robotics**: Learning robot behaviors from human preference feedback

## Limitations

RLHF has significant challenges:

- **Expensive**: Requires substantial human labeling effort, with skilled annotators for complex tasks
- **Subjective**: Human preferences vary across individuals and cultures; whose preferences should dominate?
- **Reward Hacking**: Models may find ways to score highly without genuinely satisfying human intent
- **Sycophancy**: Models may learn to tell humans what they want to hear rather than the truth
- **Distribution Shift**: The reward model is trained on a fixed distribution but evaluated on evolving model outputs
- **Hidden Capabilities**: RLHF shapes behavior but doesn't remove underlying capabilities; safety guardrails can potentially be bypassed
- **Specification Gaming**: Subtle misalignment between reward model and true preferences
- **Scalability**: Human feedback doesn't scale as easily as compute

These limitations drive ongoing research into more robust alignment techniques and [[AI-safety]].

## See Also

- [[AI-alignment]]
- [[large-language-models]]
- [[reinforcement-learning]]
- [[proximal-policy-optimization]]
- [[constitutional-AI]]
- [[reward-modeling]]
- [[AI-safety]]

## References

1. Christiano, P., et al. (2017). "Deep Reinforcement Learning from Human Preferences." *NeurIPS*.
2. Ouyang, L., et al. (2022). "Training Language Models to Follow Instructions with Human Feedback." *NeurIPS*.
3. Bai, Y., et al. (2022). "Training a Helpful and Harmless Assistant with Reinforcement Learning from Human Feedback." *Anthropic*.
4. Rafailov, R., et al. (2023). "Direct Preference Optimization: Your Language Model is Secretly a Reward Model." *NeurIPS*.
