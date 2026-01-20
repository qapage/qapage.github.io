---
layout: post
title: Lets talk about Non-Human Identities (NHIs)
categories: [NHI, Security]
tags: [NHI, Security]
---

## Introduction

**Non-Human Identity** is any digital identity that is used by something that is not a person but still needs to log in or get access. Any entity that needs to:

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

In most organizations there are thouands of NHIs, often more than human identities. Some studies have found that NHIs can outnumber human identities by 10:1. 

Because NHIs are so widespread (and growing), they deserve the same level of rigor as human identity security—both in how they are created and how they are managed over time.

#### Common Gaps:

NHIs often have:

- **Powerful access**
- **Poor visibility**
- **No central inventory** - information is spread across code, config files, cloud management consoles, and vendor-specific admin consoles
- **Unclear ownership**
- **No periodic review** of what's still needed or what needs to change

### Why attackers care

These gaps make NHIs attractive targets. If an attacker compromises an NHI, they can potentially gain long-lived, privileged, and under-monitored access to critical resources inside an organization.

---

## A mental model for managing NHIs

**Key Principle:** Think of NHIs as no different from humans and manage them similarly.

At a high level:

1. **Inventory** — Create and maintain an inventory of NHIs.
2. **Ownership** — Make it clear who owns which NHI.
3. **Purpose** — Define the scope and responsibility of each NHI.
4. **Least Privilege** — Grant the least amount of access needed to fulfill that purpose.
5. **Short-lived credentials** — Minimize credential lifetime and automate rotation. 
6. **Lifecycle** — Standardize how you create, change, and retire NHIs.

Below is a bit more detail on each.

### Inventory of NHIs

You need to know what exists before you can manage it.

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

This documentation serves as input to least-privilege design. A major source of NHI risk is over-privileged, general-purpose accounts that can “do everything,” often due to shortcuts taken during initial setup.

#### Practical steps to take:

- Make "a one-line purpose" **mandatory** in the pipeline or form that creates NHIs.
- Prefer narrow, task-specific identities over mega-accounts.
- During reviews, quarantine or retire any NHI whose purpose cannot be explained.

### Least Privileged Access
Give NHIs only the access required to perform their purpose—nothing more. Use role-based or policy-based access for NHIs just as you do for humans.

#### Practical steps to take:

Run regular reporting for high-risk NHIs that have:
- Privileged access
- Long-lived credentials
- Internet reachability

Block creation of new NHIs with `*` or global admin permissions unless they go through an explicit approval flow.

### Short-Lived Credentials

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

Take your join/move/lifecycle processes and tooling and apply them to NHIs. There's no reason for an exception.

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

- Revoke keys/tokens/roles
- Delete or disable the identity
- Clean up any remaining dependencies

#### Practical steps to take:

- If you retire a system, NHIs die automatically as part of the same change, not months later when someone remembers
- Setup periodic jobs that look for NHIs unused for N days and propose them for decommissioning

---

## Conclusion

Non-Human Identities are a critical but often overlooked aspect of security. By treating them with the same rigor as human identities — maintaining inventories, establishing ownership, defining purpose, enforcing least privilege, minimizing credential lifetime, and managing their full lifecycle — organizations can significantly reduce their attack surface and improve their overall security posture.

---

## Resources

- [OWASP Non-Human Identities Top 10](https://owasp.org/www-project-non-human-identities-top-10/2025/introduction/)
