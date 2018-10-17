
var min = require('./util').min
var max = require('./util').max

function EventLeaf(v) {
  this.value = v;
}

EventLeaf.prototype.clone = function() {
  return new EventLeaf(this.value)
}

EventLeaf.prototype.equals = function(other) {
  return (Object.getPrototypeOf(other) === EventLeaf.prototype)
    && (this.value === other.value);
}

EventLeaf.prototype.join = function(other) {
  if(Object.getPrototypeOf(other) === EventLeaf.prototype) {
    return new EventLeaf(max(this.value, other.value))
  }
  else {
    var e = new Event(this.value, new EventLeaf(0), new EventLeaf(0))
    return e.join(other)
  }
}

EventLeaf.prototype.min = function() {
  return this.value
}

EventLeaf.prototype.max = function() {
  return this.value
}

EventLeaf.prototype.lift = function(m) {
  return new EventLeaf(this.value + m)
}

EventLeaf.prototype.sink = function(m) {
  return new EventLeaf(this.value - m)
}

EventLeaf.prototype.norm = function() {
  return new EventLeaf(this.value)
}

EventLeaf.prototype.comp = function(other, pred) {
  return pred(this.value, other.value)
}

EventLeaf.prototype.leq = function(other) {
  return this.comp(other, (a, b) => a <= b)
}

EventLeaf.prototype.toString = function() {
  return ''+this.value
}

function Event(v, l, r) {
  EventLeaf.call(this, v)
  this.left = l;
  this.right = r;
}

Event.prototype = Object.create(EventLeaf.prototype);
Event.prototype.constructor = Event;

Event.prototype.clone = function() {
  return new Event(this.value, this.left.clone(), this.right.clone())
}

Event.prototype.equals = function(other) {
  return (Object.getPrototypeOf(other) === Event.prototype)
    && (this.value === other.value) && this.left.equals(other.left)
      && this.right.equals(other.right);
}

Event.prototype.join = function(other) {
  if(Object.getPrototypeOf(other) === EventLeaf.prototype) {
    return this.join(new Event(other.value, new EventLeaf(0), new EventLeaf(0)))
  }
  else {
    if(this.value > other.value) {
      return other.join(this)
    }
    else {
      var d = other.value - this.value
      var l2 = other.left.lift(d)
      var r2 = other.right.lift(d)
      var e = new Event(this.value, this.left.join(l2), this.right.join(r2))
      return e.norm()
    }
  }
}

Event.prototype.min = function() {
  return this.value + min(this.left.min(), this.right.min())
}

Event.prototype.max = function() {
  return this.value + min(this.left.max(), this.right.max())
}

Event.prototype.lift = function(m) {
  return new Event(this.value + m, this.left, this.right)
}

Event.prototype.sink = function(m) {
  return new Event(this.value - m, this.left, this.right)
}

Event.prototype.norm = function() {
  var l = this.left.norm()
  var r = this.right.norm()
  var m = min(l.min(), r.min())
  l = l.sink(m)
  r = r.sink(m)
  return l.value === 0 && r.value === 0 ? new EventLeaf(this.value + m)
    : new Event(this.value + m, l, r)
}

Event.prototype.comp = function(other, pred) {
  if(Object.getPrototypeOf(other) === EventLeaf.prototype) {
    return pred(this.value, other.value) && this.left.comp(other, (a, b) => pred(a + this.value, b))
      && this.right.comp(other, (a, b) => pred(a + this.value, b))
  }
  else {
    return pred(this.value, other.value) && this.left.comp(other.left, (a, b) => pred(a + this.value, b + other.value))
      && this.right.comp(other.right, (a, b) => pred(a + this.value, b + other.value))
  }
}

Event.prototype.toString = function() {
  return '(' + this.value + ',' + this.left.toString() +
    ',' + this.right.toString() + ')';
}

exports.EventLeaf = EventLeaf
exports.Event = Event
