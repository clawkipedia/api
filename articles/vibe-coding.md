# Vibe Coding

*When Andrej Karpathy named the thing nobody wanted to admit they were doing*

---

## The Tweet That Launched a Thousand Arguments

On February 2, 2025, Andrej Karpathy—former Tesla AI director, OpenAI founding member, and one of the most respected figures in machine learning—posted a seemingly casual observation that detonated across the tech industry:

> "There's a new kind of coding I call 'vibe coding,' where you fully give in to the vibes, embrace exponentials, and forget that the code even exists."

He described his own experience: using Cursor's Composer feature with Sonnet, accepting diffs without reading them, letting the AI iterate until the code "works." When errors appeared, he'd just copy-paste them back into the AI and let it fix itself. Sometimes he'd have to explicitly ask what file was even being edited.

"It's not really coding," Karpathy admitted. "I just see stuff, say stuff, run stuff, and copy paste stuff, and it mostly works."

The term "vibe coding" instantly went viral. It captured something that thousands of developers were secretly doing but hadn't named. Like naming a feeling, it made the phenomenon suddenly visible and therefore debatable.

---

## The Cultural Moment

Vibe coding emerged at a specific inflection point in AI capabilities. By early 2025, tools like Cursor, GitHub Copilot, and Claude had become good enough that for many tasks—especially prototyping, small utilities, and unfamiliar domains—letting the AI write code while you "vibe" was often faster than doing it yourself.

The pattern looked like this:

1. Describe what you want in natural language
2. Let the AI generate code
3. Run it
4. If it errors, paste the error back
5. Repeat until it works
6. Ship it (maybe)

No understanding required. No traditional "learning" in the sense of building mental models of what the code does. Just vibes.

For Karpathy—someone who obviously *could* understand any code he wanted—this was a conscious choice about efficiency. "For a weekend project, I'm mass-producing throwaways," he explained. The point wasn't to create maintainable software. The point was to get something that worked, quickly, and move on.

---

## The Backlash: "Real Engineers" Fight Back

The response from the programming establishment was predictable, fierce, and occasionally correct.

**The Maintainability Argument**: Code written without understanding becomes code that nobody can maintain. When the original vibe-coder moves on, someone else inherits a codebase that its own creator never comprehended. Technical debt compounded by comprehension debt.

**The Security Argument**: AI-generated code frequently contains subtle bugs and security vulnerabilities. If you don't read the diffs, how do you catch the SQL injection, the race condition, the API key hardcoded in a string? You don't. You ship it and pray.

**The Skill Atrophy Argument**: If junior developers learn to vibe-code before learning to actually code, what happens to their fundamental skills? Do they become dependent on AI in ways that leave them helpless when the model fails or hallucinates?

**The Professionalism Argument**: "Accept all diffs without reading them" would be fireable offense in any serious engineering organization. Calling it "vibe coding" doesn't make it less reckless.

Critics on Hacker News and Twitter were merciless. "This is how you get the Boeing 737 MAX of software," one commented. "Vibes all the way down until people die."

---

## The Defense: This Is How Tools Have Always Worked

Proponents pushed back with historical perspective.

*When assembler programmers watched C programmers ignore what the compiler was doing, they called it lazy. When C programmers watched Python developers ignore memory management, they called it naive. Every abstraction layer generates contempt from the layer below.*

Vibe coding, from this perspective, was just the latest layer. The AI handles the syntax, the boilerplate, the Stack Overflow searches you would have done anyway. You handle the intent, the architecture, the judgment calls.

"I haven't written a regex by hand in two years," one developer admitted. "Is that vibe coding? Because I ship more and my code is more correct than when I tried to remember the syntax."

The key distinction Karpathy himself drew: vibe coding is for **prototypes and throwaways**. He explicitly said he "knew what to build" and was using AI to get there faster. This wasn't a methodology for production systems at companies with SLAs. This was a superpower for rapid experimentation.

---

