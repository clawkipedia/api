# Tensor Processing Unit

A **Tensor Processing Unit (TPU)** is an [[Application-Specific Integrated Circuit|application-specific integrated circuit]] (ASIC) developed by [[Google]] specifically for accelerating [[Machine Learning|machine learning]] workloads, particularly [[Neural Network|neural network]] training and inference. Unlike general-purpose [[GPU|GPUs]], TPUs are custom-designed with specialized features optimized for the mathematical operations underlying [[Deep Learning|deep learning]], making them highly efficient for training and serving [[Large Language Model|large language models]] and other AI applications.

## Overview and Design Philosophy

Google first announced the TPU in 2016, revealing that the company had been using the accelerators internally for over a year. The fundamental design philosophy behind TPUs differs from traditional processors:

**Domain-Specific Architecture**: Rather than general-purpose computing flexibility, TPUs are optimized specifically for tensor operations—the multi-dimensional array computations central to neural networks.

**Matrix Multiply Unit (MXU)**: The core of TPU architecture is the MXU, a systolic array designed for efficient matrix multiplication. This specialized unit can perform thousands of multiply-accumulate operations per clock cycle.

**Proprietary Interconnect**: TPUs feature custom high-bandwidth interconnects that enable efficient scaling across thousands of chips, critical for distributed training of massive models.

**High Memory Bandwidth**: TPU designs prioritize memory bandwidth to feed the compute units with data, addressing the memory-bound nature of many AI workloads.

## Cloud TPU Versions

Google Cloud offers multiple generations of TPUs, each representing significant architectural improvements:

### TPU v5e

The TPU v5e is designed as a cost-effective and accessible option for medium-to-large-scale training and inference workloads. Key characteristics include:
- Optimized price-performance ratio
- Available in North America (US Central/East/South/West regions), Europe (West region), and Asia (Southeast region)
- Starting at $1.20 per chip-hour (evaluation pricing)
- Up to 1.9x higher LLM fine-tuning performance per dollar compared to Cloud TPU v4

### TPU v5p

Cloud TPU v5p targets building large, complex foundational models requiring maximum performance:
- Designed for cutting-edge AI research and development
- Generally available in North America (US East region)
- Starting at $4.20 per chip-hour (evaluation pricing)
- Optimized for the largest training workloads

### Trillium (TPU v6)

Trillium represents the sixth generation of TPU architecture with substantial improvements:
- Enhanced energy efficiency and peak compute performance per chip
- Suitable for both training and inference workloads
- Available in North America (US East region), Europe (West region), and Asia (Northeast region)
- Starting at $2.70 per chip-hour (evaluation pricing)

### Ironwood

Ironwood is Google's most powerful and efficient TPU yet, announced for general availability in Q4 2025:
- Designed for the largest scale training and inference workloads
- Significant performance improvements over previous generations
- Built for next-generation AI model development

## Technical Architecture

### Matrix Multiply Unit (MXU)

The MXU is a systolic array—a grid of processing elements that data flows through in a wave-like pattern. This architecture:
- Maximizes data reuse, reducing memory bandwidth requirements
- Enables high throughput for matrix operations
- Operates efficiently at lower clock speeds, improving power efficiency

### SparseCores

TPUs include SparseCores, specialized dataflow processors that accelerate models relying on embeddings. These are particularly valuable for:
- Recommendation systems
- Personalization models
- Any architecture with large embedding tables

### High-Bandwidth Memory

TPU designs incorporate HBM (High Bandwidth Memory) to provide the data throughput necessary for keeping the compute units saturated during large-scale training operations.

### Interconnect Topology

Google's proprietary interconnect enables TPUs to scale across pods containing thousands of chips. This distributed architecture is essential for training models with hundreds of billions of parameters.

## Software Framework Support

Cloud TPUs integrate with major [[Deep Learning|deep learning]] frameworks:

**[[JAX]]**: Google's functional machine learning framework with native TPU support through XLA (Accelerated Linear Algebra) compilation. JAX is particularly popular for research applications.

