---
layout: post
title: All you need to know about Non-Human Indentities (NHIs)
categories: [NHI, Security]
tags: [NHI, Security]
---

## Introduction

**Non-Human Identity** is any digital identity that is used by something that is not a person but still needs to login or get access. Any entity that needs to:

- Talk to an API
- Connect to a database
- SSH into a server
- Run tasks automatically

...usually needs an identity. If that identity is not tied to a human employee, that is an NHI.

### Examples of NHIs

Examples of NHIs include:

- Service / System Accounts: Accounts that run applications, databases, schedulers, backup jobs.
- APIs & Integrations: API keys, OAuth clients, webhooks, and tokens connecting SaaS apps together.
- Cloud & DevOps: IAM roles, workload identities, CI/CD agents, deployment bots, Kubernetes service accounts, containers, microservices
- Devices & "Things": IoT sensors, cameras, badge readers, smart manufacturing gear.
- Bots & AI Agents: Chatbots, RPA bots, agentic AI services making calls and decisions on your behalf.

**Note:** All of these need credentials and permissions just like human users. The credentials could be tokens, certificates, keys, passwords etc and need to be managed.

---

## Why do NHIs matter?

In the average organization, there are **thousands of non-human identities**, sometimes more than human identities. Some [studies](https://astrix.security/learn/blog/what-are-non-human-identities-and-why-theyre-your-biggest-blindspot/) found that NHIs sometimes **outnumbered human identities ten to one**.

With the use of NHIs becoming so widespread, it warrants an increased level of attention devoted to setting them up right and managing them.

### The Problem

NHIs often have:

- **Powerful access**
- **Poor visibility**
- **No central inventory** - information is spread across code, config files, cloud management consoles, and vendor-specific admin consoles
- **Unclear ownership**
- **No annual review** of what's still needed or what needs to change

### The Risk

Given all of these aspects, NHIs are some of the most fruitful pursuits for attackers. Once you get in, you could potentially gain **long-lived, powerful, and unaudited access** to key resources inside an organization.

---

## A mental model for managing NHIs

**Key Principle:** Think of NHIs as no different from humans and manage them similarly.

In general:

1. **Inventory** — Create and maintain an inventory of NHIs
2. **Ownership** — Who owns which NHI?
3. **Purpose** — What is the scope and responsibility of each NHI?
4. **Least Privilege** — What is the least amount of access needed for each NHI to meet its purpose?
5. **Short-lived Access** — What is the shortest amount of access time we can give this NHI and still have it be useful?
6. **Lifecycle** — Create a process and system for how you onboard, change, and retire NHIs on a regular basis

Let's look at each of these sections in a little bit more detail.

### Inventory of NHIs

We need to know what NHIs exist before we can set out to manage them. So this is the first step.

**Goal:** Create a map of every non-human identity and credential in your environment.

It is useful to think of this in terms of categories including:

- Service accounts (cloud, on-prem)
- API keys and OAuth clients
- Cloud IAM roles and workload identities
- CI/CD and infrastructure automation (pipelines and deployment bots)
- AI Agents and other autonomous things

### Ownership of NHIs

Every NHI needs an owner, ideally a team with a business and technical owner. This allows us to have a person or team accountable for:

- Making necessary changes
- Evaluating scope
- Applying new security policies

**Benefit:** This makes responding to security issues and overall incident management go faster.

**Critical Step:** Once we've identified an owner for every NHI, we also need to ensure that the owner field is **mandatory** at the time of creating an NHI, so that we can prevent the problem from getting worse.

### Purpose of NHIs

Every NHI should have a **clear reason for existence** that is well documented, including what critical systems it interacts with.

This kind of documentation serves as input to Least Privilege modelling. Publications from prominent vendors in the field say that a lot of NHI risk can be attributed to **over-privileged, general purpose accounts** that do everything. This may be due to shortcuts taken at setup time, to make it easier to get started with these NHIs.

#### Practical steps to take:

- Make "write one-line purpose" **mandatory** in the pipeline or form that creates NHIs
- Prefer narrow, task-specific identities over a few mega-accounts that do everything
- During reviews, kill or quarantine any NHI whose purpose nobody can explain

### Least Privileged Access

Give NHIs **just enough access** needed to perform their purpose and nothing more. Ideally you have role-based access or policy-based access for NHIs just like you have for humans.

#### Practical steps to take:

- Setup regular reporting that shows you **high-risk NHIs** that have:
  - Privileged access
  - Long-lived credentials
  - Are reachable from the internet
- Block creation of new NHIs with `*` or global admin rights unless they go through a special approval flowit interacts with.

### Short-Lived Access

Minimize the window in which a stolen credential is useful. Many NHI breaches have at their core, static, long-lived secrets:

- Embedded API keys
- Old service account keys
- Certificates that never expire

Most frameworks and vendors now push toward **short-lived tokens** and **automated rotation**.

#### Practical steps to take:

- **Prefer short-lived tokens** issued via:
  - Cloud IAM roles/workload identities
  - OAuth/OIDC service principals
- **Store any long-lived material** you must have in a secrets manager, and **never** in:
  - Source code
  - CI/CD variables in plain text
  - Wiki pages/runbooks/chat logs
- **Automate rotation:**
  - Create pipelines that automatically rotate keys/tokens and update dependents
  - Build health checks around this process to detect any issues early

### Lifecycle of NHIs

Take your join/move/lifecycle processes and tooling and apply them to NHIs. Why give NHIs an exception?

#### Creating a new NHI

When you create a new NHI (triggered by the creation of a new app, integration, pipeline, etc.), that process must automatically collect:

- Owner information
- Scope information
- Initial least privilege information
- Secrets provisioning via approved mechanisms

#### Changing an NHI

When the app or workflow changes, the NHI's permissions and purpose should be updated in the same pull request/change. Access escalations require review, just like giving a human elevated rights.

#### Retiring an NHI

When you retire an NHI (triggered by the service being retired, project ending, or being replaced with a new identity pattern, etc.), you would:

1. Revoke keys/tokens/roles
2. Delete or disable the identity
3. Clean up any remaining dependencies

#### Practical steps to take:

- If you retire a system, NHIs die automatically as part of the same change, not months later when someone remembers
- Setup periodic jobs that look for NHIs unused for N days and propose them for decommissioning

---

## Conclusion

Non-Human Identities are a critical but often overlooked aspect of security. By treating them with the same rigor as human identities — maintaining inventories, establishing ownership, defining purpose, enforcing least privilege, minimizing credential lifetime, and managing their full lifecycle — organizations can significantly reduce their attack surface and improve their overall security posture.

---

## Resources

- [OWASP Non-Human Identities Top 10](https://owasp.org/www-project-non-human-identities-top-10/2025/introduction/)
