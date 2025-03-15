---
layout: post
title: What are AWS Outposts?
categories: [AWS]
tags: [AWS]
---

#### Introduction
AWS Outposts, introduced in 2019, extends native AWS infrastructure and services into on-premises data centers, creating a seamless hybrid cloud environment. This allows some workloads to be run on premise and some in the cloud. This fully managed solution comes pre-configured at your facility, ready for use.

Outposts deliver a pool of AWS Compute and Storage capacity deployed in a customer's data center, that operates on AWS designed infrastructure that is optimized for secure, high-performance, and reliable operations. That means customers cannot integrate existing server hardware into an Outpost rack.

The key advantage of Outposts is operational consistency: resources are managed using the same AWS APIs, tools, and console that you would use in the AWS cloud, enabling unified management across your hybrid environment.

#### Common Use Cases for AWS Outposts

- Low latency applications that require processing close to the data source
- Data residency requirements
- Local data processing
- Local data storage

#### AWS Outposts Form Factors
AWS Outposts comes in two distinct form factors to accommodate different deployment needs:

##### AWS Outposts Rack

- Full-sized rack infrastructure (typically 42U)
- Most common deployment option
- Supports a broader range of AWS services
- Supported services include:
    - EC2 instances
    - EBS volumes
    - S3 buckets
    - And additional services detailed below

##### AWS Outpost Servers

- Smaller individual server form factor
- More limited in service capabilities
- Supports only:
    - EC2 instances
    - EBS volumes

#### Supported Services on AWS Outposts Rack
##### Core Infrastructure Services

- Amazon EC2: Compute instances with the same instance types available in AWS regions
- Amazon EBS: Block storage volumes for EC2 instances with support for gp2, gp3, io1, and io2 volume types
- Amazon VPC: Virtual networks with the same VPC components and functionality as in AWS regions

##### Storage & Database Services

- Amazon S3 on Outposts: Object storage service designed specifically for on-premises data that must remain local
- Amazon RDS: Managed relational databases including MySQL, PostgreSQL, and SQL Server
Amazon ElastiCache: In-memory caching service with Redis and Memcached compatibility

##### Container & Application Services

- Amazon ECS: Managed container orchestration service
- Amazon EKS: Managed Kubernetes service
- Application Load Balancer: Layer 7 load balancing for HTTP/HTTPS traffic (except in US GovCloud)

##### Analytics & Networking Services

- Amazon EMR: Managed big data platform for processing and analyzing large datasets
- Amazon Route 53 Resolver: DNS query resolution for hybrid environments
- AWS App Mesh: Service mesh that provides application-level networking

#### Connectivity Requirements
AWS Outposts requires active connectivity to its parent AWS Region and cannot work in a disconnected environment, as it functions as an extension, rather than a standalone entity. While AWS handles the management of the Outpost, the customer is responsible for the physical security and power.

##### Services Requiring Regional Connectivity:

- AWS Identity and Access Management (IAM): All authentication and authorization
- Amazon ECR (Elastic Container Registry): Container image storage and deployment
- Network Load Balancers: Layer 4 load balancing for TCP/UDP traffic
- Amazon Route 53: DNS management and resolution (beyond local Resolver functionality)
- AWS CloudWatch: Metrics, logs, and monitoring
- AWS CloudTrail: API logging and governance
- AWS Systems Manager: Resource configuration and management
- AWS CloudFormation: Infrastructure as code deployments

##### Operational Impact During Connectivity Loss
When connectivity to the AWS Region is interrupted, the following operational limitations apply:

- No New Deployments: Creation of new resources or clusters is not possible
- Limited Management: Existing resources cannot be modified or reconfigured
- Reduced Resilience: Failed instances will not be automatically replaced
- Observability Gap: CloudWatch logs and event data will not be collected or propagated
- Authentication Issues: IAM-dependent services may experience degraded functionality

#### Additional Information

- All services maintain API compatibility with their AWS region counterparts
- Service updates follow the same release cycle as regional services, with some delay
- Service availability may vary by AWS region and hardware configuration
- AWS Outposts are FedRAMP compliant
- The customer is responsible for the physical and environmental controls of the AWS Outpost

