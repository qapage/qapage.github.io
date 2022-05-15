---
layout: post
title: Building Resiliency, A true competitive advantage
categories: [resiliency]
tags: [resiliency]
---

TLDR; Resiliency is the capacity to recover quickly from difficulties; 
toughness.

#### Businesses are complex systems
When you start out, you have one idea, one simple system that does what you originally set out to do. Then you grow successful, you have more customers, you add more features, you add more reporting capabilities, you add more dependencies inside and outside your company, you add more vendors and use third party services.

Your simple system is not so simple any more. It is a complex system now.

#### And complex systems fail.
All those vendors, all those dependencies, those interacting systems, those data feeds that power your reports, your machine learning algorithms, those logging capabilities etc etc, each of them add failure vectors to your system.

Your system now has lots of failure modes. And given how many of those exist, you're probably not even aware of all the little failures that are constantly happening across your system. That is, your system is probably running in a degraded state a lot more than you know. You only notice when the degradation becomes bigger.

![placeholder](/assets/images/The_Complex_pattern_of_the_Zeebrugge_accident.png)

The above figure shows a causal tree derived from the Zeebrügge accident where several decision makers at different times, in different parts of a shipping company, all are striving locally to optimise cost effectiveness and thus are preparing the stage for an accident. The dynamic flow of events can then be released by a single human act.

As seen by the individual decision makers from the front end, it will be difficult to see the total picture during their daily operational decision making. The individual decision makers cannot see the complete picture and judge the state of the multiple defences conditionally depending on decisions taken by other people in other departments and organisations.

A single failure may allow the ship to remain afloat.
![placeholder](/assets/images/Herald_of_Free_Enterprise.jpeg)

But a chain of small failures tied together, form a catastrophic failure.
![placeholder](/assets/images/herald_of_free_enterprise_capsized.png)

#### The Rasmussen Model, 1997
![placeholder](/assets/images/Rasmussen_model_1997.png)

This model helps us understand how systems work and how they are on the edge of safety. There are three boundaries of interest for ay complex system. They are,
* the Economic failure boundary: if the lights are on and the doors are open, your business is running and you must stay within this edge of economic failure boundary. Anything outside leads your business to collapse.
* the Unacceptable workload boundary: this is where your workforce burns out and collapses if they work more than this. 
* the Acceptable performance boundary: this can be defined as the mean time between failures or by outages etc. This what we're to call as acceptable performance for the system. This is also called the Accident boundary.

The space in between these boundaries is where the operating space of your system. The operating point between these boundaries keeps moving as it keeps adjusting to different things. An accident or disaster or outage happens when the operating point moves outide these boundaries.

There are a couple of forces that are constantly acting on the operating point and forcing it specific directions. They are,
* there's a management pressure for economic efficiency, to push the operating point away from the economic failure boundary. this pressure is stronger the closer your operating point is to the economic failure boundary.
* the closer you are to the unacceptable workload boundary, the stronger is the pressure to push the operating point away from this boundary.

As a consequence, the system is going to be acted on in tandem by both these pressures and push the operating point towards the accident boundary. Left untended, the operating point moves closer and closer to the accident boundary.
