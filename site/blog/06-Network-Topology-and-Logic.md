---
id: 1661a766-3872-4209-9d72-74660834bf2d
title: "Networks and Logic"
date: 2024-03-12T13:00:00.000Z
template: post.hbs
excerpt: >-
  Computer network design is challenging because
  there are many different layers to consider.
  From a theoretical standpoint, however, there
  isn't much difference between designing a physical
  network and full application stack. In this post
  I give an overview of the OSI network model and
  talk about how logical formula emerge from this
  model in the form of relational semantics.
---

# {{{ title }}}

_{{{ excerpt }}}_

_Posted on {{{humanDate date }}}_

## The OSI Model

The Open Systems Interconnect model is the foundation of the modern
web. It consists of layers, each one providing guarantees that
further layers rely on.

### Layers 1 and 2: Passing Messages, Locally

Layer 1 is the physical layer. It is responible for providing
_unreliable_ transport of bits between two systems over a
physical medium, such as a wire in the case of coax, ethernet, 
and bronze wires, or the electromagnetic spectrum in the case of
wifi, radio, and satellite connections.

Layer 2 protocols are built on top of the guarantees of layer 1,
which are pretty weak. Namely, because the physical layer does
not provide reliable transport, it is possible that bits will
be lost or flipped during transmission. So layer 2 protocols
usually implement some form of error correction, either by
retransmitting data that was initally transmitted incorrectly,
or by using information-theoretic techniques.

Layer 2 protocols are _broadcast_ protocols in the sense that
any system connected on the phyiscal link receives the data.
The most common layer 2 protocol is ethernet, and ethernet
makes use of MAC addresses to inform the receiver if the data
was meant for them. However this is more of a recommendation
than any hard rule. Most network interface cards can be set
to "promiscuous mode" where _all_ data is passed to the
operating system. This is how network monitoring tools like
Wireshark work.

Some protocols like ARP don't go any further than layer 2. The
protocol stack ends at layer 2 because the task doesn't need
any more sophistication than sending and receiving a single
chunk of data! However layer 3 protocols like the Internet
Protocol rely on other guarantees. This is where _encapsulation_
comes into play.

### Layer 3 and IP: Getting Data Where it Needs to Go

Layer 3 protocols are built on layer 2 protocols. What this means
in practice is that the layer 2 protocol supports some form of
_payload_, or data that is not fully specified by the supporting
protocol. The most common layer 2 protocol that suports a
payload is the ethernet protocol. Ethernet provides _unreliable_
transport of ethernet _frames_. From the viewpoint of a layer 3
protocol, ethernet is a way to send chunks of data rather than
the single bits provided by the physical layer. It still requires
a physical link between systems and ethernet will still drop frames
if a layer 1 transmission error occurs. According to the
specification, if an invalid ethernet frame is recieved, the
receiver simply ignores it.

Layer 3 protocols are encapsulated in the payload of a layer 2
protocol. Protocols like IP are meant to be _relayed_ so that
data can be sent between systems with no direct physical link.
There still needs to be a _route_ or sequence of physical links.
No magical data teleportation here! To achieve this effect, IP
specifies that packets should include certain _header_ information
like the source and destination addresses of the packet. These
addresses are defined in the IPv4 and IPv6 specifications.

Most commercial computers are not configured to relay packets. If
they receive an ethernet frame with their own MAC address but its
encapsulated IP packet has a destination other their own IP address,
they just drop the packet. However most consumer operating systems
provide the root user with the ability to enable IP forwarding,
turning them into an internet _router_. When a router receives
an ethernet frame with its own MAC address but a different
IP address, it checks its own _routing table_ for where it should
send the packet next. If there's a match, it transmits an ethernet
frame along the appropriate physical link with the destination
MAC address of the next reciever. That new ethernet frame
encapsulates the same IP packet, but with some minor changes like
decrementing the Time-To-Live header by 1. If a router receives
an IP packet for which it has no next route, the IP
specification designates that the the router should reply
to the sender with an ICMP (another layer 3 protocol) packet
designating "no route to host".

So IP is powerful in that provides routing of packets between
systems that don't share a direct physical link. It is still
unreliable, although compliant routers _should_ notify the
sender when a packet has been dropped. One of the limitations
of IP is that does not directly support multiple _channels_ on
which two systems can communicate. Most systems need more than
just a single bidirectional stream of data.

### Layers 4-7: Supporting Applications and Service

The payload of a layer 3 protocol like IP, is--you guessed it--a
layer 4 or _transport_ protocol. The most common layer 4 protocols
are TCP and UDP. TCP provides _reliable_ transport of
arbitrary-length data, while UDP provides _unreliable_ transport
of single packets. Both introduce the notion of _ports_, which
allow systems to offer multiple services at the same IP address.
For example, a web service may advertise a TCP service on port
`443`, but only use that connection to negotiate a  random port in 
the range `40_000` to `50_000` on which the actual service
handler will run.

Some versions of the OSI model refer to layer 5 and layer 6, the
so-called _session_ and _presentation_ layers, which are
respectivly concerned with maintaining long-lived connections
and translating between different data representations. In
practice things get a little vague here, as layer 7 protocols
often take responsiblity for these directly. For example
HTTP, a layer 7 protocol, includes headers like `Keep-Alive`
and `Encoding` to specify these behaviors.

