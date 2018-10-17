
'use strict';

const t = require('tap');
const Stamp = require('../index').Stamp;
const EventLeaf = require('../index').EventLeaf;

t.test('test fork', async t => {
  let a = new Stamp()
  let [a1, b] = a.fork()
  t.is(a.toString(), '(1: 0)')
  t.is(a1.toString(), '((1,0): 0)')
  t.is(b.toString(), '((0,1): 0)')
});

t.test('test all', async t => {
  let a = new Stamp()

  let [a1, b] = a.fork()

  t.is(a.toString(), '(1: 0)')
  t.is(a1.toString(), '((1,0): 0)')
  t.is(b.toString(), '((0,1): 0)')

  let a2 = a1.event()

  t.is(a2.toString(), '((1,0): (0,1,0))')

  let b1 = b.event()

  t.is(b1.toString(), '((0,1): (0,0,1))')

  let [a3, c] = a2.fork()

  t.is(c.toString(), '(((0,1),0): (0,1,0))')

  let b2 = b1.event()

  t.is(b2.toString(), '((0,1): (0,0,2))')

  let a4 = a3.event()

  t.is(a4.toString(), '(((1,0),0): (0,(1,1,0),0))')

  let b3 = b2.join(c)

  t.is(b3.toString(), '(((0,1),1): (1,0,1))')
  t.is(c.toString(), '(((0,1),0): (0,1,0))')

  let [b4, c1] = b3.fork()

  t.is(c1.toString(), '((0,1): (1,0,1))')
  t.is(b4.toString(), '(((0,1),0): (1,0,1))')

  let a5 = a4.join(b4)

  t.is(a5.toString(), '((1,0): (1,(0,1,0),1))')
  t.is(b4.toString(), '(((0,1),0): (1,0,1))')

  let a6 = a5.event()

  t.is(a6.toString(), '((1,0): 2)')
  t.is(b4.toString(), '(((0,1),0): (1,0,1))')
  t.is(c1.toString(), '((0,1): (1,0,1))')
});
