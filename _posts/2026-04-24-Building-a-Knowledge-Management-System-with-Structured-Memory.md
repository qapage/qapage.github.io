---
layout: post
title: "Building a Knowledge Management System with Structured Memory"
categories: [Engineering]
tags: [AI, management]
---

Operational knowledge about complex systems lives across dozens of chat threads, ticketing systems, wikis, and people's heads. When a question comes up ("Which customers were affected by recent incidents?"), answering it requires searching multiple systems and reconstructing context from scratch every time. The information exists, but it is scattered and unstructured, which means it might as well not exist when you need it fast.

We built a file-based knowledge management system using Claude Code's persistent memory to solve this problem. The system stores knowledge as individual Markdown files with structured YAML frontmatter. Each file represents one discrete unit of knowledge: an incident, a service architecture, a customer relationship, or operational feedback. The approach is simple, but the structure is what makes it work.

#### How a Memory File Is Structured

Every memory file has three parts, and each part serves a specific purpose.

The frontmatter is YAML at the top of the file. It contains a name, a one-line description, and a type classification. The description matters more than you might think. It is written to support relevance matching in future lookups, so it needs to be specific enough that the system can decide whether this file is worth reading for a given question. A description like "Q4 incident" is almost useless. A description like "Database connection pool exhaustion caused 45-minute outage affecting billing service, October 2025" is immediately useful.

The body is the actual knowledge, structured consistently by type. Incident files follow a template: timeline, root cause, resolution, customer impact, retro findings. Architecture files capture service relationships, failure modes, and operational procedures. The consistency matters because it makes cross-cutting queries possible. If every incident file has a Customer Impact section in the same format, you can ask "which customers were affected across all incidents" and get a reliable answer.

The last section is a "Why / How to apply" footer. This is what distinguishes the system from a simple note archive. It encodes judgment: not just what happened, but when this knowledge should influence a decision. A memory file about a database failover incident might end with "Apply when: evaluating connection pool sizing for new services, or when diagnosing intermittent timeout errors in services that share the same database cluster." This lets the system surface relevant context proactively rather than only responding to exact keyword matches.

#### The Index

A single file called MEMORY.md serves as the table of contents. Each entry is one line, organized by topic rather than chronologically. This file is always loaded into conversation context, so it acts as a retrieval hint. When a question comes in, the system scans the index to decide which detailed files to read. It does not need to open every file on every question. It reads the index, identifies the relevant files by their one-line descriptions, and pulls only what is needed.

This is the same principle behind the AGENTS.md approach described in OpenAI's harness engineering experiment: give the system a map, not a thousand-page instruction manual. A short index with pointers to deeper sources of truth scales far better than a monolithic document that tries to contain everything.

#### The Type System

Four memory types serve different purposes, and keeping them separate matters for retrieval quality.

Project memories capture incidents, architecture decisions, and ongoing initiatives. These are the most frequently created and the most likely to go stale. An incident memory is useful for weeks or months after the event. An architecture memory stays relevant until the architecture changes.

User memories record who the person is, their role, and their preferences. These help the system tailor its responses. An engineer asking about a service gets different context than an executive asking about the same service.

Feedback memories capture corrections and confirmed approaches. When someone says "don't mock the database in these tests" or "yes, the single bundled PR was the right call here," that guidance gets recorded so it carries forward. Corrections are easy to notice. Confirmations are quieter but equally important. If you only save corrections, the system avoids past mistakes but drifts away from approaches that have already been validated.

Reference memories are pointers to external systems. They record that bugs are tracked in a specific Linear project, or that a particular Grafana dashboard is what on-call watches. The system cannot access those external systems directly, but knowing where to look is often enough to be useful.

#### Why Separation and Structure Matter

The key design choices are separation and structure. Each topic gets its own file rather than appending to a single document. This means updates do not risk corrupting unrelated knowledge. If you need to update the customer impact section of an incident memory, you are editing one file, not navigating a sprawling document where a misplaced edit could break something else.

Consistent internal structure makes the system queryable in ways that unstructured notes never are. When every incident file follows the same template, questions that span multiple incidents become straightforward. "What patterns appear across recent incidents?" is answerable because the data is organized the same way every time.

#### Where This Approach Fits

This works well for teams managing dozens of services with recurring incidents, complex customer relationships, and institutional knowledge that would otherwise be lost to staff turnover or buried in chat history. The structured format makes it possible to ask questions that span multiple knowledge domains without manually correlating information from separate systems.

The limitation is staleness. Memory files are snapshots. Tickets close, customers resolve issues, architecture changes. The system mitigates this by treating memories as starting context to verify against current state, not as authoritative truth. Before acting on a memory that names a specific function or file path, the system checks whether it still exists. A memory that says "X exists" is not the same as "X exists now."

Active maintenance is still required. Outdated files need to be updated or removed. But the cost of that maintenance is low compared to the alternative: rebuilding context from scratch every time someone asks a question that the team answered three months ago in a chat thread that nobody can find.

#### References

- [Claude Code Memory Documentation](https://code.claude.com/docs/en/memory.md) covers CLAUDE.md files, auto memory, and the MEMORY.md index system
- [Claude Code Overview](https://docs.anthropic.com/en/docs/claude-code/overview) for the broader context on how Claude Code works as an agentic coding tool
- [Harness Engineering (OpenAI)](https://www.openai.com/index/harness-engineering/) describes the AGENTS.md approach to repository knowledge management referenced in this post
