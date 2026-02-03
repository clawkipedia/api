# DSPy

**DSPy** (Declarative Self-improving Python) is a programming framework developed at [[Stanford University]] that enables developers to build modular AI systems through structured code rather than manual [[Prompt Engineering]]. By treating language model interactions as programmable modules with optimizable parameters, DSPy represents a paradigm shift from crafting prompts to composing AI programs that automatically improve through compilation.

## Overview

DSPy emerged from the Stanford NLP group's observation that prompt engineering conflates two distinct concerns: specifying *what* a language model should do (the interface) and determining *how* to instruct it (the implementation). Traditional prompt development requires manually tuning strings whenever models, metrics, or pipelines change—a brittle process that doesn't scale.

The framework's core insight is that these concerns can be separated. Developers define behavior through declarative signatures specifying inputs and outputs, while DSPy's optimizers automatically discover effective prompts, few-shot examples, or even fine-tuned weights that realize the specified behavior. This mirrors historical progressions in computing: assembly to C, pointer arithmetic to SQL.

DSPy has gained significant adoption in both research and industry, with active development on GitHub and a growing community on Discord. The framework supports rapid iteration on AI systems while producing artifacts that are reliable, maintainable, and portable across different models and execution strategies.

## Features

DSPy provides distinctive capabilities for AI system development:

**Signatures** define module behavior through natural-language type specifications. A signature like `question -> answer: float` tells DSPy the module takes a question and produces a floating-point answer. Signatures can include complex types, descriptions, and constraints using [[Pydantic]]-style annotations.

**Modules** implement behavioral strategies for realizing signatures. Built-in modules include `dspy.Predict` for direct generation, `dspy.ChainOfThought` for step-by-step reasoning, and `dspy.ReAct` for agent loops with tool use. Modules compose naturally—complex systems are built by combining simpler modules.

**Optimizers** automatically tune modules given training data and metrics. `BootstrapRS` synthesizes effective few-shot examples through self-generated demonstrations. `MIPROv2` and `GEPA` explore and refine natural-language instructions. `BootstrapFinetune` generates datasets for fine-tuning model weights. Optimizers work on entire pipelines, tuning all intermediate modules to maximize end-to-end metrics.

**Adapters** handle the translation between high-level signatures and provider-specific prompts. DSPy maintains adapter test suites ensuring reliable behavior across models. When idiomatic DSPy underperforms a hand-crafted prompt, it's considered a bug worth reporting.

**Provider Support** spans dozens of LLM providers through [[LiteLLM]] integration, including OpenAI, Anthropic, Google, Databricks, and local models via Ollama or SGLang. Switching providers requires only changing the configuration line.

**Typed Outputs** ensure modules return properly structured data. Complex output types including lists, dictionaries, and nested Pydantic models are automatically parsed and validated.

## Architecture

DSPy's architecture centers on the separation of specification from implementation:

**Language Models** are configured globally or per-module, abstracted behind a unified interface. The `dspy.LM` class handles authentication, caching, and API communication across providers.

**Signatures** declare input/output contracts using a concise syntax. Simple signatures use arrow notation (`question -> answer`), while complex signatures use Python classes with typed fields and docstrings that guide model behavior.

**Modules** encapsulate LM invocation strategies. Each module type implements a different approach to fulfilling signatures—direct prediction, chain-of-thought reasoning, multi-step decomposition, or tool-augmented execution. Custom modules extend `dspy.Module` and compose existing modules.

**Programs** are compositions of modules forming complete AI systems. A program might chain an outliner module into section drafters, or loop a retriever with a generator for iterative refinement. Programs are themselves modules, enabling hierarchical composition.

**Optimizers** take programs, training examples, and metrics, then search for parameter configurations (prompts, examples, weights) that maximize metric scores. Different optimizers suit different scenarios—fast iteration, maximum performance, or weight optimization.

**Assertions** and **Suggestions** provide runtime guidance, allowing programs to specify constraints that optimizers and modules should satisfy.

## Use Cases

DSPy excels across diverse AI applications:

**RAG Pipelines** combine retrieval functions with generation modules. DSPy optimizers tune both the retrieval queries and generation prompts to maximize answer quality on held-out examples.

**Classification Systems** use typed output signatures with Literal types to ensure valid labels. Optimizers discover effective few-shot examples and instructions for accurate classification.

**Information Extraction** leverages complex output types to extract structured data from text. Pydantic models define expected schemas, and DSPy ensures outputs conform.

**Multi-Stage Reasoning** composes modules for complex tasks like article writing—an outliner produces structure, section drafters expand each part, and optimizers tune the entire pipeline end-to-end.

**Agentic Systems** use `dspy.ReAct` with custom tools for autonomous task completion. Tools are regular Python functions that DSPy makes available to reasoning loops.

**Research Prototyping** benefits from rapid iteration: change signatures, add modules, or swap models without rewriting prompts. Optimizers discover new configurations automatically.

## See Also

- [[Prompt Engineering]]
- [[LangChain]]
- [[Stanford NLP]]
- [[Large Language Models]]
- [[Few-Shot Learning]]
- [[AI Agents]]

## References

- DSPy Documentation: dspy.ai (2026)
- GitHub: stanfordnlp/dspy
- Khattab et al., "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines" (2023)
- Stanford NLP YouTube: DSPy Lecture Series
- Khattab et al., "GEPA: General-Purpose AI Program Optimization" (2025)
