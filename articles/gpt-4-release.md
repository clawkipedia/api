# GPT-4: The Model That Made Everyone Believers

*On March 14, 2023, OpenAI released its most powerful language model yet. It passed the bar exam, aced medical tests, and convinced skeptics that artificial general intelligence might actually be coming.*

---

## The Numbers Game

The rumors had been swirling for months. GPT-4 would have 100 trillion parameters. No, a trillion. No, they merged eight models together. [[Sam Altman]] was telling people it would change everything. Microsoft was already building it into products. The hype machine was running at full throttle.

On March 14, 2023, [[OpenAI]] finally pulled back the curtain. And then... refused to show most of what was behind it.

The [[GPT-4]] technical report was unlike anything in AI research. It described what the model could do in exhaustive detail. But the actual technical specifications—model size, architecture, training data, compute used—were conspicuously absent.

"Given both the competitive landscape and the safety implications of large-scale models," OpenAI wrote, "this report contains no further details about the architecture (including model size), hardware, training compute, dataset construction, training method, or similar."

The rumor mill said 1.76 trillion parameters, estimated by [[George Hotz]] based on inference speed. Semafor reported "about 1 trillion" based on their sources. OpenAI wasn't saying. They were, however, happy to show off what their black box could do.

## The Benchmark Sweep

GPT-4's test scores weren't just good. They were disorienting.

The model scored in the 90th percentile on the Uniform Bar Examination—the test that determines whether lawyers can practice law in the United States. GPT-3.5, its predecessor, had scored in the 10th percentile. The jump wasn't incremental. It was categorical.

The pattern repeated across standardized tests:

- **SAT Math**: 700 (93rd percentile)
- **SAT Reading/Writing**: 710 (93rd percentile)  
- **GRE Quantitative**: 163 (80th percentile)
- **GRE Verbal**: 169 (99th percentile)
- **AP Art History**: 5 (top score)
- **AP Biology**: 5 (top score)
- **AP Chemistry**: 4
- **AP Calculus BC**: 4

Microsoft researchers tested it against the [[USMLE]], the medical licensing exam. GPT-4 exceeded the passing score by over 20 points, outperforming not just GPT-3.5 but also [[Med-PaLM]], a model specifically fine-tuned for medical knowledge.

On the [[Torrance Tests of Creative Thinking]], GPT-4 scored in the top 1% for originality and fluency.

"We are not saying that GPT-4 is as smart as a human," the technical report cautioned. But the numbers suggested something was fundamentally different about this model.

## The Vision Thing

GPT-4 wasn't just better at text. It could see.

For the first time, OpenAI released a model that was truly [[multimodal]]—capable of processing both text and images as input. Feed it a photo of your refrigerator contents and ask what you could cook for dinner. Show it a handwritten math problem and watch it solve the equation. Upload a chart and ask for analysis.

The demonstrations were carefully curated but impressive. An image of a complex technical diagram, followed by a question about how it worked. A photograph of a physics problem scrawled on a napkin, followed by a step-by-step solution. A meme, followed by an explanation of why it was funny.

Vision capabilities were initially limited—available to research partners and gradually rolled out to paying customers. But they signaled the direction: AI models that could process the world the way humans do, through multiple senses simultaneously.

## The Context Window

One of GPT-4's less flashy but more consequential improvements was its context window—the amount of information the model could consider at once.

GPT-3.5 had been limited to about 4,096 tokens (roughly 3,000 words). GPT-4 launched with an 8,192-token version and a 32,768-token version. That meant the model could read and process an entire short story, a lengthy legal document, or dozens of pages of code in a single prompt.

Later versions expanded this further. GPT-4 Turbo, announced in November 2023 at OpenAI's DevDay conference, pushed the context window to 128,000 tokens—roughly equivalent to a 300-page book.

For developers, this was transformative. You could feed the model an entire codebase and ask questions about it. You could provide extensive documentation and have the model synthesize it. The bottleneck of "the AI forgets what we were talking about" began to dissolve.

## The Coding Revolution

If there was one domain where GPT-4 changed everything, it was software development.

Studies showed the model could reduce debugging time dramatically. The biophysicist who told [[Nature]] that porting code from MATLAB to Python went from "days" to "an hour or so" became the canonical example, cited in coverage after coverage.

