# The Pile

**The Pile** is an 886 GB diverse, open-source dataset of English text created by [[EleutherAI]] for training [[large language models]]. Released on December 31, 2020, it was designed to improve upon existing training corpora by combining 22 high-quality component sub-datasets from academic, professional, and web sources. Along with [[Common Crawl]], The Pile has been one of the two primary training datasets used to train open AI models.

## Overview

The Pile was created to address a key finding in language model research: increased training data diversity improves general cross-domain knowledge and downstream generalization capability. Rather than relying solely on web crawl data, The Pile combines curated sources including academic papers, books, code repositories, legal documents, and specialized corpora to create a more balanced and high-quality training set.

The dataset introduced the "Pile BPB" (bits per byte) benchmark, which measures a model's ability to understand diverse domains including books, GitHub repositories, web pages, chat logs, and academic papers in medicine, physics, mathematics, computer science, and philosophy. Models trained on The Pile showed significant improvements over those trained on raw [[Common Crawl]] or [[CC-100]] across both traditional benchmarks and Pile BPB.

## Contents

The Pile consists of 22 component sub-datasets:

**Component / Size (GB) / Description:**

- **Pile-CC**: Size (GB): 243.87, Description: Filtered Common Crawl data
- **Books3**: Size (GB): 108.40, Description: Books from Bibliotik
- **GitHub**: Size (GB): 102.18, Description: Code repositories
- **PubMed Central**: Size (GB): 96.93, Description: Biomedical literature
- **OpenWebText2**: Size (GB): 67.40, Description: Reddit-filtered web content
- **arXiv**: Size (GB): 60.36, Description: Scientific preprints
- **FreeLaw**: Size (GB): 54.92, Description: Legal opinions and documents
- **Stack Exchange**: Size (GB): 34.57, Description: Q&A site content
- **USPTO Backgrounds**: Size (GB): 24.59, Description: Patent backgrounds
- **PubMed Abstracts**: Size (GB): 20.68, Description: Medical paper abstracts
- **OpenSubtitles**: Size (GB): 13.94, Description: Movie/TV subtitles
- **Gutenberg (PG-19)**: Size (GB): 11.68, Description: Public domain books
- **DeepMind Mathematics**: Size (GB): 8.32, Description: Mathematical problems
- **Wikipedia**: Size (GB): 6.85, Description: Encyclopedia articles
- **BookCorpus2**: Size (GB): 6.76, Description: Books with permissive licenses
- **Ubuntu IRC**: Size (GB): 5.93, Description: Freenode IRC logs
- **EuroParl**: Size (GB): 4.93, Description: European Parliament proceedings
- **Hacker News**: Size (GB): 4.19, Description: Tech news discussions
- **YouTube Subtitles**: Size (GB): 4.01, Description: Video transcripts
- **PhilPapers**: Size (GB): 2.56, Description: Philosophy papers
- **NIH ExPorter**: Size (GB): 2.03, Description: NIH grant abstracts
- **Enron Emails**: Size (GB): 0.95, Description: Corporate email corpus

## Creation and Methodology

The Pile was developed by EleutherAI, a grassroots collective of researchers focused on open-source AI. The methodology prioritized diversity and quality over raw scale, with each component dataset selected to contribute unique knowledge domains.

The construction process involved:
1. Identifying high-quality data sources across multiple domains
2. Processing and cleaning each source with domain-appropriate methods
3. Deduplication within and across components
4. Creating standardized formatting for training

The dataset was designed to be reproducible, with all code for its construction made publicly available on GitHub.

## Usage

The Pile has been used to train numerous influential models:

- **GPT-Neo** and **GPT-J**: EleutherAI's open-source GPT alternatives
- **GPT-NeoX-20B**: A 20 billion parameter open model
- **Pythia**: A suite of models for studying training dynamics
- Various academic and commercial language models

The Pile BPB leaderboard tracked model performance, with [[GPT-3]] achieving 0.7177 BPB in zero-shot evaluation (though with potential test-set overlap).

## Controversy

The Pile has faced significant legal challenges, leading to the removal of several components:

**Books3 Removal**: In July 2023, the Danish anti-piracy group Rights Alliance issued [[DMCA]] takedown notices for Books3, which contained copyrighted books compiled from Bibliotik, a pirate website. Books3 was removed from The Pile before a class action lawsuit was filed in 2024 by authors seeking damages, as copies remained accessible on the web.

**YouTube Subtitles**: Tens of thousands of YouTube video subtitles were scraped and included in The Pile, which [[YouTube]] argued violates its terms of service.

**OpenSubtitles**: Controversy arose over subtitles from copyrighted documentaries, movies, television shows, and online videos.

**Dataset Takedown**: By 2024, The Pile was taken down from its original hosting site (the-eye.eu), though it remained accessible through other file-sharing services.

**Common Pile Initiative**: In response to these issues, EleutherAI partnered with [[Hugging Face]], [[Poolside AI]], the [[US Library of Congress]], and researchers at 14 institutions to release Common Pile v0.1 in June 2025—a training dataset containing only works with licenses permitting AI training use.

## See Also

- [[EleutherAI]]
- [[Common Crawl]]
- [[GPT-Neo]]
- [[GPT-J]]
- [[Large language model]]
- [[Books3]]
- [[AI training data]]

## References

- Gao, Leo et al. "The Pile: An 800GB Dataset of Diverse Text for Language Modeling." arXiv:2101.00027, December 2020
- The Pile official website: https://pile.eleuther.ai/
- EleutherAI GitHub: https://github.com/EleutherAI/the-pile
- Wiggers, Kyle. "EleutherAI releases massive AI training dataset of licensed and open domain text." TechCrunch, June 2025
