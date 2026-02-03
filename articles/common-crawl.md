# Common Crawl

**Common Crawl** is a nonprofit organization that builds and maintains an open repository of web crawl data, freely accessible to anyone. Founded in 2007 by [[Gil Elbaz]], the organization operates as a 501(c)(3) nonprofit and has become one of the most important foundational datasets for training [[large language models]] and conducting internet-scale research.

## Overview

Common Crawl systematically crawls the web and archives petabytes of raw web data, including HTML content, metadata, and link information. The corpus is hosted on [[Amazon Web Services]]' Open Data Program (in the `s3://commoncrawl/` bucket in the US-East-1 region) and can be accessed freely either through direct download or by running analysis jobs in the AWS cloud.

The dataset has been cited in over 10,000 academic studies as of 2024 and serves as the primary data source for many prominent AI systems. A filtered version of Common Crawl was used to train [[OpenAI]]'s [[GPT-3]], and it forms the backbone of numerous derived datasets including [[C4]], [[RefinedWeb]], [[RedPajama]], and [[FineWeb]].

## Contents

Common Crawl data is organized into monthly or bi-monthly "crawls," with each crawl containing billions of web pages. The data is stored in several formats:

- **WARC (Web ARChive)**: The primary format containing complete HTTP responses including headers and content
- **WAT**: Metadata extracted from WARC files, including HTTP headers and HTML metadata
- **WET**: Plain text content extracted from the web pages

The corpus covers hundreds of millions of domains across the open web, with content in virtually every language. Each crawl snapshot typically contains 2-3 billion pages and 200-300 terabytes of compressed data.

## Creation and Methodology

Common Crawl uses a distributed web crawler that respects `robots.txt` directives (with caveats—see Controversy). The organization performs regular crawls of the web, archiving content and making each snapshot available as a distinct dataset. The crawling infrastructure is designed to be broad rather than deep, prioritizing coverage across domains over exhaustive crawling of individual sites.

Users can explore the corpus using the Common Crawl URL Index, which allows searching for specific URLs or domains within the archive. The organization also provides example code and libraries in Python, Java, and other languages for processing the data using frameworks like [[Apache Spark]] and [[Hadoop]].

## Usage

Common Crawl data is used extensively for:

- **LLM Training**: The primary use case, with major AI labs including [[OpenAI]], [[Anthropic]], [[Google]], and [[Meta AI]] using filtered versions for pretraining
- **Academic Research**: Studies on web structure, language distribution, and internet content
- **Search Engine Development**: Building search indices and testing retrieval algorithms
- **Natural Language Processing**: Creating language corpora and training multilingual models

Notable derived datasets include Google's Colossal Clean Crawled Corpus ([[C4]]), which was constructed for training the [[T5]] language model series, and [[RedPajama-V2]], which processes 84 Common Crawl snapshots into 30 trillion tokens.

## Controversy

Common Crawl has faced significant criticism and legal challenges:

**Copyright Concerns**: As of 2024, studies found that 45% of Common Crawl content comes from websites that now explicitly restrict AI training scraping. The dataset contains substantial copyrighted material and is distributed under fair use claims, which has uncertain legal standing in jurisdictions outside the United States.

**Paywall and Takedown Issues**: In November 2025, an investigation by *The Atlantic* revealed that Common Crawl had misrepresented its practices, claiming to respect paywalls and honor removal requests when it did not. The public search function on its website showed no entries for sites that had requested removal, while those sites remained in the actual scrapes used by AI companies.

**Funding from AI Companies**: In 2023, Common Crawl began receiving substantial financial support from AI companies, including $250,000 donations from both Anthropic and OpenAI, raising questions about potential conflicts of interest between the nonprofit's public mission and the commercial interests of its donors.

## See Also

- [[C4]]
- [[The Pile]]
- [[RedPajama]]
- [[FineWeb]]
- [[RefinedWeb]]
- [[Large language model]]
- [[Web scraping]]

## References

- Common Crawl official documentation: https://commoncrawl.org
- Reisner, Alex. "The Company Quietly Funneling Paywalled Articles to AI Developers." *The Atlantic*, November 2025
- Brown et al. "Language Models are Few-Shot Learners." arXiv:2005.14165, 2020 (GPT-3 paper)
- Raffel et al. "Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer." JMLR 2020 (C4/T5 paper)
