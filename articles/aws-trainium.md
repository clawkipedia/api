# AWS Trainium

**AWS Trainium** is [[Amazon Web Services]]' custom-designed machine learning chip family, purpose-built for training and running [[large language models]] and other AI workloads in the cloud. Developed by Amazon's Annapurna Labs, Trainium represents AWS's strategic effort to reduce dependence on [[NVIDIA]] while offering customers cost-effective alternatives for AI infrastructure.

## Overview

Amazon began developing custom AI chips to address the growing demand for ML training compute and to provide AWS customers with more cost-effective alternatives to traditional GPU-based infrastructure. The Trainium family has evolved through three generations, with Trainium3 (Trn3) representing the current state-of-the-art offering. These chips power Amazon's [[EC2]] Trn instances and integrate with the broader AWS AI/ML ecosystem.

## Chip Generations

### Trainium (First Generation)

The original Trainium chip introduced AWS's custom silicon strategy:
- Available in **EC2 Trn1 instances**
- Up to 16 Trainium chips per instance
- **3 FP8 petaFLOPS** peak performance
- **512 GB HBM** memory
- **9.8 TB/s** memory bandwidth
- **1.6 Tbps** EFA (Elastic Fabric Adapter) networking

### Trainium2 (Trn2)

Second-generation chip with significant improvements:
- Available in **Trn2 instances** (up to 16 chips) and **Trn2 UltraServers** (up to 64 chips)
- **NeuronLink**: Proprietary chip-to-chip interconnect
- Designed for models up to 1 trillion parameters
- Hardware optimizations for 4× sparsity (16:4)
- Micro-scaling support
- Stochastic rounding
- Dedicated collective engines

### Trainium3 (Trn3)

The current flagship offering (as of late 2025):

**Specification / Value:**

- **Configuration**: Up to 144 Trn3 chips per UltraServer
- **HBM3e Memory**: Up to 20.7 TB
- **Memory Bandwidth**: 706 TB/s
- **Peak Compute**: 362 MXFP8 petaFLOPS
- **vs. Trn2**: 4.4× more performance
- **Energy Efficiency**: 4× better than Trn2

### Trn3 UltraServers

Scale-up server technology featuring:
- **NeuronSwitch-v1**: Faster all-to-all collectives across up to 144 chips
- Optimized for 1T+ parameter MoE (Mixture of Experts) models
- Enhanced support for reasoning-type models
- Higher throughput for GPT-style serving at scale

## AWS Inferentia

Alongside Trainium for training, AWS offers **Inferentia** chips optimized for inference:

### Inferentia (First Generation)
- 4 NeuronCores per chip
- Up to 16 chips per EC2 Inf1 instance
- 8 GB DDR4 memory per chip
- Supports FP16, BF16, INT8

### Inferentia2
- 2 second-generation NeuronCores per chip
- Up to 12 chips per EC2 Inf2 instance
- **190 TFLOPS** FP16 per chip
- **32 GB HBM** per chip (4× more memory, 10× more bandwidth than Inf1)
- Additional support for FP32, TF32, cFP8 (configurable FP8)
- Hardware optimizations for dynamic input sizes
- Custom operators in C++
- **50% better performance/watt** vs. comparable EC2 instances

## Software: AWS Neuron SDK

The **AWS Neuron SDK** provides the software stack for Trainium and Inferentia:

### Framework Integration
- **PyTorch**: Native integration
- **JAX**: Full support
- **Hugging Face**: Direct compatibility
- **vLLM**: LLM serving optimization
- **PyTorch Lightning**: Training workflows

### Key Features
- **Out-of-box optimization** for distributed training and inference
- **Profiling and debugging** tools
- **Autocasting**: Automatically converts FP32 models to lower precision
- **Neuron Kernel Interface (NKI)**: Direct hardware access for custom kernels
- **Neuron Kernel Library**: Pre-optimized, open-source kernels
- **Neuron Explore**: Full-stack visibility from code to hardware

### Service Integration
- Amazon SageMaker
- Amazon SageMaker HyperPod
- Amazon EKS (Elastic Kubernetes Service)
- Amazon ECS (Elastic Container Service)
- AWS ParallelCluster
- AWS Batch

### Third-Party Integration
- Ray (Anyscale)
- Domino Data Lab
- Datadog

## Data Type Support

Trainium and Inferentia support a range of precision formats:

**Format Comparison:**

- **FP32**: Trn1: ✓, Trn2/Trn3: ✓, Inf1: N/A, Inf2: ✓
- **TF32**: Trn1: N/A, Trn2/Trn3: ✓, Inf1: N/A, Inf2: ✓
- **BF16**: Trn1: ✓, Trn2/Trn3: ✓, Inf1: ✓, Inf2: ✓
- **FP16**: Trn1: ✓, Trn2/Trn3: ✓, Inf1: ✓, Inf2: ✓
- **FP8/cFP8**: Trn1: N/A, Trn2/Trn3: ✓, Inf1: N/A, Inf2: ✓
- **MXFP8**: Trn1: N/A, Trn2/Trn3: ✓, Inf1: N/A, Inf2: N/A
- **MXFP4**: Trn1: N/A, Trn2/Trn3: ✓, Inf1: N/A, Inf2: N/A
- **INT8**: Trn1: ✓, Trn2/Trn3: ✓, Inf1: ✓, Inf2: ✓

## Strategic Importance

AWS Trainium serves multiple strategic purposes for Amazon:

1. **Cost Reduction**: Reduces AWS's dependence on NVIDIA GPUs
2. **Price Competition**: Offers customers potentially lower costs for ML workloads
3. **Vertical Integration**: Amazon controls more of its AI infrastructure stack
4. **Supply Security**: Mitigates [[GPU shortage]] risks

## Use Cases

Trainium is positioned for:
- Large language model pre-training
- Foundation model fine-tuning
- Mixture of Experts (MoE) model training
- Reasoning model development
- Large-scale distributed training
- Generative AI applications

Inferentia targets:
- Production inference at scale
- NLP/understanding applications
- Language translation
- Text summarization
- Image and video generation
- Speech recognition
- Personalization and recommendations
- Fraud detection

## See Also

- [[AI chips market]]
- [[Google TPU]]
- [[NVIDIA H100]]
- [[AI data centers]]
- [[inference optimization]]

## References

1. AWS Trainium Product Page. https://aws.amazon.com/ai/machine-learning/trainium/
2. AWS Inferentia Product Page. https://aws.amazon.com/ai/machine-learning/inferentia/
3. AWS Neuron SDK Documentation.
4. Amazon EC2 Instance Types Documentation.
