---
id: 30933d6e-020c-440b-854c-1cf59843b4d1
title: "Distributed Intelligence"
date: 2024-03-31T16:35:28.990Z
template: post.hbs
excerpt: >-
  In a previous post I proposed some ideas for how
  to approach our relationship with data. In this
  post I continue that train of thought with a
  framework for designing networked applications
  from the viewpoint of decentralized and distributed
  sense-making.
---

## Requirements for Automated Data Accounting

What if we thought about our little devices as tools for
helping communities make sense of the world and respond
quickly and effectively? In the current world, most people
get their data from centralized platforms that control which
data is recorded, how that data is verified, and the way that
data is presented. This has led to an unfortunate state of
affairs where the people who control the platform can optimize
these three components for opaque, private interests. By 
separating these components, people can retake control of their
data and build tools that are focused on personal and community
values.

### Identity

In order for data to be verified, we need some notion of identity.
Identities tell use _who_ is doing the verification. In a
decentralized system, we can't rely on passwords to protect
access to verification mechanisms. Intead, we can use cryptography.

Cryptographic signature algorithms have existed for decades and
allow a person to prove that they know some secret information
without revealing that information. These can be used to digitally
sign data to approve of it, or produce new data refuting the
original data and sign that to indicate disapproval.

### Metadata

Data on its own is difficult to use. If a bunch of 0s and 1s show
up on your network interface card, what do you do with them? We
need more information. In this sense, metadata--or data that describes
other data--is more than just nicety: it is actually a requirement!

Metadata tells us what to _do_ with some other data. The most
important metadata tells us how to decode other data and how that
data should be presented. Other important metadata might tell us
who authored the original data or give us links to related data.

However metadata itself is still data. Just 0s and 1s. So we haven't
solved the problem of how to use data, but rather just moved it up a
level. The underlying problem is that we need some form of protocol,
or a pre-arranged agreement as to what data means. There are many
existing solutions to this, including JSON, protocol buffers, IPLD,
and plenty more. In fact, `libp2p`'s `multicodec` specification is
an extensible protocol that prefixes encoded data with some
additional information that describes its encoding. So we can have
self-describing data, provided we agree on a protocol like `multicodec`
first!

### Storage

Storage is a long-standing challenge for almost all computer systems.
Knowing which data needs to be stored for how long and the most
resource-effective way to meet that need is highly depedendent on
the application. Since our goal is decentralized sense-making, we
can think of different tiers of data needs.

First, we have ephemeral data. This is data that we need to present
some content, but really doesn't need to be stored for any longer
than it is used. Generally, this is data that can be _restored_ via
some computational process over the next category of data: persistent
data.

Persistent data is data that we need to store to support sense-making
over time. Data only matters in the context of a task, and most tasks
are only pertinent for a constrained time period--whether that's 5
minutes for a quick back-and-forth message, or 500 years for
multi-generational scientific study!

Other concerns for decentralized storage are availabilty and
consistency in the sense of the classic CAP theoreom.

## Building Computers with these Primitives

### Trust Networks

Associating a cryptographic identity to a real identity requires some
bootstrapping of trust that takes place outside of the system. Meeting
someone in real life and exchanging cryptographic public keys is
probably the best way to do this. But ultimately we need more than that
if we want to build networks that extend beyond geographically
co-located communities. This is where networks of trust come into play.

Suppose I receive some information that claims to be authored by my
state representative. I want to verify this so I reach out to my
local network of trusted peers. Let's say three of them respond with
messages saying they have verified the representative's cryptographic
keys in-person, and ten respond saying they know someone who has
verified those keys in person. I now have _some_ justification for
the belief that the information was in fact authored by my representative.

On the other hand, maybe I get back ten responses saying they know someone
who was in-person verified, however all them report the _same_ person as
the authority who verified the information. Now I might be a little
suspticious, as there is a bottleneck in my chain of trust. I should be
more wary of that information and, if asked about its veracity, should
probably _not_ report that I have strong justification for believing it.

Generalizing, for each piece of content we see in our feeds, our
computer should be able generate an argument automatically as to why that
data should or should not be considered verified. This means presenting a
formal logical argument. While in practice users should choose a logical
system that makes sense to them, one good candidate is epistemic logic,
which deals with arguments of knowledge.

### Authoring Metadata

As content appears in our feeds, we usually choose to interact with it
in some way. Whether that's "liking" or recording a full-on multimedia
response, the process of generating and linking data is how we begin
to build context around our data.

As we generate and link data, we want to verify our creations. We can
do this by automatically creating _relationship_ data. For example a
"like" could be recorded and shared as follows:

```
{
    "payload": {
        "action": "like",
        "target": <link to data>
    },
    "verifier": {
        "id": <identity>,
        "sig": <crytographic signature of payload>
    }
}
```

Now if someone asks for our recently "liked" content, we can share
the above information with them. They can then verify the data with
our public key and know that we indeed "liked" the target content.
In fact, anyone can store the above information because it contains
the verification info. This would allow us to offload requests from
a personal device to some service.

### Caching, Caching, Caching

Because data only has a limited time of meaningful use, we want to
forget data that is no longer useful. For example, we might want to
download a breaking news story and save it for a few months so we
can access it at a later time. But if we haven't used it in a while,
we might just want to save the headline and link to somewhere else
where the data is stored. After that, we might want to delete the
data entirely.

This is a process known as caching and eviction. Our computer's
memory is the fastest place fo retrieve data, but it's also the most
expensive, requiring continuous power supply. Then we have local
disks, which can persist through power outages and system reboots, but are
still difficult to configure for replication in case of hardware
failure. There are cloud service providers and even the filecoin
network for long term storage, but these come with longer access
times.

We would like a tiered cache system where data can be held in the
form where it is most useful and moved to less expensive but less
available storage as it becomes less peritent to the current task.
To specify such a system, the system's user should be able to
define the tasks they are interested in and how important it is
for them to be able to participate in networks promoting the
completion of that task.

For highly important tasks like emergency notification networks
(think fire, extreme weather, medical events), data should be kept
both in memory for fast access and in local persistent storage for
power failure resilience. Data should only be moved to long-term
storage in the unlikely event that local storage is unavailable.

For less important tasks like watching goofy cat videos, data should
be evicted from memory quite quickly to make room for more important
things and only persisted in local and long-term storage if the
user specifically decides to save it.

## Concusions

Our computers can help us keep track of our data and build better systems
to support decentralized and distributed sense-making. Using a computer
science perspective, we can start to design and reason about such systems
and start to imagine what these systems woulkd look like. In my next post,
I'll talk about the kind of data structures and protocols that might be
used in a real implementation. See you then!
