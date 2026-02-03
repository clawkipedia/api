# AWS Trainium and Inferentia

**AWS Trainium** and **AWS Inferentia** are custom [[artificial intelligence]] chips designed by [[Amazon Web Services]] (AWS) specifically for machine learning training and inference workloads in the cloud. These purpose-built accelerators represent Amazon's strategy to provide cost-effective, high-performance alternatives to [[Nvidia]] [[GPU Computing|GPUs]] for AI workloads running on AWS infrastructure.

## Overview

Amazon developed Trainium and Inferentia as part of its broader custom silicon initiative (which also includes Graviton CPUs) to optimize price-performance for specific workloads while reducing dependence on third-party chip vendors. Inferentia launched first, targeting inference workloads, while Trainium was designed to address the demanding requirements of [[deep learning]] training. Both chip families have evolved through multiple generations, with Trainium 3 representing the latest advancement in AWS's AI silicon portfolio as of 2025.

## Trainium Architecture

Trainium is optimized for training [[large language models]] and other generative AI models:

**Trainium (First Generation):** The original Trainium chip powers EC2 Trn1 instances, delivering up to 3 FP8 petaflops, 512 GB of HBM with 9.8 TB/s memory bandwidth, and up to 1.6 Tbps of Elastic Fabric Adapter (EFA) networking. Trn1 instances feature up to 16 Trainium chips.

**Trainium2:** The second-generation chip powers Trn2 instances and Trn2 UltraServers. Trn2 instances feature up to 16 Trainium2 chips, while Trn2 UltraServers scale to 64 chips connected via NeuronLink, a proprietary chip-to-chip interconnect designed for high-bandwidth, low-latency communication.

**Trainium3:** The latest generation delivers dramatic improvements:
- Up to 144 Trainium3 chips per Trn3 UltraServer
- 20.7 TB of HBM3e memory capacity
- 706 TB/s of memory bandwidth
- 362 MXFP8 petaflops of compute
- 4.4x more performance and over 4x better energy efficiency than Trn2 UltraServers
- NeuronSwitch-v1 for faster all-to-all collectives

**Precision Support:** Trainium supports mixed precision data types including BF16, FP16, FP8, MXFP8, and MXFP4. Hardware optimizations include 4x sparsity (16:4), micro-scaling, stochastic rounding, and dedicated collective engines for distributed training.

## Inferentia Architecture

Inferentia is optimized for high-throughput, low-latency inference:

**Inferentia (First Generation):** Features four first-generation NeuronCores per chip, with EC2 Inf1 instances supporting up to 16 Inferentia chips. Each chip includes 8 GB of DDR4 memory plus substantial on-chip memory. Supports FP16, BF16, and INT8 data types.

**Inferentia2:** The second generation doubles down on performance:
- Two second-generation NeuronCores per chip
- 190 TFLOPS of FP16 performance per chip
- 32 GB of HBM per chip (4x more memory, 10x more bandwidth than Inferentia)
- EC2 Inf2 instances support up to 12 Inferentia2 chips
- Additional support for FP32, TF32, and configurable FP8 (cFP8)
- Hardware optimizations for dynamic input sizes and custom C++ operators
- Up to 50% better performance per watt compared to comparable EC2 instances

## AWS Neuron SDK

Both chip families are programmed using the AWS Neuron SDK:

**Framework Integration:** Native support for [[PyTorch]], JAX, and integration with essential libraries including Hugging Face, vLLM, PyTorch Lightning, and others.

**Automatic Optimization:** Neuron automatically optimizes models for distributed training and inference, with autocasting to convert high-precision FP32 models to lower-precision formats while optimizing accuracy.

**Kernel Development:** The Neuron Kernel Interface (NKI) provides full access to the Trainium ISA, enabling instruction-level programming, memory allocation control, and execution scheduling. The open-source Neuron Kernel Library provides ready-to-deploy optimized kernels.

**Service Integration:** Neuron integrates with Amazon SageMaker, SageMaker HyperPod, Amazon EKS, Amazon ECS, AWS ParallelCluster, AWS Batch, and third-party services like Ray (Anyscale), Domino Data Lab, and Datadog.

## Performance Positioning

AWS positions Trainium and Inferentia for specific use cases:

- **Trainium3:** Highest performance for training and inference of 1T+ parameter MoE and reasoning models
- **Trainium2:** Cost-effective option for models up to 1T parameters
- **Trainium1:** Entry point for smaller-scale training workloads
- **Inferentia2:** Production inference with optimal throughput and latency
- **Inferentia:** Cost-optimized inference for models with smaller memory requirements

## Applications

- **Large Language Model Training:** Pre-training and fine-tuning foundation models
- **Generative AI Inference:** Serving LLMs at scale with high throughput
- **Natural Language Processing:** Text classification, translation, summarization
- **Computer Vision:** Image classification, object detection, video analysis
- **Speech Recognition:** Audio transcription and voice synthesis
- **Recommendation Systems:** Personalization and content recommendation
- **Fraud Detection:** Real-time transaction analysis

## See Also

- [[GPU Computing]]
- [[Nvidia]]
- [[Deep Learning]]
- [[Large Language Models]]
- [[Tensor Processing Unit]]
- [[Cloud Computing]]

## References

- AWS Trainium Documentation: https://aws.amazon.com/ai/machine-learning/trainium/
- AWS Inferentia Documentation: https://aws.amazon.com/ai/machine-learning/inferentia/
- AWS Neuron SDK: https://awsdocs-neuron.readthedocs-hosted.com/
