# GPU Shortage

**The GPU shortage** refers to the severe and prolonged scarcity of high-performance [[graphics processing unit]]s, particularly [[NVIDIA]]'s data center accelerators like the [[NVIDIA H100|H100]] and [[NVIDIA B200|B200]], that began in late 2022 and continued through 2025. Driven by explosive demand for [[generative AI]] training and inference compute, the shortage reshaped the technology industry, influenced geopolitics, and accelerated the development of alternative [[AI accelerator]]s.

## Overview

The release of [[ChatGPT]] in November 2022 triggered unprecedented demand for AI compute infrastructure. Within months, wait times for NVIDIA's flagship H100 GPUs extended to 6-12 months, with some customers facing multi-year backlogs. The shortage affected everyone from AI startups to the world's largest technology companies, fundamentally altering how organizations approach AI infrastructure strategy.

## Causes

### Demand Explosion

The [[generative AI]] boom created a perfect storm of demand:

1. **LLM Training**: Companies raced to train foundation models requiring thousands of GPUs
2. **Inference Scale**: Deploying AI services required massive GPU clusters
3. **FOMO Effect**: Organizations stockpiled GPUs fearing future unavailability
4. **Startup Surge**: Thousands of AI startups sought compute resources

### Supply Constraints

Multiple factors limited GPU supply:

**Constraint / Impact:**

- **TSMC Capacity**: Advanced nodes (5nm, 4nm) fully booked
- **CoWoS Packaging**: Advanced packaging became primary bottleneck
- **HBM Production**: High Bandwidth Memory supply limited
- **Test Capacity**: Complex chips require extensive testing
- **Geographic Concentration**: Most advanced manufacturing in Taiwan

### Market Structure

NVIDIA's dominant market position (80-90%+ of AI accelerator market) concentrated demand on a single supplier, while the complexity of building alternative chips created high barriers to entry.

## Timeline

### 2022
- **November**: ChatGPT launches; AI demand begins exponential growth
- **December**: Initial reports of H100 allocation constraints

### 2023
- **Q1**: Wait times extend to 6+ months for new H100 orders
- **Q2**: Major cloud providers prioritize internal AI projects over customer availability
- **Q3**: Secondary market prices for H100s reach 2-3× MSRP
- **Q4**: NVIDIA announces expanded production; CoWoS packaging identified as bottleneck

### 2024
- **Q1**: [[NVIDIA B200|Blackwell]] architecture announced
- **Q2**: H100 availability improves slightly; Blackwell pre-orders consume new capacity
- **Q3**: Cloud providers announce significant GPU infrastructure investments
- **Q4**: Blackwell enters production; new shortage concerns emerge

### 2025
- **H1**: Blackwell supply remains constrained
- **H2**: Gradual improvement as TSMC and packaging capacity expands
- **Ongoing**: Demand continues to outpace supply for newest generations

## Market Impacts

### Pricing Dynamics

**Item Comparison:**

- **H100 SXM (retail)**: Pre-Shortage: ~$30,000, Peak Shortage: $40,000-50,000+, Stabilization: ~$25,000-35,000
- **H100 (cloud hourly)**: Pre-Shortage: $2-3/hour, Peak Shortage: $4-5/hour, Stabilization: $2-4/hour
- **Secondary market premium**: Pre-Shortage: 0%, Peak Shortage: 100-200%, Stabilization: 20-50%

### Cloud Provider Strategies

Major cloud providers responded differently:

- **AWS**: Accelerated [[AWS Trainium]] development; expanded GPU regions
- **Google Cloud**: Emphasized [[TPU]] alternatives; strategic GPU partnerships
- **Microsoft Azure**: Priority allocation for [[OpenAI]]; expanded GPU fleet
- **Oracle Cloud**: Aggressive GPU infrastructure buildout

### Startup Impact

AI startups faced existential challenges:
- Inability to secure training compute delayed product development
- Forced to accept unfavorable cloud contracts for GPU access
- Some pivoted to inference-only products requiring less compute
- Venture funding increasingly tied to GPU access commitments

## Alternative Accelerators

The shortage accelerated development and adoption of non-NVIDIA options:

### Custom Silicon

**Company / Product / Advantage:**

- **Google**: Product: [[TPU]], Advantage: Integrated with Google Cloud
- **Amazon**: Product: [[AWS Trainium]], Advantage: Cost-effective training
- **[[Cerebras]]**: Product: WSE-3, Advantage: Wafer-scale performance
- **[[Groq]]**: Product: [[Groq LPU, Advantage: LPU]], Inference latency

### AMD Competition

[[AMD]]'s Instinct accelerators (MI300 series, MI350 series) gained traction:
- MI300X offered competitive performance for inference
- Major deployments at Meta, Microsoft
- Price/performance advantages in some workloads

### Inference-Specific Hardware

The shortage drove interest in inference-optimized chips:
- Lower capital requirements than training clusters
- [[Groq LPU|Groq's LPU]] for low-latency inference
- AWS Inferentia for cost-effective serving
- Various startups developing inference ASICs

## Geopolitical Dimensions

### Export Controls

The U.S. government implemented restrictions on AI chip exports:
- **October 2022**: Initial restrictions on advanced chips to China
- **October 2023**: Expanded "AI diffusion" rules
- **2024-2025**: Ongoing refinements and enforcement

These controls affected:
- Chinese AI companies' access to NVIDIA GPUs
- Development of Chinese domestic AI chip industry
- Global supply chain dynamics

### Strategic Importance

Governments began treating AI compute as strategic infrastructure:
- National AI compute initiatives (UK, EU, UAE, Saudi Arabia)
- Sovereign cloud requirements
- Domestic chip manufacturing investments

## Industry Response

### NVIDIA Actions

- Expanded manufacturing partnerships
- Diversified packaging suppliers
- Prioritized high-volume customers
- Announced new product lines (GB200, various configurations)

### Customer Adaptations

Organizations adopted various strategies:
1. **Multi-cloud**: Distributed workloads across providers
2. **Reserved capacity**: Long-term commitments for guaranteed allocation
3. **Efficiency optimization**: Better utilization of existing resources
4. **Alternative hardware**: Testing AMD, TPU, custom chips
5. **Model optimization**: Smaller models requiring less compute

## Current State (Early 2026)

The shortage has evolved rather than resolved:
- H100 availability improved significantly
- Blackwell (B200, GB200) faces initial supply constraints
- Demand continues growing with new AI applications
- Packaging and advanced node capacity remain bottlenecks
- Alternative accelerators gaining market share

## Long-Term Implications

The GPU shortage fundamentally changed the industry:

1. **Vertical integration**: More companies developing custom chips
2. **Efficiency focus**: Greater emphasis on model efficiency and inference optimization
3. **Infrastructure diversity**: Multi-accelerator strategies becoming standard
4. **Supply chain awareness**: GPU access now a boardroom-level concern
5. **Geopolitical factor**: Compute access tied to international relations

## See Also

- [[AI chips market]]
- [[AI data centers]]
- [[NVIDIA H100]]
- [[NVIDIA B200]]
- [[inference optimization]]

## References

1. NVIDIA quarterly earnings calls and investor presentations, 2023-2025.
2. SemiAnalysis. "Accelerator Industry Model."
3. Data Center Dynamics. AI infrastructure coverage.
4. Various industry analyst reports on AI chip supply and demand.
