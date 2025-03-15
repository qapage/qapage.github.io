---
layout: post
title: How to Avoid ArgoCD-Related Outages
categories: [AWS, ArgoCD]
tags: [AWS, ArgoCD]
---

#### Executive Summary: Avoiding ArgoCD-Related Outages
GitOps tool ArgoCD offers powerful Kubernetes deployment automation but can introduce significant operational risks if not properly configured and managed. This document identifies five critical failure modes that commonly lead to production outages: manifest synchronization failures, resource pruning incidents, Git repository misconfiguration, RBAC access control issues, and resource health assessment failures. Additionally, complex interactions between ArgoCD and cluster autoscaling mechanisms present unique challenges that require careful planning.

For each risk area, we provide concrete preventative measures focusing on progressive deployment strategies, proper validation procedures, and careful configuration management. By implementing these safeguards, DevOps teams can harness ArgoCD's capabilities while maintaining production stability and preventing widespread service disruptions. This guide serves as a critical resource for teams looking to adopt or improve their GitOps practices using ArgoCD in production environments.

#### What is ArgoCD?
ArgoCD is a declarative, GitOps continuous delivery tool for Kubernetes. It helps DevOps teams automate and manage the deployment of applications to Kubernetes clusters. 
ArgoCD ensures that the actual state of your deployed applications in Kubernetes clusters matches the desired state defined in Git repositories It continuously monitors both the Git repo and the cluster, automatically synchronizing them when differences are detected

#### Key Concepts in ArgoCD
- **Application:** A group of Kubernetes resources as defined by a manifest. This is a Custom Resource Definition (CRD).
- **Application:** source type Which Tool is used to build the application.
- **Target state:** The desired state of an application, as represented by files in a Git repository.
- **Live state:** The live state of that application. What pods etc are deployed.
- **Sync status:** Whether or not the live state matches the target state. Is the deployed application the same as Git says it should be?
- **Sync:** The process of making an application move to its target state. E.g. by applying changes to a Kubernetes cluster.
- **Sync operation status:** Whether or not a sync succeeded.
- **Refresh:** Compare the latest code in Git with the live state. Figure out what is different.
- **Health:** The health of the application, is it running correctly? Can it serve requests?
- **Tool:** A tool to create manifests from a directory of files. E.g. Kustomize. See Application Source Type.
- **Configuration management tool:** See Tool.
- **Configuration management plugin:** A custom tool.
- **Finalizer:** a Kubernetes resource annotation that prevents the deletion of resources until certain conditions are met or specific cleanup operations are completed. Finalizers are an important mechanism in ArgoCD's resource management and play a crucial role in maintaining system integrity.

#### How Does ArgoCD Work?
Argo CD follows the GitOps pattern of using Git repositories as the source of truth for defining the desired application state. Kubernetes manifests can be specified in several ways:

- Kustomize applications
- Helm charts
- Jsonnet files
- Plain directory of YAML/json manifests
- Any custom config management tool configured as a config management plugin

Argo CD automates the deployment of the desired application states in the specified target environments. Application deployments can track updates to branches, tags, or be pinned to a specific version of manifests at a Git commit.

#### Finalizers and the Role They Play in ArgoCD
Here's how finalizers work in ArgoCD:

- **Resource Protection:** When ArgoCD manages resources, it adds finalizers to prevent resources from being deleted before ArgoCD can properly handle the deletion process.
- **Cascade Deletion:** The resources-finalizer.argocd.argoproj.io/background finalizer ensures proper cascading deletion of resources. When you delete an Application in ArgoCD, this finalizer ensures that all child resources are properly cleaned up before the parent Application is removed.
- **Orphaned Resource Management:** Finalizers help ArgoCD track and manage orphaned resources (resources that were created by ArgoCD but are no longer defined in Git).
- **Deletion Hooks:** ArgoCD uses finalizers to ensure that any pre-deletion hooks or cleanup operations are completed before a resource is permanently removed.
- **Synchronization Safety:** They prevent race conditions where resources might be deleted while ArgoCD is still performing operations on them.

If you ever encounter situations where resources seem "stuck" in a terminating state, it's often because a finalizer is still present and ArgoCD is either waiting for conditions to be met or experiencing an issue with the deletion process. In such cases, you might need to manually remove the finalizer, though this should be done cautiously as it bypasses ArgoCD's normal cleanup processes.

#### What Are Some Ways in Which ArgoCD Can Cause Outages?

Here are 5 ways production outages can unintentionally occur through ArgoCD:

1. **Manifest Synchronization Failures**
Setting too aggressive sync policies without proper validation can propagate breaking changes to production. For example, if ArgoCD automatically applies manifests with incorrect resource specifications or incompatible API versions, critical workloads can fail immediately across environments.

    Preventative Measures:

    - Implement Progressive Sync Strategy: Use non-automatic sync for production environments and automatic sync only for development/staging.
    - Add Pre-Sync Validation: Implement pre-sync hooks that run validation tools like kubeval, conftest, or kube-score.
    - Establish Resource Requirements: Make CPU/memory/storage requests and limits mandatory in your CI pipeline.
    - Version your CRDs: Always ensure CRD versions are explicitly declared and compatible with your cluster version.

