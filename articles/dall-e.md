# DALL-E

**DALL-E** (stylized DALL·E) is a series of [[text-to-image model|text-to-image models]] developed by [[OpenAI]] using [[deep learning]] methodologies to generate digital images from natural language descriptions known as [[prompt engineering|prompts]]. The name is a portmanteau of the animated robot [[WALL-E]] and Spanish surrealist artist [[Salvador Dalí]].

## Overview

DALL-E represents OpenAI's pioneering work in image generation AI. The first version was announced in January 2021, followed by DALL-E 2 in April 2022 and DALL-E 3 in September 2023. DALL-E 3 was integrated natively into [[ChatGPT]] for Plus and Enterprise customers in October 2023, and Microsoft implemented it in Bing's Image Creator and [[Microsoft Copilot]].

In March 2025, DALL-E 3 was replaced in ChatGPT by [[GPT Image]]'s native image-generation capabilities, marking a transition to next-generation OpenAI image models.

## History

### DALL-E (2021)
The original DALL-E was revealed on January 5, 2021, using a modified version of [[GPT-3]]. It demonstrated the ability to generate diverse imagery from text descriptions, blending concepts in creative ways.

### DALL-E 2 (2022)
Announced April 6, 2022, DALL-E 2 generated more realistic images at higher resolutions, capable of combining concepts, attributes, and styles. Key milestones:
- **July 20, 2022**: Beta launch with invitations to 1 million waitlisted users
- **September 28, 2022**: Waitlist removed, open to everyone
- **November 2022**: API released for developer integration

Microsoft integrated DALL-E 2 into their Designer app and Bing/Edge Image Creator tools.

### DALL-E 3 (2023)
Released September 2023, DALL-E 3 represents a major leap in prompt adherence and image quality. Unlike earlier text-to-image systems that often ignored words or required extensive [[prompt engineering]], DALL-E 3 generates images that exactly match provided descriptions.

In February 2024, OpenAI began adding C2PA watermarks to DALL-E-generated images for provenance verification.

## Technology

### DALL-E Architecture
The original DALL-E has three components:
1. **Discrete VAE**: Converts images to/from token sequences for Transformer processing
2. **Autoregressive Transformer**: 12 billion parameter decoder-only model similar to GPT-3
3. **CLIP Pair**: Image encoder and text encoder for ranking outputs

Images are processed as 256×256 RGB images divided into 32×32 patches (4×4 pixels each), converted to tokens via variational autoencoder.

### DALL-E 2 Architecture
Uses 3.5 billion parameters (smaller than DALL-E 1) and replaces the autoregressive Transformer with a [[diffusion model]] conditioned on CLIP image embeddings. This architecture parallels [[Stable Diffusion]].

### DALL-E 3
While a technical report was published, it focused on improved prompt-following capabilities rather than training details. The model shows dramatically improved text rendering and literal interpretation of prompts.

## Capabilities

DALL-E can generate imagery in multiple styles including photorealistic images, paintings, and emoji. Notable capabilities include:

- **Concept Blending**: Combining disparate ideas (e.g., "teddy bears working on AI research underwater with 1990s technology")
- **Inference**: Appropriately adding details not explicitly mentioned, like Christmas imagery or shadows
- **Visual Reasoning**: Sufficient to solve Raven's Progressive Matrices (visual intelligence tests)
- **Multiple Viewpoints**: Generating arbitrary descriptions from various perspectives
- **Text Generation**: DALL-E 3 produces coherent, accurate text within images

Mark Riedl, associate professor at Georgia Tech, noted DALL-E's ability to blend concepts—considered a key element of human creativity.

## Integration with ChatGPT

DALL-E 3's ChatGPT integration allows conversational image generation:
- Describe ideas in natural language, from simple sentences to detailed paragraphs
- ChatGPT automatically generates tailored prompts for DALL-E 3
- Request tweaks to generated images through conversation
- Images are owned by users with no permission required for reprinting, selling, or merchandising

## Safety and Restrictions

DALL-E 3 includes mitigations to:
- Decline requests for public figures by name
- Reduce harmful biases related to visual representation
- Restrict generation in the style of living artists
- Implement provenance classification for AI-generated image detection

OpenAI works with red teamers and domain experts to stress-test models for risks related to propaganda and misinformation.

## See Also

- [[OpenAI]]
- [[ChatGPT]]
- [[Midjourney]]
- [[Stable Diffusion]]
- [[Text-to-image model]]
- [[GPT Image]]

## References

1. OpenAI. "DALL·E 3." https://openai.com/index/dall-e-3/. Accessed February 2026.
2. Wikipedia. "DALL-E." https://en.wikipedia.org/wiki/DALL-E. Accessed February 2026.
