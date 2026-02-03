# Weights & Biases

**Weights & Biases** (W&B) is a machine learning operations (MLOps) platform for experiment tracking, model versioning, dataset management, and team collaboration. Founded in 2017 by Lukas Biewald, Chris Van Pelt, and Shawn Lewis, it has become the industry standard for ML experiment tracking, used by researchers and ML engineers at organizations ranging from academic labs to Fortune 500 companies.

## Overview

Weights & Biases addresses a fundamental challenge in machine learning: experiments are complex, iterative processes that generate massive amounts of data—hyperparameters, metrics, model weights, datasets, code versions, and artifacts. Without proper tooling, this information becomes scattered across notebooks, spreadsheets, and Slack messages, making reproducibility and collaboration nearly impossible.

W&B provides a unified platform that automatically captures experiment metadata and presents it through interactive dashboards. The philosophy is to integrate seamlessly into existing workflows with minimal code changes while providing comprehensive observability into the ML development process.

## Technology

### Core Products

#### Experiments (wandb.init)

The foundation of W&B is experiment tracking:

```python
import wandb

with wandb.init(project="my-project", config={"epochs": 100, "lr": 3e-4}) as run:
    for epoch in range(100):
        # Training code
        run.log({"accuracy": 0.9, "loss": 0.1})
```

Key features:
- Automatic logging of system metrics (GPU utilization, memory)
- Hyperparameter tracking and comparison
- Interactive charts and visualizations
- Code version capture
- Media logging (images, audio, video, 3D objects)

#### Sweeps

Hyperparameter optimization with distributed execution:
- Bayesian optimization, grid search, random search
- Early stopping strategies
- Parallel agent execution across machines

#### Artifacts

Dataset and model versioning:
- Track data lineage through ML pipelines
- Version datasets with deduplication
- Cache and reproduce any experiment's exact state

#### Tables

Interactive data exploration:
- Visualize and compare predictions
- Filter and sort by any column
- Share insights with team members

#### Reports

Collaborative documentation:
- Embed live charts and tables
- Write analysis alongside visualizations
- Share findings with stakeholders

### Weave

Introduced for the LLM era, Weave provides specialized tooling for generative AI applications:

- **Tracing**: Track LLM calls, prompts, and completions
- **Evaluation**: Systematic evaluation of LLM outputs
- **Monitoring**: Production observability for LLM apps
- **Debugging**: Identify failure modes and edge cases

### Integrations

W&B integrates with virtually every ML framework:

**Deep Learning**
- [[PyTorch]], [[PyTorch Lightning]]
- [[TensorFlow]], [[Keras]]
- [[JAX]], [[Flax]]
- [[Hugging Face Transformers]]

**Classical ML**
- scikit-learn
- XGBoost, LightGBM
- CatBoost

**LLM Frameworks**
- [[LangChain]]
- [[LlamaIndex]]
- OpenAI, Anthropic APIs

**Infrastructure**
- [[SageMaker]], [[Vertex AI]]
- Ray, Kubeflow
- Docker, Kubernetes

## Hosting Options

W&B offers flexible deployment:

1. **Multi-tenant Cloud**: Fully managed on GCP (North America)
2. **Dedicated Cloud**: Single-tenant, managed deployment on AWS, GCP, or Azure
3. **Self-Managed**: Deploy on your own infrastructure (cloud or on-premises)

This flexibility makes W&B suitable for organizations with varying security and compliance requirements.

## Current State (Early 2026)

As of early 2026, Weights & Biases has established itself as the leading ML experiment tracking platform:

### Adoption
- Used by 80%+ of ML research papers at major conferences
- Deployed at most top AI labs and tech companies
- Strong presence in both research and production ML

### Recent Developments
- Weave platform for LLM application development
- Enhanced model registry for production deployment
- Improved collaboration features for larger teams
- Expanded self-hosted deployment options

### Python Support

W&B commits to supporting Python versions for at least six months after their official end-of-life date, with library minor version increments when support is discontinued.

## Community

W&B maintains an active community:
- **Discord**: Real-time support and discussion
- **W&B Fully Connected**: Newsletter and content hub
- **GitHub**: Open-source client library (MIT License)

## See Also

- [[MLflow]]
- [[Neptune.ai]]
- [[Comet ML]]
- [[TensorBoard]]
- [[MLOps]]

## References

1. Weights & Biases Official Website. https://wandb.ai/site. Accessed February 2026.
2. Weights & Biases GitHub Repository. https://github.com/wandb/wandb. Accessed February 2026.
3. Weights & Biases Developer Guide. https://docs.wandb.ai/. Accessed February 2026.
4. Weave Documentation. https://wandb.github.io/weave. Accessed February 2026.
