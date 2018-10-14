
function min(a, b) {
  return a < b ? a : b;
}

function EventLeaf(v) {
  this.value = v;
}

EventLeaf.prototype.clone = function() {
  return new EventLeaf(this.value)
}

EventLeaf.prototype.min = function() {
  return this.value
}

EventLeaf.prototype.sink = function(m) {
  return new EventLeaf(this.value - m)
}

EventLeaf.prototype.norm = function() {
  return new EventLeaf(this.value)
}

EventLeaf.prototype.toString = function() {
  return ''+this.value
}

function Event(v, l, r) {
  EventLeaf.call(this, v)
  this.left = l;
  this.right = r;
}

Event.prototype.clone = function() {
  return new Event(this.value, this.left.clone(), this.right.clone())
}

Event.prototype = Object.create(EventLeaf.prototype);
Event.prototype.constructor = Event;

Event.prototype.min = function() {
  return this.value + min(this.left.min(), this.right.min())
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

Event.prototype.toString = function() {
  return '(' + this.value + ',' + this.left.toString() +
    ',' + this.right.toString() + ')';
}

exports.EventLeaf = EventLeaf
exports.Event = Event
