
function IdBase() {
}

function Id(l, r) {
  IdBase.call(this)
  this.left = l;
  this.right = r;
}

Id.prototype = Object.create(IdBase.prototype);
Id.prototype.constructor = Id;

Id.sum = function(a, b) {
  return (a instanceof ZeroId) ? b.clone()
    : (b instanceof ZeroId) ? a.clone()
    : Id.norm(new Id(Id.sum(a.left, b.left),
      Id.sum(a.right, a.right)))
}

Id.prototype.clone = function() {
  return new Id(this.left.clone(), this.right.clone())
}

Id.prototype.split = function() {
  if(this.left instanceof ZeroId) {
    var i = this.right.split()
    return [new Id(new ZeroId(), i[0]), new Id(new ZeroId(), i[1])]
  }
  else if(this.right instanceof ZeroId) {
    var i = this.left.split()
    return [new Id(i[0], new ZeroId()), new Id(i[1], new ZeroId())]
  }
  else {
    return [new Id(this.left.clone(), new ZeroId()),
      new Id(new ZeroId(), this.right.clone())]
  }
};

Id.prototype.norm = function() {
  if(this.left instanceof ZeroId && this.right instanceof ZeroId) {
    return new ZeroId()
  }
  else if(this.left instanceof OneId && this.right instanceof OneId) {
    return new OneId()
  }
  else {
    return this.clone()
  }
}

Id.prototype.toString = function() {
  return '(' + this.left.toString() + ',' + this.right.toString() + ')';
}

function ZeroId() {
  IdBase.call(this)
}

ZeroId.prototype = Object.create(IdBase.prototype);
ZeroId.prototype.constructor = ZeroId;

ZeroId.prototype.clone = function() {
  return new ZeroId()
}

ZeroId.prototype.split = function() {
  return [new ZeroId(), new ZeroId()]
}

ZeroId.prototype.toString = function() {
  return '0';
}

function OneId() {
  IdBase.call(this)
}

OneId.prototype = Object.create(IdBase.prototype);
OneId.prototype.constructor = OneId;

OneId.prototype.clone = function() {
  return new OneId()
}

OneId.prototype.split = function() {
  return [new Id(new OneId(), new ZeroId()), new Id(new ZeroId(), new OneId())]
}

OneId.prototype.toString = function() {
  return '1';
}

exports.Id = Id
exports.ZeroId = ZeroId
exports.OneId = OneId

