---
layout: post
title: Building maintainable automated acceptance tests
categories: [automation]
tags: [automation]
---

#### What are acceptance tests?
A test that verifies that a story or requirement meets the needs that it was built to accomplish. They may be functional or non functional. They could cover things that a user needs to be able to do with the system or cover number of users or transactions per second that need to be supported etc.

#### Why automated acceptance tests?
Acceptance tests are the foundation on which Continous Deployment is built. For CD to work, you need fast feedback on the state of your software for you to have confidence in your builds.  You can go from a developer build, to a production ready build by going through different environments, each progressively closer to production, running different sets of tests that give you feedback on how the software behaves on different levels.  If your suite covers all of regression, you save time on repeating these tests manually. The marginal utility that comes from running these tests manually diminishes and by moving these to things that a machine can run, you can free up manual effort to focus on areas of higher utility.

#### Problems with automated tests
Are your automated tests very tightly coupled to the application and does every change to the application, end up breaking your automation? Do you have locators that are brittle or not straightforward? Or do you have tests that are non deterministic? Flaky tests are of no help to anyone. Do you use good software development patterns to develop your test automation? Do you group functionality into Page Objects and minimize the number of places you have to make changes to, when your system under test changes? If you answered no to some of these questions, you already know what how to make your automation suites more maintainable.

#### How to choose your automation tool/framework/drivers?
What is your thought process or checklist for picking automation tools/frameworks/drivers?

Do you choose to write tests in the language that the appliation is written in?
Do you look at the support and maintainenance the tool has?
Do you pick tools that you've worked with in the past (even if there are possibly better tools out there)?
Do you use frameworks (like Cucumber, JBehave etc) that are above drivers like Selenium, Watir etc? Do you like FIT based tools like Fitnesse?
How do you structure your tests? Are your tests Declarative (you're not worried about how an action is done) vs Imperative (you dictate how the action is done)? Test specifications should be declarative (talk about the intent on the test) while the mechanics of how you do the test should be imperative.

#### But how do we fix these issues?
Here are some good practices,

* Its always better to go with tools that have active maintainers. Especially if its open source software, the more involved the maintainers and the community around the software is, the better your experience will be with it.

* Its also better to seperate the specification of a test (the intent of a test) from how you actually do the test ( the mechanics of the test). Build Page Objects or use other patterns that help you remain DRY (Don't Repeat Yourself).Every piece of knowledge must have a single, unambigious, authoritative representation within a system - The Pragmatic Programmers. Also makes sure the re-usable objects are easy to find (and use). If future developers cannot find re-usable objects easily, they will just rewrite them from scratch.

* Start from the lowest level, build units of increasing size and complexity. But at the same time make sure the test code does not go too far away from the actual purpose of the test.

* Organize test code into as many classes as make sense, with many small methods and heavy fixtures.

* Create helpers for only those tasks that are not semantically meaningful for a test. Helpers are great but make sure they are not things that are at the core of the business verification of the test. For example, database setup might be a helper method but the actual creation of test users, test roles etc should not be a helper method. They are far too close to the purpose of the test.

* Dependencies across tests should be kept to a minimum. Tests should be able to run in any order without always having to run after a certain test or before a certain test. Each test should setup data needed for it to run and clean up after its done. Minimizing cross test dependencies will enable you to run tests in parallel.

* Write tests at the right level. 80% unit tests, 15% end to end, integration, acceptance tests and maybe 5% GUI based tests.

* Refactor often, refactor small parts at a time, refactor without changing external behavior extensively and finally, always conclude refactoring with passing tests.

* Keep the locators simple. If you have to use complex xpath locators to identify objects, its time to submit change requests adding id tags to your application's objects. List all your locators in a single file, code or config file, so that it is easy to maintain.

* Evaluate existing tests constantly. Rather than just fixing broken tests, evaluate if they still make sense as tests. Avoid throwaway automation.

* Don't lose sight of the goals of testing. Automation is only as good as the testing concepts underpinning the technology implementations of automated tests.
