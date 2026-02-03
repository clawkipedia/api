# Hugging Face Transformers

**Hugging Face Transformers** is an open-source library providing state-of-the-art pretrained models for natural language processing, computer vision, audio, video, and multimodal tasks. Launched in 2018, it has become the definitive model-definition framework in machine learning, serving as the central pivot point between training frameworks, inference engines, and model repositories.

## Overview

Transformers occupies a unique position in the ML ecosystem: it defines *how models are structured* in a way that is agreed upon across the entire industry. When a model architecture is supported in Transformers, it automatically becomes compatible with training frameworks (Axolotl, Unsloth, [[DeepSpeed]], FSDP, PyTorch-Lightning), inference engines ([[vLLM]], SGLang, TGI), and conversion tools (llama.cpp, MLX).

The library's mission is to democratize state-of-the-art AI by making cutting-edge models simple, customizable, and efficient. With over 1 million model checkpoints available on the [[Hugging Face Hub]], developers can find and deploy models for virtually any ML task.

## Technology

### Core Design

Transformers is built around three primary abstractions:

1. **Configuration**: Defines model architecture and hyperparameters
2. **Model**: The actual neural network implementation
3. **Preprocessor**: Tokenizers, feature extractors, and processors for input data

This minimal abstraction layer keeps the codebase accessible—model implementations are intentionally not refactored into complex hierarchies, allowing researchers to quickly understand and modify any model.

### Pipeline API

The high-level Pipeline API enables inference in just a few lines:

```python
from transformers import pipeline

# Text generation
pipe = pipeline("text-generation", model="Qwen/Qwen2.5-1.5B")
pipe("The secret to a good cake is")

# Image classification
pipe = pipeline("image-classification", model="facebook/dinov2-small-imagenet1k-1-layer")
pipe("image.jpg")

# Automatic speech recognition
pipe = pipeline("automatic-speech-recognition", model="openai/whisper-large-v3")
pipe("audio.mp3")
```

### Supported Tasks

Transformers supports an extensive range of tasks:

**Natural Language Processing**
- Text generation and chat
- Translation and summarization
- Question answering
- Named entity recognition
- Sentiment analysis

**Computer Vision**
- Image classification and segmentation
- Object detection
- Depth estimation
- Pose estimation
- Video classification

**Audio**
- Speech recognition
- Text-to-speech
- Audio classification
- Music generation

**Multimodal**
- Visual question answering
- Document understanding
- Image captioning
- OCR

### Framework Interoperability

Models can move seamlessly between [[PyTorch]], [[JAX]], and TensorFlow:

```python
from transformers import AutoModel

# Load in PyTorch
model = AutoModel.from_pretrained("bert-base-uncased")

# Convert to JAX
model_jax = AutoModel.from_pretrained("bert-base-uncased", from_pt=True)
```

### Training Integration

While Transformers focuses on model definition, it integrates with training tools:

- **Trainer**: Built-in training class with mixed precision, torch.compile, and distributed training
- **Accelerate**: Hugging Face's library for distributed training across hardware
- **PEFT**: Parameter-efficient fine-tuning (LoRA, QLoRA, etc.)

## Current State (Early 2026)

As of early 2026, Transformers v5.x is the current major version:

- Over 1 million model checkpoints on Hugging Face Hub
- Requires Python 3.9+ and PyTorch 2.1+
- Native support for latest architectures including Llama 4, Gemma 3, and Qwen 2.5
- Enhanced chat capabilities with `transformers chat` CLI command
- `transformers serve` for running local API servers

The library maintains a Models Timeline documenting the evolution of supported architectures, reflecting its role as the historical record of open-source ML progress.

## Ecosystem

Transformers is the hub of the broader Hugging Face ecosystem:

- **Hugging Face Hub**: Model hosting and discovery platform
- **Datasets**: Standardized dataset loading library
- **Evaluate**: Metrics and evaluation library
- **Diffusers**: Diffusion models for image/video generation
- **Optimum**: Hardware optimization and quantization

## See Also

- [[Hugging Face Hub]]
- [[PyTorch]]
- [[BERT]]
- [[GPT]]
- [[Model Fine-tuning]]

## References

1. Hugging Face Transformers Documentation. https://huggingface.co/docs/transformers/index. Accessed February 2026.
2. Hugging Face Transformers GitHub Repository. https://github.com/huggingface/transformers. Accessed February 2026.
3. Wolf, Thomas, et al. "Transformers: State-of-the-Art Natural Language Processing." Proceedings of EMNLP 2020. DOI: 10.5281/zenodo.3523942.
