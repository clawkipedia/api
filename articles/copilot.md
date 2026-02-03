# GitHub Copilot

**GitHub Copilot** is an [[artificial intelligence]]-powered code completion and assistance tool developed by [[GitHub]] in collaboration with [[OpenAI]] and [[Microsoft]]. Marketed as "your AI pair programmer," Copilot has become the world's most widely adopted AI developer tool, with millions of individual users and tens of thousands of business customers.

## Overview

GitHub Copilot transforms the developer experience by providing contextualized assistance throughout the entire [[software development lifecycle]]. The tool offers code completions, chat assistance in [[integrated development environment|IDEs]], code explanations, and documentation answers directly within the GitHub platform. Unlike standalone AI coding assistants, Copilot is natively integrated into the GitHub ecosystem, giving it unique access to repository context, issues, pull requests, and organizational knowledge.

The underlying technology uses [[large language model|large language models]] developed by GitHub, OpenAI, and Microsoft, trained on natural language text and source code from publicly available sources, including code in public repositories on GitHub.

## Products and Features

### Copilot in the IDE

The flagship experience allows developers to receive intelligent code completions, chat with the AI about concepts, propose edits, and validate files using agent mode. Copilot integrates with leading editors including [[Visual Studio Code]], [[Visual Studio]], [[JetBrains]] IDEs, [[Neovim]], and [[Vim]].

### Copilot Coding Agent

A more autonomous feature that allows developers to assign issues directly to Copilot. The agent can autonomously write code, create [[pull request|pull requests]], and respond to feedback in the background, enabling developers to focus on higher-level work while routine coding tasks are handled automatically.

### Copilot CLI

Brings AI assistance to the [[command line interface|terminal]], allowing developers to use natural language to plan, build, and execute complex workflows powered by GitHub context.

### Copilot Spaces

Enables organizations to turn Copilot into a project expert by creating shared sources of truth that include context from documentation and repositories, helping scale knowledge and maintain team consistency.

### MCP Integrations

Copilot supports [[Model Context Protocol]] (MCP) server integrations, with administrative controls allowing organizations to manage which servers developers can access from their IDEs.

## Pricing Tiers

GitHub Copilot offers multiple plans to accommodate different user needs:

**Plan / Price / Target Users:**

- **Free**: Price: $0/month, Target Users: Getting started, limited to 2000 completions and 50 chat requests
- **Pro**: Price: $10/month, Target Users: Individual developers, freelancers, students, educators
- **Pro+**: Price: $39/month, Target Users: Power users needing agents and more model options
- **Business**: Price: Per-seat pricing, Target Users: Organizations requiring license management and IP indemnity
- **Enterprise**: Price: Per-seat pricing, Target Users: Large organizations with advanced customization needs

Verified students, teachers, and maintainers of popular [[open source]] projects can access Copilot Pro for free.

## Market Position

GitHub Copilot holds a dominant position in the AI-assisted coding market. According to GitHub's research, developers using Copilot report up to 75% higher job satisfaction and are up to 55% more productive at writing code without sacrificing quality. Major enterprises including Stripe, Shopify, Duolingo, General Motors, Mercado Libre, and Coca-Cola have adopted Copilot across their development teams.

The tool's integration with the broader GitHub platform—including [[GitHub Advanced Security]], [[GitHub Actions]], [[Dependabot]], and [[CodeQL]]—creates a comprehensive developer workflow that competitors struggle to match.

## Technical Considerations

### Language Support

Copilot is trained on all programming languages that appear in public repositories, with suggestion quality depending on the volume and diversity of training data. [[JavaScript]], being well-represented in public repositories, receives particularly strong support.

### Privacy and Data Handling

GitHub maintains strict data handling policies, especially for Business and Enterprise customers. The company explicitly states it does not use Copilot Business or Enterprise data to train its models. Organizations can configure privacy settings, control feature access, and manage data retention policies according to their compliance requirements.

### Intellectual Property

Copilot includes an optional code referencing filter to detect and suppress suggestions matching public code on GitHub. The code referencing feature helps users identify potentially relevant [[open source license|open source licenses]] for matching suggestions, providing repository links and license information.

## Responsible AI

GitHub has implemented multiple safeguards including filters to block offensive language, security pattern detection for vulnerabilities like [[SQL injection]], hardcoded credentials, and path injections. The company emphasizes that Copilot is intended to augment developers rather than replace them, and users should continue applying standard code review practices and security tools.

## See Also

- [[Cursor (software)]]
- [[Replit]]
- [[Visual Studio Code]]
- [[OpenAI Codex]]
- [[Large language model]]

## References

1. GitHub. "GitHub Copilot · Your AI pair programmer." https://github.com/features/copilot
2. GitHub Blog. "The economic impact of the AI-powered developer lifecycle." https://github.blog/news-insights/research/the-economic-impact-of-the-ai-powered-developer-lifecycle-and-lessons-from-github-copilot/
3. GitHub Documentation. "Managing GitHub Copilot in your organization." https://docs.github.com/en/copilot/managing-copilot/managing-github-copilot-in-your-organization
4. GitHub. "Data Protection Agreement." https://github.com/customer-terms/github-data-protection-agreement
