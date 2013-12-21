Q = require('q');

var actorId = 0;

function Actor(f, scheduler) {

  this._id = actorId++;
  this._runs = [f];
  this._scheduler = scheduler;
  this.state = 'run';
  this.mailbox = [];

}

Actor.prototype = {

  run: function() {
    this.state = 'run';
    var res =  this._runs.pop().apply(this);
    if(this._runs.length){this._scheduler.actorReady(this) }
    return res
  },

  receive: function() {
    this.state = 'receive';

    this._defer = Q.defer(0);

    if(this.mailbox.length){
      this._runs.unshift(this._receive.bind(this));
      this._scheduler.actorReady(this)
    } else {
      this._scheduler.actorWait(this)
    }

    return this._defer.promise;
  },

  _receive: function() {
    var message = this.mailbox.pop();

    this._defer.resolve(message);

  },

  send: function(message) {
    this.mailbox.unshift(message);

    if(this.state == 'receive'){
      this._runs.unshift(this._receive.bind(this));
      this._scheduler.actorReady(this);
    }
  }

};

module.exports = Actor;
