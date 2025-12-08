---
layout: post
title: The Basics of LangChain
categories: [AI, LLM, LangChain]
tags: [AI]
---

##### Introduction

LangChain can be considered as a bridge between your application and the LLM it takes to, and everything else in that layer like vector databases and other datastores, APIs, embeddings etc. They make it easy to loosely couple your application with the underlying LLM tech, that is changing so rapidly these days.

The building blocks of LangChain are,
1. Model IO <br>
The core module of LangChain, handles the input (the prompt) and the output (the response from the LLM). The prompt has to be well structured to make sure its usable by the LLM. The LLM's response may need additional formatting to be readable, or machine consumable etc. Model IO focusses on prompt engineering and formatting the response coming back from the LLM.

2. Chains <br>
Chains are modular components that can be connected together, like a pipeline to execute complex tasks. Chains can be sequential or parallel, depending on the need, like whether they are fetching data from different sources in parallel or they are processing the data in stages etc.

3. Memory <br>
This module provides short term and long term memory to the LLM. How does the LLM remember and use previous conversations, and what it learnt in previous conversations.

4. Tools <br>
A tool is essential for integrating with various services, apis etc. They bring additional capabilities to LLMs. They are inbuilt for common services like google search for example, and can be used to complement the LLMs capability. You can also build a custom tool, where one does not exist. This tool will be a part of the chain you built for your application.

5. Retreival <br>
This is where additional capabilities can be added to LLMs. This is how context is brought into LLMs, to ensure they are aware of things that have happened after the training of the LLMs was done. You get the data, load and transform it, store into a vector database and retreive from it when you need to respond. This is the module that makes your application intelligent and really relevant to your user.

6. Agents <br>
Agents are autonomous systems that are able to take certain actions in reaction to the input they get. They can call external API's, query databases or fetch data from other data sources as needed based on the situation. They use LLMs for decision making and respond intelligently to changing input.
