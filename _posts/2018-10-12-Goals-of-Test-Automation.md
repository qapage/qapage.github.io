---
layout: post
title: The Goals of Test Automation
categories: [testing]
tags: [testing]
---

#### The Goals of Test Automation

TLDR; The goals of test automation: improve the quality of software, serve as
documentation for how features work, reduce risk (and not introduce more risk),
be easy to run, write and maintain.

Test automation takes the manual effort out of testing. It makes it easy to
run your test cycles as frequently as you want them to run, without worrying
about how long it could take to get results, or how many test engineers you
have on your team. Why do repetitive stuff manually when you can code them
up and have them run automatically, quickly and more accurately than a
human ever could?

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
Tests should be fully automated, repeatable, independent and self
checking.

They should be fully automated because otherwise, they will
still need manual effort to setup or reset etc before each run and thus
will add to development time, instead of making things faster. Anything
that increases dev time is going to be cut out, sooner or later.

Self checking tests are similar. If you have a test run but not tell you
if it failed or not, you still need to get into the results and manually
verify. That's no fun.

They must be repeatable so that they can be run as many times as needed-
on every commit, on every pull request etc etc. Being fully automated
and self checking are sort of pre-conditions to this goal.

Tests must be independent so that they can be run in any order, or run
in isolation with requiring the whole test suite to run etc etc. If you
change one line of code in one module, you need to be able to run tests
that are specific to that module only. There's definitely value in
running all the tests for every code change but you don't want to be
forced to do that, if you don't want to.

##### Tests should be easy to write and maintain
Let me blow your mind here by saying this: Tests are code! They need to
be readable and maintainable like we want all other code to be. Tests
become complicated when 1. we try to do too much in one test 2. not
keeping test code [DRY](https://pragprog.com/the-pragmatic-programmer/extracts/tips).

To keep tests simple, the best approach is to keep tests small and test
one thing at a time. Each test should drive the system under test
through a single code path. The exception to this would be Acceptance
tests or Integration tests where we by definition need to work through
multiple steps and multiple actions.

Keeping tests DRY involves creating as many building blocks as possible,
building out a supporting library that's as resuable as possible to
ensure that folks writing the tests can focus on the tests and not have
to re-implement all the test functionality needed to create that one
test.

##### Tests should require minimal maintenance as the System evolves around them
We don't want our tests to slow us down in times of change. How do we
ensure that? We can do this by writing tests in such a way that the
number of tests affected by any one change is quite small. We also need
to ensure that the System under test and the environment are as loosely
connected as possible. If we've made good use of DRY concepts, ideally
all our setup, teardown etc would be localized to a few test utility
functions for every change and thus become easier to identify + modify.

A lot of this blog's thinking has been derive from this excellent book by Gerard Meszaros:
[xUnit Test Patterns](https://www.amazon.com/xUnit-Test-Patterns-Refactoring-Code/dp/0131495054).
