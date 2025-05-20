---
id: b52765ee-5d17-4287-9afe-3079a71bbbce
title: Data Storage and Persistence
date: 2024-05-26T23:19:43.626Z
modified: 2024-07-01
template: post.hbs
excerpt: >-
  Storing data is a critical part of every application in one
  way or another. In this post I discuss some different types
  of data storage and their trade-offs in terms of resource
  use.
---

## Introduction

The entire concept of computation doesn’t make sense if you can’t store and retrieve data. Storage and retrieval are 2 of the 4 necessary components of computation (the other two being the disjoint logical operations). However the question of where to store data and for how long are critical questions for optimizing resource use. Not surprisingly, the answers to these questions depend on the intentions of the application designer.

### The Origins of Storage

When Turing, Church, and their contemporaries first envisioned the ideas that we refer to today as the foundations of computer science, they imagined that storage was essentially a free resource. In fact the definition of Turing’s machines includes access to an infinite roll of indestructable tape on which symbols can be freely written, read, and erased forever! While useful for abstract thought experiments, this highly un-physical definition does not map onto anything yet seen in the observable universe. Real computers have limited storage, and the time it takes to access that storage usually increases with how robust that storage is to physical disruptions like power outages and hardware failures.


### Tiers of Data Persistence

#### Less Reliable but Fast Storage

In modern computers, the fastest storage are CPU registers, a collection of binary storage units physically printed on the chip. These registers feed directly into the logic circuits on the chip and only incur a resource cost insofar as they contribute to the [critical path][crit-path] of the CPU which decreases clock speeds. Different kinds of workloads require different kinds of chip designs, but registers usually don’t have more than a few kilobytes of storage capacity.

At the next layer, there is the CPU cache system. CPU caches are still on-chip and usually only incur tens or hundreds of CPU cycles of overhead to access. Given the limited size of microchips, larger caches means less space for other desirable components like wider and deeper [pipelines][pipelining] and or on-chip GPUs. Modern CPUs usually have a few megabytes of cache space.

Once we are off the chip, the next layer of storage is RAM or main memory. RAM is usually implemented as a fairly large array of capacitors and can hold gigabytes of memory. HPCs in cloud datacenters may have terabytes of memory available. Given that main memory is off-chip, accessing it can take thousands of CPU cycles. Avoiding this cost is the goal of speculative execution optimizations in modern processors.

Everything up to this point is still subject to data loss on power failure. To persist data even after a full hardware restart, we turn to block storage.

#### More Reliable but Slow Storage

Application designers with a need for long-term storage used to record data onto [tape drives][tape-drive], or big reels of electromagnetic tape that encode data by the orientation of tiny magnets. Some datacenters still use tape drives for data that only needs to be accessed every couple of years. However most systems use hard-disk drives (HDDs) or solid-state drives (SSDs). HDDs use tiny magnets just like tape drives, but their density is much higher and so their read/write times are a lot faster. SSDs use specialized semiconductors for storage and avoid the need for mechanically moving disks to align read/write heads with the data. As a result, SSDs are faster but usually more expensive to fabricate than HDDs.

HDDs and SSDs form the basis of almost all storage systems that can persist data through power failure. (An exception being [non-volotile RAM][nvram]). One thing that these systems cannot do in isolation is persist data through failure of physical hardware itself. This is where replicated storage systems step in.

Replicated storage systems coordinate two more more drives to store identical copies of the data. If one of those drives fails, it can be replaced with a new drive and the other replicas can copy the existing data onto the new drive. This allows critical data to be more resilient even if individual pieces of hardware fail.

### The Tradeoff Between Resource Cost and Data Resiliency

The closest thing we have to Turing’s world of infinite, indestructible tape is replicated storage. However replicated storage incurs a lot of overhead: Every write to the system needs to be replicated across every drive before the write can be said to have completed. Otherwise some drives may have different data than others and it would be infeasible to determine which data was the “correct” version. To achieve consistency with all drives, the systems controlling those drives implement consensus protocols like [paxos][paxos] or [raft][raft], which involve sending lots of messages between all the systems involved. All of this communication traffic takes time, so unless the data in question is very important, it doesn’t make sense to pay this cost.