2. **Resource Pruning Incidents**
ArgoCD's automated pruning feature can inadvertently remove resources not defined in Git but required in production. If orphaned but necessary resources (like manually created secrets or ConfigMaps) aren't properly excluded from pruning, they may be deleted during sync operations, causing dependent applications to fail.

    Preventative Measures:

    - Selectively Apply Auto-Pruning: Disable auto-pruning for critical namespaces or set exclusions.
    - Mark Critical Resources: Use the argocd.argoproj.io/sync-options: Prune=false annotation for resources that should never be pruned.
    - Stage Pruning Operations: Implement a staged approach where pruning happens first in lower environments.
    - Regular Drift Detection: Schedule regular audits to detect resources managed outside of ArgoCD.

3. **Git Repository Misconfiguration**
Pointing ArgoCD to the wrong branch or commit can deploy untested configurations. If someone accidentally merges code to the production-tracked branch without proper review, or if ArgoCD is configured to track an unstable branch, unvetted changes can immediately affect production systems.

    Preventative Measures:

    - Branch Protection Rules: Configure protected branches in GitHub/GitLab with required reviews.
    - Use Target Revision Pinning: Pin production applications to specific commits or tags rather than branches.
    - Implement Deployment Environments: Configure separate ArgoCD applications for different environments with appropriate source references.
    - GitOps Pull Request Workflow: Require changes to go through PRs that update the target revision for production applications.

4. **RBAC and Access Control Issues**
Insufficient role-based access controls within ArgoCD can allow unauthorized changes to production applications. If too many team members have sync privileges or application management rights without proper guardrails, accidental deployments or configuration changes can occur.

    Preventative Measures:

    - Apply Principle of Least Privilege: Create role-specific projects in ArgoCD with appropriate permissions.
    - Implement Approval Workflows: Require approval from designated approvers for production syncs.
    - SSO Integration: Integrate with your organization's SSO for consistent access management.
    - Restrict Self-Service: Limit which users can create/modify Applications and which clusters they can target.

5. **Resource Health Assessment Failures**
ArgoCD may incorrectly assess application health due to misconfigured health checks or incomplete resource definitions. This can lead to scenarios where ArgoCD reports applications as healthy despite actual failures, or conversely, repeatedly attempts to "fix" properly functioning systems, causing disruption and instability.

    Preventative Measures:

    - Custom Health Checks: Implement application-specific health checks beyond the default ArgoCD checks.
    - Resource Quality Gates: Define minimum health criteria before considering deployments successful.
    - Health Check Timeouts: Configure appropriate timeouts for health assessments based on application startup times.
    - Canary Deployments: Use progressive delivery tools like Argo Rollouts for gradual rollouts with health gates.

Each of these scenarios highlights the importance of implementing proper safeguards, review processes, and progressive deployment strategies when using GitOps tools like ArgoCD.

#### ArgoCD and Autoscaling
Another area worth noting is the interaction of ArgoCD and Autoscaling mechanisms. Cluster autoscaling mechanisms (both node and pod autoscaling) can create complex interactions with ArgoCD deployments that aren't immediately obvious. These interactions can lead to outages if not properly managed. 

Here's a comprehensive look at how ArgoCD interfaces with cluster autoscaling and how to prevent related outages:

1. Resource Pressure During Deployments
When ArgoCD deploys applications with substantial resource requirements to a cluster with autoscaling enabled, the cluster may attempt to scale up nodes to accommodate the new workloads. During this scaling period, pods may remain in Pending state, causing ArgoCD to potentially mark applications as degraded, timeout during health checks, or even trigger unnecessary rollbacks.

    Preventative Measures:

    - Resource Requests and Limits: Always define resource requests and limits for all applications to ensure the autoscaler can make informed decisions.
    - Pre-Deployment Capacity Checks: Use pre-deployment hooks to check cluster capacity before deploying large applications.
    - Staggered Deployments: Implement staggered deployments to avoid overwhelming the cluster during peak load times.

2. Autoscaler Interference with ArgoCD Sync
Horizontal Pod Autoscaler (HPA) or Vertical Pod Autoscaler (VPA) can change resource allocations or replica counts during or after ArgoCD sync operations, causing:

    - Differences between desired state (in Git) and live state
    - Continuous reconciliation loops as autoscalers and ArgoCD compete
    - Health assessment failures as pod counts fluctuate

    Preventative Measures:
    - Disable Autoscaling During Deployments: Temporarily disable autoscaling during critical deployments.
    - Use ArgoCD Sync Waves: Implement sync waves to control the order of resource deployment and ensure that autoscalers are not triggered prematurely.
    - Monitor Autoscaler Events: Set up alerts for autoscaler events to quickly identify and resolve conflicts.

3. Autoscaling and Resource Limits
When cluster autoscaling is enabled, ResourceQuotas may create conflicts with ArgoCD deployments by:

    - Blocking new pods while nodes are scaling up
    - Creating race conditions between quota enforcement and autoscaling
    - Causing inconsistent deployment states that ArgoCD tries to reconcile

    Preventative Measures:
    - Define ResourceQuotas: Clearly define ResourceQuotas for namespaces to avoid conflicts with autoscaling.
    - Monitor Quota Usage: Regularly monitor resource quota usage to ensure that autoscaling can function effectively.
    - Use Namespace Isolation: Isolate critical applications in separate namespaces to minimize the impact of resource quotas.

