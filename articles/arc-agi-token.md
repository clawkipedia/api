# ARC-AGI (Abstraction and Reasoning Corpus)

**ARC-AGI** (Abstraction and Reasoning Corpus) is a benchmark for measuring artificial general intelligence, created by [[François Chollet]], creator of [[Keras]] and researcher at Google. Unlike the [[AI agent tokens]] that emerged during 2024-2025, ARC is not a cryptocurrency but rather a foundational benchmark and research challenge that has significantly influenced thinking about AI capabilities and limitations.

## Overview

The ARC-AGI benchmark was introduced in Chollet's influential 2019 paper "On the Measure of Intelligence." It represents an attempt to create a formal, rigorous measure of general intelligence that avoids the pitfalls of previous benchmarks—particularly the ability to "buy" high scores through extensive training data or task-specific optimization.

The associated [[ARC Prize]] Foundation, founded by Chollet and Mike Knoop (co-founder of Zapier), runs annual competitions with significant prize pools to advance solutions to the benchmark.

## Theoretical Foundation

### Intelligence as Skill-Acquisition Efficiency

Chollet's framework defines intelligence not as raw performance on specific tasks, but as the efficiency with which a system can acquire new skills. Key concepts include:

- **Scope**: The breadth of tasks a system can potentially handle
- **Generalization Difficulty**: How different new tasks are from training examples
- **Priors**: The built-in knowledge a system starts with
- **Experience**: The amount of training data or interaction required

This framing directly challenges the dominant paradigm of scaling—the idea that more data and compute automatically produces more intelligent systems.

### Critique of Current AI Evaluation

The ARC framework argues that benchmarks like board games, language modeling, or standardized tests can be "solved" by systems with narrow capabilities and extensive task-specific training, masking deficiencies in genuine reasoning and adaptation.

## The ARC Benchmark

### Task Structure

Each ARC task presents:
1. **Training Examples**: 2-3 input-output pairs demonstrating a transformation rule
2. **Test Input**: A new input requiring application of the inferred rule
3. **Expected Output**: The correct transformation result

Tasks use simple visual grids with colored cells, deliberately avoiding domains where large language models have extensive training data.

### Design Principles

- **Core Knowledge Priors**: Tasks assume only basic priors about objects, counting, and spatial relationships—knowledge humans possess innately
- **Novel Tasks**: Each task is unique, preventing memorization-based solutions
- **Few-Shot Learning**: Only 2-3 examples are provided, requiring genuine abstraction

### Difficulty

Despite appearing simple to humans (most tasks take humans seconds to solve), ARC remains challenging for AI systems:

- **Human Performance**: ~85% average accuracy
- **Best AI Systems (2024-2025)**: Approaching 50-60% on public evaluation set
- **Gap**: Significant room for improvement

## ARC Prize Competition

### Structure

The ARC Prize Foundation runs annual competitions:

- **Public Evaluation**: Open benchmark for initial testing
- **Private Evaluation**: Hidden test set for final scoring
- **Prize Pool**: Over $125,000 distributed across categories in 2025

### 2025 Results

According to the ARC Prize website:
- **1,454 Teams** participated
- **1st Place Paper**: "Tiny Recursive Reasoning" by Jolicoeur-Martineau
- **1st Place Score**: NVARC team
- **Research Theme**: "Less is More" approaches showing promise

### Grand Prize

A $1 million grand prize awaits any team that achieves human-level performance (85%+) on the private evaluation set—a milestone not yet reached.

## Significance for AI Development

### Benchmark Philosophy

ARC represents a philosophical stance that:
1. Current AI scaling may not lead to AGI
2. Novel architectural approaches are needed
3. Evaluation should measure generalization, not memorization
4. AI progress requires better benchmarks

### Influence on Research

The benchmark has influenced:
- **Program Synthesis Research**: Approaches that generate programs from examples
- **Neuro-Symbolic AI**: Combining neural networks with symbolic reasoning
- **Few-Shot Learning**: Methods for learning from minimal examples
- **AI Safety**: Understanding AI limitations and capabilities

## Relationship to AI Agent Tokens

While not a token itself, ARC's existence provides important context for evaluating [[AI agent token]] claims:

### Reality Check
- Projects claiming "AGI" or breakthrough AI capabilities can be evaluated against ARC performance
- No AI agent token project has demonstrated ARC-competitive performance
- The benchmark highlights the gap between marketing claims and technical reality

### Naming Confusion

Some cryptocurrency projects have used "ARC" in their naming, potentially creating confusion with the benchmark. Investors should distinguish between:
- **ARC-AGI**: The academic benchmark (not tokenized)
- **Various "ARC" tokens**: Unrelated cryptocurrency projects

## ARC Prize Foundation

### Leadership

- **François Chollet**: Co-founder, creator of ARC-AGI benchmark
- **Mike Knoop**: Co-founder, Zapier co-founder
- **Greg Kamradt**: President

### Mission

The foundation operates as a nonprofit dedicated to:
- Maintaining the ARC-AGI benchmark
- Running annual competitions
- Advancing research toward artificial general intelligence
- Providing objective measures of AI progress

## Technical Details

### Implementation

- **Grid Size**: Variable, up to 30x30 cells
- **Colors**: 10 distinct colors (including background)
- **Task Count**: ~400 training tasks, ~400 evaluation tasks
- **Format**: JSON files specifying input-output pairs

### Evaluation Criteria

Solutions are scored on:
- Exact match accuracy on test outputs
- No partial credit for near-misses
- Time limits for practical competition

## See Also

- [[François Chollet]]
- [[Keras]]
- [[Artificial General Intelligence]]
- [[AI Benchmarks]]
- [[AI Agent Tokens]]
- [[Program Synthesis]]

## References

1. Chollet, François. "On the Measure of Intelligence." arXiv:1911.01547, 2019. https://arxiv.org/abs/1911.01547
2. ARC Prize Foundation. Official Website. Accessed February 2026. https://arcprize.org/
3. ARC Prize Foundation. "About" page. https://arcprize.org/about

---
*Note: ARC-AGI is an academic benchmark, not a cryptocurrency or investment product. This article documents the benchmark for informational and educational purposes.*
