---
layout: post
title: "The Morris Worm: When the Internet First Broke"
categories: [Security]
tags: [security, incidents, internet-history]
---

On the evening of November 2, 1988, around 6 PM EST, a program was launched onto the Internet from one or more hosts. Within hours, thousands of machines running BSD UNIX were so overloaded with rogue processes that they could not function. Systems ran out of swap space. Process tables filled up. Administrators disconnected entire networks in a panic. The Internet had experienced its first major self-inflicted wound.

The program responsible was a worm written by Robert T. Morris, a graduate student at Cornell. Eugene Spafford's technical analysis of the decompiled code, published just weeks after the incident, remains one of the most thorough postmortems in computing history. What it reveals is not a work of genius, but something more instructive: a mediocre program that succeeded because the systems it attacked were unprepared for even a mediocre adversary.

#### How the Worm Spread

The worm targeted Sun 3 and VAX machines running 4 BSD UNIX. It used three attack vectors to break into new hosts.

The first was a buffer overflow in fingerd. The finger daemon used the C library function `gets` to read network input into a fixed-size buffer without bounds checking. The worm sent a carefully constructed 536-byte string that overflowed the buffer, overwrote the return address on the stack, and caused the program to execute `/bin/sh`. On VAX machines, this gave the worm a remote shell. On Suns, it produced a core dump instead, because the shellcode was VAX-specific.

The second was a debug mode in sendmail. The worm issued the DEBUG command to sendmail and then specified a set of shell commands as the recipient of a message. This debug feature was not supposed to be enabled in production, but it was present in the code for testing mail delivery, and many vendors and administrators left it compiled in. The worm exploited this to pipe commands directly to `/bin/sh`.

The third was password guessing combined with trust relationships. The worm read `/etc/passwd`, attempted to crack passwords using the account name, variations of the user's real name, and a built-in dictionary of 432 words. When it broke a password, it used rsh and rexec to reach other machines where that user had accounts, exploiting the common practice of reusing passwords across hosts.

#### The Infection Sequence

The worm had two components: a main program and a bootstrap called the vector program. Once the worm obtained a shell on a target machine through any of the three attack methods, it followed a precise sequence.

It compiled and ran the vector program on the target. The vector connected back to the infecting machine on a predetermined TCP port, authenticated with a challenge number, and downloaded three files: a Sun 3 binary of the worm, a VAX binary, and the vector source code. The infecting worm then sent shell commands to try each binary. If one ran successfully, the new host was marked as infected.

The newly running worm immediately hid itself. It changed its process name, unlinked its binary from disk, killed its parent process, loaded the worm binaries into memory, encrypted them, and deleted the files. From that point on, it existed only in memory with no obvious filesystem footprint.

#### Why It Got Out of Control

The worm included a mechanism to avoid reinfecting machines. Running copies would listen on TCP port 23357 on localhost. A new worm arriving on an already-infected host would connect to that port, exchange random numbers, and based on the result, one of the two would exit.

This mechanism was fatally flawed in two ways. First, one out of every seven worms would skip the check entirely and become "immortal," ignoring any other worms on the same machine. Spafford concludes this was deliberate, designed to prevent administrators from running a fake listener on the worm port to kill incoming copies. Second, even worms marked for self-destruction would continue running through at least one full password-cracking cycle before exiting. The result was exponential growth: each pass through the main loop forced the worm to infect at least one local host, and multiple copies on a single machine would each do the same.

The worm's author apparently did not understand the propagation dynamics of his own program. The code contained mechanisms to limit growth, which suggests awareness that uncontrolled replication was undesirable. But those mechanisms were insufficient, producing the catastrophic load that made the worm so visible and so disruptive.

#### The Response

By late Wednesday night, personnel at UC Berkeley and MIT had captured copies of the program and begun analyzing it. By 5 AM Thursday, less than 12 hours after the worm appeared, the Berkeley Computer Systems Research Group had published an interim set of defenses: a patch to sendmail and a suggestion to rename the C compiler to prevent the worm from building itself on new hosts.

By 7 PM Thursday, a simpler defense was discovered at Purdue: creating a directory named `sh` in `/usr/tmp` caused the worm's shell test (`if [ -f sh ]`) to fail, blocking further infection without renaming any system utilities. This worked because the worm used the `-f` flag, which tests for a regular file but returns false for directories. The author had used `[` instead of the more portable `test` command, and `-f` instead of `-e`, both signs of limited experience with shell scripting.

On November 8, the National Computer Security Center convened a hastily-organized workshop in Baltimore. The attendees agreed not to distribute their reverse-engineered source code publicly. By that date, Spafford was aware of at least eleven independent decompilations of the worm. The genie was already out of the bottle.

#### What the Code Revealed

Spafford's analysis of the reverse-engineered code is ruthless in its assessment. The worm was not the work of a genius. The code quality was mediocre. Local variables went uninitialized. Functions were called with wrong numbers of arguments. Return codes from system calls were never checked. Data structures were uniformly linked lists with linear searches, where hash tables would have been trivial to implement and far more efficient.

The one section that showed genuine sophistication was the password-cracking routine, which ran nine times faster than the standard Berkeley `crypt` function. Spafford notes that this code does not appear to have been written by the same person who wrote the rest of the worm. It included support for both encryption and decryption, even though the worm only needed encryption.

The worm did not write to the filesystem except during infection. It did not transmit any information from infected systems to any external location. It did not exploit root access even when it cracked root passwords. Spafford finds this last omission difficult to attribute to deliberate restraint, suggesting instead that the author simply did not think of it.

The program could have been far more dangerous. The fingerd exploit worked only on VAX, not Sun, likely because the author never built a Sun version of the shellcode. Three Purdue graduate students replicated the Sun exploit in under three hours when asked. The worm's password-cracking dictionary was only 432 words. It did not gather hostnames from `.rhosts` files early in its execution. It failed to infect local network hosts due to a bug in the routing logic.

#### The Larger Lessons

The worm exposed problems that the UNIX community had long known about but never fixed. The `gets` function had no bounds checking and was documented as dangerous, yet it remained in the standard C library and in production daemons. Sendmail's debug mode was a known risk that administrators tolerated for convenience. Password hashes were stored in world-readable files, allowing offline cracking. Trust relationships between hosts via `.rhosts` and `hosts.equiv` created lateral movement paths that one compromised account could traverse.

Spafford's recommendations read like a modern security checklist written decades early: replace unbounded string functions with bounded alternatives, audit all network-facing code for their use, run each daemon under its own user ID (least privilege), implement shadow password files, enforce password complexity, and establish coordinated vulnerability disclosure mechanisms.

The response to the incident was ad hoc and nearly failed. Patches were distributed via Usenet and mailing lists, but those communication channels depended on the same Internet that was under attack. Sites that disconnected for self-protection could not receive the fixes. Three weeks after the incident, some sites had still not reconnected.

The worm demonstrated that the internet's openness was simultaneously its greatest strength and its greatest vulnerability. The same properties that allowed researchers across the country to collaborate on a fix in under 12 hours also allowed a single program to propagate across thousands of machines in the same timeframe.

#### References

- Eugene H. Spafford, "The Internet Worm Program: An Analysis," Purdue Technical Report CSD-TR-823, 1988
