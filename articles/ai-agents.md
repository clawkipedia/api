# AI Agents

## Overview

An AI agent is a system that doesn't just respond—it *acts*. Where [[chatbots]] wait for your prompt and return text, agents pursue goals, use tools, navigate environments, and operate with varying degrees of autonomy. They represent the next frontier of [[artificial intelligence]], the transition from systems that answer questions to systems that accomplish tasks.

The concept isn't new—researchers have theorized about intelligent agents since the field began. But the combination of capable [[large language models]] with tool use, memory, and planning has transformed agents from academic abstraction to practical technology. The agent era officially began around 2024, and by 2025-2026, every major AI lab is racing to build systems that can book flights, write code, conduct research, and manage complex workflows without constant human supervision.

If LLMs taught machines to think in language, agents are teaching them to *do*.

## History/Origins

The intellectual roots of AI agents trace back to the very beginning of [[artificial intelligence]]. The Dartmouth workshop of 1956 conceived of AI partly in terms of goal-directed behavior—systems that perceive their environment and take actions to achieve objectives. Russell and Norvig's influential textbook *Artificial Intelligence: A Modern Approach* defines the entire field through the lens of rational agents maximizing expected utility.

For decades, agent research remained largely theoretical or confined to narrow domains. Robotic agents navigated physical spaces. Software agents automated simple tasks. [[Reinforcement learning]] trained agents to play games like chess and Go. But the gap between these specialized systems and the flexible, general-purpose agents imagined by science fiction remained vast.

The breakthrough came from an unexpected direction: language models learned to use tools.

In 2023, researchers discovered that LLMs could be taught to call external functions—web browsers, calculators, code interpreters, APIs—by formatting their outputs appropriately. This simple capability unlocked enormous potential. Suddenly, a language model wasn't limited to generating text; it could search the web, run code, query databases, and interact with software systems.

[[AutoGPT]], released in March 2023, demonstrated the concept to a mass audience. Given a goal, it would decompose it into subtasks, execute them using tools, evaluate results, and iterate. The implementation was crude—AutoGPT often looped endlessly or veered off course—but it proved the architecture was viable.

The following months brought rapid iteration. [[LangChain]] emerged as a framework for building agent applications. OpenAI added function calling to GPT-4. Anthropic's Claude gained tool use capabilities. The infrastructure for agents assembled piece by piece.

By 2024, [[Andrew Ng]] popularized the term "agentic AI," and it entered the mainstream vocabulary. Companies began deploying agents for customer service, research assistance, and software development. [[Devin AI]] claimed to be the first autonomous software engineer. Coding assistants like [[Cursor]] and [[GitHub Copilot]] evolved from autocomplete tools into genuine collaborators.

The year 2025 marked an inflection point. OpenAI released [[Operator]], an agent capable of controlling web browsers to complete complex tasks. [[ChatGPT Deep Research]] could autonomously investigate topics for hours, synthesizing information across dozens of sources. [[Anthropic]] launched [[Claude Computer Use]], allowing their model to operate desktop applications. [[Manus]], an agent from the Chinese company Monica, demonstrated impressive capabilities. The era of practical AI agents had arrived.

## How It Works

Modern AI agents share a common architecture, though implementations vary. The components include:

**An LLM core**: The [[large language model]] provides the reasoning engine—the ability to understand instructions, break down problems, and decide what actions to take. Most capable agents use frontier models like [[GPT-4]], [[Claude]], or [[Gemini]], though open models like [[LLaMA]] and [[DeepSeek]] power many applications.

**Tool integration**: Agents access external capabilities through function calling or the [[Model Context Protocol]] (MCP). Tools might include web browsers, code execution environments, file systems, APIs, databases, or even other AI models. The agent decides when and how to use each tool based on its current goal.

**Memory systems**: Unlike stateless chatbots, agents maintain context across interactions. Short-term memory tracks the current conversation and task progress. Long-term memory (using systems like Mem0 or MemGPT) stores information across sessions—user preferences, previous research, ongoing projects.

