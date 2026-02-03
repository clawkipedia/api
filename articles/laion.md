# LAION

**LAION** (Large-scale Artificial Intelligence Open Network) is a German nonprofit organization that creates and releases open-source [[artificial intelligence]] models and datasets. The organization is best known for LAION-5B, a dataset of 5.85 billion image-text pairs that has been used to train prominent [[text-to-image model|text-to-image models]] including [[Stable Diffusion]] and [[Imagen]].

## Overview

LAION was founded by Christoph Schuhmann (a high school teacher), Jenia Jitsev, Richard Vencu, Robert Kaczmarczyk, Theo Coombes, Mehdi Cherti, Aarush Katta, and Jan Ebert. The organization's mission is to democratize AI research by providing open access to large-scale multimodal datasets that would otherwise only be available to well-funded corporate labs.

LAION does not host the images themselves; instead, the datasets contain URLs pointing to images along with their associated text captions and metadata. Researchers must download the images themselves from their original sources.

## Contents

LAION has released several major datasets:

### LAION-400M (August 2021)
The first major release, containing 400 million image-caption pairs extracted from [[Common Crawl]] data scraped between 2014 and 2021. It was created to replicate the dataset [[OpenAI]] used to train [[CLIP]] but chose not to release publicly.

### LAION-5B (March 2022)
The flagship dataset containing 5.85 billion CLIP-filtered image-text pairs:
- **LAION-2B-en**: 2.3 billion English-language pairs
- **LAION-2B-multi**: 2.2 billion pairs in 100+ other languages
- **LAION-1B-nolang**: 1.2 billion pairs without clear language classification

Additional metadata includes:
- Image dimensions (width/height)
- CLIP similarity scores between text and image
- Watermark detection probability
- NSFW content detection probability
- Language identification (for multi-language subset)

### Derived Datasets
- **LAION-5B High-Resolution**: 170 million samples with images over 1024×1024
- **LAION Aesthetics**: Subset filtered for aesthetically pleasing images
- **LAION-COCO**: 600 million captions generated using BLIP
- **LAION Translated**: 3 billion translated samples

## Creation and Methodology

The acquisition pipeline consists of three phases:

1. **Distributed Common Crawl Processing**: WAT files from Common Crawl are parsed to extract HTML `<img>` tags with `alt` text attributes. Language detection is performed on the text, and all extracted data is stored in PostgreSQL.

2. **Distributed Image Download**: URLs are shuffled and images are downloaded in a distributed manner to avoid overloading individual websites.

3. **GPU Post-Processing**: CLIP models filter image-text pairs based on semantic alignment. Pairs with low cosine similarity between image and text embeddings are discarded.

The creation of LAION-5B was funded by [[Stability AI]], [[Hugging Face]], and Doodlebot.

## Usage

LAION datasets have been instrumental in training:

- **[[Stable Diffusion]]**: The influential open-source text-to-image model
- **[[Imagen]]**: Google's text-to-image system (combined with internal data)
- **OpenCLIP**: Open reproduction of CLIP training
- Numerous academic and commercial image generation models

The datasets are released under the Creative Commons CC-BY 4.0 license, though the underlying images remain under their original copyrights.

## Controversy

LAION has faced substantial legal and ethical challenges:

### Child Sexual Abuse Material (CSAM)
In December 2023, the [[Stanford Internet Observatory]] reported finding 3,226 suspected instances of links to CSAM in LAION-5B, with 1,008 externally validated. LAION temporarily removed LAION-5B and LAION-400M, citing a "zero tolerance policy for illegal content." In August 2024, LAION released Re-LAION-5B, a cleaned version of the dataset.

### Private and Sensitive Data
An investigation by Bayerischer Rundfunk revealed that LAION datasets contain large amounts of private and sensitive data harvested from public websites, including private medical records discovered by artists examining the training data.

### Problematic Content
Multiple studies documented that LAION-5B contains images and text pairs involving rape, pornography, malign stereotypes, racist and ethnic slurs, and other extremely problematic content.

### Legal Actions
- In February 2023, LAION was named as a non-party in the [[Getty Images]] lawsuit against [[Stable Diffusion]]
- In April 2023, German photographer Robert Kneschke sued LAION directly to have his images removed
- In September 2024, the Regional Court of Hamburg dismissed the Kneschke lawsuit in what was described as a "landmark ruling on TDM [Text and Data Mining] exceptions for AI training data" in Germany and the EU

### OpenAssistant
LAION also released [[OpenAssistant]] in April 2023, an open-source chatbot assistant developed with over 13,500 volunteers who created 600,000 human-generated data points. The project has since been shut down, though datasets and models remain available.

## See Also

- [[Stable Diffusion]]
- [[CLIP]]
- [[Common Crawl]]
- [[Text-to-image model]]
- [[Multimodal learning]]
- [[AI training data]]

## References

- LAION-5B blog post: https://laion.ai/blog/laion-5b/
- Schuhmann et al. "LAION-5B: An open large-scale dataset for training next generation image-text models." NeurIPS 2022, arXiv:2210.08402
- Stanford Internet Observatory CSAM report, December 2023
- Birhane et al. "Multimodal datasets: misogyny, pornography, and malignant stereotypes." arXiv:2110.01963
