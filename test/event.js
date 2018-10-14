
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
