# OpenAI Assistants API

The **OpenAI Assistants API** was OpenAI's framework for building AI agents with persistent state, tool use, and multi-turn conversations. Launched in late 2023, it represented OpenAI's first major effort to enable developers to create autonomous agents capable of executing code, retrieving information, and maintaining context across interactions. As of 2026, the Assistants API has been deprecated in favor of the [[Responses API]], with a shutdown date of August 26, 2026.

## Overview

The Assistants API provided a higher-level abstraction for building AI applications compared to the basic [[Chat Completions API]]. Where Chat Completions required developers to manually manage conversation history and tool execution, Assistants handled these concerns automatically through persistent server-side state management.

An Assistant was a persistent API object that bundled together a model choice, system instructions, and tool declarations. When users interacted with an Assistant, conversations were stored in Threads—server-side collections of messages that maintained context indefinitely. The execution of an Assistant against a Thread was called a Run, which handled the complete lifecycle of generating responses, calling tools, and producing outputs.

## Features

The Assistants API introduced several capabilities that distinguished it from simpler API offerings:

**Code Interpreter** allowed Assistants to write and execute [[Python]] code in a sandboxed environment. This enabled mathematical computations, data analysis, file manipulation, and chart generation without requiring developers to provision compute infrastructure.

**File Retrieval** (later called Knowledge Retrieval) enabled Assistants to search through uploaded documents using [[Retrieval-Augmented Generation]] (RAG) techniques. Developers could upload PDFs, text files, and other documents that the Assistant would automatically index and query when relevant.

**Function Calling** permitted Assistants to invoke developer-defined functions, enabling integration with external systems, databases, and APIs. The Assistant would determine when to call functions based on the conversation context and return structured arguments for the developer's code to execute.

**Persistent Threads** maintained conversation history server-side, eliminating the need for developers to manage context windows and message histories. Threads could store unlimited messages and were accessible across sessions.

## Architecture

The Assistants API employed a three-tier architecture:

**Assistants** served as reusable configuration objects containing the model, instructions, tool definitions, and metadata. A single Assistant could be shared across many users and conversations.

**Threads** represented individual conversation contexts. Each Thread contained an ordered sequence of Messages from users and the Assistant. Threads were independent of Assistants, allowing the same conversation to potentially use different Assistants.

**Runs** represented the execution of an Assistant on a Thread. When created, a Run would process the Thread's messages, potentially invoke tools, and generate new messages. Runs were asynchronous, requiring polling to check completion status.

This architecture provided clear separation of concerns but introduced complexity through asynchronous execution patterns and the need for status polling.

## Use Cases

The Assistants API found application across numerous domains:

**Customer Support Bots** leveraged persistent Threads and Knowledge Retrieval to maintain context across customer interactions while accessing company documentation to provide accurate responses.

**Data Analysis Agents** used Code Interpreter to process uploaded datasets, generate visualizations, and perform statistical analyses through natural language instructions.

**Research Assistants** combined file retrieval with function calling to search through document collections and integrate with external knowledge bases.

**Coding Assistants** utilized Code Interpreter to help debug code, explain concepts through executable examples, and prototype solutions.

## Migration to Responses API

OpenAI deprecated the Assistants API after achieving feature parity with the new [[Responses API]]. The migration involves conceptual shifts:

- **Assistants → Prompts**: Configuration objects are now version-controlled Prompts managed through OpenAI's dashboard
- **Threads → Conversations**: Message collections become Conversations storing generalized Items (messages, tool calls, outputs)
- **Runs → Responses**: Synchronous execution replaces asynchronous polling, with explicit tool call management

The Responses API offers improved performance, simpler mental models, and access to new capabilities like [[Deep Research]], [[Model Context Protocol]] (MCP) integration, and [[Computer Use]].

## See Also

- [[Responses API]]
- [[Chat Completions API]]
- [[Function Calling]]
- [[Retrieval-Augmented Generation]]
- [[AI Agents]]
- [[OpenAI]]

## References

- OpenAI Platform Documentation: Assistants Migration Guide (2026)
- OpenAI Developer Blog: "Introducing Assistants API" (November 2023)
- OpenAI Cookbook: Building with Assistants API
