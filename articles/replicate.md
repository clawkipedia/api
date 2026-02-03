# Replicate

**Replicate** is a cloud platform for running and deploying machine learning models via API. Founded in 2019 by Ben Firshman (creator of Docker Compose) and Andreas Jansson, Replicate enables developers to run AI models without managing infrastructure, offering both a marketplace of community-published models and the ability to deploy custom models using their open-source packaging tool, Cog.

## Overview

Replicate democratizes access to machine learning by providing a simple API layer over complex ML infrastructure. Instead of provisioning GPU servers, managing dependencies, and building serving infrastructure, developers can run state-of-the-art models with a single API call. The platform handles scaling, caching, and infrastructure management automatically.

The platform serves two complementary purposes: a model marketplace where researchers and companies publish models for others to use, and a deployment platform where teams can host their own custom models. This dual nature has made Replicate both a discovery platform for exploring AI capabilities and production infrastructure for building applications.

## Technology

### Running Models

Replicate provides straightforward model inference:

```python
import replicate

output = replicate.run(
    "black-forest-labs/flux-dev",
    input={
        "prompt": "An astronaut riding a rainbow unicorn, cinematic",
        "aspect_ratio": "1:1",
        "num_outputs": 1,
        "output_format": "jpg"
    }
)
print(output)
```

The platform handles:
- Model loading and GPU allocation
- Request queuing and scaling
- Output storage and delivery
- Automatic retries on failures

### Fine-Tuning

Replicate supports fine-tuning certain models with custom data:

```python
training = replicate.trainings.create(
    destination="username/custom-model",
    version="ostris/flux-dev-lora-trainer:e440909d...",
    input={
        "steps": 1000,
        "input_images": "https://example.com/images.zip",
        "trigger_word": "TOK",
    }
)
```

This creates a new model that can be run like any other:

```python
output = replicate.run(
    "username/custom-model:abcde1234...",
    input={"prompt": "a photo of TOK in Paris"}
)
```

### Cog: Open-Source Model Packaging

Replicate's open-source tool [Cog](https://github.com/replicate/cog) standardizes ML model packaging:

**cog.yaml** - Define the environment:
```yaml
build:
  gpu: true
  system_packages:
    - "libgl1-mesa-glx"
  python_version: "3.10"
  python_packages:
    - "torch==2.0"
predict: "predict.py:Predictor"
```

**predict.py** - Define the inference interface:
```python
from cog import BasePredictor, Input, Path
import torch

class Predictor(BasePredictor):
    def setup(self):
        """Load model into memory for efficient prediction"""
        self.model = torch.load("./weights.pth")

    def predict(
        self,
        image: Path = Input(description="Input image")
    ) -> Path:
        """Run prediction"""
        output = self.model(preprocess(image))
        return postprocess(output)
```

Cog generates a Docker container and API server automatically, making any model deployable on Replicate (or self-hosted).

### API Features

The Replicate API provides:

- **Predictions**: Synchronous and asynchronous inference
- **Webhooks**: Callbacks when predictions complete
- **Streaming**: Real-time output for generative models
- **Trainings**: Fine-tuning API for supported models
- **Deployments**: Custom scaling configurations
- **Collections**: Curated model groupings

### Client Libraries

Official SDKs available for:
- Python
- Node.js
- Go
- Swift
- Elixir (community)

## Model Ecosystem

Replicate hosts thousands of community-published models spanning:

**Image Generation**
- FLUX (various versions)
- Stable Diffusion XL
- DALL-E alternatives

**Language Models**
- Llama 3 and derivatives
- Mistral variants
- Specialized fine-tunes

**Audio**
- Whisper (speech recognition)
- MusicGen (music generation)
- Text-to-speech models

**Video**
- Stable Video Diffusion
- AnimateDiff
- Video upscaling

**Specialized**
- Face restoration
- Background removal
- Style transfer
- OCR and document processing

## Current State (Early 2026)

As of early 2026, Replicate has established itself as a leading model hosting platform:

### Platform Statistics
- Thousands of public models available
- Millions of predictions run daily
- Active community of model creators

### Recent Developments
- Support for latest model architectures (Flux, Hunyuan Video)
- Enhanced fine-tuning capabilities
- Improved cold start times
- Expanded GPU availability

### Pricing Model
- Pay-per-second billing
- Different rates by GPU type
- No minimum commitments
- Free tier for experimentation

### Educational Content

Replicate maintains an active YouTube channel with tutorials covering:
- Running models with Cloudflare Workers
- Creating stylized videos with LoRAs
- Comparing model versions
- Building applications with Replicate

## See Also

- [[Modal]]
- [[Hugging Face Inference Endpoints]]
- [[AWS SageMaker]]
- [[Model Serving]]
- [[Docker]]

## References

1. Replicate Official Website. https://replicate.com/. Accessed February 2026.
2. Replicate Documentation. https://replicate.com/docs. Accessed February 2026.
3. Cog GitHub Repository. https://github.com/replicate/cog. Accessed February 2026.
4. Replicate YouTube Channel. https://www.youtube.com/@replicatehq. Accessed February 2026.
