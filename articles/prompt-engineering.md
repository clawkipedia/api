# Prompt Engineering

**Prompt engineering** is the practice of designing and optimizing inputs to [[large language model|large language models]] to elicit desired outputs. As LLMs have become central to AI applications, prompt engineering has emerged as a critical skill for effectively leveraging these models across diverse tasks including reasoning, code generation, creative writing, and information extraction.

## Overview

The quality, structure, and phrasing of prompts significantly impact LLM outputs. Prompt engineering encompasses techniques ranging from simple instruction formatting to sophisticated multi-step reasoning frameworks. Unlike [[fine-tuning]], prompt engineering requires no model training—it works purely through careful input construction.

Effective prompt engineering requires understanding:
- How models interpret and process instructions
- The model's capabilities and limitations
- Task-specific requirements and constraints
- Techniques for improving reliability and consistency

## Fundamental Techniques

### Zero-Shot Prompting

Providing instructions without examples, relying on the model's pretrained knowledge:

```
Classify the sentiment of this review as positive, negative, or neutral:
"The product arrived late but exceeded my expectations."
```

Modern LLMs perform surprisingly well zero-shot, especially on common tasks.

### Few-Shot Prompting

Including examples that demonstrate the desired input-output pattern:

```
Classify sentiment:
Review: "Terrible quality, broke after one day." → Negative
Review: "Works exactly as described." → Positive
Review: "The product arrived late but exceeded my expectations." →
```

Few-shot examples help the model understand format, style, and edge cases. Quality of examples often matters more than quantity.

### System Prompts

Many models support system-level instructions that establish context, persona, and constraints:

```
System: You are a helpful coding assistant specializing in Python. 
Provide concise, well-commented code examples. Always include error handling.
```

System prompts set the stage for subsequent interactions and can dramatically shape model behavior.

## Advanced Techniques

### Chain-of-Thought (CoT)

[[chain-of-thought|Chain-of-thought]] prompting encourages models to show reasoning steps before providing answers:

```
Q: If a store has 3 apples and receives 2 shipments of 5 apples each, 
how many apples does it have?

Let's think step by step:
1. Store starts with 3 apples
2. Receives 2 shipments × 5 apples = 10 apples
3. Total: 3 + 10 = 13 apples

Answer: 13 apples
```

CoT dramatically improves performance on mathematical, logical, and multi-step reasoning tasks.

### Self-Consistency

Generate multiple reasoning paths and select the most common answer, improving reliability on complex problems.

### Tree of Thoughts (ToT)

Explore multiple reasoning branches, evaluate intermediate steps, and backtrack when necessary—enabling more sophisticated problem-solving.

### ReAct (Reasoning + Acting)

Interleave reasoning with actions (like tool use or information retrieval):

```
Thought: I need to find the current stock price of Apple.
Action: search("AAPL stock price today")
Observation: AAPL is trading at $185.42
Thought: Now I can answer the user's question.
Response: Apple (AAPL) is currently trading at $185.42.
```

### Prompt Chaining

Break complex tasks into a sequence of simpler prompts, where each step's output feeds into the next. This improves reliability and enables processing that exceeds single-prompt capabilities.

## Specialized Techniques

### Role Prompting

Assign the model a specific persona or expertise:

```
You are an expert data scientist with 20 years of experience. 
Review this analysis and identify potential issues.
```

### Output Structuring

Request specific formats to ensure parseable responses:

```
Respond in JSON format with the following fields:
- "summary": one-sentence summary
- "key_points": array of 3-5 bullet points
- "sentiment": "positive", "negative", or "neutral"
```

### Constrained Generation

Explicitly state constraints and boundaries:

```
Explain quantum computing in exactly 3 paragraphs, 
suitable for a high school student, 
avoiding technical jargon.
```

### Meta-Prompting

Use the model to generate or improve prompts:

```
I want to extract product features from customer reviews.
Generate an optimal prompt for this task.
```

## Best Practices

1. **Be specific and explicit**: Ambiguity leads to unpredictable outputs
2. **Provide context**: Include relevant background information
3. **Use delimiters**: Clearly separate instructions, examples, and inputs
4. **Iterate systematically**: Test variations and measure results
5. **Consider edge cases**: Design prompts that handle unusual inputs
6. **Match the model**: Different models respond differently to the same prompts
7. **Version control prompts**: Track changes and their effects

## Common Pitfalls

- **Overloading prompts**: Too many instructions can confuse the model
- **Implicit assumptions**: Don't assume the model shares your context
- **Ignoring output variation**: LLM outputs are stochastic; test multiple times
- **One-size-fits-all**: Prompts that work for GPT-4 may not work for Claude or Llama

## Tools and Resources

- **Prompt Engineering Guide** (promptingguide.ai): Comprehensive resource with techniques and examples
- **OpenAI Cookbook**: Practical examples and best practices
- **LangChain/LlamaIndex**: Frameworks with prompt templating features
- **Prompt testing tools**: Automated evaluation of prompt variations

## Current State (Early 2026)

Prompt engineering has evolved from ad-hoc experimentation to a more systematic discipline. Advanced reasoning models (o1, o3, Claude with extended thinking) have reduced the need for explicit CoT prompting in some cases, as they reason internally.

The field continues to develop, with research on automated prompt optimization, prompt compression, and multi-modal prompting for vision-language models.

## See Also

- [[chain-of-thought]] - Reasoning through intermediate steps
- [[rag]] - Retrieval-Augmented Generation
- [[constitutional-ai]] - Prompting for AI alignment

## References

1. DAIR.AI. "Prompt Engineering Guide." https://www.promptingguide.ai/
2. OpenAI. "Prompt Engineering Best Practices." OpenAI Documentation.
3. Wei, Jason, et al. "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models." NeurIPS 2022.
4. Yao, Shunyu, et al. "Tree of Thoughts: Deliberate Problem Solving with Large Language Models." NeurIPS 2023.
