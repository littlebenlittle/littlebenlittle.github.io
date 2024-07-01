---
id: 33e66390-19cf-4a8d-a262-27228763dca7
title: "WASM and WASI"
date: 2024-04-11T18:33:57.350Z
template: post.hbs
excerpt: >-
  WebAssembly (WASM) and the WebAssembly System Interface
  (WASI) are likely to power the next generation of web
  applications. This is a brief note on what they are and
  how they might change the way we interact with data on
  the internet.
---

## WASM and WASI

There are have been many attempts to create safer ways of
exeucting untrusted code downloaded over the network. Java
Applets, Adobe Flash, and more recently Javascript have all
had their day. Each has had its upsides and downsides, but
a persistent problem throughout is _performance_. The latest
contender, WebAssembly, seeks to resolve this problem.

WebAssembly or WASM is a low-level assembly-style language
that acts as a compilation target for high level languages.
This means that compilers can take advantage of code
optimizations that are not available in the Java Virtual
Machine or Javascript runtimes. However WASM suffers from
the drawback that low-level code can't operate on complex
data structures and system APIs without adapter code. That's
where WASI, the WebAssembly System Interface, comes into
play.

WASI is a set of standardized operations for allowing WASM
_guests_--compiled WASM meant to be and run in an isolated
environment--to access common _host_ functionality, like
reading and writing to files or making network requests.
How the host responds to these requests is up to the WASM
_runtime_. For example, a host may allow guests to access
the entire filesystem or just a single file. It may receive
network requests and modify them before sending them, or
simply let them pass through to the OS network interface.

## Next-Gen Web Apps

Being able to customize how the host responds to WASI requests
from the guest opens new doors to building web apps.
Functionality that has traditionally been restricted to web
browsers can now be cutomized to support specific kinds of
guests.

As a concrete example, when WebRTC was standardized to support
video and voice calls in the browser, browser vendors had to
find ways to support these new standards. With WASI, WebRTC
could have been implemented by creating an adapter to convert
WebRTC API requests to WASI network requests. The adapter
itself could be shipped as a WASM component to support WebRTC
without any need to update the host code.

This idea is general enough to allow developers to build
highly customized hosts that support specific operatiosn that
would be challenging to implement in existing browsers. These
hosts could provide better support for peer-to-peer
applications and faster updates with no host downtime.

## Conclusion

WASM and WASI are emerging standards that can be used to support
next-gen web apps. These apps can be built upon and go beyond
what is currently possible with web browsers, effectivly creating
a more modular ecosystem for building and distributing apps.
