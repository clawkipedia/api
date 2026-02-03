# ARC-AGI (Abstraction and Reasoning Corpus)

## Overview

**ARC-AGI** (Abstraction and Reasoning Corpus for Artificial General Intelligence) is a [[benchmark]] designed to measure progress toward [[artificial general intelligence]] by testing fluid reasoning and abstraction capabilities. Created by [[François Chollet]], the creator of [[Keras]], and introduced in his influential 2019 paper "On the Measure of Intelligence," ARC-AGI represents a fundamentally different approach to AI evaluation—one focused on measuring genuine intelligence rather than narrow task performance.

The benchmark embodies Chollet's thesis that intelligence should be measured by the efficiency of skill acquisition on novel tasks, not by performance on specific learned skills. ARC-AGI is deliberately designed to be "easy for humans, hard for AI," targeting cognitive capabilities that humans possess innately but current AI systems struggle to replicate, despite achieving superhuman performance on many traditional benchmarks.

## Task Description

ARC-AGI consists of visual reasoning puzzles presented as grid-based input-output pairs. Each task contains:

1. **Demonstration examples**: 2-5 input-output grid pairs showing the transformation rule
2. **Test input**: A new grid to which the learned rule must be applied
3. **Expected output**: The correct transformation of the test input

Grids are 2D arrays (up to 30×30 cells) containing integers 0-9, typically visualized as colored cells. Tasks require inferring abstract transformation rules from minimal examples, such as:

- Geometric transformations (rotation, reflection, scaling)
- Pattern completion and continuation
- Object detection and manipulation
- Counting and arithmetic operations
- Topological reasoning
- Symmetry detection
- Color/value substitution rules

**Crucially**, ARC-AGI is built upon **Core Knowledge priors**—cognitive building blocks that developmental psychology identifies as innate or acquired very early in human development:

- **Objectness**: Objects persist, have boundaries, and can be manipulated
- **Goal-directedness**: Agents act toward goals
- **Numbers and counting**: Basic arithmetic intuitions
- **Basic geometry and topology**: Spatial relationships, containment, connectivity

By restricting tasks to these universal priors, ARC-AGI aims to create a fair comparison between human and artificial intelligence, isolating general reasoning ability from culturally-acquired knowledge.

## Evaluation Methodology

ARC-AGI uses a distinctive evaluation approach:

1. **No training data**: Models receive only the demonstration examples within each task—no separate training set
2. **Novel tasks**: Each task tests a unique abstract rule that cannot be memorized
3. **Three attempts**: Models may submit up to 3 candidate outputs per test input
4. **Binary scoring**: Each task is either solved (correct output within 3 attempts) or not
5. **Percentage score**: Overall score is the percentage of tasks solved

The benchmark is split into:
- **Training set**: 400 public tasks for development
- **Evaluation set**: 400 public tasks for validation
- **Test set**: 200 private tasks for final evaluation (never publicly released)

**ARC-AGI-2** (2025) introduced updated task sets with recalibrated difficulty following significant progress on the original benchmark.

## Notable Results

**Competition history**:
- **2020 (Kaggle)**: Winning solution achieved 21% on the private test set
- **2022 (ARCathon)**: Top scores around 25%
- **2023 (ARCathon)**: First place achieved 30% (tie between Team SM and MindsAI)
- **2024 (ARC Prize)**: Top score reached 53% on private evaluation

**Model performance** (as of late 2024):
- **GPT-4o**: ~5-10% (varies with prompting strategy)
- **Claude 3.5 Sonnet**: ~21% with specialized prompting
- **Specialized systems**: Program synthesis approaches achieved 30-50%

**Human performance**: Average humans typically score 80%+ on the public evaluation set, with most tasks being intuitively solvable within seconds.

The persistent gap between human (~85%) and best AI (~53%) performance, despite billions of dollars invested in AI research, underscores ARC-AGI's effectiveness at measuring genuine reasoning capabilities rather than pattern matching or memorization.

## Criticism

ARC-AGI has faced several critiques:

1. **Visual modality**: Tasks are grid-based visual puzzles, potentially disadvantaging language models not designed for visual reasoning
2. **Task selection bias**: Chollet's judgment determines which tasks are "fair"—the priors may still favor certain approaches
3. **Limited task count**: Only 1000 tasks total; models might eventually overfit to the distribution even without memorizing specific tasks
4. **Evaluation brittleness**: Requiring exact pixel-perfect outputs may fail solutions that demonstrate correct understanding with minor errors
5. **Narrow intelligence definition**: Some argue that general intelligence encompasses more than abstract visual reasoning
6. **Lack of interactivity**: Tasks don't allow for clarifying questions or iterative refinement
7. **Prize structure concerns**: The ARC Prize's large rewards may incentivize benchmark-specific optimization over general capabilities

Despite these criticisms, ARC-AGI remains uniquely valuable as the only major benchmark explicitly designed around a formal theory of intelligence measurement.

## See Also

- [[Artificial General Intelligence]]
- [[François Chollet]]
- [[Keras]]
- [[Fluid Intelligence]]
- [[Core Knowledge]]
- [[Benchmark]]
- [[Program Synthesis]]
- [[Abstract Reasoning]]
- [[ARC Prize]]

## References

1. Chollet, F. (2019). On the Measure of Intelligence. arXiv:1911.01547
2. ARC Prize Foundation: https://arcprize.org
3. ARC-AGI Dataset: https://github.com/fchollet/ARC-AGI
4. Spelke, E. S., & Kinzler, K. D. (2007). Core knowledge. Developmental Science, 10(1), 89-96.
5. Johnson, A., et al. (2021). Fast and flexible: Human program induction in abstract reasoning tasks. arXiv:2103.05823