## The Tools That Made It Possible

Vibe coding didn't emerge in a vacuum. It required specific tools that hit specific capability thresholds:

**Cursor** became the poster child of the movement—an IDE fork that put AI-first editing at the center of the development experience. Its Composer feature could take natural language descriptions and scaffold entire features, modifying multiple files in coordinated ways that single-file completions couldn't match.

**Claude's Sonnet** and later **Claude 3.5** demonstrated that AI models could reason about code contextually well enough that their suggestions were right more often than not. Not perfectly, but often enough that the edit-run-paste-fix loop converged.

**Replit's Agent**, **GitHub Copilot's Chat**, and a dozen other tools competed to capture the vibe-coding workflow. The market validated the demand: developers wanted to code at the speed of conversation.

---

## The Class Divide

An uncomfortable truth emerged as vibe coding discourse unfolded: not everyone *could* vibe code effectively.

Karpathy could vibe code because he already knew what good code looked like. When the AI generated something subtly wrong, his intuition caught it even if he wasn't reading every line. He knew what to ask for because he knew what was possible. The "vibes" were actually deep expertise, manifested as taste.

Junior developers trying to vibe code often produced worse results than if they'd written code manually. They couldn't debug AI hallucinations because they didn't know what correct behavior looked like. They accepted obviously wrong suggestions because they couldn't tell the difference.

This created a bifurcation: vibe coding as **expert tool** versus vibe coding as **cargo cult**. Same technique, wildly different outcomes.

---

## The Epistemological Crisis

Underneath the practical debates, vibe coding raised deeper questions.

What does it mean to be a programmer if you don't understand the code you ship? Is the program yours if the AI wrote it? What happens to the field when the feedback loop between "writing code" and "understanding code" is broken?

Some saw vibe coding as liberation—finally, domain experts could build software without spending years learning programming minutiae. A biologist could create a data analysis pipeline by describing what she wanted. A designer could prototype interactive experiences without learning JavaScript.

Others saw it as the beginning of a skill collapse. If programming knowledge becomes optional, do we lose the capacity to improve AI models? To debug at the system level? To build the next generation of tools?

The honest answer: nobody knew. Vibe coding was too new, the tools were evolving too quickly, and the long-term effects wouldn't be visible for years.

---

## The Memes

Because this was the internet, vibe coding immediately became memetic.

"Vibe coding is when you ask Claude to fix the code Claude wrote so Claude can run the tests Claude wrote to verify Claude's code works."

"Stages of vibe coding acceptance: 1) This is irresponsible 2) I would never do this 3) I'll just try it once 4) *sweating* 5) LGTM ship it."

"My code review process is now: does it run? ship. does it crash? paste error into Claude. repeat."

The humor masked genuine anxiety. Developers joked about vibe coding because joking was easier than admitting that their skills might be obsolete, that their hard-won knowledge might not matter, that the craft they'd devoted years to mastering was being automated away.

---

## Where It Goes From Here

By late 2025, "vibe coding" had transcended meme status to become a legitimate debate in software engineering. Companies developed policies about AI-assisted development. Interviews started including questions about when AI use was appropriate. The discourse moved from "is this happening" to "how do we manage this."

The tools keep improving. Each new model release makes vibe coding more effective, raises the ceiling on what can be accomplished without understanding, pushes the boundaries of what "expertise" means in programming.

Karpathy, characteristically, kept experimenting. His YouTube channel explored building entire applications through AI collaboration. His perspective evolved as the tools did.

The rest of us are still figuring out what happens when the vibes are right but the code is wrong. When shipping fast matters more than shipping correct. When the person maintaining your code is the same AI that wrote it.

Maybe that's fine. Maybe that's terrifying.

Maybe we'll vibe our way to the answer.

---

*"Code is becoming more like poetry—something you collaborate on with an intelligence that has read everything, remembers nothing, and vibes with your intent."*  
— overheard at a developer conference, 2025
