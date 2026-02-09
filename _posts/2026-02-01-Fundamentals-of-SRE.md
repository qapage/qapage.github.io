---
layout: post
title: Fundamentals of SRE
categories: [SRE]
tags: [SRE]
---

## Go to the source

*Site Reliability Engineering is what happens when you ask a software engineer to design an operations function.*
— Benjamin Treynor Sloss

Sloss coined the term while running Production Engineering at Google. In his SREcon 2014 talk, Keys to SRE, he lays out the principles that still define SRE today. This article distills those ideas and connects them to how modern companies organize reliability.

I recently sat down and watched Sloss's SREcon14 talk titled, ["Keys to SRE"](https://www.youtube.com/watch?v=n4Wf14e2jxQ). Here are my notes from that talk.

In his opinion, here's the full list of things that make SRE, SRE:

**Engineering-first**
- Hire only coders
- Common staffing pool for SRE and Dev
- Cap SRE operational load at 50%

**Reliability governance**
- Define SLAs / SLOs
- Measure and report against them
- Use error budgets to gate launches

**Operational sustainability**
- On-call teams of sufficient size
- Limits on events per shift
- Mandatory, blameless postmortems

## Why Reliability matters
Reliability is easy to ignore because its absence is only visible during failure. By the time users are complaining, multiple systemic issues have already accumulated and the organization is reacting too late. SRE exists to make reliability risk visible before it turns into outages.

Importantly, SRE does not try to eliminate all risk, prevent every outage, or dictate release policy. Instead, it provides a mechanism to manage tradeoffs explicitly. That mechanism is the error budget.

Error budgets align development velocity with reliability using objective signals. The process starts with the business defining an SLA: what availability or performance guarantees does the service make to its users? From that SLA, an error budget naturally follows. For example, a 99.99% SLA implies a 0.01% error budget—the amount of unreliability the service is allowed over a given period.

That error budget becomes the governing factor for releases. If the service is meeting its SLA and has remaining error budget, teams are free to release as often as they like. If reliability has slipped and the error budget is exhausted, releases pause until stability is restored and budget is earned back. There are no arbitrary freeze windows, personal gatekeepers, or subjective debates. The system’s observed reliability determines the pace of change.

This model puts development and SRE on the same side. Both want to ship faster and stay within the error budget. Because the rules are clear and measurable, teams can monitor themselves, understand the consequences of their changes, and adjust behavior without constant negotiation. Reliability stops being a source of friction and becomes a shared, data-driven constraint.

## Staffing, Work, Ops Overload 
In the worst possible case, you throw people at a badly functioning system, and keep it alive via manual labor. This is a tough job for anyone to be in.
For Dev, operations work might seem invisible. What you can't see, doesn't exist. And if you do see it, working on production slows you down.

Here are six things to do, to address this.
1. Common Staffing Pool: One more SRE, One less developer. The more operations work, the fewer features you can build. 
2. Hire only coders: They speak the same language as Dev. They know what a computer can do with code and they get bored easily. If they are willing to do the same thing thirty times manually, they're not going to make good SREs.
3. 50% cap on Ops work: If you succeed, work scales with traffic. If you're not careful, you could get overrun by operations work and not have time for coding. Coding reduces work/traffic ratio. You need to leave enough time for serious coding or drown.
4. Keep dev in the rotation: Makes sure that the Dev team seems the product in action. Nothing builds consensus on bug priorities like a couple of sleepless nights in a row. 
5. Excess operations load goes back to dev. This is a self regulating system. If they are working on operations stuff, they are building less features. 
6. SRE Portability: No requirement to stick with any project. In fact, there's no requirement to stick with SRE. Build it and they will come. Bust it and they will leave. The threat is rarely executed, but it is powerful.

## Death, taxes, and outages
SLA < 100% on every product, and that means there will be outages. They may not be fun, but they are going to happen. Not fun, but OK.
Goals for each outage,

1. Minimize impact: this means there are no NOCs. Alerts go straight to someone who is capable of fixing the issues. Alerts come with good diagnostic information, that allow engineers to narrow down and fix issues quickly. Practice a lot. How do you practice before an outage, so you can respond faster when it actually happens? You run firedrills. Google runs the Wheel of Misfortune.

2. Prevent recurrence: Firstly, you handle the event. Then you write the post-mortem through which you understand what happened, how it happened, who knew what when etc. You need to be brutally honest about what happened. Then you reset and get ready for the next one. This means that you can handle 2 events per on call shift. Any more, and you are not able to handle them efficiently.

