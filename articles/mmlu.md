# MMLU (Massive Multitask Language Understanding)

## Overview

**MMLU** (Massive Multitask Language Understanding) is a comprehensive [[benchmark]] designed to measure a [[language model]]'s knowledge and reasoning abilities across a wide spectrum of academic and professional domains. Introduced by Dan Hendrycks and colleagues in September 2020 and published at [[ICLR]] 2021, MMLU has become one of the most widely-cited benchmarks for evaluating [[large language models]] (LLMs).

The benchmark was created to address a fundamental question: how well do language models understand and reason about human knowledge? Unlike narrower benchmarks that focus on specific capabilities, MMLU tests whether models possess the broad, encyclopedic knowledge expected of an educated human, spanning everything from elementary mathematics to advanced law and medicine.

## Task Description

MMLU consists of **57 distinct tasks** covering subjects across four broad categories:

- **STEM**: Abstract algebra, anatomy, astronomy, college biology, college chemistry, college computer science, college mathematics, college physics, conceptual physics, electrical engineering, elementary mathematics, high school biology, high school chemistry, high school computer science, high school mathematics, high school physics, high school statistics, machine learning
- **Humanities**: Formal logic, high school European history, high school US history, high school world history, international law, jurisprudence, logical fallacies, moral disputes, moral scenarios, philosophy, prehistory, professional law, world religions
- **Social Sciences**: Econometrics, high school geography, high school government and politics, high school macroeconomics, high school microeconomics, high school psychology, human aging, human sexuality, marketing, professional accounting, professional psychology, public relations, security studies, sociology, US foreign policy
- **Other**: Clinical knowledge, college medicine, global facts, management, medical genetics, miscellaneous, nutrition, professional medicine, virology

Each task presents **multiple-choice questions** with four answer options (A, B, C, D). The questions range from elementary school level to professional and graduate-level difficulty, requiring both factual recall and complex reasoning.

## Evaluation Methodology

MMLU uses a straightforward evaluation approach:

1. **Format**: All questions are presented in a standardized multiple-choice format with exactly four options
2. **Few-shot prompting**: Models are typically evaluated using 5-shot prompting, where five example questions with answers precede the test question
3. **Scoring**: Accuracy is computed as the percentage of correctly answered questions
4. **Aggregation**: Results can be reported per-subject, per-category, or as an overall average across all 57 tasks

The benchmark includes approximately **15,908 questions** total, split across development, validation, and test sets. The test set contains around 14,042 questions.

## Notable Results

At its introduction, MMLU exposed significant limitations in then-state-of-the-art models:

- **GPT-3** (175B parameters): Achieved approximately 43.9% accuracy, roughly 20 percentage points above random chance (25%)
- **Random baseline**: 25% (expected for 4-choice questions)
- **Human expert baseline**: Estimated at ~89.8% (varies by domain)

By 2024-2025, frontier models have made dramatic progress:

- **GPT-4**: ~86.4% accuracy
- **Claude 3 Opus**: ~86.8% accuracy
- **Gemini Ultra**: ~90.0% accuracy

This rapid improvement has led to concerns about [[benchmark saturation]], prompting the development of harder variants like **MMLU-Pro** and **MMLU-Redux**.

## Criticism

Several criticisms have been leveled at MMLU:

1. **Data contamination**: As a widely-known benchmark, MMLU questions may have been inadvertently included in training data for newer models, inflating scores
2. **Question quality**: Some questions contain errors, ambiguities, or outdated information, particularly in rapidly-evolving fields
3. **Memorization vs. reasoning**: Multiple-choice format may reward pattern matching and memorization over genuine understanding
4. **Cultural bias**: Many questions assume Western, particularly American, cultural and educational contexts
5. **Saturation**: Top models now approach or exceed human expert performance, limiting MMLU's ability to discriminate between frontier models
6. **Static nature**: The benchmark doesn't evolve with new knowledge, making some questions anachronistic

These concerns have motivated successors like **MMLU-Pro** (harder questions with 10 options) and dynamically-generated evaluation sets.

## See Also

- [[Benchmark]]
- [[Language Model Evaluation]]
- [[MMLU-Pro]]
- [[HellaSwag]]
- [[TruthfulQA]]
- [[BIG-bench]]
- [[GPT-3]]
- [[Large Language Models]]

## References

1. Hendrycks, D., Burns, C., Basart, S., Zou, A., Mazeika, M., Song, D., & Steinhardt, J. (2021). Measuring Massive Multitask Language Understanding. *ICLR 2021*. arXiv:2009.03300
2. GitHub Repository: https://github.com/hendrycks/test
3. Hendrycks, D., et al. (2024). MMLU-Pro: A More Robust and Challenging Multi-Task Language Understanding Benchmark. arXiv:2406.01574
