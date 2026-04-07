---
layout: post
title: "Operational Expectations for Production Services"
categories: [Infrastructure, SRE]
tags: [production-readiness, reliability]
---

Running a service in production is not the same as running it in a lab. The gap between "it works on my machine" and "it works reliably for customers at 3 AM on a holiday weekend" is filled with operational discipline. This post walks through the expectations every production service should meet, regardless of the underlying technology stack, and explains why each one matters.

Think of this as a production readiness checklist with context. If you are launching a new service, migrating an existing one, or inheriting something that has been running on autopilot for too long, this is the bar.

#### Safe Deployment

Deploying to production should never be an all-or-nothing event. A progressive rollout strategy (canary deploys, blue-green switches, ring-based rollouts) limits the blast radius when something goes wrong. If a bad build only reaches 1% of traffic before automated health checks catch it, you have a minor incident instead of a major outage.

Automated rollback is the companion to progressive rollout. If your deploy pipeline can detect a problem (elevated error rates, failed health checks, latency spikes) it should be able to roll back without waiting for a human to wake up and click a button. The goal is to make the time between "something is wrong" and "we are back to the last known good state" as short as possible.

Infrastructure should be defined as code and reconciled from a single source of truth. If your infrastructure lives in Terraform, Pulumi, CloudFormation, or Kubernetes manifests, you have a versioned, reviewable, reproducible description of what should exist. Drift detection closes the loop: if someone makes a manual change in the console, the system notices and either corrects it or alerts on it. Without this, your infrastructure slowly diverges from what you think it is, and that divergence bites you at the worst possible time.

#### Scaling and Availability

Horizontal scaling based on load signals (CPU, memory, request rate, queue depth) means your service can absorb traffic spikes without manual intervention. The key is choosing the right signals. CPU-based autoscaling works for compute-bound workloads, but a service that is mostly waiting on I/O might need to scale on request rate or queue depth instead.

Distributing workloads across failure domains (availability zones, physical hosts, regions) protects you from correlated failures. If all your instances sit in a single availability zone and that zone has a network partition, you are down. Spread across zones, you lose a fraction of capacity and stay up.

Disruption budgets prevent too many instances from being taken down at once during maintenance, rolling updates, or node drains. Kubernetes PodDisruptionBudgets are the most common implementation, but the concept applies everywhere. If you have five replicas, you might allow at most one to be unavailable at any time. This keeps your service healthy even while the platform underneath it is being patched.

#### Health Management

Readiness and liveness signals are how your service communicates its state to the platform running it. A readiness probe says "I have finished starting up and I am ready to serve traffic." A liveness probe says "I am still running correctly." These are distinct and should stay distinct. A service that is alive but not ready (still warming a cache, waiting for a dependency) should not receive traffic. A service that is ready but no longer alive (deadlocked, stuck in an infinite loop) should be restarted.

Graceful shutdown is about respecting in-flight work. When the platform tells your service to stop (during a deploy, a scale-down, a node drain), the service should stop accepting new requests, finish the ones it is already processing, and then exit. Without this, you get dropped connections, partial writes, and unhappy users during every deploy.

#### Security Posture

Security in production is not a single gate you pass through at launch. It is a set of ongoing constraints.

Least-privilege execution means your service runs with only the permissions it actually needs. If your API server does not need to read from S3, it should not have an IAM policy that allows it. Overly broad permissions sit there quietly until an attacker or a bug exploits them.

Network segmentation restricts ingress and egress to what the service actually needs. Your internal data processing service should not be reachable from the public internet. Your frontend service should not be able to talk directly to the database. Network policies, security groups, and service mesh configurations enforce these boundaries.

Container and runtime hardening policies (read-only root filesystems, dropped capabilities, non-root execution) reduce the attack surface. Restricting image sources to approved registries prevents someone from accidentally (or maliciously) deploying an unvetted image.

Secrets must never be stored in plain text, environment variables, or source control. This sounds obvious, but it remains one of the most common findings in security reviews. Environment variables are readable by anyone who can exec into a container. Source control retains history forever. Use a proper secrets manager.

Application security reviews and risk registries round this out. The review catches issues before launch. The risk registry tracks known gaps so they do not get quietly forgotten.

#### Identity, Certificates, and Encryption

All service-to-service communication should be encrypted in transit. Mutual TLS (mTLS) is the gold standard because it authenticates both sides of the connection, not just the server. Without encryption in transit, anyone with network access can read or tamper with the traffic between your services.

