---
layout: post
title: What Executives Should Know About Ransomware Attacks
categories: [security, ransomware]
tags: [security]
---

Originally to written and published via the Forbes Technology Council, this article is a primer for executives on what they should know about ransomware attacks. Reprinted here.

[LINK](https://www.forbes.com/councils/forbestechcouncil/2024/11/06/what-executives-should-know-about-ransomware-attacks/)


It’s 4 a.m., and the phone rings. You take a minute to orient yourself. As the CEO of a publicly traded company, you wonder who’s calling you at this hour as you jump out of bed and pick up the phone. Your CISO is on the other end telling you that the company’s been hit by a serious cyberattack, that a car is waiting to take you to the office, and that your chief of staff is waiting to brief you.

You take a couple of minutes to brush your teeth and get dressed, and you get into the elevator. As you step out, the cool air hits your face, and you see your chief of staff waiting by your car. You get into the car, and the chief of staff tells you the company’s been hit by a ransomware attack. The attackers are demanding $50 million in bitcoin or else they’ll release all of the company’s customer data and source code on the internet. You feel like you’ve been punched in the gut. You wonder if you could have done anything to prevent this.

This was a made-up story, but many versions of this story have happened in the past. Norsk Hydro, an aluminum and renewable energy company based in Norway, had a significant encounter with ransomware in 2019. It had been hit by a form of ransomware known as GoGalocker that encrypted all of Norsk’s data with RSA-4096 and AES-256-bit encryption, making the data inaccessible—and only the attackers had the key to decrypt it.

To get data back from a ransomware attack, you need to either pay the attacker or rebuild everything from backups and other sources—all while trying to kick the attacker out, stopping them from doing any more damage or regaining access to your systems. Norsk refused to pay, reached out to law enforcement and cybersecurity experts, and rebuilt all of its data and systems from the ground up. The incident cost Hydro an estimated $70 million.

Back to the fictional situation: What could you have done to prevent this? The good news is there are things you can do to add so much friction to someone trying to hack you that they give up and go looking for easier targets.

First, create a list of roles per department, assign users to those roles and enforce access based on those roles. Your financial analyst doesn’t need to have access to your code repositories. Your developer doesn’t need to have access to the HR systems or the infrastructure running those HR systems.

Once you have a good baseline, review these roles and accesses periodically. If someone has moved into a new role, ensure their access has changed accordingly. If someone has left the organization, ensure their access has been deactivated. For everyone with access to privileged systems, ask them every quarter if they still need access to those machines. If someone has not been accessing those systems for an extended period of time, consider deactivating that access unless the user can justify why they still need it.

Next, have a list of approved applications that can be run by your users and ensure they’re appropriate for their roles. Your inside sales rep probably doesn’t need to install Metasploit, so don’t allow it. Make such tools available only to those folks whose roles really depend on their use.

At this point, you should slowly be moving toward a zero-trust model, where trust is not automatically assumed based on the user’s role or location.

You should be able to recognize every user’s work devices and do additional security verifications or restrict access when a personal device is being used. This is made possible by a combination of using single sign-on for providing role-based access, using device management software for determining the health of user devices and applying access policies based on the device being used.

In a true zero-trust model, every request is verified. Trust is not assumed just because a request is coming from inside the office network or over the VPN. We need enough verification to make sure things are secure but not so much that I, as a user, get frustrated and try to bypass security. Good security frustrates hackers, not users, so don’t go overboard with these measures.

Lastly, run fire drills and incident response drills. The best way to prepare for an actual cyberattack is to have documentation that is well-understood and to make sure everyone knows what they need to do in such a situation. The last thing you want is for everyone to panic and freeze or go scorched earth, doing more damage than help.

Everyone should be thinking about security, and this mindset starts at the top. Good security makes your organization a trusted steward of your customers’ data and helps make those scary 4 a.m. calls unlikely. Prioritize security like you prioritize profitability, growth and other business metrics, and your future self will be thankful.
