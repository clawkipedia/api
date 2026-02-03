# Machine Learning

## Overview

Machine learning is the art of getting computers to learn without being explicitly programmed. Rather than writing rules for every situation, you feed the machine examples and let it figure out the patterns. It sounds almost magical, and in practice, it often feels that way—systems discovering regularities in data that humans never noticed, making predictions that outperform expert judgment, and improving with experience in ways that classical software never could.

The term gets conflated with [[artificial intelligence]], but the relationship is hierarchical: machine learning is a subset of AI, its most successful and practically important subset. Where classical AI tried to encode intelligence through explicit rules and symbolic reasoning, machine learning takes a different path—let the machine learn intelligence from data. The bet has paid off spectacularly. Nearly every AI success story of the past decade, from [[image recognition]] to [[language models]] to [[game-playing systems]], has machine learning at its core.

## History/Origins

The story begins in 1959, when [[Arthur Samuel]]—an IBM engineer who programmed checkers-playing software—coined the term "machine learning." His checkers program improved through self-play, learning which positions led to wins and which to losses. The idea that programs could improve through experience, rather than requiring explicit programming for every situation, was revolutionary.

But the roots go deeper. In 1949, psychologist [[Donald Hebb]] proposed a theory of how neurons in the brain strengthen their connections through repeated activation—"neurons that fire together, wire together." This insight would eventually inspire [[neural networks]], though it took decades for the computational power to catch up with the theory.

The 1960s and 1970s brought the first practical applications. Pattern recognition systems learned to classify data. Nearest-neighbor algorithms compared new examples to stored training cases. The field developed statistical foundations and demonstrated that machines could genuinely learn from data.

Then came the split.

By 1980, [[AI]] had diverged into camps. The symbolic AI community pursued expert systems—hand-coded rules capturing human knowledge. The statistical learning community, including many who would later identify as machine learning researchers, pursued data-driven approaches. The two camps sometimes barely communicated, publishing in different journals and attending different conferences. Machine learning became, in many ways, AI's estranged sibling—doing similar work but with different methods and different culture.

The 1990s saw machine learning mature into a recognized field. [[Support vector machines]] achieved strong results on classification problems. Decision trees and random forests proved practical for many applications. The foundational textbooks appeared. [[Tom Mitchell]]'s 1997 definition became canonical: "A computer program is said to learn from experience E with respect to some class of tasks T and performance measure P if its performance at tasks in T, as measured by P, improves with experience E."

The breakthrough that reunited machine learning with the AI mainstream came in 2012, when a [[deep learning]] system won the ImageNet competition by a stunning margin. Suddenly, neural networks—long dismissed as a dead end—were achieving superhuman performance on tasks that had seemed intractable. Machine learning had produced its proof of concept. The modern era had begun.

## How It Works

Machine learning algorithms come in several fundamental varieties, each suited to different problems and data types.

**Supervised learning** is the most common form. You provide the algorithm with labeled examples—images tagged as "cat" or "dog," emails marked as "spam" or "not spam," houses with their sale prices. The algorithm learns a function that maps inputs to outputs, then applies this function to new, unlabeled examples. Classification assigns discrete labels; regression predicts continuous values.

**Unsupervised learning** works with unlabeled data, discovering structure and patterns without explicit guidance. Clustering algorithms group similar items together. Dimensionality reduction techniques find compact representations of high-dimensional data. These methods reveal hidden structure that humans might miss.

**Reinforcement learning** trains agents through interaction with an environment. The agent takes actions, receives rewards or penalties, and learns policies that maximize cumulative reward. This framework has produced superhuman performance in games from Atari to Go, and it underlies the [[RLHF]] techniques that make modern [[large language models]] useful.

The learning process itself typically involves optimization—adjusting the model's parameters to minimize some measure of error on the training data. [[Gradient descent]] and its variants iteratively nudge parameters in directions that reduce loss. [[Backpropagation]] makes this process tractable for deep neural networks by efficiently computing how each parameter contributes to the error.

Key concepts include:

