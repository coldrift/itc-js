
'use strict';

const t = require('tap');
const Id = require('../index').Id;
const ZeroId = require('../index').ZeroId;
const OneId = require('../index').OneId;

t.test('test clone 0', async t => {
  let id = new ZeroId()
  let i = id.clone()
  t.is(i.toString(), '0')
});

t.test('test clone 1', async t => {
  let id = new OneId()
  let i = id.clone()
  t.is(i.toString(), '1')
});

t.test('test clone (0,1)', async t => {
  let id = new Id(new ZeroId(), new OneId())
  let i = id.clone()
  t.is(i.toString(), '(0,1)')
});

t.test('test split 0', async t => {

  let id = new ZeroId()

  let i = id.split()

  t.is(id.toString(), '0')
  t.is(i[0].toString(), '0')
  t.is(i[1].toString(), '0')
});

t.test('test split 1', async t => {

  let id = new OneId()

  let i = id.split()

  t.is(id.toString(), '1')
  t.is(i[0].toString(), '(1,0)')
  t.is(i[1].toString(), '(0,1)')
});

t.test('test split (0,1)', async t => {

  let id = new Id(new ZeroId(), new OneId())

  let i = id.split()

  t.is(id.toString(), '(0,1)')
  t.is(i[0].toString(), '(0,(1,0))')
  t.is(i[1].toString(), '(0,(0,1))')
});

t.test('test split (1,0)', async t => {

  let id = new Id(new OneId(), new ZeroId())

  let i = id.split()

  t.is(id.toString(), '(1,0)')
  t.is(i[0].toString(), '((1,0),0)')
  t.is(i[1].toString(), '((0,1),0)')
});

t.test('test split (1,1)', async t => {

  let id = new Id(new OneId(), new OneId())

  let i = id.split()

  t.is(id.toString(), '(1,1)')
  t.is(i[0].toString(), '(1,0)')
  t.is(i[1].toString(), '(0,1)')
});

t.test('test norm (0,0)', async t => {

  let id = new Id(new ZeroId(), new ZeroId())

  let i = id.norm()

  t.is(id.toString(), '(0,0)')
  t.is(i.toString(), '0')
});

t.test('test norm (1,1)', async t => {

  let id = new Id(new OneId(), new OneId())

  let i = id.norm()

  t.is(id.toString(), '(1,1)')
  t.is(i.toString(), '1')
});

t.test('test sum ((1,0),0) and ((0,1),0)', async t => {

  let id1 = new Id(new Id(new OneId(), new ZeroId()), new ZeroId())
  let id2 = new Id(new Id(new ZeroId(), new OneId()), new ZeroId())

  let i = Id.sum(id1, id2)

  t.is(i.toString(), '(1,0)')
});
