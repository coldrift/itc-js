
'use strict';

const t = require('tap');
const Stamp = require('../index').Stamp;
const EventLeaf = require('../index').EventLeaf;

t.test('test fork', async t => {
  let a = new Stamp()

  t.is(a.toString(), '(1: 0)')

  let b = a.fork()

  t.is(a.toString(), '((1,0): 0)')
  t.is(b.toString(), '((0,1): 0)')
});

t.test('test all', async t => {
  let a = new Stamp()

  t.is(a.toString(), '(1: 0)')

  let b = a.fork()

  t.is(a.toString(), '((1,0): 0)')
  t.is(b.toString(), '((0,1): 0)')

  a.event()

  t.is(a.toString(), '((1,0): (0,1,0))')

  b.event()

  t.is(b.toString(), '((0,1): (0,0,1))')

  let c = a.fork()

  t.is(c.toString(), '(((0,1),0): (0,1,0))')

  b.event()

  t.is(b.toString(), '((0,1): (0,0,2))')

  a.event()

  t.is(a.toString(), '(((1,0),0): (0,(1,1,0),0))')

  b.join(c)

  t.is(b.toString(), '(((0,1),1): (1,0,1))')
  t.is(c.toString(), '(((0,1),0): (0,1,0))')

  c = b.fork()

  t.is(c.toString(), '((0,1): (1,0,1))')
  t.is(b.toString(), '(((0,1),0): (1,0,1))')

  a.join(b)

  t.is(a.toString(), '((1,0): (1,(0,1,0),1))')
  t.is(b.toString(), '(((0,1),0): (1,0,1))')

  a.event()

  t.is(a.toString(), '((1,0): 2)')
  t.is(b.toString(), '(((0,1),0): (1,0,1))')
  t.is(c.toString(), '((0,1): (1,0,1))')
});