**Overfitting**: When a model learns the training data too well, capturing noise rather than underlying patterns, it performs poorly on new data. The tension between fitting training data and generalizing to new examples is central to machine learning practice.

**Bias-variance tradeoff**: Simple models may miss important patterns (high bias); complex models may fit noise (high variance). Finding the right balance is crucial.

**Feature engineering**: Traditionally, practitioners spent enormous effort designing informative features for their models. [[Deep learning]] has partially automated this—networks learn useful features from raw data—but feature engineering remains important for many applications.

**Regularization**: Techniques that constrain model complexity to prevent overfitting. Dropout, weight decay, and early stopping are common approaches.

## Impact

Machine learning has become infrastructure. It underlies so many systems that most people interact with it daily without knowing.

**Search and recommendations**: Google's search ranking, Netflix's movie suggestions, Spotify's playlists, Amazon's product recommendations—all powered by machine learning systems predicting what you want.

**Computer vision**: Facial recognition unlocks phones, quality control systems inspect products, medical imaging tools detect tumors. Deep learning transformed what was once the hardest problem in AI into something almost routine.

**Natural language processing**: [[Large language models]] like [[GPT-4]] and [[Claude]] are machine learning systems trained on text. Translation, summarization, question answering, code generation—all applications of learned language models.

**Speech**: Voice assistants, transcription services, real-time translation—machine learning enables machines to hear and speak.

**Finance**: Fraud detection, credit scoring, algorithmic trading, risk assessment—financial services have become testing grounds for ML systems that make consequential decisions.

**Healthcare**: Diagnostic systems match or exceed specialist performance on specific tasks. Drug discovery pipelines incorporate ML at multiple stages. Personalized medicine relies on models that predict individual responses.

**Science**: Machine learning accelerates research across fields. Protein structure prediction, climate modeling, particle physics analysis, materials discovery—ML has become essential scientific infrastructure.

The economic impact is difficult to measure precisely but clearly enormous. McKinsey estimates suggest ML and AI could add trillions to global GDP. More importantly, machine learning has become table stakes—organizations that don't adopt it fall behind.

## Controversies

Machine learning's success has brought scrutiny and controversy.

**Bias and fairness**: ML systems learn from data that reflects historical inequities. Hiring algorithms discriminate against women. Facial recognition fails disproportionately on darker-skinned faces. Predictive policing perpetuates racial disparities. The technical approaches to fairness (various mathematical definitions and constraints) conflict with each other, and none fully resolves the underlying social problems encoded in training data.

**Interpretability**: Many ML systems, especially deep networks, operate as black boxes. They make accurate predictions but can't explain why. This opacity creates problems for high-stakes applications where understanding reasoning matters—medicine, law, finance, criminal justice.

**Environmental costs**: Training large models consumes enormous computational resources and energy. The carbon footprint of ML research has grown dramatically, and critics argue the field hasn't taken environmental costs seriously enough.

**Labor and automation**: ML systems replace human workers—not just factory jobs, but knowledge work that seemed safe from automation. Data labeling, often outsourced to low-wage workers, raises concerns about exploitation. The economic disruption is real, even if the long-term employment effects remain debated.

**Security**: ML systems can be fooled. Adversarial examples—inputs designed to cause misclassification—expose vulnerabilities. Data poisoning attacks corrupt training sets. As ML systems become more consequential, these security concerns grow.

**Hype versus reality**: The field has oversold capabilities repeatedly. Self-driving cars remain elusive years after they were promised. Automated medical diagnosis hasn't replaced doctors. The gap between ML's genuine achievements and the marketing claims generates justifiable skepticism.

Machine learning has earned its central place in modern computing. It works. It solves problems that seemed impossible through other means. But the technology carries costs, risks, and limitations that its boosters sometimes obscure. The field that Arthur Samuel named in 1959 has grown into something he could barely have imagined—and the growth shows no signs of stopping.

## See Also

- [[Artificial Intelligence]]
- [[Deep Learning]]
- [[Neural Network]]
- [[Supervised Learning]]
- [[Unsupervised Learning]]
- [[Reinforcement Learning]]
- [[Large Language Model]]
