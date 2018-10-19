
const Id = require('./Id').Id
const OneId = require('./Id').OneId
const ZeroId = require('./Id').ZeroId
const EventLeaf = require('./Event').EventLeaf
const Event = require('./Event').Event

const max = require('./util').max

const GROW_N = 1000;

function ImmutableStamp(id, ev) {
  this.id = typeof(id) !== 'undefined' ? id : new OneId();
  this.ev = typeof(ev) !== 'undefined' ? ev : new EventLeaf(0);
}

ImmutableStamp.prototype.clone = function() {
  return new ImmutableStamp(this.id.clone(), this.ev.clone())
}

ImmutableStamp.prototype.peek = function() {
  return this.clone()
}

ImmutableStamp.prototype.leq = function(other) {
  return this.ev.leq(other.ev)
}

ImmutableStamp.prototype.lte = function(other) {
  return this.leq(other)
}

ImmutableStamp.prototype.fork = function() {
  var ids = this.id.split()
  return [new ImmutableStamp(ids[0], this.ev.clone()),
    new ImmutableStamp(ids[1], this.ev.clone())]
}

ImmutableStamp.prototype.join = function(other) {
  return new ImmutableStamp(Id.sum(this.id, other.id),
    this.ev.join(other.ev))
}

ImmutableStamp.fill = function(id, ev) {
  if(id instanceof ZeroId || Object.getPrototypeOf(ev) === EventLeaf.prototype) {
    return ev;
  }
  else if(id instanceof OneId) {
    return new EventLeaf(ev.max())
  }
  else if(id.left instanceof OneId) {
    var er = ImmutableStamp.fill(id.right, ev.right)
    var e = new Event(ev.value, new EventLeaf(max(ev.left.value, er.value)), er)
    return e.norm()
  }
  else if(id.right instanceof OneId) {
    var el = ImmutableStamp.fill(id.left, ev.left)
    var e = new Event(ev.value, el, new EventLeaf(max(ev.right.value, el.value)))
    return e.norm()
  }
  else {
    var e = new Event(ev.value, ImmutableStamp.fill(id.left, ev.left),
      ImmutableStamp.fill(id.right, ev.right))
    return e.norm()
  }
}

ImmutableStamp.grow = function(id, ev) {
  if(Object.getPrototypeOf(ev) === EventLeaf.prototype) {
    if(id instanceof OneId) {
      return [new EventLeaf(ev.value + 1), 0];
    }
    else {
      var g = ImmutableStamp.grow(id, new Event(ev.value, new EventLeaf(0), new EventLeaf(0)));
      return [g[0], g[1] + GROW_N];
    }
  }
  else if(id.left instanceof ZeroId) {
    var g = ImmutableStamp.grow(id.right, ev.right);
    var e = new Event(ev.value, ev.left, g[0]);
    return [e, g[1] + 1];
  }
  else if(id.right instanceof ZeroId) {
    var g = ImmutableStamp.grow(id.left, ev.left);
    var e = new Event(ev.value, g[0], ev.right);
    return [e, g[1] + 1];
  }
  else {
    var gl = ImmutableStamp.grow(id.left, ev.left);
    var gr = ImmutableStamp.grow(id.right, ev.right);

    if(gr[1] < gl[1]) {
      var e = new Event(ev.value, gl[0], ev.right);
      return [e, gl[1] + 1];
    }
    else {
      var e = new Event(ev.value, ev.left, gr[0]);
      return [e, gr[1] + 1];
    }
  }
}

ImmutableStamp.prototype.event = function(other) {

  var ev = ImmutableStamp.fill(this.id, this.ev);

  if(!ev.equals(this.ev)) {
    return new ImmutableStamp(this.id.clone(), ev.clone());
  }
  else {
    var g = ImmutableStamp.grow(this.id, this.ev)
    return new ImmutableStamp(this.id.clone(), g[0]);
  }
}

ImmutableStamp.prototype.toString = function() {
  return '(' + this.id.toString() + ': ' + this.ev.toString() + ')';
}

module.exports = ImmutableStamp
