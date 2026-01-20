---
layout: post
title: Zero Trust for NHIs
categories: [NHI, Security, ZeroTrust]
tags: [NHI, Security, ZeroTrust]
---

## Introduction
ZeroTrust principles are generally applied to human identities in the cybersecurity world but there's a whole world of accounts swimming just below the surface, whose numbers dwarf the number of human identities. These are the service accounts, IAM roles, OAuth tokens, etc that are quietly running business as usual in every enterprise. They are generally invisible, unless something breaks, so they are not top of mind when Zero Trust principles are rolled out everywhere.

The core principle of Zero Trust is, "Never trust, always verify".

NHIs (Non Human Identities) violate this in so many ways. NHIs are,

- not very visible, so are hard to verify at the point of the request
- often have long lived access, and inherit trust, long lived trust.
- often do not follow the principle of Least Privileged Access

These properties that are often true for NHIs make them problematic.

To read more about NHIs, please see this [article](https://onsitereliability.com/All-about-Non-Human-Identities-NHIs/)

## Zero Trust Principles and applying them to NHIs

A Zero Trust strategy is typically built on four pillars: (1) Identity Verification, (2) Granular Access Controls, (3) Continuous Monitoring and Analytics, and (4) Data protection. Below, we’ll briefly review each pillar and then discuss how it applies to non-human identities (NHIs).

### Identity Verification
Zero Trust means continuously verifying every identity in the organization. In practice, most Zero Trust programs focus on human users, and non-human identities (NHIs) are often left out, except in the most mature or highly regulated environments.

Here are two simple ways to bring NHIs into better alignment with Zero Trust principles:

- Use strong, short-lived authentication. Prefer short-lived, signed tokens (such as OAuth tokens) over long-lived, static credentials like permanent API keys or passwords.

- Make access decisions based on context, not just identity. Don’t approve requests solely because an NHI presents valid credentials. Also check the request context—such as approved IP ranges, expected environments, time of day, or workload location—and allow access only when it matches what you expect.

### Granular Access Controls

Start by building an inventory of your NHIs. At a minimum, record each NHI’s name, owner, what it can access, and what it is allowed to do with those resources.

Once you have the list, review each NHI:
- Does it still need all of its current permissions? If not, reduce them.
- Can it do its job with fewer permissions? If so, make the change.
- Does it have a clear owner and a valid purpose? If not, flag it for deletion.
- Does it have write access when it only ever reads? Remove write access.

A strong baseline practice is to apply least privilege wherever possible to limit the damage if credentials are compromised.

For sensitive resources or high-risk actions, require re-authentication (or other step-up controls) so that access isn’t granted solely on a long-lived credential.

### Continuous Monitoring and Analytics

Zero Trust is dynamic and depends on continuous monitoring. To apply it to NHIs, you need to understand what “normal” looks like for each identity and watch for new or unusual patterns. The goal is to spot anomalies early and respond quickly.

Here is a non-exhaustive set of monitoring practices to put in place:

- Continuously monitor for unauthorized access attempts and unusual NHI behavior.
- Use tools that audit and track NHI activity so every action is visible and attributable. Human use should be detectable. Humans should not be using NHIs.
- Build dashboards and visualizations showing how NHIs are used across environments, services, regions, and jurisdictions to surface issues early.
- Monitor third-party NHI activity using logs, API call tracking, and behavior analytics to detect anomalies.

### Data Protection

Segmenting your environments, and enforcing access rules based on those segments is an effective way to limit the broad permissions NHIs often receive.

For example, if a service account should only be used in non-production, enforce that restriction at the system level rather than relying on documentation or user training. If an NHI should only operate from a specific network range, enforce it with controls like firewalls and network policies instead of trusting people to stay within bounds.

## Conclusion
Zero Trust can’t stop at human users. NHIs run much of the business, and when they’re long-lived, over-permissioned, and poorly monitored, they quietly undermine “never trust, always verify.”

Treat NHIs as first-class identities: keep an inventory, assign owners, use short-lived authentication, enforce least privilege and segmentation, and continuously monitor for anomalies. Extending Zero Trust to NHIs reduces standing access, limits blast radius, and strengthens your overall security posture.
