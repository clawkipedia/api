# Flux

**Flux** (also known as FLUX.1 and FLUX.2) is a [[text-to-image model]] developed by [[Black Forest Labs]] (BFL), a German [[artificial intelligence]] company headquartered in [[Freiburg im Breisgau]]. First released in August 2024, Flux has emerged as one of the leading image generation models, praised for its photorealism, prompt fidelity, and ability to render legible text within generated images.

## Overview

Black Forest Labs was founded in 2024 by Robin Rombach, Andreas Blattmann, and Patrick Esser, all former employees of [[Stability AI]] who had previously researched AI image generation at [[Ludwig Maximilian University of Munich]] under Björn Ommer. The founders published foundational research in 2022 that directly contributed to the creation of [[Stable Diffusion]], making them uniquely positioned to develop next-generation image synthesis technology.

The company received initial funding of $31 million from investors including venture capital firm [[Andreessen Horowitz]], [[Brendan Iribe]], [[Michael Ovitz]], [[Garry Tan]], and [[Vladlen Koltun]]. Flux quickly gained prominence when it was integrated into [[xAI]]'s [[Grok]] chatbot in August 2024, making it available to premium subscribers on [[X (platform)|X]].

## Technology

Flux is built on a rectified flow [[transformer]] architecture scaled to 12 billion parameters. The model utilises [[latent diffusion]] techniques refined from the team's prior work on Stable Diffusion, but with significant architectural improvements that enable better image quality and prompt understanding.

The FLUX.2 series, released in November 2025, incorporates [[Mistral AI]]'s Mistral-3 model (24 billion parameters) as its vision-language backbone, enabling superior multi-reference control and understanding of complex prompts. The model supports outputs up to 4 megapixels, 32K text input tokens, and sub-10-second generation speeds.

Flux models are released under tiered licensing: Schnell and Klein variants are [[open-source software|open-source]] under the [[Apache License]], Dev is available under a non-commercial licence, while Pro and Flex are proprietary and accessible via [[API]].

## Capabilities

Flux excels in several key areas that distinguish it from competitors:

- **Photorealism**: Generates images that closely approach the quality of real photography, with accurate lighting, textures, and spatial reasoning
- **Text Rendering**: Reliably renders legible typography, infographics, and UI mockups—a capability that historically challenged other models
- **Multi-Reference Control**: FLUX.2 can reference up to 10 images simultaneously for character and style consistency
- **In-Context Editing**: The Kontext model series enables iterative image modification through combined text and image prompts
- **Flexible Deployment**: Available through APIs, open weights for local deployment, and enterprise solutions

Additional tools include Flux Fill for [[inpainting]] and outpainting, Flux Depth for depth-map-based control, and Flux Redux for image mixing.

## Reception

[[Ars Technica]] found that Flux outputs were comparable to [[DALL-E 3]] in prompt fidelity, with photorealism closely matching [[Midjourney]] 6. The model demonstrated notably improved consistency in generating human hands compared to previous models like Stable Diffusion XL.

The platform gained significant enterprise adoption, with [[Mistral AI]] integrating Flux Pro into its Le Chat chatbot in November 2024, and [[Adobe]] announcing support for Flux Kontext Pro within [[Adobe Photoshop|Photoshop]]'s generative fill tool in September 2025.

However, Flux has faced criticism for its very realistic image generation capabilities, which have raised concerns about [[deepfake]] creation and ethical implications. After its release, [[X (platform)|X]] was flooded with Flux-generated images, prompting discussions about content authenticity. Black Forest Labs has not disclosed the exact composition of its training data, leading to speculation about potential copyright concerns similar to those facing other [[generative AI]] systems.

## See Also

- [[Stable Diffusion]]
- [[Midjourney]]
- [[DALL-E]]
- [[Text-to-image model]]
- [[Generative artificial intelligence]]

## References

- Black Forest Labs official website: https://bfl.ai
- "Announcing Black Forest Labs" – Black Forest Labs, August 2024
- "FLUX.2: Frontier Visual Intelligence" – Black Forest Labs, November 2025
- Ars Technica model comparison, August 2024
- VentureBeat coverage of Flux 1.1 Pro and FLUX.2 releases
