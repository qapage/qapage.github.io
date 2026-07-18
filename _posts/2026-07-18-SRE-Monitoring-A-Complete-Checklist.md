---
layout: post
title: "SRE Monitoring: A Complete Checklist"
categories: [SRE]
tags: [SRE, monitoring, observability]
---

Most monitoring setups grow organically. A team adds a dashboard here, an alert there, and over time the system accumulates gaps nobody notices until an outage reveals them. The Google SRE books offer a structured alternative: a layered approach to monitoring that starts with what users experience and works inward toward root causes.

This post synthesizes the monitoring guidance from three Google books: Site Reliability Engineering (2016), The Site Reliability Workbook (2018), and Building Secure and Reliable Systems (2020). The result is a single checklist you can use to audit your monitoring coverage.

## The Four Golden Signals

Google's SRE book defines four signals that every service should monitor. These are the foundation.

| Signal | What to Monitor | Alert Threshold Guidance |
|--------|----------------|--------------------------|
| Latency | Request duration (split success vs error), P50/P95/P99 | Page on sustained P99 breach of SLO |
| Traffic | Requests/sec, connections/sec, sessions/sec | Alert on sudden drops (more than increases) |
| Errors | Error rate %, explicit (5xx), implicit (wrong content), policy (too slow) | Page when error budget burn rate is high |
| Saturation | CPU, memory, disk, connections, queue depth: the resource that will exhaust first | Page at 80%+ of hard capacity |

Traffic drops are often more informative than spikes. A sudden drop in requests frequently means users cannot reach you at all. Spikes might just mean you are popular.

## The Full Monitoring Checklist

The four golden signals tell you something is wrong. A complete monitoring stack tells you why, and warns you before users notice. The checklist below is organized in tiers from user-facing symptoms down to operational meta-signals.

#### Tier 1: User-Facing SLIs (Symptoms)

This is where your monitoring should be strongest. Everything else exists to explain anomalies in these signals.

- End-to-end latency from the user perspective (synthetic probes)
- Success rate of user-visible operations
- Availability measured from outside the system (black-box)
- Error rate differentiated by severity (client vs server errors)
- Traffic volume with anomaly detection (sudden drop equals outage signal)

#### Tier 2: Infrastructure Health (Causes)

Once you know something is wrong at Tier 1, these metrics help you find the cause.

- Compute saturation (CPU, memory per pod/node)
- Network saturation (bandwidth, connection limits, packet loss)
- Storage saturation (disk IOPS, capacity)
- Database health (connections, replication lag, query latency)
- Cache effectiveness (hit rate, eviction rate, memory usage)
- Queue depth and processing lag

#### Tier 3: Dependency Health

Modern services fail at their boundaries. Monitor what you depend on.

- Upstream dependency latency and error rates
- Downstream dependency availability
- Cloud provider service health (region-level signals)
- DNS resolution success and latency
- Certificate validity and expiration tracking

#### Tier 4: Capacity and Scaling

Saturation problems are predictable if you track the trends.

- Current utilization vs headroom for each constrained resource
- Autoscaler health (desired vs actual replicas)
- IP address pool exhaustion
- Session/connection capacity vs current load
- Rate limit proximity
- Time-to-exhaustion predictions for growing resources

#### Tier 5: Configuration and Deployment

Many outages correlate with recent changes. Make those changes visible.

- Deployment health (rollout status, rollback signals)
- Configuration drift detection
- Feature flag and config change correlation with errors
- Canary/rollout monitoring

#### Tier 6: Security and Compliance

Security failures are reliability failures. Monitor them the same way.

- Authentication/authorization failure rates
- Certificate expiration (30-day, 7-day, 1-day warnings)
- Anomalous access patterns
- Compliance-relevant audit trail gaps
- Rate limiting and abuse detection

#### Tier 7: Data Correctness and Freshness

For services that process or serve data, correctness is an SLI.

- Data pipeline lag (freshness SLI)
- Data completeness checks
- Cross-system consistency validation

#### Tier 8: Incident Detection Meta-Signals

Your monitoring system itself can fail silently. Watch the watchers.

- Customer-reported issues (manual escalation)
- Correlated multi-signal alerts (not just individual thresholds)
- Maintenance window awareness
- Operational workflow health (runbook automation success)
- Monitoring system health (dead alerts, unexercised rules)

## SLO-Based Alerting

The SRE Workbook advocates multi-window, multi-burn-rate alerting over simple threshold-based alerts. The idea: alert not on a raw error count, but on the rate at which you are consuming your error budget.

| Severity | Long Window | Short Window | Burn Rate | Budget Consumed | Action |
|----------|-------------|--------------|-----------|-----------------|--------|
| Page | 1 hour | 5 minutes | 14.4x | 2% | Immediate |
| Page | 6 hours | 30 minutes | 6x | 5% | Immediate |
| Ticket | 24 hours | 2 hours | 3x | 10% | Non-urgent |
| Ticket | 3 days | 6 hours | 1x | 10% | Next business day |

A 14.4x burn rate over one hour means you will exhaust your entire monthly error budget in about two days if the condition persists. That warrants a page. A 1x burn rate sustained over three days means you will barely miss your SLO target by month's end. That warrants a ticket, not a 3am wake-up.

The dual-window approach (long window plus short window) prevents both slow-burn blindness and flappy alerting. The long window catches sustained issues. The short window confirms the problem is happening right now, not just an artifact of earlier errors still in the window.

## Five Questions Before Creating Any Alert

Before you add any new alert rule, run it through these five questions from the SRE book.

1. Does this rule detect an otherwise undetected condition that is urgent, actionable, and actively or imminently user-visible?
2. Will I ever be able to ignore this alert, knowing it is benign?
3. Does this alert definitely indicate that users are being negatively affected?
4. Can I take action in response? Is that action urgent, or could it wait until morning?
5. Are other people getting paged for this issue, rendering at least one page unnecessary?

If the answer to question 2 is yes, the alert will train your team to ignore pages. If the answer to question 4 is "it can wait," it should be a ticket, not a page. These questions are a forcing function for alert hygiene.

## Key Principles

A few principles tie the checklist together.

Heavy use of white-box monitoring with modest but critical uses of black-box monitoring. White-box (metrics, logs, traces from inside the system) tells you why. Black-box (synthetic probes from outside) tells you what users actually experience. You need both, but white-box carries most of the diagnostic weight.

Symptoms over causes. Spend more effort catching symptoms than causes. A user does not care whether your database is slow or your cache is cold. They care that the page did not load. Alert on what users experience, and use cause-level metrics for diagnosis.

Every page should be actionable, require intelligence, and represent a novel problem. If a page requires no thought, automate the response. If it requires no action, it should not page.

Alert on burn rate, not raw threshold. A single error is not an incident. A sustained rate of errors that threatens your SLO target is.

SLIs are always ratios: good events divided by total events, expressed as a percentage. Error budget equals one minus the SLO target. Track on a four-week rolling window.

#### References

- [Site Reliability Engineering](https://sre.google/sre-book/table-of-contents/) (2016)
- [The Site Reliability Workbook](https://sre.google/workbook/table-of-contents/) (2018)
- [Building Secure and Reliable Systems](https://sre.google/books/building-secure-reliable-systems/) (2020)
