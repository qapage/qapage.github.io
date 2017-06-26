---
layout: post
title: Building maintainable automated acceptance tests
categories: [automation]
tags: [automation]
---

#### What are acceptance tests?
Acceptance tests verify that a story or requirement meets the needs that it was built to accomplish. They may be functional or non functional. For example, they could cover things that a user needs to be able to do with the system or cover number of users or transactions per second that need to be supported etc.

#### Why automated acceptance tests?
If you need quick feedback on the state of your software, you need automated Acceptance tests. Acceptance tests are the foundation on which Continous Deployment is built. You can setup build pipelines that allow a build to progress from environment to environment based on passing tests at different levels. For example, passing unit tests and integration tests could allow the build to get deployed to QA environments. Then once they pass functional tests, they could get deployed to a staging or UAT environment. There once, acceptance tests pass, the build becomes a candidate for deployment to production.  If your suite covers all of regression, you save time on repeating these tests manually. The marginal utility that comes from running these tests again and again manually diminishes with every run. By automating these tests, you free up manual efforts to be spent on newer tests or areas that have higher utility, while the machines continue to run automated tests as frequently as we make changes.

#### Problems with automated tests
Are your automated tests very tightly coupled to the application and does every change to the application, end up breaking your automation? Do you have locators that are brittle or not straightforward? Or do you have tests that are non deterministic? Flaky tests are of no help to anyone. Do you use good software development patterns to develop your test automation? Do you group functionality into Page Objects and minimize the number of places you have to make changes to, when your system under test changes? Are your tests suites trusted? Meaning, when a build fails a test suite, does everyone stop and try to fix the issue or do they say, 'yeah, its probably ok - that suite always fails'. Do you ever catch up with application functionality changes, or you still have tests failing because a part of the application functionality changed but you've not had time to update your tests yet?

If you answered no to some of these questions, you already know what how to make your automation suites more maintainable.

#### How do you choose your automation tool/framework/drivers?
What is your thought process or checklist for picking automation tools/frameworks/drivers?

Do you choose to write tests in the language that the appliation is written in?
Do you look at the support and maintainenance the tool has?
Do you pick tools that you've worked with in the past (even if there are possibly better tools out there)?
Do you use frameworks (like Cucumber, JBehave etc) that are above drivers like Selenium, Watir etc? Do you like FIT based tools like Fitnesse?
How do you structure your tests? Are your tests Declarative (you're not worried about how an action is done) vs Imperative (you dictate how the action is done)? Test specifications should be declarative (talk about the intent on the test) while the mechanics of how you do the test should be imperative.

#### But how do we fix these issues?
Here are some good practices,

* Its always better to go with tools that have active maintainers. Especially if its open source software, the more involved the maintainers and the community around the software is, the better your experience will be with it.

* Its better to write test code in the same language that the application code is written in. This way, when you want developers to pitch in and write test code on a regular basis, you are offering them a path of least resistance. If they need to learn a new language and 5 other tools to be able to write test code, you will notice that not much test code gets written.

* Its better to seperate the specification of a test (the intent of a test) from how you actually do the test (the mechanics of the test). Pages may change, HTML elements may change but the purpose of your test probably will remain the same. Build Page Objects or use other patterns that help you remain DRY (Don't Repeat Yourself). The Pragramatic Programmers book says this - `Every piece of knowledge must have a single, unambigious, authoritative representation within a system.`

* Also make sure the re-usable objects are easy to find (and use). If future developers cannot find re-usable objects easily, they will just rewrite them from scratch.

* Start from the lowest level, build units of increasing size and complexity. But at the same time make sure the test code does not go too far away from the actual purpose of the test.

* Organize test code into as many classes as make sense, with many small methods and heavy fixtures.

* Create helpers for only those tasks that are not at the heart of a test. Helpers are great but make sure they are not doing things that are at the core of the business verification of the test. For example, database setup might be a helper method but the actual creation of test users, test roles etc should not be a helper method. They are far too close to the purpose of the test to belong in a helper function.

* Dependencies across tests should be kept to a minimum. Tests should be able to run in any order without always having to run after a certain test or before a certain test. Each test should setup data needed for it to run and clean up after its done. Minimizing cross test dependencies will enable you to run tests in parallel.

* Write tests at the right level. The [Testing pyramid](https://martinfowler.com/bliki/TestPyramid.html) puts unit tests at the base of the pyramid (heavy coverage using unit tests), end to end, integration, acceptance tests in the middle (moderate coverage using these test types) and GUI based tests on the top of the pyramid(light coverage using these tests).

* Refactor often, refactor small parts at a time, refactor without changing external behavior extensively and keep tests green at all time when refactoring is in progress.

* Keep the locators simple. If you have to use complex xpath locators to identify objects, its time to submit change requests adding id tags to your application's objects. List all your locators in a single file, code or config file, so that it is easy to maintain.

* Evaluate existing tests constantly. Rather than just fixing broken tests, evaluate if they still make sense as tests. Avoid throwaway automation.

* Don't lose sight of the goals of testing. Automation is only as good as the testing concepts underpinning the technology implementations of automated tests.
