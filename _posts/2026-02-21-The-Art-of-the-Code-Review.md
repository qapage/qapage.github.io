---
layout: post
title: The Art of the Code Review
categories: [software]
tags: [sre]
---

Code reviews are one of the most valuable practices in software engineering. Done well, they catch bugs, spread knowledge, and raise the quality bar across your team. Done poorly, they become adversarial gatekeeping rituals that slow everyone down and erode trust. The difference comes down to how you approach them.

I have had the privilege of working with some exceptional code reviewers over the years. The best ones share a common trait: they treat reviews as a conversation, not an inspection. Here is what I have learned from watching them work.

#### Ask Questions Instead of Making Demands

When something looks off in a pull request, resist the urge to say "Change this to X." Instead, ask "Why was this approach chosen?" or "What if we did X instead?" This is a small shift in language, but it changes the entire dynamic. You are assuming the author knows something you don't, and you are inviting them to share that context. Sometimes they have a great reason. Sometimes the question itself helps them realize there is a better way. Either way, the outcome is better than a demand.

A question like "Will returning zero for an unknown location be helpful to all callers?" does more work than "Don't return zero here." It prompts the author to think about the broader impact and come to the right answer themselves.

#### Distinguish Must-Fix From Nice-to-Have

Not every comment on a PR needs to block the merge. One of the most respectful things you can do as a reviewer is to clearly distinguish between issues that must be addressed and suggestions that are optional. A simple prefix like "Non-blocking:" before optional suggestions, style preferences, or minor improvements goes a long way. It shows respect for the author's time while still sharing useful insights. The author can choose to address these in a follow-up or not at all, and the PR keeps moving.

#### Explain the Why

Don't just flag problems. Explain the reasoning, the potential consequences, and the alternatives. If you are pointing out that `time.sleep()` should not be used on the main reactor thread, don't stop at "Don't use time.sleep() here." Explain that it blocks the reactor, which adds latency for other requests and can wreak havoc on background coroutines like Redis keepalives. When you explain the full consequence chain, you are not just fixing one line of code. You are teaching the author something they will carry into every future PR.

Link to documentation when it helps. The goal is to leave the author better equipped than before.

#### Be Appreciative

Call out good code explicitly. When you see something well done, say so. "Nice!", "Great idea!", "These tests are impressive" - these small affirmations matter more than you think. Code reviews that are nothing but criticism, even constructive criticism, are draining. Recognizing good work creates a culture where people want to write better code, not just code that passes review.

#### Use a Friendly Tone

Your reviews should feel like helpful advice from a friend, not criticism from a gatekeeper. This does not mean being vague or avoiding hard feedback. It means delivering that feedback in a way that keeps the relationship healthy. An occasional `:)` or a lighthearted comment goes a long way toward keeping things human.

#### Technical Areas Worth Your Attention

Beyond tone and philosophy, good reviewers develop an eye for specific technical risks. Here are some areas that consistently deserve close attention:

**Async patterns.** In codebases that use async frameworks like Twisted or asyncio, watch for missing decorators that bridge async and sync code, blocking calls on the main thread, and unmanaged background tasks that can silently fail.

**Logging.** Good logging is what makes code debuggable in production. Look for error logs that are missing stack traces, string formatting where structured keyword arguments would make logs searchable, and API calls that silently swallow log arguments.

**Database safety.** SQL injection via string interpolation is still one of the most common vulnerabilities. Always suggest parameterized queries. On schema migrations, check for proper locking strategies to avoid locking production tables. Question unbounded caches that can cause memory leaks - `lru_cache(maxsize=N)` is almost always safer than an unbounded `cache`.

**Security.** Flag `shell=True` in subprocess calls. Watch for potential SSRF in URL handling. Validate any interpolated values in URLs and SQL. These patterns are easy to miss in review and easy to exploit in production.

**Testing.** When code is removed, ask whether the tests covering that code were intentionally removed or accidentally lost. Edge case tests should survive refactors. And if a PR mixes formatting changes with functional changes, suggest splitting it into separate PRs. Mixed PRs are harder to review and harder to revert.

**Thread safety.** Shared mutable state accessed from multiple threads without locks is a recipe for intermittent bugs that are painful to reproduce. Compression and decompression libraries may not be thread-safe due to shared internal buffers. These are the kinds of issues that only show up under load.

**Code style.** Small things add up. Prefer `time.monotonic()` over `time.time()` for duration measurements since it is not affected by system clock changes. Suggest trailing commas in multi-line structures for cleaner diffs. Recommend `removesuffix()` and `removeprefix()` over manual slicing. In tests, prefer `assertEqual(a, b)` over `assertTrue(a == b)` because the former gives you a useful diff on failure.

#### Think About Production

The best reviewers think beyond correctness. They think about what happens when this code is deployed, rolled back, or running alongside the previous version during a rolling deploy. Will this change break things if rolled back? During rolling deploys, old and new code run simultaneously, so two requests could hit different versions. Are cache keys compatible between versions? Will changes to metric names or log formats break monitoring dashboards?

These are the questions that separate good code from production-ready code.

#### Conclusion

Great code reviews make the whole team better. They are not about catching mistakes. They are about sharing knowledge, raising standards, and building trust. Ask questions. Explain your reasoning. Be kind. And always remember that there is a person on the other side of that PR who is trying their best.
