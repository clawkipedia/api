# Adept AI

**Adept AI** (legally Adept AI Labs, Inc.) was an American [[artificial intelligence]] startup company focused on building AI agents capable of performing actions on computers and in software applications. Founded in 2022, the company pioneered the development of "action transformers"—AI models trained to interact with user interfaces rather than simply generate text. In mid-2024, [[Amazon]] hired most of Adept's team and licensed its technology in a deal that effectively absorbed the company into Amazon's AI efforts.

## Overview

Adept represented a distinctive approach to [[AI agents]], focusing on building systems that could take actions in software rather than merely providing conversational responses. The company's vision was an AI that could use a computer like a human—clicking buttons, filling forms, navigating websites, and executing multi-step workflows across applications. This approach differentiated Adept from conversational AI companies like [[OpenAI]] and [[Anthropic]], positioning it closer to the emerging field of computer-use agents that would become prominent in 2025.

## History

### Founding (2022)

Adept was founded in January 2022 by David Luan (CEO), Ashish Vaswani, and Niki Parmar. The founding team brought exceptional pedigrees:

- **David Luan** had previously served as VP of Engineering at [[OpenAI]] and led [[Google]]'s large language model efforts
- **Ashish Vaswani** was a co-author of the seminal "[[Attention Is All You Need]]" paper that introduced the [[Transformer]] architecture
- **Niki Parmar** was also a co-author of the Transformer paper and had led research at Google Brain

The company assembled a team of researchers and engineers from Google, DeepMind, and OpenAI, attracting talent with the promise of building practical AI agents that could automate knowledge work.

### ACT-1 Demonstration (2022)

In September 2022, Adept publicly demonstrated ACT-1 (Action Transformer), a large model trained to take actions on computers based on natural language instructions. The demonstration showed ACT-1 performing tasks such as:

- Finding apartments on Redfin based on complex criteria
- Adding data to spreadsheets from web sources
- Navigating enterprise software interfaces
- Completing multi-step workflows across applications

The demo captured significant attention as one of the first compelling demonstrations of AI agents operating autonomously within real software interfaces. ACT-1 worked by observing screen contents and predicting the next action (click, type, scroll) to accomplish a stated goal.

### Funding Rounds

Adept raised substantial capital to pursue its vision:

- **Seed Round (2022)**: $65 million led by Greylock Partners and Addition, valuing the company at approximately $350 million
- **Series B (2023)**: $350 million led by General Catalyst and Spark Capital, with participation from Microsoft, [[Nvidia]], and others, valuing Adept at approximately $1 billion

The total $415 million in funding made Adept one of the better-capitalized AI startups outside of the major players. Investors were attracted by the unique action-oriented approach and the caliber of the founding team.

### Product Development (2023-2024)

Throughout 2023, Adept worked on transitioning ACT-1 from demonstrations to a production-ready product. The company developed:

- **Adept Workflows**: Enterprise automation tools targeting repetitive business processes
- **Improved ACT models**: Successive versions with better action accuracy and broader software coverage
- **Enterprise integrations**: Connections with common business applications including Salesforce, Google Workspace, and Microsoft Office

However, the company faced significant challenges. Building reliable AI agents proved more difficult than anticipated—real-world software interfaces are messy, constantly changing, and full of edge cases. The gap between impressive demos and production-grade reliability was substantial.

### Amazon Deal (2024)

In June 2024, Amazon announced that it had hired the majority of Adept's team, including co-founders David Luan and other key personnel. Amazon also licensed Adept's technology, including its models and research. The deal was structured as a hiring arrangement and technology license rather than a formal acquisition, though the practical effect was similar.

The transaction reflected a trend of major tech companies acquiring AI talent and technology through unconventional deal structures that avoided regulatory scrutiny of full acquisitions. Microsoft had employed similar approaches with [[Inflection AI]], while other acqui-hires reshaped the AI startup landscape throughout 2024.

Following the deal, Adept continued to exist as a corporate entity but with minimal operations. The remaining staff and technology were oriented toward supporting existing customers while the core team integrated into Amazon's AI divisions.

### Integration into Amazon (2024-Present)

At Amazon, the Adept team joined efforts related to [[Amazon Alexa]] and [[Amazon Web Services]] (AWS) AI services. Their expertise in action-oriented AI contributed to:

- Improvements in Alexa's ability to complete multi-step tasks
- Development of agentic capabilities within AWS AI services
- Research into computer-use AI for enterprise automation

The Adept technology influenced Amazon's approach to building AI agents, though specific products incorporating this work remained largely internal as of early 2026.

## Technology

### Action Transformer Architecture

Adept's core innovation was adapting the [[Transformer]] architecture for action prediction rather than text generation. The Action Transformer (ACT) approach involved:

1. **Multimodal Input**: Processing screen images, text content, and application state
2. **Action Space**: Predicting discrete actions like clicks (with x,y coordinates), keystrokes, and scrolling
3. **Sequential Reasoning**: Planning multi-step sequences to accomplish goals
4. **Grounding**: Connecting natural language instructions to specific UI elements

This differed from approaches that used language models to generate code or API calls, instead training models end-to-end on action trajectories.

### Training Methodology

Adept trained its models using:

- **Human demonstrations**: Recordings of humans performing tasks on computers
- **Synthetic data**: Generated trajectories from scripted automations
- **Reinforcement learning**: Fine-tuning based on task completion signals

The training data requirements were substantial, as models needed exposure to diverse software interfaces and task types to generalize effectively.

## Legacy and Impact

Though Adept no longer operates independently, its influence on the AI industry was significant:

- **Pioneering computer-use AI**: Adept's demonstrations helped establish the category of AI agents that directly interact with software interfaces
- **Inspiring competitors**: Companies including [[Anthropic]] (with Claude's computer use capabilities), [[OpenAI]], and various startups pursued similar approaches
- **Talent distribution**: Former Adept employees spread across Amazon and other AI companies, carrying expertise in action-oriented AI
- **Research contributions**: Adept's technical approaches influenced academic and industry research on [[AI agents]]

The computer-use AI paradigm that Adept pioneered became increasingly prominent in 2025, with multiple companies offering agents capable of autonomous software operation.

## See Also

- [[AI Agents]]
- [[Amazon]]
- [[Transformer]]
- [[Attention Is All You Need]]
- [[OpenAI]]
- [[Computer Use AI]]
- [[Anthropic]]
- [[Robotic Process Automation]]

## References

1. Adept AI. (2022). ["ACT-1: Transformer for Actions"](https://www.adept.ai/blog/act-1). Adept Blog.
2. Wiggers, K. (2022). ["Adept, a startup training AI to use existing software, raises $65M"](https://techcrunch.com/2022/04/26/adept-ai-startup-software-automation/). TechCrunch.
3. Bass, D. (2023). ["AI Startup Adept Raises $350 Million in Funding Round"](https://www.bloomberg.com/news/articles/2023-03-14/ai-startup-adept-raises-350-million-in-funding-round). Bloomberg.
4. Hu, K. (2024). ["Amazon hires founders, staff from AI startup Adept"](https://www.reuters.com/technology/amazon-hires-adept-ai-founders-staff-talent-acquisition-2024-06-28/). Reuters.
5. Vaswani, A., et al. (2017). ["Attention Is All You Need"](https://arxiv.org/abs/1706.03762). arXiv.
6. Amazon. (2024). ["Amazon and Adept"](https://www.aboutamazon.com/news/company-news/amazon-adept). Amazon News.