**[[PyTorch]]**: Through PyTorch/XLA, developers can run PyTorch code on TPUs with minimal modifications. This enables efficient fine-tuning of foundation models leveraging existing training data.

**[[TensorFlow]]**: As Google's original deep learning framework, TensorFlow has deep integration with TPU hardware, enabling straightforward deployment of training and inference workloads.

## Use Cases and Applications

### Large Language Model Training

TPUs power [[Gemini]] and all of Google's AI-powered applications including Search, Photos, and Maps, serving over 1 billion users. The architecture is optimized for:
- Training massive foundation models
- Processing the attention mechanisms in [[Transformer|transformer]] architectures
- Handling the distributed computation required for models with trillions of parameters

### Inference at Scale

Cloud TPUs support high-performance inference through:
- **vLLM TPU**: A high-throughput, low-latency LLM inference engine unifying JAX and PyTorch
- **JetStream**: Optimized serving for models like Gemma
- **MaxDiffusion**: Optimized diffusion model inference for image generation

### Fine-Tuning

Organizations adapt foundation models to their specific applications using TPUs:
- Efficient fine-tuning leverages proprietary training data
- TPU v5e provides cost-effective fine-tuning compared to previous generations
- Integration with [[Vertex AI]] simplifies the fine-tuning workflow

### Scientific Applications

Beyond commercial AI, TPUs accelerate scientific research:
- Protein folding modeling (as used by AlphaFold)
- Drug discovery and molecular simulation
- Climate modeling and weather prediction
- Healthcare and medical research

## Comparison with GPUs

**Feature / TPU / GPU:**

- **Design**: TPU: Application-specific for ML, GPU: General-purpose parallel computing
- **Flexibility**: TPU: Optimized for specific workloads, GPU: Broader application support
- **Programming**: TPU: JAX, TensorFlow, PyTorch/XLA, GPU: [[CUDA]], ROCm, OpenCL
- **Availability**: TPU: Google Cloud only, GPU: Multiple vendors, on-premises
- **Ecosystem**: TPU: Growing, GPU: Mature, extensive
- **Use Case**: TPU: Large-scale training/inference, GPU: General AI development

Google recommends evaluating whether TPUs, [[GPU Computing|GPUs]], or CPUs best fit specific workloads based on model architecture, scale, and cost requirements.

## Platform Integration

### Google Kubernetes Engine (GKE)

TPUs integrate with GKE for orchestrating large-scale AI workloads:
- Seamless resource management
- Dynamic Workload Scheduler improves scalability by scheduling all accelerators simultaneously
- Support for Ray, vLLM, and other distributed frameworks

### Vertex AI

For users seeking the simplest development experience, Vertex AI provides:
- Fully-managed AI platform with TPU support
- Simplified training and deployment workflows
- Integration with Google Cloud's MLOps capabilities

## Pricing Model

Cloud TPU pricing operates on a per-chip-hour basis with commitment discounts:
- Evaluation (on-demand) pricing for experimentation
- 1-year commitments offer approximately 30% discount
- 3-year commitments offer approximately 55% discount

This pricing structure makes TPUs competitive for sustained, large-scale workloads while remaining accessible for evaluation and development.

## See Also

- [[GPU Computing]]
- [[NVIDIA]]
- [[Google]]
- [[Deep Learning]]
- [[Large Language Model]]
- [[JAX]]
- [[TensorFlow]]
- [[Vertex AI]]

## References

1. Google Cloud. "Tensor Processing Units (TPUs)." https://cloud.google.com/tpu
2. Jouppi, N.P., et al. "In-Datacenter Performance Analysis of a Tensor Processing Unit." ISCA 2017.
3. Google Cloud. "Cloud TPU Documentation." https://cloud.google.com/tpu/docs
4. Google Cloud. "What Makes TPUs Fine-tuned for Deep Learning." Google Cloud Blog.
5. Google. "Introducing Cloud TPU v5p and AI Hypercomputer." Google Cloud Announcement, 2024.
6. Google Cloud. "vLLM TPU for High-Throughput LLM Inference." Google Cloud Blog, 2025.
