---
layout: page
title: "Engineering Confidence"
permalink: /book/
---

## Lessons from qmail, the 1990s Mail Server with a Security Guarantee and a Cult Following

**A book about how software earns trust when the stakes are real.**

[Buy on Leanpub](https://leanpub.com/engineeringconfidence)

qmail was more than a mail server. It was an argument: that security should come
from architecture, not hope; that trusted code should be small; that dangerous
parsing should be avoided; and that public claims should be precise enough to
inspect.

*Engineering Confidence* uses qmail as a case study in how software earns
confidence through architecture, boundaries, implementation, documentation,
defaults, maintenance, and adversarial review.

This is not a qmail installation manual. It is a book for engineers and
engineering leaders who care about reliability, security, operational trust, and
the long-term cost of design decisions.

---

#### Why qmail?

In the 1990s, Internet mail was becoming public, commercial, and hostile.
Sendmail was everywhere, and administrators lived with a recurring rhythm of
advisories, patches, rebuilds, and operational uncertainty.

D. J. Bernstein's qmail arrived with a different claim. It did not promise to
patch faster. It promised that architecture could make some classes of bugs less
powerful before they were even found.

That is what makes qmail worth studying today.

Modern systems still struggle with the same questions:

- Which code is trusted?
- Which component parses hostile input?
- Which process has authority?
- What happens when a parser is wrong?
- What exactly does a security claim cover?
- How do defaults, documentation, and maintenance affect trust?
- When does simplicity help, and when does it create new costs?

qmail is old software. The engineering questions are not old.

---

#### What the book covers

*Engineering Confidence* follows qmail from historical pressure to architectural
response to long-term consequences.

- The 1990s mail-server environment that made qmail plausible
- Sendmail's historical role and why its complexity was understandable
- Bernstein's public technical style and security posture
- qmail's architecture: small programs, clear boundaries, and limited trust
- The "don't parse" philosophy
- Maildir, queue reliability, and filesystem-based design
- The famous qmail security guarantee
- The Guninski and Qualys security disputes
- The frozen upstream, patch culture, and maintenance tradeoffs
- What qmail got right
- What did not age as well
- What modern teams can still learn from it

---

#### Who this is for

- Site reliability engineers
- Security engineers
- Infrastructure engineers
- Engineering managers
- Platform teams
- Unix and Internet-history readers
- Anyone interested in how technical confidence is built, challenged, and maintained

You do not need to be a qmail user to read it. The book explains the relevant
mail, Unix, and security context as it goes.

---

#### Why I wrote it

I wrote this book because qmail is worth remembering. Imagine the confidence needed to thrown open your source code to the whole world, and dare it to find a security hole. On top of it, the developer of qmail, D.J. Bernstein offered $500 to anyone who found a security hole in the latest version of qmail. That confidence is rarely seen in software today. That confidence was based on principles, it was based on structure. This structure is worth learning, worth considering when we make decisions about software today. 

Modern engineering teams make claims all the time: this system is secure, reliable, simple, maintainable, zero trust, cloud native, production ready. qmail is a reminder that confidence has to be earned in the design.

---

#### Get updates

*Engineering Confidence* is nearing completion. You can follow the book's
progress and get notified at launch:

[Follow on Leanpub](https://leanpub.com/engineeringconfidence)

---

#### About the author

Deepak Bhaskaran is a senior engineering leader focused on reliability, security,
and infrastructure. He is currently a Sr Director of Engineering at Cisco, where
he is responsible for the reliability of Cisco Security products including Cisco
Duo, Cisco Secure Access, and Umbrella.

He writes at [OnSiteReliability.com](https://www.onsitereliability.com).
