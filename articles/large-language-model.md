# Large Language Model

## Overview

A large language model is a neural network trained to predict the next word in a sequence—and from this deceptively simple objective emerges something that looks increasingly like intelligence. LLMs have become the foundation of the modern [[AI]] revolution, powering chatbots, coding assistants, search engines, and creative tools. They represent the most dramatic capability leap in the history of [[natural language processing]], and possibly in the history of computing itself.

The "large" in large language model refers to scale: billions to trillions of parameters, training datasets measured in terabytes, computational budgets measured in millions of dollars. This scale turns out to matter enormously. Something happens when you train language models large enough—they acquire capabilities that smaller models simply don't have. They learn grammar, facts, reasoning, coding, and tasks they were never explicitly taught. The emergence of these capabilities from raw scale has been one of the most surprising and consequential discoveries in [[machine learning]].

## History/Origins

Language modeling has a long history. Statistical approaches in the 1990s could predict likely word sequences by counting occurrences in text corpora. Neural approaches emerged in the 2000s, with architectures like [[recurrent neural networks]] (RNNs) and [[LSTMs]] learning to process text sequentially. These systems showed promise but struggled with long-range dependencies—they couldn't remember what happened at the beginning of a long passage.

The breakthrough came in 2017 with a paper titled "Attention Is All You Need," published by researchers at [[Google]]. The [[transformer architecture]] it introduced replaced sequential processing with a mechanism called **self-attention**, allowing the model to relate any part of a sequence to any other part. This wasn't just an incremental improvement—it unlocked parallelization, enabling training on vastly larger datasets, and it handled long-range dependencies with ease.

[[BERT]], released by Google in 2018, demonstrated that transformers could achieve state-of-the-art results across a range of NLP tasks through pre-training on massive text corpora. But BERT was an encoder model, designed primarily to understand text. The decoder models that followed would prove even more transformative.

[[OpenAI]]'s [[GPT-1]] (2018) showed that generative pre-training on large text corpora could produce useful language models. GPT-2 (2019) scaled this up and produced text so convincing that OpenAI initially declined to release the full model, citing concerns about misuse—a decision that drew both praise and mockery but established a new norm of caution around powerful AI releases.

Then came GPT-3 in 2020, with 175 billion parameters and capabilities that stunned the field. GPT-3 could write essays, code programs, answer questions, and perform tasks it had never been explicitly trained to do. The phenomenon of **few-shot learning**—showing the model a few examples and having it generalize to new cases—emerged as a signature capability. The scaling hypothesis gained credibility: make models bigger, train them on more data, and new abilities appear.

The public breakthrough arrived in November 2022 with [[ChatGPT]], which combined GPT-3.5 with [[reinforcement learning from human feedback]] (RLHF) to create a conversational interface anyone could use. It reached 100 million users in two months—the fastest-growing consumer application in history. Suddenly, everyone understood what LLMs could do.

[[GPT-4]] in 2023 pushed further still, adding multimodal capabilities (processing images alongside text) and demonstrating performance that approached or exceeded human experts on standardized tests. OpenAI declined to reveal its architecture or parameter count, but the capabilities spoke for themselves.

The field exploded. [[Anthropic]] released [[Claude]]. Google launched [[Gemini]]. Meta open-sourced [[LLaMA]], democratizing access to frontier-level models. China's [[DeepSeek]] emerged in 2025 with models matching GPT-4's capabilities at dramatically lower costs. The race was on.

## How It Works

At its core, an LLM is a neural network trained on a simple objective: given a sequence of words (or more precisely, **tokens**), predict the next one. The training data is essentially the internet—books, articles, code, conversations, everything that humans have written and made accessible online. The model learns statistical patterns in this data, encoding them in billions of numerical parameters.

The transformer architecture processes text through layers of attention mechanisms and feedforward networks. Each layer transforms the representation of the input, building increasingly abstract and useful features. The self-attention mechanism allows every position in a sequence to "attend to" every other position, weighing the relevance of different words for predicting what comes next.

**Tokenization** converts text into numerical representations. Rather than whole words, most LLMs use subword tokens—common words might be single tokens, while rare words get split into pieces. This allows the model to handle any text, including words it has never seen, by composing them from familiar parts.