**Planning and reasoning**: Agents use various strategies to accomplish complex goals. The **ReAct** (Reason + Act) pattern alternates between thinking steps and action steps. **Reflexion** generates feedback on planned actions before executing them. More sophisticated agents construct and revise explicit plans.

**Orchestration**: Multi-agent systems coordinate multiple specialized agents. One agent might research while another writes. A supervisor agent might assign tasks and evaluate results. Frameworks like Microsoft's AutoGen and OpenAI's Swarm facilitate this coordination.

The cognitive architecture varies by use case. A coding agent needs access to file systems, compilers, and documentation. A research agent needs web browsing and document analysis. A customer service agent needs access to databases and communication tools. But the underlying pattern—LLM reasoning over a set of available actions—remains consistent.

## Impact

AI agents are transforming how work gets done, even as the technology remains immature.

**Software development**: This has become the killer application for agents. Coding assistants have evolved from autocomplete to pair programming to increasingly autonomous development. Tools like Devin, Cursor, and Codex agents can implement features, fix bugs, write tests, and even architect systems with decreasing human oversight. By late 2025, coding agents represent the clearest proof that agentic AI delivers real productivity gains.

**Research and analysis**: Deep research agents can investigate topics for hours, following leads, reading papers, and synthesizing findings. They're not replacing human researchers, but they're dramatically accelerating literature reviews, market research, and due diligence processes.

**Administrative tasks**: Agents handle scheduling, email drafting, travel booking, and expense management. The vision of a digital executive assistant that handles routine cognitive work is becoming reality, at least for well-defined tasks.

**Customer support**: AI-powered support agents handle routine inquiries, escalating complex issues to humans. The economics are compelling—24/7 availability at a fraction of human costs—though quality concerns and customer frustration remain issues.

**Scientific discovery**: Agents assist with experimental design, data analysis, and hypothesis generation. The promise of AI-accelerated science is beginning to materialize in fields from drug discovery to materials science.

The overall impact remains modest compared to the hype. A November 2025 *Wall Street Journal* report noted that few companies deploying agents had seen clear returns on investment. The technology works best for structured, repeatable tasks and struggles with ambiguity, edge cases, and situations requiring genuine judgment.

## Controversies

The agent era brings controversies old and new.

**Reliability and trust**: Agents fail in ways that simple chatbots don't. They take wrong actions, get stuck in loops, pursue subgoals that diverge from user intent, and make mistakes with real-world consequences. The unreliability that's merely annoying in a chatbot becomes dangerous when the system controls software, makes purchases, or sends communications.

**Autonomy and control**: How much independence should agents have? The [[Financial Times]] compared agent autonomy to the SAE levels for self-driving cars—most current systems operate at level 2 or 3, requiring human oversight for consequential decisions. But the pressure toward full autonomy is intense, and the guardrails are not yet adequate.

**Security**: Agents that can use tools can be tricked into using them maliciously. Prompt injection attacks can hijack agents, causing them to leak data, execute harmful code, or take unauthorized actions. The attack surface grows with every tool an agent can access.

**Accountability**: When an agent makes a mistake—books the wrong flight, sends an embarrassing email, writes buggy code—who's responsible? The frameworks for AI accountability remain underdeveloped even for simple systems; agents complicate everything.

**Labor displacement**: If agents can do knowledge work, what happens to knowledge workers? The software developer who once seemed immune to automation now watches agents write code. The lawyer who thought legal reasoning was uniquely human now sees agents draft contracts. The disruption that LLMs began, agents may accelerate.

**Power concentration**: Building capable agents requires frontier models, which require enormous resources. The agent era may concentrate power further in the hands of well-funded AI labs and the companies that deploy their products.

The agent revolution is real but incomplete. The technology works better than skeptics admit and worse than enthusiasts claim. The trajectory, however, seems clear: agents will become more capable, more autonomous, and more integrated into daily life. The only questions are how fast and at what cost.

## See Also

- [[Artificial Intelligence]]
- [[Large Language Model]]
- [[Machine Learning]]
- [[Reinforcement Learning]]
- [[Model Context Protocol]]
- [[ChatGPT]]
- [[Claude]]
- [[AutoGPT]]
