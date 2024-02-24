---
id: 1ae01492-19fa-47c2-84eb-0cf353728188
title: "Types and Logic"
date: 2024-02-20T11:07:00.000Z
template: post.hbs
excerpt: >-
  In this post I discuss how type systems make it
  easier to write correct and reusable code. I show
  how function call signatures are a form of logical
  restriction on values and how function bodies
  can encode correct execution for those values.
snips:
  go: 04-Types-and-Logic/go
---

# {{{ title }}}

> _{{{ excerpt }}}_

## Type Systems are Logic

The [Curry-Howard-Lambek-Scott][1] correspondence famously shows
that type systems and logic are the same kind of thing. Another
way of looking at type systems is that they are a form of
[abstract interpretation][2]. There are countless other ways of
thinking about types, so I thought it it would be useful to
write down some of my own ideas on the topic in the language
that I personally find useful for reasoning about code!

## A Real-World Example

Recently I've been using Go's `syscall/js` package. This is a
low-level library that allows Go code compiled to `wasm` to
interact with [Web APIs][3] when run in the browser. One
major challenge of working with `syscall/js` is that it does
provide type-safety, meaning it's very easy to get runtime
errors by passing an argument of the wrong type.

The following code will generate an `invalid Value` error at
runtime:

```go
type Value = js.Value

func alert1() {
	var window Value
	window = js.Global().Get("window")
	window.Call(
		"addEventListener",
		"load",
		func(this Value, args []Value) any {
			window.Call("alert", "The window has loaded!")
			return nil
		},
	)
}
```

So what went wrong? The variable `window` has type `js.Value`,
and its method `Call` has signature `(m string, args ...any) js.Value`.
But really this is misleading, because you can't pass just
`any` arguments--the type of `args` you need to pass depends
on the JS function being called and sending the wrong type or
wrong number of arguments will cause a runtime error!

In this case we're calling the JS function `window.addEventListener`,
which accepts a single JS callback. However a go `func` type is not a
automatically converted to a JS callback. We need to explicitly
create a `js.Func` using the `js.FuncOf` method.

```go
func alert2() {
	var window Value
	window = js.Global().Get("window")
	window.Call(
		"addEventLister",
		"load",
		js.FuncOf(func(this Value, args []Value) any {
			window.Call("alert", "The window has loaded!")
			return nil
		}),
	)
}
```

Except... oops, there's no method `addEventLister`! If you look
carefully there's a typo: it should be `addEventListener`.

It gets very easy to lose track of all these little details,
especially if you think about a codebase with thousands and
thousands of lines of code. The fundamental problem is that
the `syscall/js` package needs certain consistency guarantees
that are not represented in its use of types. What we need
is a wrapper for this package that ensures correctness by
using the type system so mistakes can be caught before
compilation rather than during runtime.

Here's an example of a type safe wrapper for `window`:

```go
type Window struct {
	Value
}

type Event struct {
	Value
}

func GetWindow() Window {
	// no typos, so this always return the
	// JS Value of the window
	return Window{js.Global().Get("window")}
}

func (w *Window) AddEventListenerLoad(cb func(e Event)) {
	w.Call(
		// No typos here!
		"addEventListener",
		js.FuncOf(func(this Value, args []Value) any {
			// Web API spec guarantees first argument
			// will be a generic JS Event type
			event := Event{args[0]}
			cb(event)
			return nil
		}),
	)
}

func (w *Window) Alert(message string) {
	// JS alert method expects a string
	w.Call("alert", message)
}

func alert3() {
	window := GetWindow()
	window.AddEventListenerLoad(func(e Event) {
		window.Alert("window has loaded!")
	})
}
```

Assuming our wrapper code is implemented correctly, we
now have a reusable, type-safe interface for calling
`alert` on the JS window element when the window loads. In
fact, there is an entire project called [`gopherjs`][4] that
tries to do exactly this: provide type-safe and correct
wrappers for just about every Web API.

## Types Assert Logical Consistency

By restricting the ways in which a function can be called, we
can reduce and often eliminate incorrect execution paths.

The wrapper methods in the `syscall/js` example above
effectively assert, "If you give me values of this type,
I can _always_ correctly execute the wrapped method." This is
in fact a logical statment! The arguments _quantify_ over the
set of values for which correct execution is guaranteed, and
the body of the method transforms those values into the ones
that will work correctly with the wrapped method.

