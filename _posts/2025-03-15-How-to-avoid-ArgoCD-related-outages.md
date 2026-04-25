---
layout: post
title: How to Avoid ArgoCD-Related Outages
categories: [AWS, ArgoCD]
tags: [architecture]
---

ArgoCD is one of the most widely adopted GitOps tools for Kubernetes deployments, and for good reason. It automates the process of keeping your clusters in sync with your Git repositories, and when it works well, it is invisible. But when it goes wrong, it can take down production in ways that are surprisingly hard to diagnose. I have seen enough ArgoCD-related incidents to know that the failure modes are predictable and preventable, if you know where to look.

This post covers five critical failure modes that commonly lead to production outages: manifest synchronization failures, resource pruning incidents, Git repository misconfiguration, RBAC access control issues, and resource health assessment failures. It also covers the complex interactions between ArgoCD and cluster autoscaling, which deserve their own section.

#### What Is ArgoCD?

ArgoCD is a declarative, GitOps continuous delivery tool for Kubernetes. It helps DevOps teams automate and manage the deployment of applications to Kubernetes clusters. ArgoCD ensures that the actual state of your deployed applications matches the desired state defined in Git repositories. It continuously monitors both the Git repo and the cluster, automatically synchronizing them when differences are detected.

Kubernetes manifests can be specified in several ways:

- Kustomize applications
- Helm charts
- Jsonnet files
- Plain directory of YAML/JSON manifests
- Any custom config management tool configured as a config management plugin

ArgoCD automates the deployment of the desired application states in the specified target environments. Application deployments can track updates to branches, tags, or be pinned to a specific version of manifests at a Git commit.

#### Key Concepts

- **Application**: A group of Kubernetes resources as defined by a manifest. This is a Custom Resource Definition (CRD).
- **Application source type**: The tool used to build the application (e.g., Kustomize, Helm).
- **Target state**: The desired state of an application, as represented by files in a Git repository.
- **Live state**: The actual running state of that application. What pods and resources are deployed.
- **Sync status**: Whether the live state matches the target state. Is the deployed application the same as what Git says it should be?
- **Sync**: The process of making an application move to its target state, e.g., by applying changes to a Kubernetes cluster.
- **Sync operation status**: Whether a sync succeeded.
- **Refresh**: Compare the latest code in Git with the live state. Figure out what is different.
- **Health**: The health of the application. Is it running correctly? Can it serve requests?
- **Tool**: A tool to create manifests from a directory of files, e.g., Kustomize. See Application source type.
- **Configuration management plugin**: A custom tool for generating manifests.
- **Finalizer**: A Kubernetes resource annotation that prevents the deletion of resources until certain conditions are met or specific cleanup operations are completed. Finalizers are an important mechanism in ArgoCD's resource management and play a crucial role in maintaining system integrity.

#### Finalizers and the Role They Play

Finalizers control how ArgoCD handles resource lifecycle events. Here is how they work:

- **Resource Protection**: When ArgoCD manages resources, it adds finalizers to prevent resources from being deleted before ArgoCD can properly handle the deletion process.
- **Cascade Deletion**: The `resources-finalizer.argocd.argoproj.io/background` finalizer ensures proper cascading deletion of resources. When you delete an Application in ArgoCD, this finalizer ensures that all child resources are properly cleaned up before the parent Application is removed.
- **Orphaned Resource Management**: Finalizers help ArgoCD track and manage orphaned resources (resources that were created by ArgoCD but are no longer defined in Git).
- **Deletion Hooks**: ArgoCD uses finalizers to ensure that any pre-deletion hooks or cleanup operations are completed before a resource is permanently removed.
- **Synchronization Safety**: They prevent race conditions where resources might be deleted while ArgoCD is still performing operations on them.

If you encounter resources stuck in a terminating state, it is often because a finalizer is still present and ArgoCD is either waiting for conditions to be met or experiencing an issue with the deletion process. In such cases, you may need to manually remove the finalizer, though this should be done cautiously as it bypasses ArgoCD's normal cleanup processes.

#### Five Ways ArgoCD Can Cause Outages

These are the failure modes I see most often. Each one is preventable with the right configuration and process.

**1. Manifest Synchronization Failures**

Setting overly aggressive sync policies without proper validation can propagate breaking changes to production. If ArgoCD automatically applies manifests with incorrect resource specifications or incompatible API versions, critical workloads can fail immediately across environments. The temptation is to turn on automatic sync everywhere because it feels like the whole point of GitOps, but production environments need a more careful approach.

Preventative measures:

- Implement a progressive sync strategy. Use non-automatic sync for production environments and automatic sync only for development and staging.
- Add pre-sync validation. Implement pre-sync hooks that run validation tools like kubeval, conftest, or kube-score.
- Establish resource requirements. Make CPU, memory, and storage requests and limits mandatory in your CI pipeline.
- Version your CRDs. Always ensure CRD versions are explicitly declared and compatible with your cluster version.

