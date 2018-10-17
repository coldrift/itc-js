## JavaScript Interval Tree Clock Library

This is a JavaScript implementation of Interval Tree Clock as described in [itc2008](http://gsd.di.uminho.pt/members/cbm/ps/itc2008.pdf)

Interval Tree Clocks (ITC) is a novel causality tracking mechanism that generalizes both Version Vectors and Vector Clocks.

Causality tracking mechanisms is modeled by a set of core operations: **fork**, **event** and **join**, that act on stamps (logical clocks).

Causality is characterized by a partial order over the event components of stamps.

There are 3 basic operations over a stamp:

**fork** The fork operation allows the cloning of the causal past of a stamp, resulting in a pair of stamps that

**event** An event operation adds a new event to the event component, so that if _s1_ results from
_event(a)_ the causal ordering is such that s < s1. This action does a strict advance in the partial order such
that _s1_ is not dominated by any other entity and does not dominate more events than needed.

**join** This operation merges two stamps, producing a new one. If _join((i1,e1), (i2,e2)) = (i3,e3)_, the resulting
event component _e3_ should be such that _e1 ≤ e3_ and _e2 ≤ e3_. 

## Installation

```
$ npm install --save itc-js
```

## API

### fork, event and join

```javascript
  const Stamp = require('itc-js').Stamp

  let a = new Stamp()

  // a.toString() === '(1: 0)'

  let [a1, b] = a.fork()

  // a1.toString() === '((1,0): 0)'
  // b.toString() === '((0,1): 0)'

  let a2 = a1.event()

  // a2.toString() === '((1,0): (0,1,0))'

  let b1 = b.event()

  // b1.toString() === '((0,1): (0,0,1))'
    
  let [a3, c] = a2.fork()

  // c.toString() === '(((0,1),0): (0,1,0))'
    
  let b2 = b1.event()

  // b2.toString() === '((0,1): (0,0,2))'
    
  let a4 = a3.event()
    
  // a4.toString() === '(((1,0),0): (0,(1,1,0),0))'

  let b3 = b2.join(c)
    
  // b3.toString() === '(((0,1),1): (1,0,1))'
  // c.toString() === '(((0,1),0): (0,1,0))'
    
  let [b4, c1] = b3.fork()
    
  // c1.toString() === '((0,1): (1,0,1))'
  // b4.toString() === '(((0,1),0): (1,0,1))'

  let a5 = a4.join(b4)
  
  // a5.toString() === '((1,0): (1,(0,1,0),1))'
  // b4.toString() === '(((0,1),0): (1,0,1))'
    
  let a6 = a5.event()

  // a6.toString() === '((1,0): 2)'
  // b4.toString() === '(((0,1),0): (1,0,1))'
  // c1.toString() === '((0,1): (1,0,1))'
```

### Comparing stamps

To compare stamps use _leq_ method of a stamp. This method returns **true** if given stamp is strictly before
the one in the argument, **false** otherwise.

```javascript
  const Stamp = require('itc-js').Stamp

  let a = new Stamp()

  // a.toString() === '(1: 0)'

  let [a1, b1] = a.fork()

  // a1.toString() === '((1,0): 0)'
  // b1.toString() === '((0,1): 0)'

  let b2 = b1.event()

  // b2.toString() === '((0,1): (0,0,1))'

  b1.leq(b2) // true
```

### Immutable stamps

You can also use immutable stamps if you want to enforce strict immutability.

The API of immutable stamps is slighly different:

```javascript
  const Stamp = require('itc-js').ImmutableStamp

  let a = new Stamp()

  // a.toString() === '(1: 0)'

  let [a1, b] = a.fork()

  // a1.toString() === '((1,0): 0)'
  // b.toString() === '((0,1): 0)'

  let a2 = a1.event()

  // a2.toString() === '((1,0): (0,1,0))'

  let b1 = b.event()

  // b1.toString() === '((0,1): (0,0,1))'
    
  let [a3, c] = a2.fork()

  // c.toString() === '(((0,1),0): (0,1,0))'
    
  let b2 = b1.event()

  // b2.toString() === '((0,1): (0,0,2))'
    
  let a4 = a3.event()
    
  // a4.toString() === '(((1,0),0): (0,(1,1,0),0))'

  let b3 = b2.join(c)
    
  // b3.toString() === '(((0,1),1): (1,0,1))'
  // c.toString() === '(((0,1),0): (0,1,0))'
    
  let [b4, c1] = b3.fork()
    
  // c1.toString() === '((0,1): (1,0,1))'
  // b4.toString() === '(((0,1),0): (1,0,1))'

  let a5 = a4.join(b4)
  
  // a5.toString() === '((1,0): (1,(0,1,0),1))'
  // b4.toString() === '(((0,1),0): (1,0,1))'
    
  let a6 = a5.event()

  // a6.toString() === '((1,0): 2)'
  // b4.toString() === '(((0,1),0): (1,0,1))'
  // c1.toString() === '((0,1): (1,0,1))'
```

## License

Licensed under MIT License. Copyright 2018 Coldrift Technologies B.V. All rights reserved.

