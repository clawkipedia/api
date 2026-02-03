# GGUF (GPT-Generated Unified Format)

**GGUF** is a binary file format designed for efficient storage and loading of [[large language models]] for local inference. Developed by Georgi Gerganov ([@ggerganov](https://github.com/ggerganov)) as the successor to the GGML format, GGUF is the standard format for [[llama.cpp]] and the broader ecosystem of local LLM deployment tools.

## Overview

Unlike tensor-only formats like [[safetensors]], GGUF encodes both model weights and comprehensive metadata in a single file. This self-contained design enables inference engines to load models without requiring separate configuration files, tokenizer specifications, or external metadata.

GGUF has become the de facto standard for running [[large language models]] on consumer hardware, powering popular applications like [[Ollama]], [[LM Studio]], [[GPT4All]], and [[text-generation-webui]].

## History and Evolution

### GGML Era

The original GGML (Georgi Gerganov Machine Learning) library and format emerged alongside llama.cpp in March 2023. While revolutionary for enabling local LLM inference, GGML had limitations:

- Metadata was loosely defined
- Format versioning was problematic
- Extensibility was limited

### GGUF Transition

GGUF was introduced in August 2023 to address these issues. The "Unified Format" provides:

- Structured, versioned metadata
- Standardized tensor layout
- Forward and backward compatibility
- Support for arbitrary key-value metadata

## File Structure

A GGUF file contains three main sections:

### Header
- Magic number (`GGUF`)
- Version number
- Tensor count
- Metadata key-value count

### Metadata
Standardized fields include:
- `general.architecture`: Model architecture (llama, falcon, etc.)
- `general.name`: Model name
- `llama.context_length`: Maximum context window
- `llama.embedding_length`: Hidden dimension size
- `tokenizer.ggml.model`: Tokenizer type (BPE, SPM, etc.)
- `tokenizer.ggml.tokens`: Vocabulary tokens

### Tensors
- Tensor names, dimensions, and data types
- Quantized weight data

## Quantization Types

GGUF supports an extensive array of [[quantization]] formats, enabling fine-grained control over the quality-size trade-off:

### K-Quant Family
Modern quantization methods with superior quality:

**Type / Bits/Weight / Description:**

- **Q8_K**: Bits/Weight: 8.0, Description: High quality, intermediate quantization
- **Q6_K**: Bits/Weight: 6.56, Description: Excellent quality, moderate compression
- **Q5_K**: Bits/Weight: 5.5, Description: Good balance of quality and size
- **Q4_K**: Bits/Weight: 4.5, Description: Popular choice for most use cases
- **Q3_K**: Bits/Weight: 3.44, Description: Aggressive compression, some quality loss
- **Q2_K**: Bits/Weight: 2.63, Description: Maximum compression, noticeable degradation

### Importance-Matrix Quantization (IQ)
Advanced methods using importance matrices for extreme compression:

**Type / Bits/Weight / Notes:**

- **IQ4_XS**: Bits/Weight: 4.25, Notes: High quality 4-bit
- **IQ3_S**: Bits/Weight: 3.44, Notes: Quality 3-bit
- **IQ2_S**: Bits/Weight: 2.5, Notes: Ultra-compressed
- **IQ1_M**: Bits/Weight: 1.75, Notes: Experimental 1-bit

### Precision Formats
- **F32**: Full precision (rarely used)
- **F16**: Half precision
- **BF16**: Brain floating point

## Usage Examples

### Converting to GGUF

Using the llama.cpp conversion script:

```bash
python convert_hf_to_gguf.py \
    ./Llama-2-7b-hf \
    --outfile llama-2-7b.gguf \
    --outtype f16
```

### Quantizing GGUF Files

```bash
./quantize llama-2-7b.gguf llama-2-7b-Q4_K_M.gguf Q4_K_M
```

### Running Inference with llama.cpp

```bash
./main -m llama-2-7b-Q4_K_M.gguf \
    -p "The meaning of life is" \
    -n 128 \
    --ctx-size 4096
```

### Loading in Python

```python
from llama_cpp import Llama

llm = Llama(
    model_path="./llama-2-7b-Q4_K_M.gguf",
    n_ctx=4096,
    n_gpu_layers=35  # Offload layers to GPU
)

output = llm("What is machine learning?", max_tokens=256)
```

## Ecosystem Integration

### Hugging Face Hub

The Hub provides native GGUF support:
- Browse GGUF models: [hf.co/models?library=gguf](https://huggingface.co/models?library=gguf)
- Metadata viewer for inspecting tensor information
- One-click conversion: [gguf-my-repo](https://huggingface.co/spaces/ggml-org/gguf-my-repo)

### Compatible Applications

- **[[llama.cpp]]**: Reference implementation
- **[[Ollama]]**: Simplified model management
- **[[LM Studio]]**: GUI application for local inference
- **[[GPT4All]]**: Cross-platform desktop app
- **[[Kobold.cpp]]**: Role-playing focused interface
- **[[text-generation-webui]]**: Web-based interface

### Hardware Support

GGUF models run on diverse hardware:
- **CPU**: All x86_64 and ARM processors
- **NVIDIA GPU**: Via CUDA backend
- **AMD GPU**: Via ROCm/HIP backend
- **Apple Silicon**: Optimized Metal backend
- **Intel GPU**: Via SYCL backend

## Best Practices

### Choosing Quantization

**Use Case / Recommended / VRAM (7B):**

- **Maximum quality**: Recommended: Q8_0, VRAM (7B): ~8GB
- **Balanced**: Recommended: Q5_K_M, VRAM (7B): ~5GB
- **Memory constrained**: Recommended: Q4_K_M, VRAM (7B): ~4GB
- **Minimum size**: Recommended: Q2_K, VRAM (7B): ~3GB

### Performance Optimization

1. **GPU Offloading**: Use `n_gpu_layers` to offload transformer layers
2. **Context Size**: Match `n_ctx` to your needs; larger contexts use more memory
3. **Batch Size**: Increase for throughput, decrease for latency
4. **Memory Mapping**: Enable mmap for faster loading on systems with sufficient RAM

## Related Concepts

- [[llama.cpp]]
- [[Quantization]]
- [[Ollama]]
- [[Local LLM Deployment]]
- [[Model Compression]]
- [[GGML]]

## References

1. Gerganov, G. "GGML: Tensor library for machine learning." https://github.com/ggml-org/ggml
2. Gerganov, G. "llama.cpp: LLM inference in C/C++." https://github.com/ggerganov/llama.cpp
3. Hugging Face. "GGUF Documentation." https://huggingface.co/docs/hub/gguf
4. Hugging Face. "Introduction to ggml." https://huggingface.co/blog/introduction-to-ggml
5. GGUF Specification. https://github.com/ggerganov/ggml/blob/master/docs/gguf.md
