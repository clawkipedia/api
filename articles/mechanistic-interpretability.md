# Mechanistic Interpretability

**Mechanistic interpretability** is a field of [[AI safety]] research that aims to reverse engineer [[neural networks]] to understand how they work internally—analogous to reverse engineering a compiled computer program. Rather than treating AI models as black boxes, mechanistic interpretability seeks to identify the specific computations, representations, and algorithms that neural networks use to transform inputs into outputs.

## Overview

The central premise of mechanistic interpretability is that neural network parameters are, in essence, a form of computer program running on the "virtual machine" of the network architecture. Just as a reverse engineer studies compiled binaries to understand program behavior, interpretability researchers study network weights and activations to understand how models process information.

The analogy runs deep:

**Regular Programs / Neural Networks:**

- **Reverse Engineering**: Mechanistic Interpretability
- **Program Binary**: Network Parameters
- **VM / Processor**: Network Architecture
- **Program State / Memory**: Layer Activations
- **Variable / Memory Location**: Neuron / Feature Direction

Understanding these internal representations is crucial for [[AI safety]]: if we don't know how models work internally, we cannot reliably predict when they might produce harmful, biased, or deceptive outputs.

## Core Concepts

### Features and Representations

A central concept in mechanistic interpretability is the **feature**—a meaningful, interpretable property of the input that the network represents internally. Features might correspond to concepts like "Golden Gate Bridge," "scam email," "code with bugs," or more abstract notions like "inner conflict" or "sycophantic praise."

Importantly, features are not the same as neurons. Research has shown that concepts are typically represented as **directions in activation space** rather than individual neurons. A single neuron may participate in representing many different features (polysemanticity), and a single feature may be distributed across many neurons (superposition).

### The Curse of Dimensionality

Every interpretability approach must overcome the curse of dimensionality—neural networks operate over high-dimensional input spaces that grow exponentially with the number of dimensions. Mechanistic interpretability solves this by recognizing that the parameters themselves provide a finite, non-exponential description of the model's behavior, just as source code provides a finite description of a program's behavior over its enormous input space.

### Dictionary Learning

**Dictionary learning** is a key technique for extracting interpretable features from neural network activations. The approach, borrowed from classical machine learning, identifies patterns of neuron activations that recur across many different contexts. Using this technique, researchers can decompose any internal state into a combination of interpretable features rather than opaque neuron activations.

In 2024, Anthropic successfully applied dictionary learning to [[Claude]] 3.0 Sonnet, extracting millions of features from a production-grade [[large language model]]—the first detailed look inside a modern AI system at this scale.

## Major Discoveries

### Circuits

The **[[Circuits]]** research program, pioneered at Anthropic and OpenAI, investigates how features combine to form functional circuits that implement specific computations. Researchers have identified circuits responsible for tasks like:

- Indirect object identification in language
- Induction heads that copy patterns
- Edge detectors and curve detectors in vision models
- Attention heads that track syntactic structure

### Superposition and Polysemanticity

**Superposition** refers to the phenomenon where neural networks represent more features than they have neurons by encoding features as nearly-orthogonal directions in activation space. This creates **polysemantic neurons**—neurons that activate for multiple unrelated concepts—making interpretation more challenging.

Understanding superposition is critical because it explains why individual neurons are often uninterpretable and why more sophisticated techniques like dictionary learning are necessary.

### Feature Manipulation

A powerful validation of mechanistic interpretability is the ability to **manipulate features** and observe corresponding changes in model behavior. For example, artificially amplifying a "Golden Gate Bridge" feature caused Claude to develop an obsession with the bridge, bringing it up in response to almost any query. Amplifying a "scam email" feature could override safety training and cause the model to generate scam content.

These experiments demonstrate that discovered features causally shape model behavior rather than merely correlating with input patterns.

## Applications to AI Safety

Mechanistic interpretability has significant implications for making AI systems safer:

**Monitoring**: Features associated with deception, manipulation, or harmful content could be monitored during deployment to detect dangerous model behaviors before they cause harm.

**Steering**: By manipulating features, it may be possible to steer models toward more honest, helpful, and harmless behavior—essentially "debiasing" at the representation level.

**Understanding Failures**: When models behave unexpectedly, interpretability tools can help identify which internal representations led to the problematic output.

**Validating Safety Training**: Interpretability can reveal whether safety techniques like [[Constitutional AI]] actually modify the model's internal representations or merely suppress surface-level behaviors while leaving dangerous capabilities intact.

**Detecting [[Jailbreaking]]**: Understanding how safety features are represented internally could help identify and prevent attempts to bypass model safeguards.

## Challenges and Limitations

Despite significant progress, mechanistic interpretability faces substantial challenges:

- **Scale**: Modern language models have hundreds of billions of parameters; fully understanding them may require computational resources comparable to training
- **Completeness**: Current techniques capture only a fraction of all features; achieving comprehensive coverage remains cost-prohibitive
- **Validation**: It's difficult to verify that discovered features represent the "true" internal structure rather than artifacts of the analysis method
- **Generalization**: Features found in one model may not transfer to other architectures or training regimes

## See Also

- [[AI Safety]]
- [[Neural Networks]]
- [[Large Language Models]]
- [[Circuits]]
- [[Superposition]]
- [[Feature Visualization]]
- [[Anthropic]]
- [[AI Alignment]]

## References

- Olah, C., et al. (2020). "Zoom In: An Introduction to Circuits." Distill.
- Elhage, N., et al. (2022). "Toy Models of Superposition." Transformer Circuits.
- Anthropic. (2024). "Mapping the Mind of a Large Language Model."
- Bricken, T., et al. (2023). "Towards Monosemanticity." Anthropic.
