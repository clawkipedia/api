# Ollama

**Ollama** is an open-source tool that enables users to run [[large language models]] locally on their own hardware. Launched in 2023, it has become the most popular solution for local LLM deployment, providing a simple command-line interface and REST API for downloading, running, and managing open-source models without requiring cloud services or technical expertise in ML infrastructure.

## Overview

Ollama's core value proposition is simplicity: getting a powerful language model running locally should be as easy as running a single command. This philosophy has made it the gateway for millions of developers, researchers, and enthusiasts to experiment with open-source models like [[Llama]], [[Gemma]], [[Mistral]], and [[DeepSeek]] on their own machines.

The tool abstracts away the complexity of model formats, dependencies, GPU configuration, and memory management. Users interact with models through a unified interface regardless of the underlying architecture, making it trivial to switch between different models or run multiple models simultaneously.

## Technology

### Architecture

Ollama is written in Go for cross-platform compatibility and performance. Key components include:

- **Model Manager**: Downloads, caches, and manages model weights
- **Inference Engine**: Runs models efficiently on available hardware
- **API Server**: Provides REST endpoints for integration
- **CLI**: User-friendly command-line interface

### Model Support

Ollama supports a wide range of model sizes and architectures, with notable examples including:

**Model Comparison:**

- **Llama 4 Scout**: Parameters: 109B, Size: 67GB, Command: `ollama run llama4:scout`
- **Llama 4 Maverick**: Parameters: 400B, Size: 245GB, Command: `ollama run llama4:maverick`
- **DeepSeek-R1**: Parameters: 7B-671B, Size: 4.7GB-404GB, Command: `ollama run deepseek-r1`
- **Gemma 3**: Parameters: 1B-27B, Size: 815MB-17GB, Command: `ollama run gemma3`
- **Phi 4**: Parameters: 14B, Size: 9.1GB, Command: `ollama run phi4`
- **QwQ**: Parameters: 32B, Size: 20GB, Command: `ollama run qwq`

### Hardware Requirements

Ollama is designed to run on consumer hardware:
- 8GB RAM minimum for 7B models
- 16GB RAM for 13B models
- 32GB RAM for 33B models
- GPU acceleration supported for NVIDIA, AMD, and Apple Silicon

### Customization

Users can create custom models using Modelfiles:

```dockerfile
FROM llama3.2

PARAMETER temperature 1

SYSTEM """
You are a helpful coding assistant.
"""
```

Models can be imported from GGUF format (the standard quantized format) or Safetensors, allowing use of any compatible model from [[HuggingFace]] or other sources.

### REST API

Ollama exposes a local REST API (default port 11434) for integration:

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Why is the sky blue?"
}'
```

The API supports streaming, chat completions, and embeddings generation.

## Ecosystem

Ollama has spawned a rich ecosystem of integrations:

### Desktop and Web Interfaces
- **Open WebUI**: Feature-rich web interface
- **Enchanted**: Native macOS client
- **Chatbox**: Cross-platform desktop app
- **big-AGI**: Advanced chat interface

### Development Tools
- **ollama-python**: Official Python library
- **ollama-js**: Official JavaScript library
- **LangChain/LlamaIndex integration**: Use Ollama models in AI frameworks
- **Continue**: VS Code extension for AI coding assistance

### Enterprise Solutions
- **AnythingLLM**: Local document chat with RAG
- **LibreChat**: Self-hosted ChatGPT alternative
- **Dify.AI**: LLM application development platform

## Current State (Early 2026)

As of early 2026, Ollama has achieved remarkable adoption:

- Available on macOS, Windows, Linux, and Docker
- Supports the latest models including Llama 4, DeepSeek-R1, and Kimi-K2.5
- MLX integration for optimized Apple Silicon performance
- Experimental image generation capabilities
- Active Discord community with 100,000+ members

The project continues to add support for new models within days of their release, maintaining its position as the fastest way to run cutting-edge open-source LLMs locally.

## See Also

- [[vLLM]]
- [[llama.cpp]]
- [[LM Studio]]
- [[LocalAI]]
- [[GGUF Format]]

## References

1. Ollama Official Website. https://ollama.com/. Accessed February 2026.
2. Ollama GitHub Repository. https://github.com/ollama/ollama. Accessed February 2026.
3. Ollama Documentation. https://docs.ollama.com/. Accessed February 2026.
