# John Schulman

**John Schulman** (born 1987 or 1988) is an American [[artificial intelligence]] researcher, entrepreneur, and co-founder of [[OpenAI]]. He is widely recognized as the "architect" of [[ChatGPT]] and a pioneer in [[reinforcement learning]], particularly known for developing [[Proximal Policy Optimization]] (PPO) and advancing [[Reinforcement Learning from Human Feedback]] (RLHF)—the techniques that made modern conversational AI systems possible.

## Early Life

Schulman developed an interest in science and mathematics from a young age. He was an avid reader of science fiction, particularly enjoying the works of [[Isaac Asimov]]. In seventh grade, he became fascinated with the television program [[BattleBots]], which featured combat between remote-controlled robots. In what he later described as his first self-directed study, he read extensively across subjects that would help him design a superior robot, though the robot he and his friends worked on was never actually built.

Schulman attended Great Neck South High School on Long Island, New York. His exceptional aptitude for physics was recognized when he was selected for the United States Physics Olympiad Team in 2005, one of the most competitive scientific competitions for high school students.

He pursued his undergraduate education at the [[California Institute of Technology]] (Caltech), graduating with a degree in physics in 2010. He then enrolled at the [[University of California, Berkeley]] for graduate studies in electrical engineering and computer sciences. There, under the supervision of [[Pieter Abbeel]], a leading researcher in robotics and machine learning, Schulman developed his expertise in reinforcement learning.

## Career

### OpenAI (2015-2024)

In December 2015, shortly before completing his PhD, Schulman co-founded OpenAI alongside [[Sam Altman]], [[Elon Musk]], [[Ilya Sutskever]], [[Greg Brockman]], [[Trevor Blackwell]], Vicki Cheung, [[Andrej Karpathy]], Durk Kingma, Pamela Vagata, and [[Wojciech Zaremba]]. Sam Altman and Elon Musk served as co-chairs of the organization.

At OpenAI, Schulman led the reinforcement learning team and became instrumental in developing the technologies that would eventually power ChatGPT. His work on Proximal Policy Optimization (PPO) and Reinforcement Learning from Human Feedback (RLHF) provided the critical techniques needed to align large language models with human preferences and make them safe and helpful for widespread use.

Schulman has been referred to as the "architect" of ChatGPT, reflecting his central role in developing the training methodologies that transformed raw language models into coherent, aligned conversational agents. His technical contributions were essential to ChatGPT's remarkable success upon its launch in November 2022.

### Anthropic (2024-2025)

In August 2024, Schulman announced he would be leaving OpenAI to join [[Anthropic]], the AI safety company founded by former OpenAI researchers including Dario and Daniela Amodei. He stated that his move was motivated by a desire to "deepen his focus on AI alignment and return to more hands-on technical work."

The departure was notable given Schulman's status as a co-founder and his central role in OpenAI's success. It came during a period of significant departures from OpenAI, raising questions about the company's direction on AI safety.

### Thinking Machines Lab (2025-present)

In February 2025, Schulman announced he was leaving Anthropic to join [[Thinking Machines Lab]], the AI startup founded by [[Mira Murati]] (former OpenAI CTO). At Thinking Machines Lab, Schulman serves as Chief Scientist, continuing his work on advancing AI capabilities while maintaining focus on safety and alignment.

## Notable Work

### Proximal Policy Optimization (PPO)

Schulman developed [[Proximal Policy Optimization]] (PPO), one of the most important algorithms in modern reinforcement learning. PPO addresses a fundamental challenge in policy gradient methods: how to take the largest possible improvement step without causing the policy to become unstable.

PPO achieves this by using a "clipped" objective function that prevents excessively large policy updates. The algorithm has become the default choice for many reinforcement learning applications due to its:
- Ease of implementation
- Good sample efficiency
- Stable training dynamics
- Strong empirical performance

PPO is used in training language models, robotics, game playing, and numerous other applications.

### Reinforcement Learning from Human Feedback (RLHF)

Schulman was a key contributor to developing [[Reinforcement Learning from Human Feedback]] (RLHF), the technique that allows AI models to learn from human preferences rather than explicit reward functions. RLHF involves:

1. Collecting human comparisons between model outputs
2. Training a reward model to predict human preferences
3. Using reinforcement learning (often PPO) to optimize the language model against this reward

RLHF was crucial for making large language models like ChatGPT helpful, harmless, and honest. Without RLHF, language models would simply predict the next token without regard for whether their outputs are actually useful or aligned with human values.

### Trust Region Policy Optimization (TRPO)

Before PPO, Schulman developed [[Trust Region Policy Optimization]] (TRPO), which introduced the concept of constrained policy optimization that PPO would later simplify. TRPO provided theoretical foundations for understanding policy gradient methods.

## Recognition

- Mark Bingham Award for Excellence in Achievement by Young Alumni, UC Berkeley (2025)
- MIT Technology Review profile as a pioneer in AI (2018)

## See Also

- [[OpenAI]]
- [[ChatGPT]]
- [[Reinforcement Learning]]
- [[Proximal Policy Optimization]]
- [[RLHF]]
- [[AI Alignment]]
- [[Anthropic]]
- [[Thinking Machines Lab]]
- [[Ilya Sutskever]]
- [[Sam Altman]]

## References

1. Wikipedia contributors. "John Schulman." Wikipedia, The Free Encyclopedia.
2. Manke, Kara. "ChatGPT architect, Berkeley alum John Schulman on his journey with AI." Berkeley News, April 20, 2023.
3. Schulman, J., Wolski, F., Dhariwal, P., Radford, A., & Klimov, O. (2017). "Proximal Policy Optimization Algorithms." arXiv preprint arXiv:1707.06347.
4. Schulman, J., Levine, S., Abbeel, P., Jordan, M., & Moritz, P. (2015). "Trust Region Policy Optimization." ICML 2015.
5. OpenAI. "Introducing OpenAI." December 2015.
