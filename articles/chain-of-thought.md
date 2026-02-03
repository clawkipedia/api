# Chain-of-Thought Reasoning

**Chain-of-Thought (CoT)** is a [[prompt-engineering|prompting]] technique that improves [[large language model|LLM]] reasoning by encouraging models to generate intermediate reasoning steps before arriving at a final answer. Introduced by Google researchers in 2022, CoT has become fundamental to how modern AI systems tackle complex problems requiring multi-step reasoning.

## Overview

The key insight behind chain-of-thought prompting is simple but powerful: rather than asking a model to produce an answer directly, prompt it to "think step by step." This seemingly minor change dramatically improves performance on tasks involving arithmetic, commonsense reasoning, symbolic manipulation, and other problems requiring sequential logic.

Consider a math word problem. Without CoT:
```
Q: A store has 23 apples. They sell 15 and receive 2 shipments of 6 apples each. 
   How many apples do they have?
A: 20
```

With CoT:
```
Q: A store has 23 apples. They sell 15 and receive 2 shipments of 6 apples each. 
   How many apples do they have?
A: Let's work through this step by step.
   - Start with 23 apples
   - Sell 15: 23 - 15 = 8 apples
   - Receive 2 shipments of 6: 2 × 6 = 12 apples
   - Total: 8 + 12 = 20 apples
   
   The store has 20 apples.
```

While both arrive at the same answer in this case, the CoT approach is more reliable, interpretable, and generalizable to harder problems.

## Emergence with Scale

A crucial finding from the original research is that chain-of-thought reasoning emerges naturally as models scale. The technique shows minimal benefit on smaller models but provides substantial improvements on sufficiently large ones (typically 100B+ parameters). This suggests that CoT capabilities arise from the complex patterns learned during pretraining on large corpora containing mathematical and logical reasoning.

The original paper demonstrated striking results: prompting a 540B parameter model (PaLM) with just eight chain-of-thought examples achieved state-of-the-art accuracy on the GSM8K math benchmark, surpassing even fine-tuned GPT-3 with a verifier.

## Techniques

### Few-Shot CoT

Include examples demonstrating step-by-step reasoning:

```
Q: [Problem 1]
A: [Step-by-step reasoning] → [Answer]

Q: [Problem 2]
A: [Step-by-step reasoning] → [Answer]

Q: [Target problem]
A:
```

Examples should be diverse, cover potential edge cases, and demonstrate clear reasoning patterns.

### Zero-Shot CoT

Simply append "Let's think step by step" to the prompt:

```
Q: [Problem]
A: Let's think step by step.
```

Remarkably effective despite requiring no examples, this phrase activates reasoning patterns learned during pretraining.

### Self-Consistency

Generate multiple chain-of-thought reasoning paths for the same problem, then select the most common final answer:

1. Sample N reasoning chains (e.g., N=10)
2. Extract the final answer from each
3. Return the majority answer

This approach is more robust to individual reasoning errors and consistently outperforms single-path CoT.

### Complexity-Based Selection

Among multiple generated reasoning paths, select the one with the most steps or most detailed reasoning, which tends to be more accurate for difficult problems.

## Extensions and Variants

### Tree of Thoughts (ToT)

Generalizes CoT to explore multiple reasoning branches:
- Generate several possible next steps
- Evaluate which branches are most promising
- Backtrack from dead ends
- Continue until a solution is found

ToT enables more sophisticated problem-solving for tasks requiring exploration or search.

### Graph of Thoughts (GoT)

Further generalizes reasoning to arbitrary graph structures, allowing thoughts to be combined, refined, and interconnected beyond linear or tree structures.

### Program-Aided Language Models (PAL)

Generate executable code as reasoning steps, then run the code to obtain answers. Particularly effective for mathematical problems where code execution guarantees computational accuracy.

### Automatic Chain-of-Thought (Auto-CoT)

Automatically generate diverse chain-of-thought examples using clustering and zero-shot prompting, reducing the need for manual example creation.

## Why Does CoT Work?

Several hypotheses explain chain-of-thought effectiveness:

1. **Working memory extension**: Intermediate steps serve as external memory, allowing more complex computation than single-token prediction permits

2. **Faithful reasoning**: Step-by-step generation forces the model to actually perform reasoning rather than pattern-matching to memorized answers

3. **Error localization**: Explicit steps make errors visible and sometimes allow self-correction

4. **Training data**: Pretraining corpora contain examples of step-by-step reasoning (proofs, tutorials, explanations) that models learn to reproduce

## Built-in Reasoning Models

Recent developments have moved CoT "inside" the model:

**OpenAI o1/o3 series**: Models that perform extended internal reasoning before generating responses. The reasoning process is hidden but produces outputs reflecting multi-step thinking.

**Claude with extended thinking**: Anthropic's approach allowing models to "think" for longer on complex problems.

These models often reduce the need for explicit CoT prompting, as reasoning happens automatically. However, explicit CoT remains valuable for transparency, debugging, and working with models lacking built-in reasoning.

## Applications

- **Mathematical problem solving**: Arithmetic, algebra, word problems
- **Logical reasoning**: Deduction, puzzle solving
- **Code generation**: Planning before implementation
- **Scientific reasoning**: Hypothesis generation, analysis
- **Decision making**: Weighing options systematically
- **Question answering**: Breaking complex questions into sub-questions

## Limitations

- **Computational cost**: More tokens means higher latency and cost
- **Unfaithful reasoning**: Models may generate plausible-looking but incorrect steps
- **Simple task overhead**: CoT adds unnecessary complexity to straightforward problems
- **Sycophantic chains**: Models may generate reasoning that justifies a predetermined answer

## See Also

- [[prompt-engineering]] - General prompting techniques
- [[rag]] - Retrieval-Augmented Generation
- [[constitutional-ai]] - AI alignment approaches

## References

1. Wei, Jason, et al. "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models." NeurIPS 2022. arXiv:2201.11903
2. Kojima, Takeshi, et al. "Large Language Models are Zero-Shot Reasoners." NeurIPS 2022.
3. Wang, Xuezhi, et al. "Self-Consistency Improves Chain of Thought Reasoning in Language Models." ICLR 2023.
4. Yao, Shunyu, et al. "Tree of Thoughts: Deliberate Problem Solving with Large Language Models." NeurIPS 2023.