Certificates should come from a trusted internal CA, auto-renew before they expire, and trigger automatic workload restarts when they rotate. Certificate expiry is one of the most preventable causes of outages. If your certificates are managed manually, it is a matter of when, not if, someone forgets to renew one.

Workload identity should be tied to the service itself, not to a shared or static credential. A service mesh identity (SPIFFE, Kubernetes service accounts with bound tokens) gives each workload a cryptographically verifiable identity that does not depend on a long-lived secret sitting in a config file somewhere.

#### Secrets Management

Secrets should come from a centralized, access-controlled store (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, GCP Secret Manager). They should be refreshable without redeploying the service: your secret store rotates the database password, and the service picks up the new one on its next refresh cycle. Scoping secrets appropriately (per-deployment, per-region, global) limits the damage if one is compromised.

#### Observability

You cannot fix what you cannot see. Observability has three pillars, and you need all three.

Metrics give you the quantitative view: request rate, error rate, latency percentiles, resource utilization, queue depth, and business signals (orders placed, logins succeeded). These feed your dashboards and your alerts.

Distributed tracing follows a request as it crosses service boundaries. When a user reports that a particular action is slow, tracing lets you see exactly which service in the chain is adding latency. Without tracing, debugging in a microservices architecture devolves into grepping through logs from six different services and trying to correlate timestamps.

Dashboards should exist for each service and for shared infrastructure. The on-call engineer at 2 AM should be able to open a dashboard and immediately see whether the service is healthy, what changed recently, and where the problem might be.

Database and data-store monitoring is often overlooked. Slow queries, connection pool exhaustion, replication lag: these are some of the most common root causes of production incidents, and they are invisible if you are only watching application-level metrics.

Runbooks should exist for every critical alert. The alert fires, the on-call engineer opens the runbook, and the runbook tells them what to check, what to try, and when to escalate. Runbooks turn tribal knowledge into documented procedures that anyone on the rotation can follow.

#### Logging

Application and system logs should be forwarded to a centralized, searchable platform (Elasticsearch, Splunk, Datadog, CloudWatch Logs). If your only option for reading logs is to SSH into a production host and tail a file, you are one disk failure away from losing your debugging history.

Access logs serve double duty: they are essential for troubleshooting ("did the request actually reach the service?") and for audit ("who accessed what, and when?"). Log retention policies should be defined and enforced. Keep logs long enough to be useful for incident investigation and compliance, but not so long that storage costs spiral or you retain data you are obligated to delete.

#### Alerting and Incident Response

Alerts should be defined for the things that matter: certificate expiry, resource health, provider-level events, error budget burn rate. Routing alerts to the responsible team through a notification channel (PagerDuty, Opsgenie, a team Slack channel) seems basic, but misconfigured routing is a surprisingly common cause of delayed incident response.

Automated remediation for known, repeatable failure modes saves time and reduces mean time to recovery. If a specific alert always results in the same manual action (restart the service, clear the cache, drain the node), automate that action and alert on the automation failing instead.

Failure scenarios should be identified with documented escalation paths. "The database is unreachable" is a different escalation than "the CDN is returning stale content." Knowing who to call and when to call them before the incident starts makes the response faster and calmer.

Gameday or tabletop exercises validate that your incident response process actually works. They expose gaps in runbooks, stale contact lists, and assumptions about what "automatic" actually means. Run them regularly.

#### Backup and Disaster Recovery

Data stores should be backed up on a defined schedule with retention policies. Backup success and failure should be reported automatically. It is not enough to set up a backup job and assume it is working: backup jobs fail silently more often than anyone would like.

The recovery process should be documented and periodically tested. An untested backup is not a backup. If you have never actually restored from your backups, you do not know whether they work, how long the restore takes, or what state the data will be in after restoration.

#### CI/CD Validation

Changes should be validated before merge: linting, schema checks, policy enforcement. Catching a misconfigured Kubernetes manifest or a deprecated API call in the pull request is vastly cheaper than catching it in production.

Deprecated APIs and configurations should be detected before they reach production. Cloud providers deprecate APIs, Kubernetes removes beta resources, libraries drop support for old versions. If your CI pipeline flags these, you fix them on your schedule instead of scrambling when something breaks.

Scoped pipelines (only testing the components affected by a change) keep your CI fast. If you changed one microservice, you should not have to wait for the entire monorepo to build and test. Fast CI encourages small, frequent merges. Slow CI encourages large, risky batches.

#### Resource Accountability

Every cloud resource should be tagged with an owning team or contact. When an alert fires for an orphaned resource, someone needs to be responsible for it. Untagged resources become everyone's problem, which means they become no one's problem.

