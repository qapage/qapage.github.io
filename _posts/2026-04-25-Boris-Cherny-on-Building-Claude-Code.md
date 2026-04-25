---
layout: post
title: "Boris Cherny on Building Claude Code"
categories: [Engineering]
tags: [AI, software-engineering, productivity]
---

Boris Cherney is the creator and engineering lead behind Claude Code at Anthropic. Before that, he spent seven years at Meta leading code quality across Instagram, Facebook, WhatsApp, and Messenger. In a recent conversation on the Pragmatic Engineer podcast, Boris shared how Claude Code went from a solo side project to one of the fastest-growing developer tools, how it writes roughly 80% of all code at Anthropic, and what his daily workflow looks like when shipping 20 to 30 pull requests a day with zero handwritten code.

The whole conversation is worth listening to. But the parts that stuck with me most were the practical lessons: things Boris does every day, principles that shaped the tool, and shifts in how he thinks about engineering. Here are the ones I keep coming back to.

#### Plan First, Then Let It One-Shot

Boris almost always starts in plan mode. He iterates on the plan with Claude before letting it implement anything. This is the highest-leverage workflow pattern he describes.

"Once there is a good plan, it just will one-shot the implementation almost every time," he says. "The most important thing is to go back and forth a little bit to get the plan right."

The instinct most people have is to jump straight into implementation. That works when you are the one writing the code and can course-correct on the fly. When an agent is doing the work, a bad plan means a bad implementation that you have to throw away. A few extra minutes refining the plan saves significantly more time than fixing a misdirected implementation.

#### Parallelize Your Agents

Boris runs five terminal tabs, each with a separate checkout of the repository, with Claude Code running in parallel across all of them. He round-robins between tabs: starts Claude in plan mode on tab one, moves to tab two, starts another, and keeps cycling. When he runs out of tabs, he overflows to the desktop app and the iOS app.

"If you told me six months ago I'd be writing, I don't know, a third, maybe like a third, half, something like this of my code on a phone. That's crazy. But that's what I'm doing today."

The key insight is that the bottleneck is no longer typing speed or even thinking speed. It is how well you manage multiple concurrent streams of work. Boris frames this directly: "The work has become jumping between Claudes. It's not so much about deep work, it's about how good am I at context-switching."

#### Automate Recurring Review Comments

At Meta, Boris was one of the most prolific code reviewers at the company. He tracked every recurring comment in a spreadsheet. When a particular issue appeared three or four times, he wrote a lint rule for it.

"Every time that I would have to comment about something, I would drop it in a spreadsheet," he explains. "Anytime that a particular row had more than three or four instances, I would write a lint rule for it. Just automate it with an op. This is one of our superpowers as engineers: we are able to automate all of the tedious work."

The modern version is even faster. "Now what I do is when a coworker puts up a pull request and I'm like, this is lintable, I'll just at Claude, please write a lint rule for this, in that PR on their PR." The feedback loop from noticing a pattern to encoding it as an automated check has collapsed from days to minutes.

#### Understand the Layer Below

Boris spent part of his early time at Anthropic working on reinforcement learning, not because it was his job, but because he wanted to understand the layer underneath what he was building.

"Always understand the layer under. It's really important because that just gives you the depth and you have a little bit more levers to work at the layer that you actually work at." He notes that this advice has not changed in a decade. What has changed is which layer matters. "Before it was like understand the JavaScript VM and frameworks and stuff. Now it's: understand the model."

This is a practical call to action. If you are building on top of language models, you should have at least a working understanding of how they reason, where they fail, and what makes them perform better. That knowledge directly improves the quality of the prompts you write, the architectures you design, and the failure modes you anticipate.

#### Prototype Aggressively

When building the todo list feature for Claude Code, Boris created roughly twenty working prototypes in about a day and a half. Not mockups, not wireframes. Working, interactive implementations. He tried each one, got a feel for it, and moved on.

"On our team the culture is we don't really write stuff. We just show. Prototyping everything is so baked into the way that we build." He contrasts this with the old approach of starting with static mocks in Figma or writing a PRD. "There's just no way we could have shipped this if we started with static mocks or a PRD. It's a thing that you have to build and you have to feel."

The economic argument is simple: the cost of building has dropped dramatically. When implementation is cheap, the right move is to explore broadly rather than speculate narrowly. "Personally I'm wrong like half the time. At least half of my ideas are bad. And I don't know which half until I try it."

