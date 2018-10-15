---
layout: post
title: The Goals of Test Automation
categories: [testing]
tags: [testing]
---

#### The Goals of Test Automation

Test automation takes the manual effort out of testing. It makes it easy to run your test cycles as frequently as you want them to run, without worrying about how long it could take to get results, or how many test engineers you have on your team. Why do repetitive stuff manually when you can code them up and have them run automatically, quickly and more accurately than a human ever could?

Now, with the obvious out of the way, lets consider what goals we could
have for test automation.

* Tests should help improve the quality of software
* Tests should serve as documentation for software
* Tests should help reduce risk
* Tests should be easy to run
* Tests should be easy to write and maintain
* Tests should require minimal maintenance as the System evolves around them

The first three focus focus on the value provided by the tests, while
the last three focus on the characteristics of the tests themselves.
Lets look at each of these in more detail and see how we can make them
measurable goals and not just concepts.

##### Tests should help improve the quality of software
Just the act of thinking through various scenarios in enough detail to create
test cases and identifying where the requirements are ambiguous or contradicting,
would weed out bugs at the earliest possible stage, even before a lot of code
has been written.

Tests, like regression tests help ensure that bugs once fixed or
features that used to work have not stopped working after the latest
code change we made. This is a case of tests acting as bug repellents in
this case.

Tests can identify which specific feature, thus part of the code base is
broken. Imagine working through a ten page user creation workflow etc to
be told at the end that something failed and that you should try it
again, correctly this time. Unit tests in particular can point to
specific functions that are misbehaving, so that you don't spend time
stepping through your entire workflow trying to find the specific line
of code that's broken.

##### Tests should serve as documentation for software
Tests help you understand how a specific feature reacts in a specific
case or to a specific type of data. You can just pick the test that
covers the specific scenario in question, step through it in a debugger
and traverse through everything the system does in that case, thus
understanding how control (and data) flow through the system.

##### Tests should help reduce risk
Tests provide a safety net to your code changes. If you din't have
automated tests, you would end up testing every feature (new and
pre-existing) to make sure you did not break anything that worked before
your changes or that you did not unintentionally make changes that
caused some other part of the system to start working differently. There
would be no easy way of verifying those things, without the safety net
that an automated test suite offers.

Ensure that no testing specific code exists in the production
environment. You want the system to behave exactly the same way in prod
and in every other environment. Otherwise, how can you be sure that the
production code actually works?


##### Tests should be easy to run
##### Tests should be easy to write and maintain
##### Tests should require minimal maintenance as the System evolves around them

A lot of this blog's thinking has been derive from this excellent book by Gerard Meszaros:
[xUnit Test Patterns](https://www.amazon.com/xUnit-Test-Patterns-Refactoring-Code/dp/0131495054).