Workload identity should use short-lived, scoped credentials. Long-lived API keys are a liability: they do not expire, they get shared, they end up in places they should not be. Short-lived tokens from an identity provider are revocable, auditable, and scoped to exactly what the workload needs.

Node and instance lifecycle should be managed gracefully. Drain workloads before terminating nodes. Give pods time to migrate before scaling down. Abrupt termination causes the kind of intermittent failures that are hardest to debug.

Cloud cost should be estimated, tracked, and reported to a responsible party. Cost surprises are operational incidents too. An autoscaler that spins up 200 instances because of a traffic spike is doing its job, but someone should know about it and understand the cost implications.

#### Privacy and Data Governance

PII must be encrypted in transit and at rest. PII must not cross data residency boundaries without authorization. These are not optional: they are legal and contractual requirements in most jurisdictions.

Customer data should be purged when an account is deleted. Customer log retention settings should be respected. If a customer deletes their account and their data is still sitting in your logs six months later, you have a compliance problem.

Third-party services should be reviewed for sub-processor and contractual obligations. If your service sends customer data to a third-party analytics provider, that provider becomes a sub-processor under regulations like GDPR. Your contracts and your data processing agreements need to account for this.

#### Service Level Expectations

A customer-facing SLA defines the uptime or availability commitment you are making to your customers. It is a contract with consequences (usually financial) for not meeting it.

An internal SLO is the target you set for yourself, typically stricter than the external SLA. If your SLA promises 99.9% availability, your SLO might target 99.95%, giving you a buffer before you breach the SLA.

An error budget is the inverse of the SLO: if your target is 99.95%, you have a 0.05% error budget. When the budget is exhausted, you should have a defined response: freeze feature work, focus on reliability, conduct a review. Error budgets give engineering teams a quantitative framework for balancing velocity and reliability instead of arguing about it in meetings.

Severity and priority classifications should be documented for the service. Not every bug is a P1. Not every outage is a Sev1. Having clear definitions prevents the adrenaline of an incident from distorting the response.

#### Performance Validation

Load testing identifies capacity limits and breaking points before your customers find them. It answers questions like: "How many concurrent users can this service handle before latency degrades?" and "What happens when the database connection pool is exhausted?"

Performance criteria should be defined and met before production launch. If you do not have a latency target, you cannot tell whether a deploy made things worse. If you do not have a throughput target, you cannot tell whether you are provisioned correctly.

Sufficient test coverage across unit, integration, and end-to-end layers gives you confidence that changes do not break existing behavior. The emphasis is on "sufficient," not "100%." Focus coverage on the paths that matter most: the happy path, the error paths that customers hit, and the edge cases that have caused incidents before.

#### Documentation and Ownership

Architecture should be documented with diagrams and component descriptions. This does not need to be a 50-page design document. A clear diagram showing how the service fits into the broader system, what it depends on, and what depends on it is often enough.

Service ownership should be clearly attributed to a team. When something goes wrong, there should be no ambiguity about who is responsible. Ownership means the team is accountable for the service's health, security, and operational posture.

Data migration strategies should be defined if applicable. How do you move data between schema versions? What happens if a migration fails partway through? Can you roll back?

Maintenance and remediation procedures should be scripted where possible. If a human has to follow 15 manual steps to recover from a failure, at least some of those steps can and should be automated.

#### Launch and On-call Readiness

The rollback process should be defined with thresholds that trigger it. "If error rate exceeds 5% for 10 minutes, roll back" is a clear, actionable threshold. "Roll back if things look bad" is not.

A monitoring burn-in period at full production load should be completed before handing the service off to an on-call team. This period lets you tune alerts, identify noisy signals, and build confidence that the monitoring actually catches real problems.

Alert volume and remediation patterns should be journaled during burn-in. If the same alert fires 20 times in a week and the response is always the same, that is a candidate for automation or a sign that the threshold needs adjustment.

Internal and external stakeholders should be notified of launch and on-call transitions. The team taking on-call responsibility needs to know the service exists, what it does, and where to find the runbooks. Surprising an on-call engineer with a new service they have never heard of is a recipe for slow incident response and team frustration.

---

This list is long, and that is the point. Production is an environment that demands rigor across deployment, security, observability, resilience, and governance. No single item on this list is exotic or controversial. Each one exists because skipping it has caused real outages, real security incidents, or real compliance findings at real organizations. The goal is not perfection on day one. The goal is a clear, shared understanding of what "production ready" means, and a systematic approach to closing the gaps.