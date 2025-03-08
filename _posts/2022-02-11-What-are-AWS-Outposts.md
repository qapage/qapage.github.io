---
layout: post
title: AWS Outposts for Managers
categories: [AWS]
tags: [AWS]
---

AWS Outposts were originally introduced by Amazon in 2019. They allow extending an AWS region into an on premise data center. This allows for a hybrid cloud solution where some workloads can be run on premise and some in the cloud. AWS Outposts are fully managed by AWS and are delivered to the customer's data center pre-configured and ready to use. They are connected to the AWS region over a dedicated connection and cannot work in a disconnected environment. They require permanent, reliable network connectivity to a parent region, as they are only an extension of the AWS region and do not stand alone. They are managed by AWS but the customer is responsible for certain aspects like physical security and power. They are typically a pool of AWS Compute and Storage capacity deployed in a customer's data center. AWS Outposts rack leverages AWS designed infrastructure, and is only supported on AWS-designed hardware that is optimized for secure, high-performance, and reliable operations. That means customers cannot just bring in any servers they own, and set them up inside the Outpost rack. These resources are managed the same way as resources in the AWS cloud. The customer can use the same AWS APIs, tools, and console to manage the resources on the Outpost.

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
