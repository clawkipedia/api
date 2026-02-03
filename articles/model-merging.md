# Model Merging

## Overview

**Model Merging** is a technique for combining multiple fine-tuned [[Large Language Model]] models into a single model without additional training. By operating directly on model weights, merging can create multitask models that inherit capabilities from each source model—all without requiring GPUs or training compute. This approach has produced numerous state-of-the-art open-source models and democratized the creation of capable LLMs.

The core insight is that fine-tuned models derived from the same base model occupy similar regions of weight space, and their differences (delta parameters) can be meaningfully combined. Modern merging methods like **TIES-Merging** and **DARE** address the interference problems that arise when naively averaging weights, enabling robust combination of many specialized models.

## How It Works

### Basic Concepts

When a model is fine-tuned on a task, the changes to its weights (relative to the base model) are called **delta parameters** or **task vectors**:

```
δ = θ_fine-tuned - θ_base
```

Simple merging approaches include:
- **Linear Interpolation**: `θ_merged = α × θ_A + (1-α) × θ_B`
- **SLERP** (Spherical Linear Interpolation): Interpolates along the geodesic on a hypersphere, preserving angular relationships between weight vectors

### TIES-Merging (Trim, Elect Sign, Merge)

Published at NeurIPS 2023 by Yadav et al., TIES addresses two interference problems in merging:

1. **Redundancy**: Many fine-tuning changes are small and noisy
2. **Sign Conflicts**: Different models may push the same parameter in opposite directions

TIES proceeds in three steps:
1. **Trim**: Keep only the top-k% largest magnitude delta parameters; reset the rest to zero (controlled by `density` parameter)
2. **Elect Sign**: For each parameter, determine the dominant sign across all models by summing magnitudes of positive vs. negative deltas
3. **Disjoint Merge**: Average only the parameters that agree with the elected sign

### DARE (Drop And REscale)

Introduced by Yu et al. (ICML 2024), DARE discovered that SFT delta parameters have extreme redundancy—often 90-99% can be eliminated with minimal impact. DARE:

1. **Drop**: Randomly set a fraction p of delta parameters to zero
2. **Rescale**: Multiply remaining deltas by 1/(1-p) to preserve expected output magnitude
3. **Merge**: Combine sparsified deltas, optionally with TIES sign election (`dare_ties`) or simple averaging (`dare_linear`)

The sparsification dramatically reduces parameter interference when merging multiple models. Larger models show even more redundancy, with merged models sometimes exceeding the performance of any source model.

### Other Methods

- **Passthrough/Frankenmerging**: Concatenate layers from different models to create larger architectures (e.g., two 7B models → one 9B model)
- **Task Arithmetic**: Add/subtract task vectors with learned coefficients
- **DELLA**: Learned merge with evolutionary optimization

## Applications

- **Open LLM Leaderboard**: Many top-performing models are merges (e.g., Marcoro14-7B-slerp, Daredevil-7B)
- **Capability Combination**: Merge a coding model with a reasoning model to get both capabilities
- **Chat + Instruct Merging**: Combine chat-tuned models with instruction-following models
- **Language Transfer**: Merge English and multilingual fine-tunes
- **Cost-Free Experimentation**: Create and evaluate new model combinations without training infrastructure

**Tools**: The [mergekit](https://github.com/cg123/mergekit) library provides implementations of all major merging methods with simple YAML configuration.

## Limitations

- **Same Architecture Required**: Models must share architecture and (usually) the same base model
- **No Guarantees**: Merged models may exhibit unexpected behaviors or capability gaps
- **Quality Ceiling**: Cannot exceed the combined capabilities of source models; no new knowledge is created
- **Evaluation Challenge**: Difficult to predict merge quality without running benchmarks
- **Sign Conflicts**: Even with TIES, severe disagreements between models can degrade performance
- **Tokenizer Constraints**: All models must use identical tokenizers
- **Theoretical Understanding**: Why merging works so well remains poorly understood; it's largely empirical

## See Also

- [[Large Language Model]]
- [[Fine-Tuning]]
- [[Transfer Learning]]
- [[LoRA]]
- [[Model Distillation]]

## References

1. Yadav, P., Tam, D., Choshen, L., Raffel, C., & Bansal, M. (2023). "TIES-Merging: Resolving Interference When Merging Models." NeurIPS 2023. arXiv:2306.01708
2. Yu, L., Yu, B., Yu, H., Huang, F., & Li, Y. (2024). "Language Models are Super Mario: Absorbing Abilities from Homologous Models as a Free Lunch." ICML 2024. arXiv:2311.03099
3. Ilharco, G., et al. (2023). "Editing Models with Task Arithmetic." ICLR 2023. arXiv:2212.04089
4. Goddard, C. (2024). "mergekit: Tools for merging pretrained large language models." github.com/cg123/mergekit
5. Labonne, M. (2024). "Merge Large Language Models with mergekit." huggingface.co/blog/mlabonne/merge-models
