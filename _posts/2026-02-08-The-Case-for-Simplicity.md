---
layout: post
title: The Case for Simplicity
categories: [SRE]
tags: [SRE]
---

Simple is clean. Simple is functional. Simple is better.

In Elements of Programming Style, Kernighan and Plauger wrote, *Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are by definition, not smart enough to debug it.*

Every minute spent simplifying code pays of time and again when the system is in operation. If you make code easy to read and understand, the next person that comes along and has to maintain it, will have an easier time. You write it once, but it gets read many times. It gets read by future you, when you want to build on top of it or add new features. It gets read by future you, at 3AM when something broke and folks need your help fixing it. You read it again, when its time to port it over to Java 99 or Python 4.6.9 or whatever the latest programming language of that time is.

You're writing this code for a reason. You might be building a product or a service that you hope is successful. And when it is, your product is going to grow, your user base is going to grow and want more features. You're going to add new things that stand on your current code base. Simpler code is going to be easier to change at that time. Simpler code is going make assumptions and dependencies clear. Its going to be easier to test, so you'll know you did not break anything during or after your changes.

When your team grows, you'll need to bring on board new people. You'll need to onboard these folks. Simple code is going to make that easier. The more people that understand your code, the more people that can add to it, that can review it, that can approve changes etc.

This can be extended to Architecture as well. Simple architecture makes growth easy, and it makes re-factors easy. Simple architectures allow you to scale easily. Simple architectures are easier to understand and make it clear where the risks are, and where your hot spots are. Simple architecture just evolves easier. If you complicate things in the beginning, you're making things harder to build on, to modify, to scale in the future. You are really limiting your choices.

A simple architecture provides clear boundaries, clear ownership and paved paths. It is boring, easy to understand, provides opinionated defaults, and makes it easy to do the right thing.

You are just starting out, with a small team, with a product that is yet to prove itself in the market. Do you need microservices yet? Maybe not. Start with a modular monolith, and extract services when forced by scale or by teams splitting out. You don't need the deployment or debugging hassles that come with microservices on day one, when you are not big enough to see any benefits.

When you are starting out, you don't need event driven everything. You are ok with direct function calls, until you need to break things down into asynchronous ones. The complexity these bring may not compensate you enough for the benefits they bring to a small code base.

Keep it simple and future you will be grateful.
