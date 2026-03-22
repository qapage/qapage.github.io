---
layout: post
title: Harness Engineering
categories: [Engineering]
tags: [AI, Codex, Agents, Software Delivery]
---

## What is Harness Engineering?

OpenAI published a post in February 2026 by Ryan Lopopolo describing an experiment their team ran: building and shipping an internal software product with zero lines of manually-written code. Every line of application logic, tests, CI configuration, documentation, observability setup, and internal tooling was written by Codex. The product had daily internal users and external alpha testers. It shipped, deployed, broke, and got fixed, all driven by agents.

The team estimates they built the product in roughly 1/10th the time it would have taken to write the code by hand.

The core philosophy: *Humans steer. Agents execute.*

The term "harness engineering" refers to the discipline of building the environment, scaffolding, and feedback loops that make this kind of agent-driven development possible. The harness is not the product code itself. It is the infrastructure of intent, constraints, and context that allows an agent to do reliable work at scale.

## The numbers

The first commit landed in late August 2025. Five months later, the repository contained roughly one million lines of code across application logic, infrastructure, tooling, and documentation. About 1,500 pull requests were opened and merged by a small team of three engineers driving Codex, translating to an average of 3.5 pull requests per engineer per day. Throughput actually increased as the team grew to seven engineers.

Humans never directly contributed code. That constraint was the point. By holding that line, the team was forced to build what was actually necessary to make agents effective, rather than falling back on manual work when things got hard.

## Redefining the engineer's role

Early progress was slower than expected, not because Codex was incapable, but because the environment was underspecified. The agent lacked the tools, abstractions, and internal structure needed to make progress on high-level goals.

The primary job of the engineering team became: *enable the agents to do useful work.*

In practice this meant working depth-first. Break down a larger goal into smaller building blocks. Prompt the agent to construct those blocks. Use them to unlock more complex tasks. When something failed, the fix was almost never "try harder." The question was always: what capability is missing, and how do we make it both legible and enforceable for the agent?

Human interaction with the system happened almost entirely through prompts. An engineer describes a task, runs the agent, and allows it to open a pull request. Codex was instructed to review its own changes locally, request additional agent reviews, respond to feedback, and iterate in a loop until all agent reviewers were satisfied. Pull requests could be reviewed by humans, but humans were not required. Over time, the team pushed almost all review effort towards agent-to-agent.

## Making the application legible to agents

As code throughput increased, the bottleneck shifted to human QA capacity. Since human time and attention were the fixed constraint, the team worked to make the application itself directly legible to Codex.

They made the app bootable per git worktree, so Codex could launch and drive a separate instance per change. The Chrome DevTools Protocol was wired into the agent runtime, giving Codex skills for working with DOM snapshots, screenshots, and navigation. This let Codex reproduce bugs, validate fixes, and reason about UI behavior directly without a human watching.

The same approach was applied to observability. Logs, metrics, and traces were exposed to Codex via a local observability stack that was ephemeral for any given worktree. Codex could query logs with LogQL and metrics with PromQL. This made prompts like "ensure service startup completes in under 800ms" or "no span in these four critical user journeys exceeds two seconds" directly tractable. The team regularly saw single Codex runs work on a task for upwards of six hours, often while humans were sleeping.

## Repository knowledge as the system of record

Context management is one of the biggest challenges in making agents effective at complex tasks. One of the team's earliest lessons: give Codex a map, not a 1,000-page instruction manual.

They tried the "one big AGENTS.md" approach. It failed in predictable ways:

- Context is a scarce resource. A giant instruction file crowds out the task, the code, and the relevant docs, so the agent misses key constraints or optimizes for the wrong ones.
- Too much guidance becomes non-guidance. When everything is "important," nothing is. Agents pattern-match locally instead of navigating intentionally.
- It rots instantly. A monolithic manual turns into a graveyard of stale rules. Agents cannot tell what is still true, humans stop maintaining it, and the file quietly becomes an attractive nuisance.
- It is hard to verify. A single blob does not lend itself to mechanical checks like coverage, freshness, or ownership, so drift is inevitable.

Instead, the team treats AGENTS.md as the table of contents, not the encyclopedia. A short AGENTS.md of roughly 100 lines serves as a map, with pointers to deeper sources of truth in a structured `docs/` directory. The directory holds design docs, execution plans, product specs, architectural references, and generated artifacts like the database schema.

Plans are treated as first-class artifacts. Ephemeral plans are used for small changes. Complex work is captured in execution plans with progress and decision logs, checked into the repository. Active plans, completed plans, and known technical debt are versioned and co-located, so agents can operate without relying on external context.

This enables progressive disclosure: agents start with a small, stable entry point and are taught where to look next, rather than being overwhelmed up front. Dedicated linters and CI jobs validate that the knowledge base is up to date, cross-linked, and structured correctly. A recurring "doc-gardening" agent scans for stale documentation and opens fix-up pull requests.

