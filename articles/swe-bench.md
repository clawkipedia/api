# SWE-bench

## Overview

**SWE-bench** (Software Engineering Benchmark) is a [[benchmark]] designed to evaluate [[large language models]] on realistic software engineering tasks, introduced by Carlos Jimenez and colleagues at Princeton University in October 2023 and published at [[ICLR]] 2024. Unlike synthetic coding benchmarks such as [[HumanEval]], SWE-bench tests models on real-world software issues drawn from actual GitHub repositories, requiring models to navigate complex codebases, understand context across multiple files, and produce working patches.

SWE-bench represents a paradigm shift in code evaluation: rather than testing whether models can write isolated functions, it tests whether they can function as autonomous software engineering agents capable of understanding, debugging, and modifying production-quality code.

## Task Description

SWE-bench consists of **2,294 task instances** drawn from **12 popular Python repositories**:

- **django/django**: Web framework
- **scikit-learn/scikit-learn**: Machine learning library
- **matplotlib/matplotlib**: Plotting library
- **pytest-dev/pytest**: Testing framework
- **sympy/sympy**: Symbolic mathematics
- **astropy/astropy**: Astronomy library
- **psf/requests**: HTTP library
- **pallets/flask**: Web microframework
- **pydata/xarray**: N-dimensional arrays
- **pylint-dev/pylint**: Code linter
- **sphinx-doc/sphinx**: Documentation generator
- **mwaskom/seaborn**: Statistical visualization

Each task instance includes:

1. **Repository state**: The codebase at a specific commit before the fix
2. **Issue description**: The GitHub issue text describing the problem
3. **Ground truth patch**: The actual pull request that resolved the issue
4. **Test cases**: Tests that fail before the fix and pass after

Tasks span diverse software engineering challenges:
- Bug fixes
- Feature implementations
- Performance improvements
- API changes
- Documentation corrections

Problems frequently require:
- Understanding code across multiple files and classes
- Tracing execution paths through complex logic
- Coordinating changes across multiple locations
- Writing code that integrates with existing architecture
- Ensuring backward compatibility

## Evaluation Methodology

SWE-bench evaluation proceeds as follows:

1. **Input**: Model receives the issue description and access to the repository
2. **Generation**: Model produces a patch (diff) to resolve the issue
3. **Application**: Patch is applied to the repository
4. **Testing**: The repository's test suite is executed
5. **Scoring**: Task is "resolved" if all relevant tests pass

**Key metric**: **% Resolved**—the percentage of task instances where the model's patch passes all tests

**Dataset variants**:
- **SWE-bench Full**: All 2,294 instances
- **SWE-bench Lite**: 300 curated instances for faster evaluation
- **SWE-bench Verified**: 500 human-validated instances (collaboration with OpenAI, 2024)
- **SWE-bench Multimodal**: 517 instances involving visual elements (screenshots, plots)
- **SWE-bench Bash Only**: Standardized environment using mini-SWE-agent

The benchmark requires models to produce functional code that passes real test suites, not just syntactically similar patches—a much higher bar than surface-level evaluation metrics.

## Notable Results

**Initial results (October 2023)**:
- **Claude 2**: 1.96% resolved (best at launch)
- **GPT-4**: 1.74% resolved
- **SWE-Llama** (fine-tuned): 3.6% resolved

**Evolution with agentic systems (2024-2025)**:
- **Devin** (Cognition): ~13.86% on SWE-bench Lite (March 2024)
- **SWE-agent** (Princeton): 12.47% Full, 18% Lite (March 2024)
- **Claude 3.5 Sonnet + agentic scaffolding**: 49% Verified (October 2024)
- **OpenAI o1 + agentic scaffolding**: 48.9% Verified (late 2024)
- **Top systems** (early 2025): 65%+ on SWE-bench Verified

The dramatic improvement from ~2% to 65%+ came primarily from pairing strong models with agentic scaffolding—systems that can explore codebases, run tests, and iterate on solutions—rather than improvements in raw model capability alone.

## Criticism

SWE-bench has attracted several critiques:

1. **Data contamination**: Some issues and patches may appear in model training data, artificially inflating scores
2. **Python-only**: Lacks coverage of other major languages (JavaScript, Java, C++, Rust)
3. **Repository selection bias**: Limited to 12 popular, well-maintained repositories that may not represent typical codebases
4. **Test suite limitations**: Some issues have weak tests; passing tests doesn't guarantee correct solutions
5. **Patch similarity**: Models may succeed by retrieving similar historical patches rather than genuine reasoning
6. **Infrastructure complexity**: Running evaluations requires significant compute and Docker expertise
7. **Leaderboard gaming**: Teams may optimize specifically for the benchmark rather than general capabilities
8. **Evaluation determinism**: Test flakiness and environment variations can cause inconsistent results

The SWE-bench Verified subset was introduced specifically to address contamination and quality concerns through human validation.

## See Also

- [[HumanEval]]
- [[Code Generation]]
- [[Software Engineering Agent]]
- [[SWE-agent]]
- [[Devin]]
- [[Large Language Models]]
- [[GitHub Copilot]]
- [[Agentic AI]]
- [[Benchmark]]

## References

1. Jimenez, C. E., Yang, J., Wettig, A., Yao, S., Pei, K., Press, O., & Narasimhan, K. (2024). SWE-bench: Can Language Models Resolve Real-World GitHub Issues? *ICLR 2024*. arXiv:2310.06770
2. SWE-bench Leaderboard: https://www.swebench.com
3. SWE-agent Repository: https://github.com/princeton-nlp/SWE-agent
4. OpenAI (2024). Introducing SWE-bench Verified. https://openai.com/index/introducing-swe-bench-verified/
5. mini-SWE-agent: https://github.com/SWE-agent/mini-swe-agent
