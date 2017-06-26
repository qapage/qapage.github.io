---
bg: "tag.jpg"
layout: page
permalink: /posts/
title: "Blog"
crawlertitle: "All articles"
summary: "All articles"
active: blog
---

{% for post in site.posts %}
  * {{ post.date | date_to_string }} &raquo; [ {{ post.title }} ]({{
    post.url }})
{% endfor %}
