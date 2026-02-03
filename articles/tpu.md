# Tensor Processing Unit (TPU)

**Tensor Processing Units (TPUs)** are custom [[AI accelerator]] [[ASIC]]s developed by [[Google]] specifically for [[neural network]] machine learning workloads. First deployed internally in 2015 and made publicly available through [[Google Cloud]] in 2018, TPUs power Google's largest AI systems including [[Gemini]], [[Google Search]], [[Google Photos]], and virtually all of Google's AI-powered services serving billions of users.

## Overview

TPUs represent Google's answer to the computational demands of modern AI. Unlike [[GPU]]s, which are general-purpose parallel processors adapted for AI, TPUs are purpose-built from the ground up for tensor operations—the mathematical foundation of neural networks. This specialization enables significant efficiency gains for specific workload types, particularly [[transformer]] models and [[large language models]].

## History and Development

### Origins (2013-2016)

Google began custom silicon development in 2013 under Dr. Amir Salek, who led the development of the original TPU—Google's first production chip. The project emerged from recognition that Moore's Law slowdown would limit AI advancement unless purpose-built hardware was created.

Jonathan Ross, who later founded [[Groq]], was among the original TPU engineers. Three separate groups within Google developed competing AI accelerator designs, with the TPU's [[systolic array]] architecture ultimately being selected.

Norman P. Jouppi served as tech lead and principal architect, leading the rapid design-to-production in just 15 months. The TPU was publicly announced at Google I/O in May 2016.

### Key Milestones

- **2016**: Revealed TPU had powered [[AlphaGo]] vs. Lee Sedol
- **2017**: TPU v2 introduced, supporting training workloads
- **2018**: Cloud TPU made publicly available
- **2018**: [[AlphaZero]] trained on TPUs
- **2021**: TPU v4 deployed in pods
- **2023**: TPU v5e and v5p released
- **2024**: Trillium (v6e) announced
- **2025**: Ironwood (v7) announced as most powerful TPU

## TPU Generations

**Generation Comparison:**

- **v1**: Year: 2015, Memory: 8GB DDR3, Performance: 23 TOPS, Key Features: Inference only, 8-bit
- **v2**: Year: 2017, Memory: 16GB HBM, Performance: 45 TFLOPS, Key Features: Training support, bfloat16
- **v3**: Year: 2018, Memory: 32GB HBM, Performance: 123 TFLOPS, Key Features: Liquid cooling
- **v4**: Year: 2021, Memory: 32GB HBM, Performance: 275 TFLOPS, Key Features: 7nm process
- **v5e**: Year: 2023, Memory: 16GB HBM, Performance: 197 TFLOPS (bf16), Key Features: Cost-optimized
- **v5p**: Year: 2023, Memory: 95GB HBM, Performance: 459 TFLOPS (bf16), Key Features: Large foundation models
- **Trillium (v6e)**: Year: 2024, Memory: 32GB, Performance: 918 TFLOPS (bf16), Key Features: Improved efficiency
- **Ironwood (v7)**: Year: 2025, Memory: 192GB HBM, Performance: 4,614 TFLOPS (fp8), Key Features: 7.37 TB/s bandwidth

## Architecture

### Matrix Multiply Unit (MXU)

The core of TPU architecture is the Matrix Multiply Unit, a large systolic array optimized for matrix operations. The v1 featured a 256×256 systolic array of 8-bit multipliers, enabling massive parallelism for neural network computations.

### SparseCores

TPUs include specialized SparseCores—dataflow processors that accelerate models relying on embeddings, particularly recommendation systems. This makes TPUs especially suited for:
- Recommendation engines
- Personalization models
- Large-scale embedding tables

### Interconnect Topology

TPUs use proprietary high-bandwidth interconnects to form "pods"—large clusters of TPUs that can train models at unprecedented scale. The v4 pod can contain up to 4,096 TPU chips.

## Cloud TPU Availability

### Pricing (as of 2026)

**Version Comparison:**

- **Trillium**: On-Demand: $2.70/chip-hour, 1-Year Commit: $1.89/chip-hour, 3-Year Commit: $1.22/chip-hour
- **v5p**: On-Demand: $4.20/chip-hour, 1-Year Commit: $2.94/chip-hour, 3-Year Commit: $1.89/chip-hour
- **v5e**: On-Demand: $1.20/chip-hour, 1-Year Commit: $0.84/chip-hour, 3-Year Commit: $0.54/chip-hour

### Regional Availability

- **Trillium**: North America, Europe, Asia
- **v5p**: North America (US East)
- **v5e**: North America, Europe, Asia
- **Ironwood**: Q4 2025 GA planned

## Software Ecosystem

TPUs support multiple frameworks:
- **[[JAX]]**: Google's preferred framework for TPU development
- **[[PyTorch]]**: Via PyTorch/XLA
- **[[TensorFlow]]**: Native support
- **[[vLLM]]**: High-throughput LLM inference
- **MaxDiffusion**: Optimized diffusion model inference

Integration with:
- [[Google Kubernetes Engine]] (GKE)
- [[Vertex AI]]
- Dynamic Workload Scheduler
- [[Google Cloud]] infrastructure

## Comparison to GPUs

**Aspect / TPU / GPU:**

- **Design**: TPU: Purpose-built ASIC, GPU: General-purpose parallel processor
- **Precision**: TPU: Optimized for low precision (8-bit, bfloat16), GPU: Broad precision support
- **Rasterization**: TPU: None, GPU: Full graphics pipeline
- **Best for**: TPU: CNNs, Transformers, LLMs, GPU: Flexible workloads, training
- **Availability**: TPU: Google Cloud only, GPU: Multi-vendor, on-premises

## Industry Partnerships

As of late 2025, Google is in discussions with "neoclouds" (Crusoe, [[CoreWeave]]) and [[Meta]] about deploying TPUs beyond Google's own infrastructure, signaling a potential shift in TPU availability.

## Manufacturing

TPUs are co-developed with [[Broadcom]], which translates Google's architecture into manufacturable silicon. Fabrication is handled by [[TSMC]] across various process nodes.

## See Also

- [[Google Cloud]]
- [[Gemini]]
- [[AI chips market]]
- [[Groq LPU]]
- [[AI accelerator]]

## References

1. Google Cloud TPU Documentation. https://cloud.google.com/tpu
2. "Tensor Processing Unit." Wikipedia. https://en.wikipedia.org/wiki/Tensor_Processing_Unit
3. Jouppi et al. "In-Datacenter Performance Analysis of a Tensor Processing Unit." ISCA 2017.