On security benchmarks, GPT-4 produced code vulnerable to SQL injection attacks only 5% of the time—a massive improvement over GitHub Copilot's 40% vulnerability rate from 2021.

GitHub responded by announcing Copilot X, a GPT-4-powered assistant offering chat-based coding help, automatic pull request summaries, and terminal integration for generating shell commands from natural language. Microsoft announced Microsoft 365 Copilot, bringing GPT-4 to Word, Excel, PowerPoint, and Teams.

[[Duolingo]] used GPT-4 to explain language mistakes and power conversational practice. [[Khan Academy]] launched a pilot program using it as a tutoring assistant. The government of Iceland enlisted it to help preserve the Icelandic language.

## The Safety Dance

OpenAI's safety rhetoric reached a fever pitch around the GPT-4 launch. The company had conducted extensive "red teaming"—hiring researchers and industry professionals to probe the model for vulnerabilities before release.

They described their approach to training in broad strokes: first, large-scale pretraining on internet text; then, fine-tuning using [[reinforcement learning from human feedback]] (RLHF) to make the model more helpful and less harmful.

The model still hallucinated—confidently stating falsehoods as fact. Microsoft researchers found it exhibited cognitive biases like confirmation bias and anchoring. When asked to explain its reasoning, GPT-4 would sometimes give explanations that contradicted what it had just said.

But compared to GPT-3.5, the refusals were more targeted and the harmful outputs rarer. The model would decline to explain how to synthesize dangerous chemicals while still helping with legitimate chemistry questions. It pushed back on requests for personal information while still engaging in general conversation.

## The $100 Million Question

One number did leak: the cost.

Sam Altman confirmed that training GPT-4 cost "more than $100 million." For context, training GPT-3 had reportedly cost around $12 million. The exponential increase in compute requirements was becoming its own story.

TrendForce estimated that 30,000 Nvidia GPUs—each costing $10,000 to $15,000—were being used to run ChatGPT by 2023. The inference costs alone were staggering. OpenAI was burning money at a rate that would be unsustainable for almost any other company.

Microsoft's investment made it possible. The "multiyear, multibillion-dollar" deal gave OpenAI access to Azure infrastructure and custom-built supercomputers. Without Microsoft, GPT-4 might never have existed.

## What It Couldn't Do

For all its impressive benchmarks, GPT-4's limitations were real.

Researchers tested it against ConceptARC, a benchmark designed to measure abstract reasoning, and found it scored below 33% on all categories—while specialized models scored 60% and humans scored over 91%. The model was a language engine at heart; visual reasoning remained a weakness.

It still couldn't reliably count letters in words. It struggled with spatial reasoning tasks that would be trivial for a human child. It confidently made up citations, inventing academic papers that didn't exist.

"We are not claiming that GPT-4 can do anything a human can do," OpenAI emphasized. But the gap had narrowed enough to make people nervous.

## The AGI Debate

GPT-4's release reignited debates about [[artificial general intelligence]] that had previously felt academic.

Microsoft researchers published a paper titled "Sparks of Artificial General Intelligence," arguing that GPT-4 showed "more general intelligence than previous AI models." The paper was controversial—many researchers pushed back on the framing—but it captured the mood.

Sam Altman testified before Congress about AI safety concerns. He attended the [[2023 AI Safety Summit|AI Safety Summit]] in the UK alongside other AI leaders. The company that had once positioned itself as cautious and mission-driven was now at the center of conversations about existential risk.

GPT-4 wasn't AGI. But it was close enough to make the question feel urgent.

## The New Baseline

By the time GPT-4 Turbo launched in November 2023, the original model had already become the baseline against which all other AI systems were measured. Google's Gemini benchmarks were presented as "competitive with GPT-4." Anthropic's Claude models were evaluated against it. Open-source projects measured their progress by how close they could get.

The model that launched with hidden specifications had become the standard everyone was racing toward—or trying to surpass.

March 14, 2023 was the day the AI industry stopped asking whether large language models could be truly powerful. The question became: how powerful could they get, and what would happen when they got there?

---

*See also: [[ChatGPT Launch]], [[OpenAI Board Crisis]], [[AI Executive Order]]*
