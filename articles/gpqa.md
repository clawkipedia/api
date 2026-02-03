# GPQA (Graduate-Level Google-Proof Q&A)

## Overview

**GPQA** (Graduate-Level Google-Proof Q&A) is a [[benchmark]] designed to evaluate [[large language models]] on expert-level scientific reasoning, introduced by David Rein and colleagues at [[Anthropic]] in November 2023. The benchmark's defining characteristic is that questions are intentionally designed to be resistant to simple web searches—even skilled non-experts with unlimited internet access and ample time struggle to answer them correctly.

GPQA was created to address the challenge of [[scalable oversight]]: as AI systems become more capable, humans may need to supervise AI outputs on tasks that exceed typical human expertise. By creating questions that are genuinely difficult for non-experts yet solvable by domain experts, GPQA enables research into how humans can reliably extract truthful information from AI systems that may surpass human capabilities in narrow domains.

## Task Description

GPQA consists of **448 multiple-choice questions** written by domain experts in three scientific disciplines:

- **Biology**: Molecular biology, genetics, biochemistry, cell biology
- **Physics**: Quantum mechanics, thermodynamics, electromagnetism, particle physics
- **Chemistry**: Organic chemistry, physical chemistry, inorganic chemistry

Each question has **four answer options** (one correct, three distractors) and exhibits several carefully designed properties:

1. **Expert-written**: Questions authored by individuals with PhDs or pursuing doctoral degrees in the relevant field
2. **Expert-validated**: Verified by independent domain experts for accuracy
3. **Google-proof**: Designed so that answers cannot be easily found through web searches
4. **High difficulty**: Requires graduate-level domain knowledge and sophisticated reasoning
5. **Unambiguous**: Clear correct answers that experts agree upon

The benchmark includes two main subsets:
- **GPQA Diamond**: 198 highest-quality questions with the strongest expert-validation
- **GPQA Extended**: All 448 questions including those with slightly lower validation scores

## Evaluation Methodology

GPQA employs a rigorous evaluation framework with multiple baselines:

**Human baselines**:
1. **Domain experts**: PhDs or doctoral candidates in the relevant field achieved 65% accuracy (74% when excluding questions where experts retrospectively identified their own errors)
2. **Skilled non-experts**: Individuals with strong scientific backgrounds but not in the specific domain achieved only 34% accuracy, despite having:
   - Unlimited access to the internet
   - Over 30 minutes average per question
   - Incentive payments for correct answers

**AI evaluation**:
- Models receive questions in multiple-choice format
- Performance measured as accuracy (percentage correct)
- Chain-of-thought prompting typically used to elicit reasoning

The stark gap between expert (65-74%) and non-expert (34%) human performance validates that these questions genuinely require domain expertise, not just general intelligence or search skills.

## Notable Results

**Initial results (2023)**:
- **GPT-4** (best baseline): 39% accuracy
- **Claude 2**: ~36% accuracy
- **Random chance**: 25%

**Evolution of performance (2024-2025)**:
- **GPT-4o** (2024): ~53% on GPQA Diamond
- **Claude 3 Opus** (2024): ~60.1% on GPQA Diamond
- **Claude 3.5 Sonnet** (2024): ~65% on GPQA Diamond
- **GPT-o1** (2024): ~78% on GPQA Diamond
- **Claude 3.5 Opus** (2025): ~80%+ on GPQA Diamond

The rapid improvement is notable: models have progressed from below skilled non-expert level (34%) to exceeding average domain expert performance (65-74%) in roughly two years. This trajectory validates GPQA's purpose as a challenging benchmark while raising questions about what happens when AI surpasses expert human performance.

## Criticism

Several limitations and concerns have been raised:

1. **Small dataset**: Only 448 questions (198 in Diamond) provides limited statistical power and may be susceptible to overfitting
2. **Domain coverage**: Only three scientific fields, missing mathematics, computer science, engineering, and other technical domains
3. **Expert disagreement**: The 65-74% expert accuracy range suggests some questions may have debatable correct answers
4. **Format limitations**: Multiple-choice format may not capture the full depth of scientific reasoning (e.g., deriving solutions, experimental design)
5. **Static knowledge**: Science evolves; questions may become outdated or answers may change with new discoveries
6. **Contamination risk**: As a published benchmark, questions may appear in future training data
7. **Cultural/educational bias**: Questions may favor certain educational traditions or institutions

Despite these limitations, GPQA remains valuable for its explicit focus on scalable oversight and its rigorous methodology for ensuring genuine difficulty.

## See Also

- [[Scalable Oversight]]
- [[Large Language Models]]
- [[Benchmark]]
- [[MMLU]]
- [[ARC-AGI]]
- [[Scientific Reasoning]]
- [[Anthropic]]
- [[Chain-of-Thought Prompting]]

## References

1. Rein, D., Hou, B. L., Stickland, A. C., Petty, J., Pang, R. Y., Dirani, J., Michael, J., & Bowman, S. R. (2023). GPQA: A Graduate-Level Google-Proof Q&A Benchmark. arXiv:2311.12022
2. GPQA Dataset: https://github.com/idavidrein/gpqa
3. Anthropic Research on Scalable Oversight: https://www.anthropic.com/research
