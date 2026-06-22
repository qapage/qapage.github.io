---
layout: post
title: "Engineering Confidence: A Book About qmail and Earning Trust Through Architecture"
categories: [Announcements]
tags: [security, architecture, books]
---


I wrote a book called *Engineering Confidence*. It is about qmail, the 1990s mail server that shipped with a public security guarantee and a cult following among Unix administrators.  I wrote this book because qmail is worth remembering. Imagine the confidence needed to thrown open your source code to the whole world, and dare it to find a security hole. On top of it, the developer of qmail, D.J. Bernstein offered $500 to anyone who found a security hole in the latest version of qmail. That confidence is rarely seen in software today. That confidence was based on principles, it was based on structure. This structure is worth learning, worth considering when we make decisions about software today.

The book is not an installation manual. It uses qmail as a case study in how software earns trust: through architecture, boundaries, constrained privilege, careful parsing, explicit claims, and long-term maintenance decisions. Modern engineering teams make claims all the time: this system is secure, reliable, simple, maintainable, zero trust, cloud native, production ready. qmail is a reminder that confidence has to be earned in the design.

#### What it covers

The book follows qmail from the hostile mail environment of the 1990s, through Bernstein's architectural response, to the long-term consequences of a frozen upstream. It examines the security guarantee, the disputes around it, the patch culture that grew in the absence of releases, and what modern engineering teams can still learn from the design.

#### Who it is for

Site reliability engineers, security engineers, infrastructure engineers, engineering managers, and anyone interested in how technical confidence is built, challenged, and maintained. No prior qmail experience required.

#### Status

The book is nearing completion. Formats planned: EPUB, PDF, Kindle, and paperback.

[Read more about the book](/book/) or [Buy on Leanpub](https://leanpub.com/engineeringconfidence).