And with that, we've reached the end of OSI protocol stack!
Layer 7 is the application layer on which most moden web
applications are built. In fact, many sites on the web are
still using HTTP/1.1, the specification for which was released 
in 1999 and intended to service a single request with a single
response. Some services are not with HTTP/2 which is more
appropriate for multiple-request multiple-response applications
(almost every web page you visit pulls multiple resources to
build the page--check out the network panel in the developer
tools of your browser to see just how many!) Both HTTP/1.1 and
HTTP/2 rely on TCP as their undferlying transport, but an even
more modern protocol called QUIC is now making headway with
its use of UDP, a much less complex layer 4 protocol.

> ... Or did we reach the end? Many people have referred to
layer 8, the financial layer, and layer 9, the political layer.
As we've seen in the past decade, distributed ledgers like
Bitcoin and Ethereum have emerged, and plenty of online
activism communities have formed using layer 7 applications for
communication and organizing. Modern computer networks are a
powerful way to notify us of emerging threats to justice,
environmental hazards, and all manner of things. With wisdom,
we should use these tools for intergenerational wellbeing, and
so talk of layer 8 and beyond is becoming more and more pertinent
in our daily lives.

## Logically Specifying Network Behavior

So after that long introduction to the OSI model, let's talk
about the _logic_ of networks. How can we specify network
behavior and build correct network implementations that satisfy
those specifications?

### Layer 1 and 2: First-Order Logic with Transitive Closure

With layers 1 and 2, there is really only one notion: connectivity. 
For two systems to communicate, there needs to some physical relay
chain between them. This is well-described using relational
semantics. Any two systems satsify one of two possibilites:
there exists a direct physical link between them or there does
not. If two systems _are_ drirectly connected, we'll call that
satisfying the "physical link" relation. There is also the notion
of two systems being connected by a relay chain. In relational 
semantics, being connected by a relay chain is the _transitive 
closure_ of the physical link relation.

So a specification of a physical network is well-described by
first-order logic. We can say things like

```
Point-to-Point Network:
A and B are connected by L

Mesh Network:
For all A B, there exists L such that A and B are connected by L

Bus Network or LAN:
There exists L such that for all A B, A and B are connected by L

Relayed Mesh Network:
For all A B, there exists R such that A and B are relayed through R
```

From a computational complexity standpoint, verifying that a network
satisfies a first-order formula with transitive closure takes
polynomial time. However in practice, IP routers only allow 
packets with a TTL value of at most 30, so the search depth is
limited to 30.

### IP: Routing

With relayed connections available, the next task is figuring out
where to send packets to move them closer to their destination. 

To do this, we need to talk about routing policies. If a system
sends a packet to another system that does not have a route
to the packet's destination, the packet will be dropped. So we have
a chain of existential quantifiers:

For a packet to reach its destination, there must be a relay chain
to that destination and each hop must be a router whose routing
policy moves the packet to the next hop. Formally

```
A can send a packet to B if
There exists R such that:
A and B are relayed by R
AND
for each Rn in R, S's routing policy forwards the packet to R(n+1)
```

So we've added a new relation, namely the routing policy. Assuming
the routing policy for each system in the relay chain is not
too complex (it probably only checks the destination header
against a short list of potential next hops), the complexity has
not changed much from our layer 1 and 2 specification. We're still
working with first-order logic extended by transitive closure.

### Routing Policies and Firewall Rules

In principal the routing policy could be arbitrarily complex, but
that would generally be bad network policy design. You don't want
to spend millions and millions of CPU cycles just to figure out
where to send a packet!

Routing policies and firewall rules do get the complicated in the
sense that here are many packet headers to quantify over.
Sometimes these polices even modify packets as in the case
NAT traversal for IPv4.

Let's consider how a network service running on an internal
network can be accessed by a computer on the public internet.

```
Given:
A is listening on /ip4/10.0.0.50/tcp/80
B sends a packet dst /ip4/5.6.7.8/tcp/80 src /ip4/1.2.3.4/tcp/54321
C rewrites packets destined for /ip4/5.6.7.8/tcp/80
  to /ip4/10.0.0.50/tcp/80
L is the link shared by A and C
C transmits packets with dst /ip4/10.0.0.50 on L
R is the relay chain between B and C
C rewrites packets src /ip4/10.0.0.50 to src /ip4/5.6.7.8
P is the link shared by C and R0
C transmits packets dst /ip4/1.2.3.4 to P

Then:
A and B can communicate between /ip4/1.2.3.4/tcp/54321
        and /ip4/5.6.7.8/tcp/80
```

Quite gnarly to look at, but this effectively how firewall rules
are specified. These rules are really first order formula where
each system in the network is concerned with which link to
write packets to, depending on properties of the packets, and
possibly with rewriting rules to handle things NAT traversal.

## Conclusions

I hope you enjoyed this post on networks and logic.
It's surprising that first-order logic with transitive
closure--something that arsises in the very first layer--is
really the limiting source of complexity. Everything else is
just propositional logic formulas related to packet headers.
