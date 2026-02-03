# Cerebras

**Cerebras Systems Inc.** is an American [[artificial intelligence]] company that designs and manufactures the world's largest computer chips—wafer-scale processors built for AI training and inference. The company's Wafer Scale Engine (WSE) chips contain trillions of transistors on a single silicon wafer, representing a radical departure from conventional chip design that has yielded exceptional performance for large-scale AI workloads.

## Overview

Founded in 2015, Cerebras challenged the fundamental assumptions of semiconductor manufacturing by building entire processors on single silicon wafers rather than cutting wafers into individual chips. This "wafer-scale" approach eliminates the communication bottlenecks between separate chips, enabling massive parallelism within a single device. The company's CS-3 system, powered by the WSE-3, delivers 125 petaflops of AI compute through 900,000 AI-optimized cores.

## Company History

### Founding and Leadership

Cerebras was founded in 2015 by Andrew Feldman (CEO), Gary Lauterbach, Michael James, Sean Lie, and Jean-Philippe Fricker. These five had previously worked together at SeaMicro, a microserver company Feldman and Lauterbach started in 2007 and sold to [[AMD]] for $334 million in 2012.

### Funding History

**Round Comparison:**

- **Series A**: Date: May 2016, Amount: $27M, Lead Investors: Benchmark, Foundation Capital, Eclipse, Valuation: N/A
- **Series B**: Date: Dec 2016, Amount: N/A, Lead Investors: Coatue Management, Valuation: N/A
- **Series C**: Date: Jan 2017, Amount: N/A, Lead Investors: VY Capital, Valuation: N/A
- **Series D**: Date: Nov 2018, Amount: $88M, Lead Investors: Altimeter, VY Capital, Valuation: $1B+ (unicorn)
- **Series E**: Date: Nov 2019, Amount: $270M, Lead Investors: N/A, Valuation: $2.4B
- **Series F**: Date: Nov 2021, Amount: $250M, Lead Investors: Alpha Wave, Abu Dhabi Growth Fund, Valuation: $4B+
- **Series G**: Date: Sep 2025, Amount: $1.1B, Lead Investors: N/A, Valuation: $8.1B

### Key Milestones

- **August 2019**: Announced first-generation WSE
- **April 2021**: Launched CS-2 with WSE-2
- **August 2021**: Demonstrated brain-scale technology (120T+ connections)
- **November 2022**: Unveiled Andromeda supercomputer (1 Exaflop)
- **July 2023**: Launched Condor Galaxy with G42 (world's largest AI network)
- **March 2024**: Introduced WSE-3 and CS-3
- **August 2024**: Launched world's fastest AI inference service
- **January 2026**: Signed $10B+ deal with OpenAI
- **April 2025**: Partnership with Meta for Llama API

### IPO Attempts

Cerebras filed for IPO in September 2024, planning to list on NASDAQ under ticker 'CBRS'. The process was delayed due to CFIUS review of investments from [[G42]] (UAE). In October 2025, the company withdrew its IPO registration but indicated it still intends to go public.

## Wafer Scale Engine Technology

### WSE-3 (Current Generation)

**Specification / Value:**

- **Transistors**: 4 trillion
- **Die Size**: 46,225 mm²
- **AI Compute Cores**: 900,000
- **AI Compute**: 125 petaflops
- **vs. NVIDIA B200**: 19× more transistors, 28× more compute
- **Process Node**: 5nm (TSMC)

### WSE-2 (Previous Generation)

- **Transistors**: 2.6 trillion
- **Cores**: 850,000
- **On-chip SRAM**: 40 gigabytes
- **Memory Bandwidth**: 20 petabytes/second
- **Fabric Bandwidth**: 220 petabits/second
- **Process**: 7nm (TSMC)

### WSE-1 (First Generation)

- **Transistors**: 1.2 trillion
- **Cores**: 400,000
- **On-chip Memory**: 18 gigabytes

### Design Philosophy

Traditional chip manufacturing limits die size to approximately 800mm² (the "reticle limit"). Cerebras overcomes this by:

1. Using the entire wafer (~46,000mm²) as a single chip
2. Building fault tolerance into the design
3. Integrating compute, memory, and interconnect fabric

## Systems

### CS-3

The current-generation system featuring WSE-3:
- Purpose-built for large-scale AI training and inference
- Scales to 24 trillion parameter models on a single logical device
- Lower power consumption and smaller footprint than GPU clusters
- One-third of a standard data center rack (26 inches tall)

### Condor Galaxy

A network of interconnected supercomputers built in partnership with [[G42]]:
- **CG-1** (July 2023): 4 exaFLOPS, 54 million cores
- **CG-2** (November 2023): 4 exaFLOPS, 54 million cores
- **CG-3** (March 2024): 8 exaFLOPS, 58 million cores
- Total planned: 9 interconnected supercomputers

### Andromeda

A 16-chip cluster (WSE-2):
- 13.5 million AI-optimized cores
- Up to 1 Exaflop AI compute
- 500 kW total power consumption

## Inference Performance

Cerebras claims industry-leading inference speeds:
- **August 2024**: Launched "world's fastest" AI inference service
- Often 10-20× faster than NVIDIA H100-based systems
- **October 2024**: 3.5× performance improvement on Llama 3.2 models
- **May 2025**: Claimed 2× Blackwell performance on Llama 4 (2,500+ tokens/second on 400B Maverick)

### Inference Infrastructure Expansion

In March 2025, Cerebras announced six new datacenters across the US and Europe, increasing inference capacity twentyfold to over 40 million tokens per second.

## Major Partnerships

- **OpenAI** (January 2026): $10B+ deal for 750 MW of computing through 2028
- **Meta** (April 2025): Powers new Llama API with 18× faster inference
- **G42**: Joint development of Condor Galaxy
- **Dell Technologies**: AI compute infrastructure collaboration
- **DARPA** (April 2025): $45M contract (with Ranovus) for military computing efficiency

## Recognition

- **Computer History Museum** (August 2022): WSE-2 added to permanent collection
- **Forbes AI 50** (April 2024)
- **TIME 100 Most Influential Companies** (May 2024)

## See Also

- [[AI chips market]]
- [[AI data centers]]
- [[inference optimization]]
- [[NVIDIA B200]]
- [[Groq LPU]]

## References

1. Cerebras Product Page. https://www.cerebras.ai/chip
2. "Cerebras." Wikipedia. https://en.wikipedia.org/wiki/Cerebras
3. Cerebras Systems Press Releases. 2024-2026.
4. CNBC. Cerebras IPO Prospectus Coverage. September 2024.