In the Curry-Howard perspective, the function call signature
is a _theorem_ that says "correct execution is guaranteed for
values of this type" and the method body is a _proof_ that
demonstrates how correct execution is performed for those
values. In the abstract interpretation perspective, the method
type is a set of values and the method body describes an
abstract execution trace for elements of that set.

## At the Level of Assembly

Types allow modern programming languages to work. When working
with assembly, there is no notion of type. All you have are raw
bytes, and you must be very careful to remember _what those bytes mean_
when you are writing code. When working in a typed language, though,
the type system can take care of some of this reasoning for you. You
won't ever accidenally try to add the raw bytes of an integer value
to the raw bytes of a floating point value, because the type system
remembers `x` is an `int` and `y` is a `float` and so `x + y` doesn't
make sense (unless the language you're using is smart enough to
do type conversion automatically!).

## Type Definitions as Logical Guarantees About Memory

Most languages provide a means of constructing new types.

```go
type Dot struct {
  X int
  Y int
}
```

From a logical perspective, this says that a segment of memory
that has type `Dot` will _always_ contain two integers. For
example if the type system knows that address `0xff0000` is
the start of a `Dot` value, then `0xff0000` is the start
of the first `int` type and `0xff0000+0x10` is the start of the
second `int` type. The type system also knows how long the
memory segments for these values are based on their type. I just
made up these numbers and different languages have different
models for storing data in memeory, but the general idea holds
true: a type definition tells the compiler what the memory
layout looks like.

If you're working with assembly and don't have a type system, then
you are responsible for remembering how memory is laid out. This
is pretty unworkable, so basic type systems and type definitions
are necessary for working with large programs.

## Investigating Various Modern Programming Languages

Type can be used for all sorts of things. In fact, some type
theories are expressive enough to represent arbitrary computation
and hence arbitrary logic. Here's a few examples of some
interesting choices made by various programming languages in
their type systems:

### TypeScript's "Type Predicates"

```ts
type MyType = {
  doesTheThing: () => void;
  hasTheThing: int;
}

function isMyType(t: T): t is T {
  return
     (t as T).doesTheThing !== undefined
  && (t as T).hasTheThing !== undefined
}

function main() {
  // value has type any
  var value: any = {
    doesTheThing() { console.log("hoopla!") }
    hasTheThing: 42
  }
  if (isMyType()) {
    // type checker now knows that
    // value has type MyType
    value.doesTheThing()
  }
}
```

Type predicates allow the type checker to _narrow_ the scope of a type.
In TypeScript there is a notion type polymorphism, where a
value can have multiple types. This allows the value to be
used in functions that accept any of its types. However in
some cases you may want to perform some runtime check to
determine if a value meets the conditions necessary to be
considered as having a certain type. If that check succeeds,
type predciates allow you to make a guarantee to the type
checker that the value has that type. Without the predicate,
the type checker will continue to assume that the value has
the original type.

### Rust's "Borrow Checker"

Yes, the quintessential selling point of the rust programming
language is its borrow checker. The borrow checker statically
checks to make sure the a value has not been freed from
memory before its use.

```rs
fn f() &Int {
  let x = 7;
  return &x // error! value `x` does not live long enough
}

fn main() {
  f()
}
```

In this example the type system is able to determine that
the value `x` is referenced after its underlying value
has been dropped. In rust, variables are dropped as soon
as they go out of the scope, so in this case `x` is dropped
right before the `return` statement of `f`. Therefore any
reference to `x` that outlives this scope will be invalid!

### Go

Go allows for multiple inheritiance, which is a form of
polymorphism.

```go
type MyType struct { }

func (m *MyType) DoTheThing() {
  // ...
}

type MyOtherType struct { }

func (m *MyOtherType) DoTheOtherThing() {
  // ...
}

func MyStruct{
  MyType
  MyOtherType
}

func main() {
  v := MyStruct{
    MyType{},
    MyOtherType{},
  }
  v.DoTheThing()
  v.DoTheOtherThing()
}
```

[1]: https://en.wikipedia.org/wiki/Curry%E2%80%93Howard_correspondence
[2]: https://en.wikipedia.org/wiki/Abstract_interpretation
[3]: https://developer.mozilla.org/en-US/docs/Web/API
[4]: https://github.com/gopherjs/gopherjs
