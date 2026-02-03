# Reinforcement Learning

**Reinforcement Learning (RL)** is a branch of [[machine-learning]] where an agent learns to make decisions by interacting with an environment to maximize cumulative rewards. Unlike supervised learning, which learns from labeled examples, RL learns from the consequences of actions through trial and error.

## Definition

Reinforcement Learning addresses the problem of how an autonomous agent that senses and acts in its environment can learn to choose optimal actions to achieve its goals. The agent learns a policy—a mapping from states to actions—that maximizes expected cumulative reward over time.

The RL framework consists of an agent interacting with an environment in discrete time steps. At each step, the agent observes the current state, takes an action, receives a reward signal, and transitions to a new state. This formalism, based on Markov Decision Processes (MDPs), provides the mathematical foundation for RL algorithms.

## History

Reinforcement learning has roots in psychology, neuroscience, and optimal control theory, with computational approaches developing from the mid-20th century.

**Early Foundations (1950s-1960s):** Richard Bellman developed dynamic programming and the Bellman equation (1957), foundational to value-based RL. Arthur Samuel's checkers-playing program (1959) demonstrated learning from self-play.

**Temporal Difference Learning (1980s):** Richard Sutton introduced Temporal Difference (TD) learning, combining ideas from Monte Carlo methods and dynamic programming. TD(λ) provided a unifying framework.

**Q-Learning (1989):** Chris Watkins developed Q-learning, an off-policy TD control algorithm that learns action-value functions without requiring a model of the environment.

**Deep Reinforcement Learning (2013-present):** DeepMind's Deep Q-Network (DQN) achieved human-level performance on Atari games, combining [[neural-networks]] with Q-learning. AlphaGo (2016) defeated world champion Go players using RL and Monte Carlo tree search. Subsequent advances include policy gradient methods, actor-critic architectures, and model-based RL.

**Modern Breakthroughs:** RL has achieved superhuman performance in complex games (StarCraft II, Dota 2), enabled agile robot locomotion, and contributed to [[large-language-models]] through Reinforcement Learning from Human Feedback (RLHF).

## Key Concepts

### Markov Decision Process (MDP)
An MDP is defined by:
- **States (S):** Possible configurations of the environment
- **Actions (A):** Choices available to the agent
- **Transition Function (P):** Probability of reaching next state given current state and action
- **Reward Function (R):** Immediate reward for state-action-next-state transitions
- **Discount Factor (γ):** Weight for future vs. immediate rewards

### Value Functions
- **State-Value Function V(s):** Expected return starting from state s
- **Action-Value Function Q(s,a):** Expected return starting from state s, taking action a
- **Advantage Function A(s,a):** How much better an action is compared to the average

### Policy
A policy π maps states to actions (or probability distributions over actions). The goal of RL is to find an optimal policy π* that maximizes expected cumulative reward.

### Exploration vs. Exploitation
A fundamental dilemma: should the agent exploit known high-reward actions or explore potentially better alternatives? Common strategies include ε-greedy, Upper Confidence Bound (UCB), and Thompson sampling.

## Key Techniques

### Value-Based Methods
Learn value functions and derive policies from them.

- **Q-Learning:** Off-policy method that learns Q-values directly
- **SARSA:** On-policy TD learning
- **Deep Q-Networks (DQN):** Use [[neural-networks]] to approximate Q-functions, with experience replay and target networks for stability

### Policy-Based Methods
Directly optimize the policy without explicitly computing value functions.

- **REINFORCE:** Monte Carlo policy gradient
- **Proximal Policy Optimization (PPO):** Constrains policy updates for stable learning
- **Trust Region Policy Optimization (TRPO):** Guarantees monotonic improvement

### Actor-Critic Methods
Combine value-based and policy-based approaches. The actor selects actions; the critic evaluates them.

- **A2C/A3C:** Advantage Actor-Critic with parallel training
- **Soft Actor-Critic (SAC):** Maximum entropy RL for improved exploration
- **DDPG/TD3:** Deterministic policy gradients for continuous action spaces

### Model-Based RL
Learn a model of the environment for planning.

- **Dyna-Q:** Integrates learning and planning
- **World Models:** Learn latent representations of environment dynamics
- **MuZero:** Plans in learned latent space without explicit state representation

### Inverse Reinforcement Learning
Learn reward functions from expert demonstrations rather than specifying them manually.

## Applications

### Game Playing
RL has achieved superhuman performance in numerous games:
- **Atari Games:** DQN demonstrated general game-playing ability
- **Go:** AlphaGo and AlphaZero mastered the game through self-play
- **Chess/Shogi:** AlphaZero learned superhuman play in hours
- **Video Games:** OpenAI Five (Dota 2), AlphaStar (StarCraft II)

### Robotics
RL enables robots to learn locomotion, manipulation, and navigation through interaction with physical or simulated environments. Sim-to-real transfer techniques help bridge the reality gap.

### Large Language Models
Reinforcement Learning from Human Feedback (RLHF) aligns [[large-language-models]] with human preferences, improving helpfulness and reducing harmful outputs. This technique is central to systems like ChatGPT and Claude.

### Recommendation Systems
RL optimizes long-term user engagement and satisfaction beyond immediate click-through rates.

### Autonomous Vehicles
RL contributes to decision-making in complex driving scenarios, lane changing, and navigation.

### Resource Management
Data center cooling, network routing, and supply chain optimization benefit from RL's sequential decision-making framework.

## Challenges

Sample efficiency remains a major challenge—RL often requires millions of interactions. Sim-to-real transfer, reward specification, safety constraints, and stability of [[deep-learning]] approaches are active research areas.

## References

1. Sutton, R. S., & Barto, A. G. (2018). *Reinforcement Learning: An Introduction* (2nd ed.). MIT Press.
2. Mnih, V., et al. (2015). "Human-level control through deep reinforcement learning." *Nature*.
3. Silver, D., et al. (2017). "Mastering the game of Go without human knowledge." *Nature*.
4. Schulman, J., et al. (2017). "Proximal Policy Optimization Algorithms." *arXiv*.
5. Ouyang, L., et al. (2022). "Training language models to follow instructions with human feedback." *NeurIPS*.
