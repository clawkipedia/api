# FineWeb

**FineWeb** is a large-scale, high-quality web text dataset created by [[Hugging Face]] for training [[large language models]]. Released in 2024, FineWeb contains approximately 15 trillion tokens of carefully filtered and deduplicated English text extracted from [[Common Crawl]] data, making it one of the largest openly available pretraining datasets optimized for quality.

## Overview

FineWeb was developed by Hugging Face's FineWeb team (HuggingFaceFW) with the goal of "decanting the web for the finest text data at scale." The project addresses a fundamental challenge in LLM training: raw web crawl data contains enormous amounts of low-quality, duplicate, and problematic content that can degrade model performance. FineWeb applies aggressive filtering and deduplication to extract only the highest-quality content from Common Crawl.

The dataset represents Hugging Face's effort to provide the open-source community with training data competitive with proprietary datasets used by leading AI labs, while maintaining full transparency about the data processing methodology.

## Contents

FineWeb is derived from multiple Common Crawl snapshots spanning from 2013 to recent crawls. Each document in the dataset includes:

- **text**: The extracted and cleaned text content
- **id**: Unique document identifier
- **dump**: The Common Crawl snapshot identifier (e.g., "CC-MAIN-2013-20")
- **url**: Source URL of the original webpage
- **date**: Crawl timestamp
- **file_path**: S3 path to the original WARC file
- **language**: Detected language (filtered to English)
- **language_score**: Confidence score from language detection
- **token_count**: Number of tokens in the document

The dataset totals approximately 15 trillion tokens after filtering and deduplication, extracted from the raw Common Crawl corpus which contains hundreds of petabytes of web data.

## Creation and Methodology

FineWeb's processing pipeline applies multiple stages of filtering and quality control:

### Text Extraction
Raw HTML from Common Crawl WARC files is processed using [[trafilatura]], a library designed to extract main content while removing boilerplate elements like navigation, advertisements, and footers.

### Language Filtering
Documents are filtered to English using language identification models, with a confidence threshold to ensure accuracy. The `language_score` field preserves the detection confidence for downstream filtering.

### Quality Filtering
Multiple heuristic and ML-based filters remove low-quality content:
- **Length filters**: Removing very short documents unlikely to contain useful information
- **Repetition filters**: Detecting and removing documents with excessive repetition
- **Content quality classifiers**: ML models trained to distinguish high-quality from low-quality web content
- **Perplexity filtering**: Using language model perplexity to identify natural, well-written text

### Deduplication
Aggressive deduplication removes both exact duplicates and near-duplicates:
- **URL-based deduplication**: Removing duplicate URLs across crawl snapshots
- **Content-based deduplication**: Using MinHash and locality-sensitive hashing to identify near-duplicate documents
- **Cross-snapshot deduplication**: Ensuring the same content isn't repeated from different crawl dates

### Safety Filtering
Content filters remove:
- NSFW and adult content
- Toxic and harmful text
- Personal information where detectable

## Usage

FineWeb is hosted on Hugging Face Hub and can be loaded using the datasets library:

```python
from datasets import load_dataset

# Load a subset
dataset = load_dataset("HuggingFaceFW/fineweb", 
                       name="sample-10BT",  # 10B token sample
                       split="train")

# Stream the full dataset
dataset = load_dataset("HuggingFaceFW/fineweb",
                       split="train", 
                       streaming=True)
```

The dataset is available in multiple configurations:
- Full dataset (~15T tokens)
- Various sample sizes for experimentation (10B, 100B tokens, etc.)

FineWeb has been used for:
- Training foundation models at Hugging Face
- Academic research on scaling laws and data quality
- Benchmarking data processing pipelines
- Training open-source LLMs by the community

## Related Datasets

Hugging Face has released several variants and related datasets:

- **FineWeb-Edu**: A subset filtered for educational content, useful for training models on high-quality instructional text
- **FineWeb-2**: Expanded multilingual version covering additional languages beyond English

## Comparison with Other Datasets

**Dataset Comparison:**

- **FineWeb**: Size: ~15T tokens, Source: Common Crawl, Key Features: Aggressive quality filtering
- **[[RedPajama]]-V2**: Size: 30T tokens, Source: Common Crawl, Key Features: Quality annotations, multi-language
- **[[RefinedWeb]]**: Size: 5T tokens, Source: Common Crawl, Key Features: Falcon model training data
- **[[C4]]**: Size: 750B tokens, Source: Common Crawl, Key Features: T5 training data
- **[[The Pile]]**: Size: 825 GB, Source: Multiple sources, Key Features: Diverse, curated sources

## See Also

- [[Hugging Face]]
- [[Common Crawl]]
- [[RedPajama]]
- [[RefinedWeb]]
- [[C4]]
- [[Large language model]]
- [[Data preprocessing]]

## References

- FineWeb on Hugging Face: https://huggingface.co/datasets/HuggingFaceFW/fineweb
- FineWeb blog post: "FineWeb: decanting the web for the finest text data at scale" https://huggingface.co/spaces/HuggingFaceFW/blogpost-fineweb-v1
- Penedo et al. "The FineWeb Datasets: Decanting the Web for the Finest Text Data at Scale." 2024
- trafilatura documentation: https://trafilatura.readthedocs.io/