Training happens in two phases. **Pre-training** exposes the model to massive text datasets, teaching it language patterns, facts, and reasoning abilities. **Fine-tuning** then adapts the pre-trained model to specific tasks or behaviors. [[RLHF]]—reinforcement learning from human feedback—has become the dominant fine-tuning approach, where human evaluators rank model outputs and a reward model learns to predict these preferences.

The mystery of LLMs is that capabilities emerge that weren't directly trained. No one taught GPT-4 to solve math problems or write poetry—these abilities arose from the pressure to predict text that contains math and poetry. **Scaling laws** describe how performance improves predictably with more parameters, more data, and more computation. But predicting *which* capabilities will emerge at what scale remains difficult.

## Impact

Large language models have transformed the technology landscape with a speed that caught nearly everyone off guard. The applications multiply faster than anyone can track.

**Conversational AI**: ChatGPT and its competitors have become the default interface for millions seeking information, assistance, and conversation. They're replacing traditional search for many queries and functioning as writing partners, tutors, and advisors.

**Code generation**: Tools like [[GitHub Copilot]], [[Cursor]], and [[Claude Code]] have become essential for developers, autocompleting functions, explaining code, debugging errors, and even writing entire applications from natural language descriptions. Studies suggest productivity gains of 50% or more for certain programming tasks.

**Content creation**: LLMs generate marketing copy, articles, scripts, and creative writing. The quality varies, but the economics are irresistible—why pay a writer for generic content when a model produces passable drafts for pennies?

**Scientific research**: Models assist with literature reviews, hypothesis generation, and paper writing. Specialized models trained on scientific corpora push the boundaries further, though concerns about AI-generated misinformation in research persist.

**Enterprise applications**: Companies deploy LLMs for customer service, internal knowledge management, document processing, and decision support. The enterprise market has become a battlefield where OpenAI, Anthropic, Google, and others compete for contracts worth billions.

## Controversies

The rise of LLMs has generated controversies as impressive as their capabilities.

**Hallucination**: LLMs confidently generate false information with no apparent awareness that they're wrong. They invent citations, misstate facts, and fabricate plausible-sounding nonsense. This failure mode limits their reliability for high-stakes applications and has created headaches ranging from embarrassed lawyers citing nonexistent cases to students submitting fabricated facts.

**Training data and copyright**: LLMs train on text scraped from the internet, including copyrighted works. Lawsuits from authors, publishers, and media companies argue this constitutes infringement. The legal status remains unresolved, with billion-dollar licensing deals and litigation proceeding in parallel.

**Environmental costs**: Training frontier models consumes enormous energy. Estimates suggest GPT-4's training produced thousands of tons of CO2 emissions. As models scale further, the environmental footprint grows, though inference costs have dropped dramatically.

**Economic disruption**: Knowledge workers who thought themselves safe from automation face displacement. Copywriters, junior programmers, customer service representatives, and translators watch AI encroach on their work. The promise of new jobs created rings hollow to those losing current ones.

**Concentration of power**: Building frontier LLMs requires resources only a few organizations possess. This concentrates power in ways that concern policymakers, civil society, and even some AI researchers. The open-source movement provides a counterbalance—LLaMA, Mistral, and DeepSeek have democratized access—but the largest and most capable models remain proprietary.

**Alignment and safety**: As LLMs become more capable and more autonomous, ensuring they behave as intended grows harder. Jailbreaks circumvent safety filters. Unexpected capabilities emerge. The [[AI safety]] community warns that these problems will only intensify as systems approach and potentially exceed human-level capabilities.

Large language models represent a genuine technological discontinuity—a capability leap that seemed years away until suddenly it wasn't. What began as a research curiosity has become infrastructure, reshaping industries and raising questions about the nature of intelligence, creativity, and work itself. The technology is barely three years into its public emergence. The implications will unfold for decades.

## See Also

- [[Artificial Intelligence]]
- [[Transformer Architecture]]
- [[Deep Learning]]
- [[Natural Language Processing]]
- [[ChatGPT]]
- [[GPT-4]]
- [[RLHF]]
- [[AI Agents]]