#### Embrace Generalism

At Anthropic, everyone holds the same title: Member of Technical Staff. Boris sees this as more than a cultural choice. It is a signal about how work gets done.

"Without this title, the default would have been: I see your name on Slack and under your name it says software engineer. And then I'm like, okay, I guess you're the coding person. I'm not going to ask you product questions. But when everyone's title is Member of Technical Staff, by default you assume everyone does everything."

He believes this is a preview of where the broader industry is heading. "People are going to become more and more multi-discipline and this will become more and more rewarded. In some ways, I think this will be the year of the generalist." When AI tools lower the cost of execution across disciplines, the people who can work across boundaries become disproportionately valuable.

#### Revisit Old Assumptions

The pace of model improvement means that ideas which failed months ago may now work. Boris describes this as one of the hardest adjustments.

"The model is improving so quickly that the ideas that worked with the old model might not work with a new model. The things that didn't work with the old model might work with a new model. You just always have to bring this beginner mindset."

In a traditional engineering culture, re-trying a failed idea is often met with skepticism. Why are you doing this again? We already tried it. Boris argues that this instinct is now counterproductive. "It's the first time ever where it's actually not crazy to just try the same idea every few months because the model improves and it just works."

He also points out that this dynamic inverts the usual seniority advantage. "New people that are newer to the team, people that are newer to engineering, sometimes do things in a better way than I do. And I just have to look at them and I have to learn and I have to adjust my expectations."

#### Keep a Clean Codebase

At Meta, Boris led the Better Engineering program, a Zuckerberg mandate requiring every engineer to spend 20% of their time fixing tech debt. His team used causal inference to measure the impact. The finding: code quality contributes double-digit percentage points to engineering productivity.

That finding now extends to models. "When you start a migration, finish the migration," Boris says. "As an engineer, you're going to have a bad time. As a new hire, you're going to have a bad time. As a model, you might just pick the wrong thing and then the user has to course-correct you. So actually the better thing to do is just always have a clean codebase. This is great for engineers and nowadays it's great for models too."

A codebase with two half-migrated frameworks is confusing for humans and actively harmful for AI agents that cannot tell which pattern is the intended one. If code quality had a double-digit impact on human productivity, the impact on model-assisted productivity is likely even larger.

#### Layer Your Safety Measures

Claude Code's security model uses what Boris calls the Swiss cheese model: multiple overlapping layers, none of which is perfect on its own, but whose combined probability of catching problems increases with each additional layer.

"For things like safety and security, there's no one perfect answer. You just need a bunch of layers. With enough layers, the probability of catching anything goes up. You just have to count the number of nines in that probability and pick the threshold that you want."

For prompt injection specifically, there are at least three layers: model alignment (training the model to resist injection), runtime classifiers that detect suspicious requests, and sub-agent summarization that processes external content through a separate context before returning results to the main agent. "This isn't just one mechanism. It's a layer, and by having a bunch of these different layers, it just reduces the probability a lot."

This principle applies broadly. Any system that interacts with untrusted input needs defense in depth. A single mechanism, no matter how sophisticated, has failure modes. Layered defenses make those failure modes independent, which makes the system far more robust.

#### The Printing Press Moment

Boris compares this moment in software engineering to the invention of the printing press. Before the press, less than 1% of the European population was literate. Writing was a niche skill performed by scribes employed by lords and kings, many of whom were themselves illiterate.

After the press, the cost of printed material dropped 100x in a few decades, and the quantity of printed material increased 10,000x over the following century. "If you think about what happened to the scribes, they ceased to become scribes, but now there's a category of writers and authors. These people now exist. And the reason they exist is because the market for literature just expanded a ton."

The parallel to coding is direct. Programming has been a niche skill performed by a small fraction of the population. As AI tools make coding accessible to everyone, the market for software will expand in ways that are difficult to predict. "The economy as we know it would not have existed without it. So what's next? What is the thing that we can't even predict today that will exist because anyone can do this?"

It is an optimistic framing, and one grounded in historical precedent. The scribes did not disappear. The scope of what they could do expanded beyond anything they could have imagined.

#### References

- [Pragmatic Engineer Podcast: Building Claude Code](https://www.youtube.com/watch?v=2ncBfaxONGE)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code/overview)
