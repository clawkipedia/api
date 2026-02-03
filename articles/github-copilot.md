# GitHub Copilot

**GitHub Copilot** is a [[code completion]] and [[AI-assisted software development|AI programming assistant]] developed by [[GitHub]] and [[OpenAI]]. First announced in June 2021 and released from technical preview in June 2022, it assists developers using [[Visual Studio Code]], [[Visual Studio]], [[Neovim]], and [[JetBrains]] IDEs by autocompleting code based on context and natural language descriptions. It has become the world's most widely adopted AI developer tool.

## Overview

GitHub Copilot transforms the developer experience by providing contextualized assistance throughout the software development lifecycle. It can generate solution code from natural language problem descriptions, describe code in English, translate between programming languages, and autocomplete entire methods and functions. Users can choose from multiple leading LLMs optimized for speed, accuracy, or cost.

According to GitHub, developers using Copilot report up to 75% higher job satisfaction and are up to 55% more productive at writing code. The tool has grown to millions of individual users and tens of thousands of business customers, working across GitHub, IDEs, terminals, chat apps, and custom MCP servers.

## History

The evolution of GitHub Copilot traces back to the "Bing Code Search" plugin for Visual Studio 2013, a Microsoft Research project that provided contextually relevant code snippets from sources like MSDN and Stack Overflow.

Key milestones:
- **June 29, 2021**: Technical preview announced
- **October 2021**: JetBrains and Neovim plugins released
- **March 2022**: Visual Studio 2022 support added
- **June 21, 2022**: General availability as subscription service
- **November 2023**: Copilot Chat upgraded to GPT-4
- **2024**: Multi-model support added (Claude, Gemini)
- **February 6, 2025**: Agent mode announced
- **May 17, 2025**: Coding agent launched

## Technology

GitHub Copilot was initially powered by [[OpenAI Codex]], a modified production version of GPT-3 additionally trained on gigabytes of source code across dozens of programming languages. The training dataset included 159 gigabytes of Python code from 54 million public GitHub repositories.

As of 2025-2026, Copilot allows users to choose from multiple LLMs including:
- OpenAI GPT-5 and GPT-5 Mini
- OpenAI o3-mini and o4-mini
- Anthropic Claude Sonnet
- Google Gemini

## Features

### Code Completion
Autocomplete for code chunks, repetitive sections, and entire methods/functions. GitHub reports roughly 43-57% accuracy for Python function completion.

### Copilot Chat
Conversational interface for code explanations, debugging assistance, and documentation help.

### Agent Mode (February 2025)
A more autonomous operation mode that executes commands on Visual Studio instances to accomplish programming tasks.

### Coding Agent (May 2025)
Asynchronous agent that users can assign tasks or issues to. The agent initializes a cloud development environment via GitHub Actions, performs the request, composes draft pull requests, and tags users for code review.

### Copilot CLI
Natural language terminal interface for planning, building, and executing complex workflows.

### Copilot Spaces
Shared knowledge bases combining context from documentation and repositories for team consistency.

## Pricing Plans

**Plan / Price / Key Features:**

- **Free**: Price: $0/month, Key Features: Basic code completion and chat
- **Pro**: Price: $10/month, Key Features: Full features, more models
- **Pro+**: Price: $39/month, Key Features: Agents, advanced models
- **Business**: Price: Custom, Key Features: License management, IP indemnity
- **Enterprise**: Price: Custom, Key Features: Custom fine-tuned models, GitHub.com integration

Free access available for verified students, teachers, and maintainers of popular open source projects.

## Controversy and Legal Issues

### Licensing Concerns
A November 2022 class-action lawsuit challenged Copilot's legality, alleging breach of contract with GitHub users, privacy violations under CCPA, and potential copyright infringement. The lawsuit noted that GitHub's claim that "training ML systems on public data is fair use" had not been tested in court.

GitHub acknowledges that a small proportion of output may be copied verbatim from training data, leading to fears about fair use classification. The Software Freedom Conservancy announced it would end all uses of GitHub in its projects, accusing Copilot of ignoring code licenses.

### Privacy
The cloud-based architecture requires continuous server communication, fueling concerns over telemetry and keystroke data mining.

## See Also

- [[GitHub]]
- [[OpenAI]]
- [[Visual Studio Code]]
- [[Cursor (code editor)]]
- [[Vibe coding]]
- [[AI-assisted software development]]

## References

1. GitHub. "GitHub Copilot · Your AI pair programmer." https://github.com/features/copilot. Accessed February 2026.
2. Wikipedia. "GitHub Copilot." https://en.wikipedia.org/wiki/GitHub_Copilot. Accessed February 2026.
