# DeepSeek

**DeepSeek** is a Chinese artificial intelligence company developing [[large language models]], founded in July 2023 by [[Liang Wenfeng]], co-founder of the quantitative hedge fund [[High-Flyer]]. DeepSeek gained international attention in January 2025 when its DeepSeek-R1 model demonstrated performance comparable to leading Western AI systems at a fraction of the reported training cost, an event described as a "[[Sputnik moment]]" for American AI development.

## Overview

DeepSeek (杭州深度求索人工智能基础技术研究有限公司) is headquartered in Hangzhou, Zhejiang, China. The company is notable for developing highly efficient AI models using innovative architectures including [[Mixture of Experts]] (MoE), Multi-head Latent Attention (MLA), and multi-token prediction objectives.

The company's breakthrough DeepSeek-V3 model claimed training costs of approximately $6 million—far below the $100+ million typically cited for comparable Western models—while achieving competitive performance with [[GPT-4]], [[Claude]], and other frontier systems. This efficiency was achieved despite US export restrictions limiting Chinese access to advanced AI chips.

## History

### Origins (2016-2023)

DeepSeek's roots trace to High-Flyer, a quantitative trading firm co-founded by Liang Wenfeng in 2016. High-Flyer pioneered GPU-based AI trading systems in China:

- **October 2016**: Began stock trading using deep learning models
- **2017**: Transitioned to AI-exclusive trading strategies
- **2019**: Built Fire-Flyer computing cluster with 1,100 GPUs
- **2021**: Acquired approximately 10,000 NVIDIA A100 GPUs before US export restrictions
- **2022**: Fire-Flyer 2 cluster reached 5,000 A100 GPUs with 96%+ utilization

In April 2023, High-Flyer announced an AGI research lab, which was spun off as DeepSeek in July 2023.

### Model Releases (2023-Present)

- **November 2023**: DeepSeek Coder and DeepSeek-LLM
- **January 2024**: DeepSeek-MoE models
- **April 2024**: DeepSeek-Math series
- **May 2024**: DeepSeek-V2 with MLA architecture
- **September 2024**: DeepSeek V2.5
- **November 2024**: DeepSeek-R1-Lite preview
- **December 2024**: DeepSeek-V3 (671B parameters)
- **January 2025**: DeepSeek-R1 and chatbot launch
- **March 2025**: DeepSeek-V3-0324
- **May 2025**: DeepSeek-R1-0528
- **August 2025**: DeepSeek V3.1 with hybrid thinking modes
- **September 2025**: V3.2-Exp with DeepSeek Sparse Attention

## DeepSeek-V3 Architecture

### Model Specifications

**Specification / Value:**

- **Total Parameters**: 671 billion
- **Active Parameters per Token**: 37 billion
- **Context Length**: 128K tokens
- **Training Data**: 14.8 trillion tokens
- **Training Cost**: ~2.788 million H800 GPU hours

### Key Innovations

**Mixture of Experts (MoE)**
Sparse activation where only 37B of 671B parameters are used per token, dramatically reducing inference costs.

**Multi-head Latent Attention (MLA)**
More efficient attention mechanism reducing memory and compute requirements.

**Auxiliary-Loss-Free Load Balancing**
Novel approach to expert load balancing without the performance degradation typical of auxiliary loss methods.

**Multi-Token Prediction (MTP)**
Training objective predicting multiple future tokens, enabling speculative decoding for faster inference.

**FP8 Mixed Precision Training**
First validation of FP8 training at extremely large scale, improving training efficiency.

### Training Efficiency

DeepSeek achieved remarkable training stability and efficiency:
- No irrecoverable loss spikes throughout training
- No training rollbacks required
- Near-complete computation-communication overlap for cross-node MoE training
- Post-training (SFT and RL) required only 0.1 million GPU hours

## DeepSeek-R1

DeepSeek-R1 is a reasoning-focused model that incorporates:
- Long Chain-of-Thought (CoT) reasoning
- Knowledge distilled from DeepSeek R1 series into DeepSeek-V3
- Verification and reflection patterns
- Controlled output style and length

The model was released in January 2025 alongside the DeepSeek chatbot application, which quickly became the most downloaded free app on the US iOS App Store.

## Benchmark Performance

DeepSeek-V3 demonstrates leading open-source performance:

**Base Model (vs. Llama-3.1-405B, Qwen2.5-72B)**
- MMLU: 87.1% (vs. 84.4%, 85.0%)
- HumanEval: 65.2% (vs. 54.9%, 53.0%)
- MATH: 61.6% (vs. 49.0%, 54.4%)

**Chat Model (vs. GPT-4o, Claude-3.5-Sonnet)**
- Competitive or superior on most standard benchmarks
- Strong performance on coding (SWE Verified: 42.0%)
- Leading scores on Chinese language tasks

## Infrastructure

### Fire-Flyer 2 Cluster

DeepSeek operates sophisticated computing infrastructure:
- Co-designed software and hardware architecture
- 200 Gbps interconnects between GPUs
- Two-zone fat tree network topology

**Software Stack**
- **3FS**: Custom distributed parallel file system with Direct I/O and RDMA
- **hfreduce**: Asynchronous communication library replacing NCCL
- **HaiScale DDP**: Parallel training with DP, PP, TP, EP, FSDP, and ZeRO
- **HAI Platform**: Task scheduling, fault handling, disaster recovery

## Impact and Reception

### "Sputnik Moment"

DeepSeek's January 2025 launch triggered significant market reactions:
- NVIDIA lost $600 billion in market value (largest single-company decline in US history)
- Described as "sending shock waves through the industry"
- Demonstrated that export restrictions had not prevented Chinese AI advancement
- Sparked debate about the true cost and requirements for frontier AI development

### Open Development

DeepSeek releases models under permissive licenses:
- MIT License for many releases
- Open weights enable local deployment and customization
- Extensive documentation and technical reports

## Company Structure

- **Ownership**: Wholly owned subsidiary of High-Flyer hedge fund
- **Leadership**: Liang Wenfeng serves as CEO of both companies
- **Employees**: Approximately 160 as of 2025
- **Focus**: Research-oriented without immediate commercialization plans
- **Hiring**: Emphasizes skills over experience, recruits fresh graduates and non-CS specialists

As of May 2024, Liang personally held an 84% stake in DeepSeek through shell corporations.

## Current State (Early 2026)

DeepSeek continues rapid development with V3.1, V3.2, and subsequent releases. The company's efficient training methodology has influenced global AI development practices, with MoE architectures now widely adopted across the industry.

DeepSeek's success demonstrated that frontier AI development is achievable outside the US tech ecosystem, even under significant hardware constraints. The company has expanded influence in Africa and other regions seeking affordable AI solutions.

Recent versions have been noted for stronger alignment with Chinese government content policies, reflecting the complex regulatory environment for AI development in China.

## See Also

- [[Liang Wenfeng]]
- [[High-Flyer]]
- [[Mixture of Experts]]
- [[Large Language Model]]
- [[Chinese AI Development]]
- [[AI Export Restrictions]]

## References

1. Wikipedia. "DeepSeek." Accessed February 2026. https://en.wikipedia.org/wiki/DeepSeek
2. DeepSeek. "DeepSeek-V3 Technical Report." December 2024.
3. GitHub. "deepseek-ai/DeepSeek-V3." https://github.com/deepseek-ai/DeepSeek-V3
4. Various news sources on DeepSeek impact and development, 2024-2026.
