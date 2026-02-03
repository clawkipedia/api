# RedPajama

**RedPajama** is a family of open datasets for training [[large language models]], developed by [[Together AI]]. The project began as an effort to reproduce the training data behind [[Meta AI]]'s [[LLaMA]] model and has evolved into one of the largest publicly available LLM training datasets, with RedPajama-V2 containing over 30 trillion tokens from 84 [[Common Crawl]] snapshots.

## Overview

RedPajama was created to address a critical gap in open-source AI: while models like LLaMA released their weights, the training data remained proprietary. By recreating and expanding upon these training datasets, RedPajama aims to democratize LLM development by providing researchers and developers with the same quality of training data available to major AI labs.

The project embodies a philosophy of providing raw data with extensive quality annotations, allowing downstream users to filter and weight the data according to their specific needs rather than imposing a single filtering methodology.

## Contents

### RedPajama-V1 (March 2023)
The original release containing approximately 1.2 trillion tokens of high-quality English text, designed to replicate the LLaMA training mixture:

- **Common Crawl**: Web text filtered using CCNet pipeline
- **C4**: Google's Colossal Clean Crawled Corpus
- **GitHub**: Code repositories
- **Books**: BookCorpus and other book sources
- **arXiv**: Scientific preprints
- **Wikipedia**: Encyclopedia articles
- **Stack Exchange**: Q&A content

### RedPajama-V2 (October 2023)
A massive expansion containing:

- **100+ billion text documents** from 84 Common Crawl dumps
- **30+ trillion deduplicated tokens** with quality annotations
- **Five languages**: English (20.5T tokens), German (3.0T), French (2.7T), Spanish (2.8T), Italian (1.5T)
- **40+ pre-computed quality annotations** for filtering and weighting

Document counts by language:
**Language / Documents / Estimated Tokens (deduplicated):**

- **English**: Documents: 14.5B, Estimated Tokens (deduplicated): 20.5T
- **German**: Documents: 1.9B, Estimated Tokens (deduplicated): 3.0T
- **French**: Documents: 1.6B, Estimated Tokens (deduplicated): 2.7T
- **Spanish**: Documents: 1.8B, Estimated Tokens (deduplicated): 2.8T
- **Italian**: Documents: 0.9B, Estimated Tokens (deduplicated): 1.5T
- **Total**: Documents: **20.8B**, Estimated Tokens (deduplicated): **30.4T**

## Creation and Methodology

RedPajama-V2 follows a multi-stage pipeline:

### 1. CCNet Processing
Each Common Crawl snapshot is processed through the [[CCNet]] pipeline developed by Facebook Research. This light processing approach preserves maximum information while performing:
- Language identification and filtering
- Perplexity-based quality bucketing (head/middle/tail)
- In-document line deduplication

### 2. Quality Signal Computation
Over 40 quality annotations are computed for the "head" and "middle" quality buckets, implementing filtering rules from:
- **C4**: Sentence counts, bad word filtering, lorem ipsum detection
- **Gopher** (DeepMind): Word count ranges, mean word length, symbol ratios
- **RefinedWeb**: Additional heuristic measures
- **DSIR** (Data Selection via Importance Resampling): ML-based quality classifiers

Example quality signals include:
- `ccnet_perplexity`: LM perplexity trained on Wikipedia
- `rps_doc_word_count`: Document word count
- `rps_doc_ml_wikiref_score`: Wikipedia reference classifier score
- `rps_doc_frac_chars_top_2gram`: Character fraction in most frequent 2-gram
- MinHash signatures for fuzzy deduplication

### 3. Deduplication
Both exact deduplication (via Bloom filters) and fuzzy deduplication (via locality-sensitive hashing on MinHash signatures) are performed.

## Usage

RedPajama enables flexible dataset creation through its quality annotations. Users can implement custom filtering by combining signals:

```python
# Example: Implementing Gopher filtering rules
def gopher_rules_pass(sample):
    signals = json.loads(sample["quality_signals"])
    word_count = signals["rps_doc_word_count"][0][2]
    if word_count < 50 or word_count > 10_000:
        return False
    # ... additional rules
    return True
```

The dataset has been used to train:
- **RedPajama-INCITE models**: Together AI's open LLM family
- **MPT models**: MosaicML's foundation models
- Numerous academic and commercial language models

RedPajama-V1 has been downloaded over 190,000 times from Hugging Face.

## Complementary Datasets

Together AI recommends combining RedPajama-V2 with:
- **[[The Stack]]** (BigCode): For code data
- **S2ORC** (AI2): For scientific articles
- **RedPajama-V1**: For curated sources like Wikipedia and arXiv

## See Also

- [[Together AI]]
- [[LLaMA]]
- [[Common Crawl]]
- [[CCNet]]
- [[SlimPajama]]
- [[Large language model]]
- [[Data quality filtering]]

## References

- Together AI blog: "RedPajama-Data-v2: An open dataset with 30 trillion tokens for training large language models" https://together.ai/blog/redpajama-data-v2
- RedPajama GitHub: https://github.com/togethercomputer/RedPajama-Data
- RedPajama on Hugging Face: https://huggingface.co/datasets/togethercomputer/RedPajama-Data-V2
- CCNet: Wenzek et al. "CCNet: Extracting High Quality Monolingual Datasets from Web Crawl Data." LREC 2020
