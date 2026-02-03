# Stable Diffusion

**Stable Diffusion** is a [[deep learning]] [[text-to-image model]] based on [[diffusion model|diffusion]] techniques, first released in August 2022. Developed collaboratively by researchers from CompVis Group at [[Ludwig Maximilian University of Munich]], [[Runway (company)|Runway]], and [[Stability AI]], it represents a landmark achievement in democratizing [[generative artificial intelligence]] by enabling image generation on consumer hardware. As the premier product of Stability AI, Stable Diffusion is considered a defining technology of the [[AI boom]].

## History

### Origins

Stable Diffusion originated from a project called Latent Diffusion, developed by researchers at Ludwig Maximilian University in [[Munich]] and [[Heidelberg University]]. Four of the original five authors—Robin Rombach, Andreas Blattmann, Patrick Esser, and Dominik Lorenz—subsequently joined Stability AI to develop future versions.

Development was led by Patrick Esser of Runway and Robin Rombach of CompVis, who had previously invented the [[latent diffusion model]] architecture underlying Stable Diffusion. [[Stability AI]] credited [[EleutherAI]] and [[LAION]] (a German nonprofit that assembled the training dataset) as key supporters.

### Public Release

The technical license was released by the CompVis group at Ludwig Maximilian University on August 22, 2022. Unlike proprietary competitors such as [[DALL-E]] and [[Midjourney]], which operated exclusively through cloud services, Stable Diffusion made its code and model weights publicly available, enabling local deployment on consumer hardware.

### Version Evolution

**Version / Release Date / Key Features:**

- **SD 1.4**: Release Date: August 2022, Key Features: Initial public release, 512×512 resolution
- **SD 1.5**: Release Date: October 2022, Key Features: Improved quality and training
- **SD 2.0**: Release Date: November 2022, Key Features: Native 768×768 resolution
- **SD 2.1**: Release Date: December 2022, Key Features: Refined aesthetics
- **SDXL**: Release Date: July 2023, Key Features: Larger architecture, multiple aspect ratios
- **SD 3.0**: Release Date: 2024, Key Features: Rectified Flow Transformer backbone
- **SD 3.5**: Release Date: **October 22, 2024**, Key Features: Current stable release

## Technical Architecture

### Latent Diffusion Model (SD 1.x - SDXL)

Models before SD 3 utilize [[latent diffusion model]] (LDM) architecture, comprising three primary components:

1. **Variational Autoencoder (VAE)**: Compresses images from pixel space to a smaller-dimensional [[latent space]], capturing semantic meaning
2. **U-Net**: A [[ResNet]]-backbone network that denoises forward diffusion output to obtain latent representations
3. **Text Encoder**: Uses pretrained [[CLIP]] ViT-L/14 to transform text prompts into embedding space

During generation, Gaussian noise is iteratively applied to compressed latent representations, then the U-Net progressively denoises backward. The VAE decoder converts final latent representations to pixel-space images.

The base model contains 860 million parameters in the U-Net and 123 million in the text encoder—considered lightweight by 2022 standards, enabling operation on consumer [[GPU]]s with as little as 2.4 GB [[VRAM]].

### SDXL Architecture

SDXL maintains the LDM framework with expanded scale: a larger UNet backbone, expanded cross-attention context, two text encoders (versus one), and training across multiple aspect ratios rather than exclusively square outputs.

The **SDXL Refiner** shares SDXL's architecture but specializes in adding fine details to existing images through text-conditional img2img processing.

### Stable Diffusion 3 Architecture

SD 3.0 introduced a fundamental architectural change, replacing the UNet with a **Rectified Flow Transformer** implementing the rectified flow method. This **Multimodal Diffusion Transformer (MMDiT)** uses three processing tracks for original text encoding, transformed text encoding, and image encoding in latent space. Unlike previous DiT implementations where text affects image encoding unidirectionally, MMDiT enables bidirectional mixing of text and image encodings.

## Stable Diffusion 3.5

Released October 22, 2024, **Stable Diffusion 3.5** represents Stability AI's most capable image model, offering professional-grade generation across diverse styles.

### Model Variants

- **Large**: Maximum quality and prompt adherence at 1 megapixel resolution, designed for professional applications
- **Turbo**: Optimized for speed, generating high-quality images in approximately four denoising steps
- **Medium**: Balances quality with customization and efficiency, designed for consumer hardware deployment

### Capabilities

- **Versatile Styles**: Photography, painting, 3D rendering, line art, and diverse artistic approaches
- **Prompt Adherence**: Market-leading accuracy in translating text descriptions to visual output
- **Diverse Outputs**: Representation of varied people and scenes globally

## Training Data

Stable Diffusion was trained on image-text pairs from LAION-5B, a publicly available dataset derived from [[Common Crawl]] web scraping data. The dataset comprises 5 billion pairs classified by language and filtered by resolution, watermark likelihood, and predicted aesthetic scores.

Training utilized three LAION-5B subsets: laion2B-en, laion-high-resolution, and laion-aesthetics v2 5+. Final training rounds used LAION-Aesthetics v2 5+, containing 600 million images predicted to receive human aesthetic ratings of 5/10 or higher, excluding low-resolution images and those with >80% watermark probability.

The model was trained using 256 [[Nvidia A100]] GPUs on [[Amazon Web Services]] for 150,000 GPU-hours at approximately $600,000 total cost.

## Deployment Options

### Self-Hosting

Stable Diffusion's open weights enable local deployment, running on modest consumer GPUs or even CPU-only configurations using [[OpenVINO]]. This distinguishes it from proprietary cloud-only alternatives.

### Stability AI API

Developers can integrate Stable Diffusion models and editing tools via the Stability AI platform API (platform.stability.ai).

### Stable Assistant

Stability AI's web-based creative platform provides direct access to all models and editing tools without technical setup.

### Cloud Partners

Enterprise users can deploy through partner cloud ecosystems including major providers, avoiding additional infrastructure requirements.

## Licensing

Stable Diffusion operates under the **Stability AI Community License**, allowing broad usage while maintaining certain commercial restrictions. Organizations requiring deployment flexibility can obtain enterprise licenses directly from Stability AI.

## Limitations

Initial releases exhibited quality degradation when specifications deviated from trained 512×512 resolution. Human limb generation presents challenges due to training data quality issues. SD 2.0 introduced native 768×768 resolution support, while subsequent versions have progressively addressed these limitations.

## Cultural Impact

Stable Diffusion's open release transformed the AI image generation landscape, enabling:

- Community development of specialized models and fine-tunes
- Integration into creative workflows across industries
- Academic research into diffusion model capabilities
- Democratized access to generative AI technology

## See Also

- [[Midjourney]]
- [[DALL-E]]
- [[Text-to-image model]]
- [[Diffusion model]]
- [[Latent diffusion model]]
- [[Stability AI]]
- [[Generative artificial intelligence]]

## References

1. Stability AI. "Stable Diffusion 3.5." stability.ai/stable-image. Accessed February 2026.
2. "Stable Diffusion." Wikipedia. Accessed February 2026.
3. Rombach, R., et al. "High-Resolution Image Synthesis with Latent Diffusion Models." CVPR 2022.
4. Stability AI GitHub Repository. github.com/Stability-AI/generative-models.
5. LAION. "LAION-5B: An Open Large-Scale Dataset for Training Next Generation Image-Text Models." 2022.
6. Stability AI Platform Documentation. platform.stability.ai.
