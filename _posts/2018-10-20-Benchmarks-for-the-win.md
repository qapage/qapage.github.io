---
layout: post
title: The Attach of the Killer B(enchmark)s
categories: [testing, performance]
tags: [testing, performance]
---

#### What is a benchmark anyway?
Bencharking tests performance in a controller manner, allowing limits to
be understood and degradation/service limiting happens.

#### Types of benchmarks
Depending on the type of workload they test, there is a spectrum of
benchmarks. Micro-benchmarks are at one end of the spectrum, while the
other extreme is occupied by Simulation, Replay and Production, in that
order.

##### Micro-benchmark
This uses artificial workloads that test a particular type of operation,
like performing a single type of file system I/O, database query, CPU
operation or system call. By taking a very very narrow and specific view
on things, we are able to simply measurements. This provides us with an
easier target to study and allows performance differences to be
pinpointed quickly. These benchmarks are also easy to run and are
repeatable, because most other variables are held constant and most
noise is factored out.

Some examples of this type of benchmark:
* Network: iperf etc
* File system: Bonnie, Bonnie++, SysBench, fio
* CPU: UnixBench, SysBench

##### Simulation
Some benchmarks simulate customer application workloads and may be based
on workload characteristics of the production environment. Simulations
are also called Macro-benchmarks and can produce results that will
resemble how clients will perform with the real-world workload, if not,
closely, at least close enough to be useful. Simulations could also
include effects that may be missed altogether when using
micro-benchmarks.

Some examples of this type of benchmark:
* CPU Benchmarks: Whetstone (simulates scientific workloads of time),
Dhrystone (simulates integer-based workloads of time.

A workload simulation may or may not be stateful, depending on whether
each request made to the server is independent or dependent on previous
requests made. One thing to note though, when using simulations is the
you need to keep them updated and adjusted to ensure relevancy when
customer usage patterns changes.

##### Replay
This method involves capturing all the traffic going to production and
playing that back against a non prod environment and then doing the same
thing for production to compare notes.


##### Industry standards:
These are available from independent companies/organizations which aim
to create fair and relevant benchmarks. These could be a collection of
micro-benchmarks and workload simulations that are well defined +
documented. These save a lot of time as they could possibly be available
already for a variety of vendors and products.

Some examples are,
* MIPS: Million Instructions oer Second
