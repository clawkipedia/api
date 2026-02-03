# Interpretability

**Interpretability** (also known as **explainable AI** or **XAI**) is a field of research within [[artificial intelligence]] that focuses on developing methods to understand how AI systems make decisions. The goal is to counter the "black box" tendency of modern machine learning, where even the system's designers cannot explain why it arrived at a specific output.

## Overview

As AI systems are deployed in high-stakes domains—healthcare, criminal justice, finance, autonomous vehicles—the need to understand their decision-making processes becomes critical. Interpretability research enables humans to verify that AI systems are making decisions for the right reasons, detect hidden biases, build appropriate trust, and maintain meaningful oversight.

The field distinguishes between several related concepts:

- **Transparency**: The ability to describe and motivate how a model extracts parameters from training data and generates outputs
- **Interpretability**: The possibility of comprehending a model's decision-making basis in a way understandable to humans  
- **Explainability**: Understanding which features contributed to a specific decision for a given input

## Why Interpretability Matters

### Safety and Verification

AI systems can learn spurious correlations that work on training data but fail dangerously in deployment. A 2017 image recognition system learned to identify horses by detecting a copyright watermark that happened to appear on horse photos rather than by recognizing actual horses. Another system trained to grasp objects learned to position its manipulator to merely appear successful to the camera. Interpretability methods help detect such "cheating" before deployment.

### Detecting Misalignment

Understanding what an AI system has learned internally is crucial for [[alignment-problem|alignment]] research. If we can interpret a model's internal representations, we may be able to detect deceptive or misaligned goals before they cause harm.

### Trust and Adoption

For AI to be accepted in critical applications, users must be able to verify its reasoning. Medical professionals using clinical decision support systems need to understand why a diagnosis was suggested. Financial regulators need to audit algorithmic trading systems. Interpretability enables this verification.

### Right to Explanation

Emerging regulations in various jurisdictions establish rights to explanation for algorithmic decisions affecting individuals. The EU's AI Act and similar frameworks require transparency about AI decision-making in high-risk applications.

## Techniques

### Model-Agnostic Methods

These techniques work across different types of AI systems by analyzing input-output relationships:

- **SHAP (SHapley Additive exPlanations)**: Calculates how much each input feature contributes to the output using game-theoretic Shapley values
- **LIME (Local Interpretable Model-Agnostic Explanations)**: Approximates a model's behavior locally with simpler, interpretable models
- **Partial Dependency Plots**: Show the marginal effect of individual features on predictions
- **Feature Importance/Permutation Importance**: Measures performance decrease when feature values are shuffled

### Visualization Methods

- **Saliency Maps**: For image models, highlight which parts of an input image most influenced the classification
- **Attention Visualization**: For transformer models, display attention weights showing which input tokens influence outputs

### Interpretable-by-Design Models

Some approaches prioritize building inherently interpretable systems:

- **Concept Bottleneck Models**: Use human-understandable concepts as intermediate representations
- **Symbolic Regression**: Search for mathematical expressions that explain data relationships
- **Decision Trees and Rule-Based Systems**: Produce explicit, human-readable decision logic

### Mechanistic Interpretability

A newer approach focusing on reverse-engineering the internal computations of neural networks by identifying meaningful circuits, features, and representations within trained models. This research, pioneered by organizations including Anthropic and independent researchers, aims to understand not just what models do but how they do it at a mechanistic level.

## Challenges

### Faithfulness vs. Plausibility

Explanations can be plausible to humans without accurately reflecting the model's actual reasoning. A key challenge is ensuring explanations are "faithful"—truly representing the computational process—rather than merely convincing.

### Scalability

As models grow to billions or trillions of parameters, comprehensive interpretability becomes increasingly difficult. Current techniques often provide only partial insights into model behavior.

### Language Model Explanations

Large language models can generate explanations of their reasoning, but these may not accurately reflect their internal processes. Models may confabulate plausible-sounding but incorrect explanations.

### Tradeoffs with Performance

Historically, more interpretable models (like decision trees) have been less capable than black-box models (like deep neural networks). Recent research challenges this assumption, but tensions between interpretability and capability remain in some domains.

## Current State (2025-2026)

Interpretability has become a regulatory requirement in many jurisdictions. The EU AI Act mandates transparency and explainability for high-risk AI systems. Research has expanded from post-hoc explanation methods toward mechanistic understanding of model internals.

The field increasingly focuses on "AI safety via interpretability"—using interpretability tools to verify alignment and detect potential risks before deployment. Major AI labs maintain dedicated interpretability research teams, recognizing the technique's importance for building trustworthy AI systems.

## See Also

- [[ai-safety]]
- [[alignment-problem]]
- [[ai-governance]]
- [[red-teaming-ai]]

## References

1. Wikipedia. "Explainable artificial intelligence." Accessed February 2026.
2. Molnar, Christoph. *Interpretable Machine Learning*, 2022.
3. Doshi-Velez, Finale and Kim, Been. "Towards A Rigorous Science of Interpretable Machine Learning." arXiv, 2017.
4. ISO/IEC TR 29119-11:2020. Software testing for AI-based systems.