On the other end of the spectrum, data that persists only in registers is lost if the program crashes or the system running it loses power for even a moment. However that data is always immediately available for performing computations. In between there are choices like main memory and isolated drives, each with its own resource costs and persistence guarantees. Striking a balance between re-computing lost data and storing critical data depends on the application.

## Some Useful Concepts in Replicated Storage

Replicated storage is a broad topic with an extensive history of research and engineering. Here are a few ideas that I find interesting.

### Locking Mechanisms

When multiple threads, programs, or systems need to read and write to the same storage, race conditions can occur. As an example of such a race condition, imagine one process reads a value from main memory into a register. It then uses the value in a computation and writes the new data back into the same place in memory. In the meantime, another process reads the same value, performs a different computation, and writes that value to main memory. The actual value that ends up in memory depends on which operation completed second! The other operation is completely overwritten, which is probably not the intended behavior.

To mitigate this inconsistency, the processes can be coordinated so that the first signals to the coordinator that it intends to modify a value. When the second process tries to read that value, the coordinator informs that the value is not ready to be read, and the second process can either wait or do something else in the meantime. When the first process finishes and writes the data back to memory, the coordinator will allow other processes to read that value again. This is called “locking” and implemented everywhere from replicated storage down to CPU registers!

Examples of locking meachanisms in distributed systems include Google’s [Chubby][chubby], whereas low-level implementations can be seen in the [cache coherency protocols][ccp] for multi-core processors. For locking mechanisms in programming languages, there are mutexes and the slightly more sphisticated atomic data types. All of these mechanisms lock data at different storage tiers, yet they all function similarly by coordinating updates to shared data.

### [Speculative Lock Ellision][sle]

Correctly implementing a fine-grained locking mechanism for an application can be challenging and error-prone. Another option is to allow for programmers to over-approximate which set of data needs to be locked and allow the coordinating processes to speculate as to whether or not their updates are going to conflict. For example, a programmer may implement on a lock on entire object in an object-oriented language or an entire row of data in a database, even if the operation they intend to perform only modifies a small amount of that data. Another operation can still read the data behind the lock, hoping that the other process isn’t actually modifying the data it needs. When the second operation goes to write their data, the coordinator can check if a conflicing update has been applied or if both updates can go through without one overwriting the other. If there is a conflict, the second process can simply wait to acquire to the lock and perform its inteded update, or continue to sepculate and try again.

### [Conflict-free Replicated Data Types][crdt]

Another interesting mechanism on the spectrum of coherence and consensus are Conflict-free Replicated Data Types or CRDTs. CRDTs allow different systems to update data independently in a way that is eventually consistent once these systems have synchronized with one another. A CRDT is a data type along with a process for conflict-resolution that all particpants agree to. The classic example is a shared counter, where two conflicting updates can simply be added together when the systems sync. This is helpful when global consistency is not needed for individual systems to proceed, such a aggregating log messages for informational purposes. It would not be appropriate for a something like a booking application, where a limited resource must be reserved to prevent double-booking.

## Conclusion

Storage is a physical resource and it can be challenging to design systems to persist data through various types of failures and interacting components. Fortunately this is an area with a large body of existing research and many lessons to be learned from real-world applications. The core principles of storage, caching, and persistence hold at all levels and we can use success stories from one domain to help guide our decisions in another!

[crit-path]: https://en.wikipedia.org/wiki/Static_timing_analysis#Definitions
[pipelining]: https://en.wikipedia.org/wiki/Instruction_pipelining
[nvram]: https://en.wikipedia.org/wiki/Non-volatile_random-access_memory
[paxos]: https://en.wikipedia.org/wiki/Paxos_(computer_science)
[raft]: https://en.wikipedia.org/wiki/Raft_(algorithm)
[sle]: https://pages.cs.wisc.edu/~rajwar/papers/micro01.pdf
[crdt]: https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type
[chubby]: https://static.googleusercontent.com/media/research.google.com/en//archive/chubby-osdi06.pdf
[ccp]: https://redis.io/glossary/cache-coherence/
[tape-drive]: https://en.wikipedia.org/wiki/Tape_drive
