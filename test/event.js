
'use strict';

const t = require('tap');
const Event = require('../index').Event;
const EventLeaf = require('../index').EventLeaf;

t.test('test norm (2,1,1)', async t => {
  let ev = new Event(2, new EventLeaf(1), new EventLeaf(1))
  t.is(ev.norm().toString(), '3')
});

t.test('test norm (2,(2,1,0),3)', async t => {
  let ev = new Event(2, new Event(2, new EventLeaf(1), new EventLeaf(0)), new EventLeaf(3))
  t.is(ev.norm().toString(), '(4,(0,1,0),1)')
});

t.test('test norm (2,3,(2,1,0))', async t => {
  let ev = new Event(2, new EventLeaf(3), new Event(2, new EventLeaf(1), new EventLeaf(0)))
  t.is(ev.norm().toString(), '(4,1,(0,1,0))')
});

t.test('test join 2 and 0', async t => {
  let e1 = new EventLeaf(2)
  let e2 = new EventLeaf(0)
  t.is(e1.join(e2).toString(), '2')
});

t.test('test join 2 and (2,1,0)', async t => {
  let e1 = new EventLeaf(2)
  let e2 = new Event(2, new EventLeaf(1), new EventLeaf(0))
  t.is(e1.join(e2).toString(), '(2,1,0)')
});

t.test('test join (2,1,0) and (1,(3,1,0),1)', async t => {
  let e1 = new Event(2, new EventLeaf(1), new EventLeaf(0))
  let e2 = new Event(1, new Event(3, new EventLeaf(1), new EventLeaf(0)), new EventLeaf(1))
  t.is(e1.join(e2).toString(), '(2,(2,1,0),0)')
});

t.test('test join (0,1,0) and (0,0,2)', async t => {
  let e1 = new Event(0, new EventLeaf(1), new EventLeaf(0))
  let e2 = new Event(0, new EventLeaf(0), new EventLeaf(2))
  t.is(e1.join(e2).toString(), '(1,0,1)')
});

t.test('test leq', async t => {
  {
    let e1 = new EventLeaf(0)
    let e2 = new EventLeaf(2)
    t.is(e1.leq(e2), true)
  }
  {
    let e1 = new EventLeaf(0)
    let e2 = new EventLeaf(0)
    t.is(e1.leq(e2), true)
  }
  {
    let e1 = new EventLeaf(25)
    let e2 = new EventLeaf(0)
    t.is(e1.leq(e2), false)
  }
  {
    let e1 = new Event(2, new EventLeaf(1), new EventLeaf(0))
    let e2 = new Event(1, new Event(3, new EventLeaf(1), new EventLeaf(0)), new EventLeaf(1))
    t.is(e1.leq(e2), false)
  }
  {
    let e1 = new Event(1, new Event(2, new EventLeaf(1), new EventLeaf(0)), new EventLeaf(1))
    let e2 = new Event(3, new EventLeaf(1), new EventLeaf(0))
    t.is(e1.leq(e2), true)
  }
});
