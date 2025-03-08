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

#### Common use cases for AWS Outposts
- Low latency applications that require processing close to the data source
- Data residency requirements
- Local data processing
- Local data storage

#### Versions of AWS Outposts
- AWS Outpost Racks: A single rack that can be used to run EC2 instances and EBS volumes. This is the most common version of Outposts.
- AWS Outpost Servers: A 42U rack that can be used to run EC2 instances, EBS volumes, and S3 buckets. This version is typically used for larger workloads.

The AWS Outpost Racks offer much more flexibility than the AWS Outpost Servers. The Outpost Racks can be used to run EC2 instances, EBS volumes, and S3 buckets. The Outpost Servers can only be used to run EC2 instances and EBS volumes.

#### AWS Outposts Rack: Supported Services

##### Core Infrastructure Services
- Amazon EC2: Compute instances with the same instance types available in AWS regions
- Amazon EBS: Block storage volumes for EC2 instances with support for gp2, gp3, io1, and io2 volume types
- Amazon VPC: Virtual networks with the same VPC components and functionality as in AWS regions

##### Storage & Database Services
- Amazon S3 on Outposts: Object storage service designed specifically for on-premises data that must remain local
- Amazon RDS: Managed relational databases including MySQL, PostgreSQL, and SQL Server
- Amazon ElastiCache: In-memory caching service with Redis and Memcached compatibility

##### Container & Application Services
- Amazon ECS: Managed container orchestration service
- Amazon EKS: Managed Kubernetes service
- Application Load Balancer: Layer 7 load balancing for HTTP/HTTPS traffic (except in US GovCloud)

##### Analytics & Networking Services
- Amazon EMR: Managed big data platform for processing and analyzing large datasets
- Amazon Route 53 Resolver: DNS query resolution for hybrid environments
- AWS App Mesh: Service mesh that provides application-level networking

##### Additional information
- All services maintain API compatibility with their AWS region counterparts
- Service updates follow the same release cycle as regional services, with some delay
- Service availability may vary by AWS region and hardware configuration


#### AWS Outposts Rack: Unsupported Services

##### Connectivity needs
AWS Outposts requires active connectivity to its parent AWS Region for several critical services:

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

AWS Outposts are FedRAMP compliant. The customer is responsible for the phyical and environmental controls of the AWS Outpost. 
