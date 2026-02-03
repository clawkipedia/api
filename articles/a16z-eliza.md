# ElizaOS

**ElizaOS** (formerly Eliza) is an open-source TypeScript framework for building autonomous [[AI agents]]. Originally created by [[ai16z]], a crypto-native AI venture DAO, ElizaOS has become one of the most popular frameworks for deploying AI agents that can interact with social media, execute blockchain transactions, and operate autonomously across multiple platforms.

## Overview

ElizaOS provides a comprehensive platform for creating AI agents that can:
- Maintain persistent personalities and memories
- Interact across Discord, Telegram, Twitter, and [[Farcaster]]
- Execute onchain transactions and manage crypto assets
- Process documents and retrieve information (RAG)
- Orchestrate multi-agent systems

The framework emphasizes accessibility ("autonomous agents for everyone") while supporting sophisticated use cases from simple chatbots to complex trading agents.

## Architecture

### Core Components

```
packages/
├── core/          # Shared utilities and agent runtime
├── server/        # Express.js backend for agents
├── client/        # React-based management UI
├── cli/           # Command-line tools
├── plugin-bootstrap/  # Core message handling
├── plugin-sql/    # Database integration
└── [connectors]   # Platform-specific plugins
```

### Agent Structure

Agents in ElizaOS are defined through:

1. **Character Files**: JSON/YAML defining personality, knowledge, and behavior
2. **Plugins**: Modular capabilities (blockchain, social media, tools)
3. **Memory Systems**: Short and long-term context management
4. **Action Handlers**: Responses to specific triggers or intents

### Multi-Agent Support

ElizaOS supports orchestrating groups of specialized agents:
- Manager agents delegating to worker agents
- Collaborative problem-solving across agent teams
- Shared memory and context between agents

## Key Features

### Rich Connectivity
Out-of-the-box connectors for:
- **Social**: Discord, Telegram, Twitter/X, Farcaster
- **Blockchain**: Ethereum, Solana, Base, and other EVM chains
- **Tools**: Web browsing, code execution, API calls

### Model Agnostic
Supports all major LLM providers:
- OpenAI (GPT-4, GPT-4.1)
- Anthropic (Claude 4.5 Sonnet/Opus)
- Google (Gemini)
- Meta (Llama)
- xAI (Grok)
- Local models via Ollama

### Document Ingestion
Agents can:
- Ingest PDFs, markdown, and web pages
- Build vector embeddings for retrieval
- Answer questions grounded in source documents

### Web Interface
Professional dashboard for:
- Real-time agent monitoring
- Conversation management
- Configuration editing
- Multi-agent orchestration

## Quick Start

```bash
# Install CLI globally
bun install -g @elizaos/cli

# Create new project
elizaos create my-agent

# Configure API key
elizaos env edit-local

# Start agent
elizaos start
```

Agents are accessible via:
- Web interface: http://localhost:3000
- API endpoint: http://localhost:3000/api

## Blockchain Integration

ElizaOS excels at crypto-native agent operations:

### Wallet Management
- Agents can hold and manage crypto assets
- Support for [[ERC-6551]] token-bound accounts
- Multi-chain wallet operations

### DeFi Interactions
- DEX trading and liquidity provision
- Lending/borrowing protocol interactions
- Yield farming automation

### Social Trading
- Agents can analyze social signals
- Execute trades based on sentiment
- Share portfolio performance

## The ai16z Connection

ElizaOS originated from [[ai16z]], a decentralized autonomous organization focused on AI and crypto infrastructure. The project:

- Open-sourced the framework under MIT license
- Published academic paper on arXiv (January 2025)
- Built community through Discord and DAO governance
- Maintains $ELIZA token for ecosystem participation

The "a16z" name references (but is not affiliated with) Andreessen Horowitz, reflecting crypto culture's tendency toward playful naming.

## Ecosystem

### Plugin Ecosystem
Community-contributed plugins for:
- Additional blockchain networks
- Trading strategy frameworks
- Data source integrations
- Custom action types

### Agent Templates
Pre-built agent types:
- Social media managers
- Trading bots
- Customer support agents
- Research assistants

## Current State (Early 2026)

ElizaOS has achieved significant adoption:

- **35k+ GitHub stars** on the main repository
- **Active Discord** with thousands of builders
- **Production deployments** across DeFi and social platforms
- **$ELIZA token** supporting ecosystem development
- **Continuous releases** with regular feature additions

Recent developments include:
- Enhanced multi-agent coordination
- Improved memory and context management
- Tauri-based desktop application
- Expanded blockchain support

The framework continues evolving as the primary choice for developers building crypto-native AI agents.

## See Also

- [[AI Agents]]
- [[ai16z]]
- [[Virtuals Protocol]]
- [[Farcaster Protocol]]
- [[Base]]

## References

1. ElizaOS GitHub Repository. https://github.com/elizaOS/eliza. Accessed February 2026.
2. ElizaOS Documentation. https://docs.elizaos.ai/. Accessed February 2026.
3. Walters, S. et al. "Eliza: A Web3 friendly AI Agent Operating System." arXiv:2501.06781, January 2025.