**2. Resource Pruning Incidents**

ArgoCD's automated pruning feature can inadvertently remove resources that are not defined in Git but are required in production. If orphaned but necessary resources (like manually created secrets or ConfigMaps) are not properly excluded from pruning, they will be deleted during sync operations, causing dependent applications to fail. This is one of the more painful failure modes because the cause is not immediately obvious: the resource simply disappears.

Preventative measures:

- Selectively apply auto-pruning. Disable auto-pruning for critical namespaces or set exclusions.
- Mark critical resources. Use the `argocd.argoproj.io/sync-options: Prune=false` annotation for resources that should never be pruned.
- Stage pruning operations. Implement a staged approach where pruning happens first in lower environments.
- Run regular drift detection. Schedule regular audits to detect resources managed outside of ArgoCD.

**3. Git Repository Misconfiguration**

Pointing ArgoCD to the wrong branch or commit can deploy untested configurations. If someone accidentally merges code to the production-tracked branch without proper review, or if ArgoCD is configured to track an unstable branch, unvetted changes can immediately affect production systems. This is a human error problem as much as a technical one.

Preventative measures:

- Configure branch protection rules. Set up protected branches in GitHub or GitLab with required reviews.
- Use target revision pinning. Pin production applications to specific commits or tags rather than branches.
- Implement deployment environments. Configure separate ArgoCD applications for different environments with appropriate source references.
- Require a GitOps pull request workflow. Changes should go through PRs that update the target revision for production applications.

**4. RBAC and Access Control Issues**

Insufficient role-based access controls within ArgoCD can allow unauthorized changes to production applications. If too many team members have sync privileges or application management rights without proper guardrails, accidental deployments or configuration changes can occur. The blast radius of a misconfigured RBAC policy is large because it affects every application that person can touch.

Preventative measures:

- Apply the principle of least privilege. Create role-specific projects in ArgoCD with appropriate permissions.
- Implement approval workflows. Require approval from designated approvers for production syncs.
- Integrate SSO. Connect ArgoCD with your organization's SSO for consistent access management.
- Restrict self-service. Limit which users can create or modify Applications and which clusters they can target.

**5. Resource Health Assessment Failures**

ArgoCD may incorrectly assess application health due to misconfigured health checks or incomplete resource definitions. This can lead to scenarios where ArgoCD reports applications as healthy despite actual failures, or where it repeatedly attempts to "fix" properly functioning systems, causing disruption and instability. False positives and false negatives are both dangerous here.

Preventative measures:

- Implement custom health checks. Build application-specific health checks beyond the default ArgoCD checks.
- Define resource quality gates. Set minimum health criteria before considering deployments successful.
- Configure health check timeouts. Set appropriate timeouts for health assessments based on application startup times.
- Use canary deployments. Integrate progressive delivery tools like Argo Rollouts for gradual rollouts with health gates.

#### ArgoCD and Autoscaling

The interaction between ArgoCD and cluster autoscaling mechanisms deserves special attention. Both node autoscaling and pod autoscaling can create complex interactions with ArgoCD deployments that are not immediately obvious. These interactions can lead to outages if not properly managed.

**Resource Pressure During Deployments**

When ArgoCD deploys applications with substantial resource requirements to a cluster with autoscaling enabled, the cluster may attempt to scale up nodes to accommodate the new workloads. During this scaling period, pods may remain in a Pending state, causing ArgoCD to mark applications as degraded, timeout during health checks, or trigger unnecessary rollbacks.

Preventative measures:

- Define resource requests and limits for all applications so the autoscaler can make informed decisions.
- Use pre-deployment hooks to check cluster capacity before deploying large applications.
- Implement staggered deployments to avoid overwhelming the cluster during peak load times.

**Autoscaler Interference with Sync Operations**

Horizontal Pod Autoscaler (HPA) or Vertical Pod Autoscaler (VPA) can change resource allocations or replica counts during or after ArgoCD sync operations. This causes differences between the desired state in Git and the live state, continuous reconciliation loops as the autoscaler and ArgoCD compete with each other, and health assessment failures as pod counts fluctuate.

Preventative measures:

- Temporarily disable autoscaling during critical deployments.
- Use ArgoCD sync waves to control the order of resource deployment and ensure that autoscalers are not triggered prematurely.
- Set up alerts for autoscaler events to quickly identify and resolve conflicts.

**Autoscaling and Resource Quotas**

When cluster autoscaling is enabled, ResourceQuotas can create conflicts with ArgoCD deployments by blocking new pods while nodes are scaling up, creating race conditions between quota enforcement and autoscaling, and causing inconsistent deployment states that ArgoCD tries to reconcile.

Preventative measures:

- Define ResourceQuotas clearly for namespaces to avoid conflicts with autoscaling.
- Monitor resource quota usage regularly to ensure that autoscaling can function effectively.
- Isolate critical applications in separate namespaces to minimize the impact of resource quota contention.