## Agent legibility is the goal

The repository is optimized first for Codex's legibility. In the same way a team improves navigability for a new engineering hire, the human engineers' goal was making it possible for an agent to reason about the full business domain directly from the repository itself.

From the agent's point of view, anything it cannot access in-context while running effectively does not exist. Knowledge in Google Docs, chat threads, or people's heads is not accessible to the system. Repository-local, versioned artifacts such as code, markdown, schemas, and executable plans are all it can see.

The practical consequence: that Slack discussion that aligned the team on an architectural pattern is illegible to the agent if it never made it into the repo. The same way it would be unknown to a new hire joining three months later.

This framing clarified many tradeoffs. The team favored dependencies and abstractions that could be fully internalized and reasoned about in-repo. Technologies often described as "boring" tend to be easier for agents to model due to composability, API stability, and representation in the training set. In some cases it was cheaper to have the agent reimplement subsets of functionality than to work around opaque upstream behavior. For example, rather than pulling in a generic concurrency-limiting package, they implemented their own map-with-concurrency helper: tightly integrated with their OpenTelemetry instrumentation, with 100% test coverage, behaving exactly the way their runtime expected.

## Enforcing architecture and taste

Documentation alone does not keep a fully agent-generated codebase coherent. The team's approach: enforce invariants, not implementations. By encoding architectural rules mechanically, agents could ship fast without causing drift or decay.

The application was built around a rigid layered model. Each business domain is divided into a fixed set of layers with strictly validated dependency directions and a limited set of permissible edges. Cross-cutting concerns such as auth, connectors, telemetry, and feature flags enter through a single explicit interface: Providers. These constraints are enforced via custom linters and structural tests.

This is the kind of architecture teams usually postpone until they have hundreds of engineers. With coding agents, it becomes an early prerequisite. The constraints are what allow speed without architectural drift.

The team also maintained a small set of "taste invariants" enforced statically: structured logging, naming conventions for schemas and types, file size limits, platform-specific reliability requirements. Because the lints were custom, the error messages were written to inject remediation instructions directly into agent context. In a human-first workflow, these rules might feel pedantic. With agents, they become multipliers: once encoded, they apply everywhere at once.

The principle was: enforce boundaries centrally, allow autonomy locally. Within those boundaries, agents have significant freedom in how solutions are expressed. The resulting code does not always match human stylistic preferences, and that is accepted. As long as the output is correct, maintainable, and legible to future agent runs, it meets the bar.

Human taste gets fed back into the system continuously through review comments, refactoring pull requests, and user-facing bugs, captured as documentation updates or encoded directly into tooling.

## Throughput changes the merge philosophy

As Codex's throughput increased, many conventional engineering norms became counterproductive.

The repository operates with minimal blocking merge gates. Pull requests are short-lived. Test flakes are often addressed with follow-up runs rather than blocking progress indefinitely. In a system where agent throughput far exceeds human attention, corrections are cheap, and waiting is expensive. This would be irresponsible in a low-throughput environment. Here, it is often the right tradeoff.

## Entropy and garbage collection

Full agent autonomy introduces novel problems. Codex replicates patterns that already exist in the repository, including uneven or suboptimal ones. Over time, this leads to drift.

Initially, humans addressed this manually, spending every Friday cleaning up what the team called "AI slop." That did not scale.

Instead, the team encoded "golden principles" directly into the repository and built a recurring cleanup process. These are opinionated, mechanical rules that keep the codebase legible and consistent for future agent runs. For example: prefer shared utility packages over hand-rolled helpers to keep invariants centralized, and validate data boundaries rather than probing "YOLO-style." On a regular cadence, background Codex tasks scan for deviations, update quality grades, and open targeted refactoring pull requests. Most can be reviewed in under a minute and automerged.

The framing here is garbage collection. Technical debt is like a high-interest loan: almost always better to pay it down continuously in small increments than to let it compound. Human taste is captured once, then enforced continuously on every line of code. Bad patterns get caught and resolved daily rather than spreading for weeks.

## What this means for software engineering

The clearest takeaway from this experiment is that building software in an agent-first world still demands discipline, but the discipline shows up in the scaffolding rather than the code. The tooling, abstractions, and feedback loops that keep a codebase coherent are increasingly where the engineering leverage lives.

The engineer's job shifts: less time writing code, more time designing environments, specifying intent, and building feedback loops. When an agent struggles, the right question is not "how do I fix this code" but "what capability is missing from the environment, and how do I make it legible and enforceable for the agent?"

The most difficult challenges in this model center on designing control systems that help agents accomplish complex, reliable work at scale. That is what harness engineering is: the practice of building those systems well.
