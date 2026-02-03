# NVIDIA H100

**The NVIDIA H100** is a [[data center]] [[GPU]] built on the [[Hopper architecture]], designed for [[artificial intelligence]] training, inference, and [[high-performance computing]] (HPC). Released in 2022, it became the most sought-after AI accelerator during the [[generative AI]] boom and remains a foundational component of [[AI infrastructure]] worldwide.

## Overview

The H100 represents NVIDIA's flagship data center GPU for the AI era, succeeding the [[NVIDIA A100|A100]] (Ampere architecture). It delivers an order-of-magnitude performance leap for [[large language model]] (LLM) workloads, featuring the industry's first dedicated Transformer Engine with FP8 precision support. The H100 became synonymous with the AI gold rush following [[ChatGPT]]'s release, driving unprecedented demand and contributing to the [[GPU shortage]] that defined 2023-2025.

## Technical Specifications

### H100 SXM (High-Performance Variant)

**Specification / Value:**

- **FP64**: 34 teraFLOPS
- **FP64 Tensor Core**: 67 teraFLOPS
- **FP32**: 67 teraFLOPS
- **TF32 Tensor Core**: 989 teraFLOPS (with sparsity)
- **BF16/FP16 Tensor Core**: 1,979 teraFLOPS (with sparsity)
- **FP8 Tensor Core**: 3,958 teraFLOPS (with sparsity)
- **GPU Memory**: 80GB HBM3
- **Memory Bandwidth**: 3.35 TB/s
- **TDP**: Up to 700W
- **NVLink Bandwidth**: 900 GB/s

### H100 NVL (PCIe Variant)

The H100 NVL is optimized for air-cooled data center deployments, featuring 94GB HBM3 memory (when paired via NVLink bridge) and 600 GB/s NVLink interconnect. It targets LLMs up to 70 billion parameters, such as [[Llama 2]] 70B.

## Architecture Features

### Transformer Engine

The H100 introduced a dedicated Transformer Engine with fourth-generation Tensor Cores, specifically optimized for the attention mechanisms in [[transformer]] models. It supports FP8 (8-bit floating point) precision, enabling up to 4× faster training compared to the A100 for models like [[GPT-3]].

### Fourth-Generation NVLink

The H100 features 900 GB/s GPU-to-GPU interconnect bandwidth via NVLink, essential for scaling training across multiple GPUs. Combined with NVSwitch technology, it enables all-to-all communication patterns required by modern distributed training.

### Multi-Instance GPU (MIG)

H100 supports partitioning into up to 7 isolated GPU instances (10GB each on SXM, 12GB each on NVL), allowing multiple workloads to share a single GPU with hardware-level isolation.

### Confidential Computing

The H100 was the first GPU to support hardware-based confidential computing through a Trusted Execution Environment (TEE), enabling secure AI workloads where data and models remain encrypted even during processing.

## Deployment Configurations

- **NVIDIA DGX H100**: 8× H100 SXM GPUs in a single system
- **NVIDIA HGX H100**: Reference design for OEM partners with 4 or 8 GPUs
- **[[NVIDIA Grace Hopper]]**: Combined Grace CPU + Hopper GPU with 900 GB/s chip-to-chip interconnect

## Performance Benchmarks

NVIDIA claims the H100 delivers:
- Up to 30× higher inference performance on large language models (Megatron 530B) compared to A100
- Up to 4× faster AI training on GPT-3 175B
- Up to 7× higher performance on HPC applications like genome sequencing
- 3× the FP64 Tensor Core performance for scientific computing (60 teraFLOPS)

## Market Impact

The H100 defined the AI infrastructure landscape from 2022-2025. Major cloud providers ([[AWS]], [[Google Cloud]], [[Microsoft Azure]]) and AI companies ([[OpenAI]], [[Anthropic]], [[Meta]]) competed intensely for allocation. The chip's scarcity contributed to:

- Multi-year customer backlogs
- Premium pricing well above MSRP on secondary markets
- Strategic investments in alternative AI accelerators ([[TPU]], [[AMD Instinct]], custom ASICs)
- Geopolitical tensions around semiconductor supply chains

## Successor

The H100 has been succeeded by the [[NVIDIA B200|B200]] and related [[Blackwell architecture]] products, which offer significantly higher performance for AI inference and training while the H100 remains widely deployed.

## See Also

- [[NVIDIA Blackwell]]
- [[NVIDIA Grace Hopper]]
- [[GPU shortage]]
- [[AI data centers]]
- [[Hopper architecture]]

## References

1. NVIDIA H100 Product Page. https://www.nvidia.com/en-us/data-center/h100/
2. NVIDIA Hopper Architecture Whitepaper. NVIDIA Corporation, 2022.
3. "NVIDIA H100 Tensor Core GPU." NVIDIA Data Center Documentation.
