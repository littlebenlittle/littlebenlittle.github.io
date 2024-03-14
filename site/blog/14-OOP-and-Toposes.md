---
id: 1ae70779-cb5b-4fb7-9d4d-4ae861407701
title: "Object Oriented Programming and Toposes"
date: 2024-03-09T18:41:29.415Z
template: post.hbs
excerpt: >-
  Object oriented programming has been the most
  popular style of programming for decades. Is
  there a good theoretical reason for this? What
  makes OOP convenient, and when is OOP not the
  right style? In this post I discuss how the
  category-theoretic notion of a topos captures
  the principles of OOP and when the resources
  needed to reason about execution become intractable.
---

# {{{ title }}}

_{{{ excerpt }}}_

_Posted {{{ humanDate date }}}_

## Context Matters: Responding Differently to the Same Input

Consider a very simple and contrived game.

The player on the left can ask the player on the right to do one
of the three actions:

1. Sit
2. Stand
3. Jump

The player on the right does their best to comply. This is simple,
but there are some complications. First, the player on the right cannot
sit if they already sitting. Likewise, they cannot stand if they
are already standing. It is also pretty difficult to jump if they
are sitting, so they can't do that either. This is an example of
how _context_ can change how systems react to input, and how
reacting to input can change the context in which future inputs
are received.

One way to specify the player on the right's behavior formally is
through linear temporal logic, or LTL.

1. After `sit` occurs, the player cannot `sit` until `stand` occurs
2. After `sit` occurs, the player cannot `jump` until `stand` occurs

Everything else is valid behavior.

## Implementing Behaviors in an Object-Oriented Style

Here's an example of a way to implement a behavioral model in
Go:

```go
type Actor struct {
    currently string
}

func (a *Actor) Sit() {
    switch a.currently {
    case "sitting":
        fmt.Printf("already sitting!")
    case "standing" :  
        fmt.Printf("ok, standing")
        a.currently = "standing"
    }
}

func (a *Actor) Stand() {
    switch a.currently {
    case "sitting":
        fmt.Printf("ok, sitting")
        a.currently = sitting
    case "standing" :  
        fmt.Printf("already standing!")
    }
}

func (a *Actor) Jump() {
    switch a.currently {
    case "sitting":
        fmt.Printf("need to stand first!")
    case "standing" :  
        fmt.Printf("jump!")
    }
}
```

The above code also points in an interesting theoretical direction
by it use of the vriable `currently`. If we think about code as a
logical specification about data, then the use of `currently`
to switch execution paths tells us that _different_ specifications
hold in different contexts.

In category theory, this is the notion of a _topos_ which is Greek
for "place" or "site". The space of all possibles values for the 
variable `currently` (in our case just "sitting" or "standing") 
describes all the sites at which things can happen, and our case
clauses describe how the actor behaves at each of those sites.

> **Quick Intuitive Example of a Topos**: Topos theory studies the
  idea of conditional facts. For example, "the ground is wet" is
  an example of a fact that may only be true at some points in
  space and time. In this example, space and time form a collection
  of "sites" at which certain facts may be true, and statements
  like "the ground is wet" form those facts.

I chose `currently` to be a string with only two possible values,
but there's no theoretical reason not to use _any_ kind of data
here. After all, data is just 0s and 1s in memory, and we can come
up with all sorts of a logical facts about those 0s and 1s
representing whatever we like!

```go
type Actor struct {
    currently string
    temperature float32
}

func (a *Actor) Sit() {
    if temperature < 1.0 {
        log.Printf("Not enough entropy to move!")
        return
    }
    switch a.currently {
    case "sitting":
        fmt.Printf("already sitting!")
    case "standing" :  
        fmt.Printf("ok, standing")
        a.currently = "standing"
    }
}

func (a *Actor) Stand() {
    if temperature < 1.0 {
        log.Printf("Not enough entropy to move!")
        return
    }
    switch a.currently {
    case "sitting":
        fmt.Printf("ok, sitting")
        a.currently = sitting
    case "standing" :  
        fmt.Printf("already standing!")
    }
}

func (a *Actor) Jump() {
    if temperature < 1.0 {
        log.Printf("Not enough entropy to move!")
        return
    }
    switch a.currently {
    case "sitting":
        fmt.Printf("need to stand first!")
    case "standing" :  
        fmt.Printf("jump!")
    }
}
```

## Object-Oriented Programming is a Topos

As a broadly sweeping statement, the reason that object-oriented
programming is nice to reason about is precisely because it
satisfies the notion of a topos. Whether the programming language
calls it a "class", "struct", "object", or whatever else, the
data we save in an object gives us a _context_ under which the
different methods operate. Within those methods, we use code to 
specify the logical relationship between data before and after 
execution. Those specifications may change in different contexts,
and providing access to the data in the object gives us a way
to determine the _conditions_ under which each specification
should be used.

## Incompleteness

The notion of a topos is very general. In fact, because of the
"data = programs" paradigm, determining which behavior to
execute can require arbitrary computation.

Check this out:

```go
type Actor struct {
    context func() bool
}

func (a *Actor) Run() {
    if a.context() {
        // do something
    } else {
        // do something else
    }
}

func PathologicalInitialization() Actor {
    return Actor{
        context: func() bool {
            // spin forever! mwahahahaha!
            for {}
            return true
        }
    }
}
```

So it would be nice to say that the context checking code
should always terminate if we want to guarantee program
progress. Well, guaranteeing that something terminates is...
precisely the halting problem.

## Conclusion

I hope you enjoyed this post on OOP and logic. The notion of a
topos helps pin down the relationship between `objects|methods`
and `sites|logical formulas`. I believe there is a great deal for software
engineers to learn by taking different perspectives on code, and
topos theory is one helpful concept worth exploring!
