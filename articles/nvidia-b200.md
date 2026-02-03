# NVIDIA Blackwell B200

**The NVIDIA B200** (and related GB200) is [[NVIDIA]]'s flagship [[AI accelerator]] based on the [[Blackwell architecture]], announced in March 2024 and entering full production in late 2024. It represents a generational leap in AI compute, specifically designed for trillion-parameter models and the emerging era of AI reasoning and [[agentic AI]].

## Overview

The Blackwell architecture powers what NVIDIA calls "AI factories"—purpose-built data centers for training and serving massive AI models. The B200 GPU packs 208 billion transistors across two reticle-limited dies connected by a 10 TB/s chip-to-chip interconnect, functioning as a single unified GPU. This "superchip" design enables unprecedented performance for [[generative AI]] workloads.

## Technical Architecture

### Manufacturing and Design

- **Process**: Custom TSMC 4NP (4nm-class)
- **Transistors**: 208 billion
- **Die Configuration**: Two reticle-limited dies with 10 TB/s interconnect
- **Design Philosophy**: Single logical GPU from multiple physical dies

### Second-Generation Transformer Engine

The Blackwell Transformer Engine introduces:

- **FP4 (4-bit floating point)**: Doubles performance and model capacity compared to FP8
- **Micro-tensor scaling**: Fine-grained precision control for accuracy preservation
- **MXFP4/MXFP6 support**: New microscaling formats defined by industry standards
- **1.5× more AI compute FLOPS** compared to Hopper (on Blackwell Ultra variants)

### Fifth-Generation NVLink

- **576 GPU scalability**: Single NVLink domain can span 576 GPUs
- **130 TB/s bandwidth**: In a 72-GPU NVLink domain (NVL72)
- **SHARP FP8 support**: 4× bandwidth efficiency with in-network computing
- **NVLink Switch Chip**: Enables multi-server clusters at 1.8 TB/s per link

## Product Configurations

### GB200 NVL72

The flagship rack-scale system connecting:
- 36 NVIDIA Grace CPUs
- 72 Blackwell GPUs
- Liquid-cooled design
- Acts as a single massive GPU for trillion-parameter models
- **30× faster real-time inference** vs. Hopper for trillion-parameter LLMs

### GB300 NVL72

Enhanced version announced for late 2025:
- **65× more AI compute** than Hopper systems
- Optimized for AI reasoning inference
- Targeted at next-generation [[reasoning models]]

### HGX B300

Standard 8-GPU board configuration:
- Enhanced compute and increased memory
- For enterprise AI infrastructure

### DGX SuperPOD

Turnkey AI data center solution:
- Scalable from single racks to exascale
- Full NVIDIA software stack integration
- NVIDIA Mission Control management

### DGX Spark

Compact personal AI supercomputer:
- GB10 Grace Blackwell Superchip
- 128GB unified memory
- Models up to 200 billion parameters
- Desktop form factor for developers

### DGX Station

Desktop AI supercomputer:
- GB300 Grace Blackwell Ultra Desktop Superchip
- 784GB coherent memory
- For researchers and data scientists

## Key Innovations

### Decompression Engine

Hardware acceleration for data analytics:
- Supports LZ4, Snappy, Deflate compression formats
- 900 GB/s bidirectional bandwidth to Grace CPU
- Accelerates database queries and Apache Spark workloads

### RAS Engine (Reliability, Availability, Serviceability)

AI-powered infrastructure management:
- Predictive fault detection
- Continuous health monitoring across thousands of data points
- Reduces downtime through proactive maintenance
- Diagnostic information for rapid issue localization

### Confidential Computing

Enhanced security features:
- First TEE-I/O capable GPU
- Inline protection over NVLink
- Near-identical throughput vs. unencrypted modes
- Protects AI intellectual property during training/inference

## Economic Impact

NVIDIA claims exceptional ROI for Blackwell deployments:
- A $5M investment in GB200 NVL72 can generate $75M in token revenue
- 15× return on investment for inference services
- Driven by co-optimization across hardware, NVLink, and software (TensorRT-LLM, Dynamo)

## Software Ecosystem

Blackwell systems are optimized for:
- **[[TensorRT-LLM]]**: NVIDIA's inference optimization library
- **[[NeMo Framework]]**: For training and fine-tuning LLMs
- **[[NVIDIA Dynamo]]**: Distributed inference orchestration
- **Community frameworks**: vLLM, SGLang support
- **[[NVIDIA NIM]]**: Microservices for enterprise AI deployment

## See Also

- [[NVIDIA H100]]
- [[Blackwell architecture]]
- [[AI data centers]]
- [[AI chips market]]
- [[NVIDIA Grace]]

## References

1. NVIDIA Blackwell Architecture. https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/
2. "NVIDIA Blackwell Platform." NVIDIA GTC 2024 Announcement.
3. NVIDIA DGX Platform Documentation. https://www.nvidia.com/en-us/data-center/dgx-platform/
