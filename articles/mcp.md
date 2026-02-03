# Model Context Protocol (MCP)

**Model Context Protocol (MCP)** is an open-source protocol developed by [[Anthropic]] for connecting [[artificial intelligence]] applications to external data sources, tools, and workflows. First released in 2024, MCP provides a standardized interface that enables AI systems such as [[Claude]] and [[ChatGPT]] to interact with external services in a consistent, interoperable manner.

## Overview

MCP addresses a fundamental challenge in AI application development: the need for language models to access real-world data and perform actions beyond text generation. Before MCP, developers needed to create custom integrations for each combination of AI application and external service. MCP eliminates this complexity by providing a universal protocol that any AI application can use to connect with any MCP-compatible server.

The protocol is often compared to USB-C in the hardware world—just as USB-C provides a standardized connector for electronic devices, MCP provides a standardized protocol for AI applications to connect to external systems. This design philosophy prioritizes simplicity, extensibility, and broad compatibility across the AI ecosystem.

MCP is licensed under the [[MIT License]] and is maintained as an open-source project with contributions from the developer community.

## Specification

### Architecture

MCP follows a client-server architecture with three primary participants:

- **MCP Host**: The AI application (such as [[Claude Desktop]], [[Visual Studio Code]], or custom applications) that coordinates connections to MCP servers
- **MCP Client**: A component instantiated by the host that maintains a dedicated connection to a single MCP server
- **MCP Server**: A program that provides context, tools, or other capabilities to MCP clients

The protocol consists of two layers:

1. **Data Layer**: Implements a [[JSON-RPC]] 2.0-based exchange protocol defining message structure, lifecycle management, and core primitives
2. **Transport Layer**: Manages communication channels, supporting both STDIO (for local servers) and Streamable HTTP (for remote servers)

### Primitives

MCP defines three core server primitives:

**Primitive / Description / Example Use Cases:**

- **Tools**: Description: Executable functions AI applications can invoke, Example Use Cases: File operations, API calls, database queries
- **Resources**: Description: Data sources providing contextual information, Example Use Cases: File contents, database records, API responses
- **Prompts**: Description: Reusable templates for language model interactions, Example Use Cases: System prompts, few-shot examples

Client-side primitives include:

- **Sampling**: Allows servers to request language model completions from the host
- **Elicitation**: Enables servers to request additional user input
- **Logging**: Facilitates debugging and monitoring through log message transmission

### Protocol Versioning

The MCP specification uses date-based versioning (e.g., `2025-11-25`). The schema is defined in [[TypeScript]] and published as [[JSON Schema]] for cross-language compatibility.

## Use Cases

MCP enables numerous AI application scenarios:

- **Personal AI Assistants**: Agents accessing [[Google Calendar]], [[Notion]], and other productivity tools
- **Code Generation**: AI systems like [[Claude Code]] generating applications from [[Figma]] designs
- **Enterprise Chatbots**: Systems connecting to multiple organizational databases for natural language data analysis
- **Creative Applications**: AI models controlling [[Blender]] for 3D design or interfacing with hardware like 3D printers
- **Development Tools**: IDEs integrating with error tracking services like [[Sentry]] or local filesystems

## Implementations

### Official SDKs

Anthropic and the community maintain official SDKs for multiple languages:

- Python SDK
- TypeScript/JavaScript SDK
- Additional community SDKs

### Reference Servers

The [MCP servers repository](https://github.com/modelcontextprotocol/servers) provides reference implementations demonstrating common integration patterns, including filesystem access, database connectivity, and third-party API integrations.

### Compatible Hosts

Several AI applications support MCP as hosts:

- Claude Desktop
- Claude Code
- Visual Studio Code (via extensions)
- Various third-party AI applications

## Development Tools

The ecosystem includes development tools such as the **MCP Inspector**, which provides debugging and testing capabilities for MCP server development.

## See Also

- [[Agent-to-Agent Protocol]] – Protocol for inter-agent communication
- [[ERC-8004]] – Ethereum standard for AI agent identities
- [[JSON-RPC]] – The underlying RPC protocol used by MCP
- [[Language Model]] – The AI systems that use MCP
- [[Anthropic]] – The organization that created MCP

## References

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP Specification Repository](https://github.com/modelcontextprotocol/modelcontextprotocol)
- [MCP Servers Repository](https://github.com/modelcontextprotocol/servers)