### Running good postmortems
Keep post-mortems blameless. Focus purely on fixing technology and the processes, so that you are focussing on things that you can focus. This allows people to be open about what they did, and what happened, so you can fix them, to stop them from happening again.
You create a timeline, get all the facts and create bugs for all the follow up work.

The SRE Benediction: *May the Queries flow, And may the Pagers Remain Silent*.

## Core Takeaways from Sloss’s View
If I had to summarize what I hear Sloss say in that talk, here's that short list.

- **Engineer reliability:** Treat operational problems as software problems.
- **Automate toil away:** Manual, repetitive work is a signal — not a job description.
- **Balance tradeoffs:** Use SLOs and error budgets to balance feature velocity with reliability.
- **Scale sustainably:** SRE scales people and systems through tooling and engineering.
- **Focus on principles:** SRE is a long-term philosophy — not just a team name.

There are other aspects of SRE that are worth thinking about as well. 

## Centralized vs embedded SRE or Hybrid?
In a hybrid model there might be a central SRE org that owns,
- standards (SLIs, SLOs, incident processes)
- shared infra (observability, CI/CD, rollout tooling)
- training and hiring bar.

The embedded SREs might sit with product teams day to day but report to SRE. This keeps leverage high and preserves context.

## SRE is a leverage function, not a support team.
They are expected to grow slower than product headcount. If SREs are primarily on-call babysitters, the org design is broken. SRE's dont accept ownership of broken systems. They sent entry criteria (production releases, SLOs, on call maturity etc). They invest in eliminating work, not absorbing it.

Common patterns include using error budgets as a forcing function, making SRE engagements conditional and reversible, making toil have a limited life span.
Clear boundaries and ownership help prevent chaos. Who owns the service, who owns the platform, who is on call for what etc are questions that need to be answered clearly for an organization to be successful. Examples of answers are, Product feature teams own feature correctness and business logic, SRE owns availability, latency, capacity, and incident process.

## Reward Reliability improvements, not heroics
At scale, process beats talent.

Big companies might converge on standard incident command systems, dedicated incident tooling etc. They should recognize and reward reliability improvements, instead of heroics that happen during outages even though the former is less visible. SRE needs leadership's backing, so they can honor error budgets even when launches slip. So that they can say no to production when quality appears to be low, without taking political damage. 

The best companies treat SRE as an evolving function, as continuously refactorable, just like code.

## Comparison of SRE organizations across Google, Meta and Netflix.

| Dimension         | Google                    | Meta (Facebook)               | Netflix                     |
| ----------------- | ------------------------- | ----------------------------- | --------------------------- |
| Primary model     | Central SRE org           | Product-embedded reliability  | “You build it, you run it”  |
| SRE ownership     | Service reliability & ops | Reliability practices & infra | Platform reliability only   |
| Error budgets     | Core governance mechanism | Used, but softer              | Rarely formal               |
| On-call           | Often SRE-owned           | Mostly dev-owned              | Always dev-owned            |
| Culture           | Guardrails & gates        | Speed with feedback           | Freedom + responsibility    |
| Failure tolerance | Low                       | Medium                        | High (designed for failure) |

### Why these differences exist
#### Product shape matters
- Google: shared infrastructure, internal dependencies, strict SLOs
- Meta: consumer products optimized for speed and iteration
- Netflix: stateless, edge-heavy, streaming workloads

#### Failure cost matters
- Google Search / Ads downtime = immediate revenue & trust loss
- Facebook outages hurt engagement but recover quickly
- Netflix can degrade gracefully (lower bitrate, regional impact)

#### Talent model matters
- Netflix hires fewer, very senior engineers
- Google optimizes for consistency at scale
- Meta optimizes for fast learning loops

### Practical guidance (the synthesis)

Most successful large non-FAANG companies converge on a hybrid model rather than copying any single company wholesale. They adopt Google-like SRE principles—clear SLOs, error budgets, and explicit limits on toil—to make reliability measurable and governable. They use Meta-like embedding, aligning reliability engineers closely with product teams so reliability improvements stay near the code and development velocity remains high. And they enforce Netflix-like ownership, ensuring that product teams remain accountable for running what they ship, rather than outsourcing reliability to a separate group.

The common thread across these approaches is simple but non-negotiable: reliability is engineered, not outsourced. Organizations succeed when they combine strong reliability mechanisms with clear ownership and adapt these ideas to their own scale, risk tolerance, and talent mix—rather than trying to copy any one model verbatim.
