---
layout: post
title: What are AWS Outposts?
categories: [AWS]
tags: [AWS]
---

AWS Outposts, introduced in 2019, extends native AWS infrastructure and services into on-premises data centers, creating a seamless hybrid cloud environment. This allows some workloads to be run on premise and some in the cloud. This fully managed solution comes pre-configured at your facility, ready for use. 

Outposts require a dedicated connection to its parent AWS region and cannot work in a disconnected environment, as it functions as an extension, rathern than a standalone entity. While AWS handles the management of the Outpost, the customer is responsible for the physical security and power.

Outposts deliver a pool of AWS Compute and Storage capacity deployed in a customer's data center, that operates on AWS designed infrastructure that is optimized for secure, high-performance, and reliable operations. That means customers cannot integrate existing server hardware into an Outpost rack. 

The key advantage of Outposts is operational consistency: resources are managed using the same AWS APIs, tools, and console that you would use in the AWS cloud, enabling unified management across your hybrid environment.

Here are some common use cases for AWS Outposts:
- Low latency applications that require processing close to the data source
- Data residency requirements
- Local data processing
- Local data storage

There are two versions of AWS Outposts:
- AWS Outpost Racks: A single rack that can be used to run EC2 instances and EBS volumes. This is the most common version of Outposts.
- AWS Outpost Servers: A 42U rack that can be used to run EC2 instances, EBS volumes, and S3 buckets. This version is typically used for larger workloads.

The AWS Outpost Racks offer much more flexibility than the AWS Outpost Servers. The Outpost Racks can be used to run EC2 instances, EBS volumes, and S3 buckets. The Outpost Servers can only be used to run EC2 instances and EBS volumes.

What's supported(in AWS Outpost Racks)?
- EC2 instances
- S3 buckets
- EBS volumes
- RDS databases
- VPCs
- ElastiCache nodes
- ECS and EKS clusters
- EMR (Elastic MapReduce) clusters
- Application Load Balancers, except in US GovCloud
- Amazon Route 53 Resolver
- AWS App Mesh

For the below services, the Outpost requires AWS Region connectivity:
- ECR
- Network Load Balancers
- AWS IAM
- Amazon Route 53, etc.

The lack of access to these supplemental services means that no new clusters can be created, no new actions can be performed on existing clusters, instance failures will not be automatically replaced, and CloudWatch logs and event data will not propagate.

AWS Outposts are FedRAMP compliant. The customer is responsible for the phyical and environmental controls of the AWS Outpost. 
