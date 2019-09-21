
const Id = require('./Id').Id
const OneId = require('./Id').OneId
const ZeroId = require('./Id').ZeroId
const EventLeaf = require('./Event').EventLeaf
const Event = require('./Event').Event

const max = require('./util').max

const GROW_N = 1000;

function Stamp(id, ev) {
  this.id = typeof(id) !== 'undefined' ? id : new OneId();
  this.ev = typeof(ev) !== 'undefined' ? ev : new EventLeaf(0);
}

Stamp.prototype.clone = function() {
  return new Stamp(this.id.clone(), this.ev.clone())
}

Stamp.prototype.peek = function() {
  return new Stamp(new ZeroId(), this.ev.clone())
}

Stamp.prototype.leq = function(other) {
  return this.ev.leq(other.ev)
}

Stamp.prototype.lte = function(other) {
  return this.leq(other)
}

Stamp.prototype.fork = function() {
  var ids = this.id.split()
  this.id = ids[0]
  return new Stamp(ids[1], this.ev.clone())
}

Stamp.prototype.join = function(other) {
  this.id = Id.sum(this.id, other.id)
  this.ev = this.ev.join(other.ev)
}

Stamp.fill = function(id, ev) {
  if(id instanceof ZeroId || Object.getPrototypeOf(ev) === EventLeaf.prototype) {
    return ev;
  }
  else if(id instanceof OneId) {
    return new EventLeaf(ev.max())
  }
  else if(id.left instanceof OneId) {
    var er = Stamp.fill(id.right, ev.right)
    var e = new Event(ev.value, new EventLeaf(max(ev.left.value, er.value)), er)
    return e.norm()
  }
  else if(id.right instanceof OneId) {
    var el = Stamp.fill(id.left, ev.left)
    var e = new Event(ev.value, el, new EventLeaf(max(ev.right.value, el.value)), er)
    return e.norm()
  }
  else {
    var e = new Event(ev.value, Stamp.fill(id.left, ev.left),
      Stamp.fill(id.right, ev.right))
    return e.norm()
  }
}

Stamp.grow = function(id, ev) {
  if(Object.getPrototypeOf(ev) === EventLeaf.prototype) {
    if(id instanceof OneId) {
      return [new EventLeaf(ev.value + 1), 0];
    }
    else {
      var g = Stamp.grow(id, new Event(ev.value, new EventLeaf(0), new EventLeaf(0)));
      return [g[0], g[1] + GROW_N];
    }
  }
  else if(id.left instanceof ZeroId) {
    var g = Stamp.grow(id.right, ev.right);
    var e = new Event(ev.value, ev.left, g[0]);
    return [e, g[1] + 1];
  }
  else if(id.right instanceof ZeroId) {
    var g = Stamp.grow(id.left, ev.left);
    var e = new Event(ev.value, g[0], ev.right);
    return [e, g[1] + 1];
  }
  else {
    var gl = Stamp.grow(id.left, ev.left);
    var gr = Stamp.grow(id.right, ev.right);

    if(gl[1] < gr[1]) {
      var e = new Event(ev.value, gl[0], ev.right);
      return [e, gl[1] + 1];
    }
    else {
      var e = new Event(ev.value, ev.left, gr[0]);
      return [e, gr[1] + 1];
    }
  }
}

Stamp.prototype.event = function(other) {

  var ev = Stamp.fill(this.id, this.ev);

  if(!ev.equals(this.ev)) {
    this.ev = ev
  }
  else {
    var g = Stamp.grow(this.id, this.ev)
    this.ev = g[0]
  }
}

Stamp.prototype.toString = function() {
  return '(' + this.id.toString() + ': ' + this.ev.toString() + ')';
}

module.exports = Stamp
