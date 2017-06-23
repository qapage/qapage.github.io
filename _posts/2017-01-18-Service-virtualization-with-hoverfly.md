---
layout: post
title: Service virtualization with hoverfly
categories: [csv, data]
tags: [csv]
---
Hoverfly from spect.io is an open source tool that allows one to simulate an API, capture, modify and playback responses from an API etc. It is an invaluable tool that speeds up your testing and helps you simulate those hard to reproduce situations when dealing with a real API. Say you want to simulate an API being down or sending you bad responses, without taking down the real API which may be in use by other teams, what can you do? Or you’re writing up tests before the actual service has been built. All you have is a spec that tells you what the response should be for every request. What do you do then?

Service virtualization is the answer. Read on.

I’m picking the python bindings that come with Hoverfly to delve into more details. There is also a java API that you may find interesting. The install instructions are available at https://hoverpy.readthedocs.io/en/latest/installation.html.

```
from hoverpy import HoverPy
import requests

with HoverPy(capture=True) as hoverpy:
   print (requests.get(“http://httpbin.org/user-agent”).json())

   hoverpy.simulate()
   print (requests.get(“http://httpbin.org/user-agent”).json())
```
And the output?

```
(hovercraft) Deepaks-MacBook-Pro:hoverpy dbhaskaran$ python capt_auth.py
{u'user-agent’: u'python-requests/2.12.4’}
{u'user-agent’: u'python-requests/2.12.4’}
```

The first line of output is from the actual API endpoint and the second like is Hoverpy serving the recorded data. That was easy wasn’t it? Lets extend this some more. Maybe, modify the response that is being sent back? 

Here’s a script that shows you the output with the mocking and then without the mocking, 

```
from hoverpy import HoverPy
import requests

flag=‘not_mocked’

if flag == 'mocked’:
   with HoverPy(modify=True, middleware=“python examples/modify/modify_payload.py”) as hoverpy:
       for i in range(30):
           r = requests.get(“http://time.jsontest.com”)

           if “time” in r.json().keys():
               print(“response successfully modified, current date is ” + r.json()[“time”])
           else:
               print(“something went wrong - deal with it gracefully.”)
else:
   for i in range(30):
       r = requests.get(“http://time.jsontest.com”)

       if “time” in r.json().keys():
           print(“response successfully modified, current date is ” + r.json()[“time”])
       else:
           print(“something went wrong - deal with it gracefully.”)
```

The output with mocking, 

```
(hovercraft) Deepaks-MacBook-Pro:hoverpy dbhaskaran$ python modi_auth.py
response successfully modified, current date is 02:19:56 PM
response successfully modified, current date is 02:19:56 PM
..

..
response successfully modified, current date is 02:19:58 PM
response successfully modified, current date is 02:19:58 PM
response successfully modified, current date is 02:19:58 PM
```

The output without mocking,

```
(hovercraft) Deepaks-MacBook-Pro:hoverpy dbhaskaran$ python modi_auth.py
response successfully modified, current date is 02:21:16 PM
something went wrong - deal with it gracefully.
response successfully modified, current date is 02:21:16 PM
something went wrong - deal with it gracefully.
..

..
something went wrong - deal with it gracefully.
response successfully modified, current date is 02:21:20 PM
something went wrong - deal with it gracefully. 
```

What did we put in the mocking script that resulted in this behavior? Look closely at line 28 and lines 33/34. That’s where we add randomness into the output responses - returning 200/201 and empty responses at random.

```
 7 import sys
 8 import json
 9 import logging
10 import random
11
12 logging.basicConfig(filename='middleware.log', level=logging.DEBUG)
13 logging.debug('Middleware "modify_request" called')
14
15 # Above we've also configured our logging. This is essential, as it's
16 # difficult to figure out what went wrong otherwise.
17
18
19 def main():
20     data = sys.stdin.readlines()
21     payload = data[0]
22     logging.debug(payload)
23     payload_dict = json.loads(payload)
24
25     # The response to our request gets sent to middleware via stdin.
26     # Therefore, we are really only interested in the first line.
27
28     payload_dict['response']['status'] = random.choice([200, 201])
29
30     # Let's randomly switch the status for the responses between 200, and 201.
31     # This helps us build a resilient client, that can deal with curved balls.
32
33     if random.choice([True, False]):
34         payload_dict['response']['body'] = "{}"
35
36     # Let's also randomly return an empty response body. This is tricky
37     # middleware indeed.
38     print(json.dumps(payload_dict))
```
