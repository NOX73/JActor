Q = require('q');

var actorId = 0;

function Actor(f, scheduler) {

  this._id = actorId++;
  this._actor = f;
  this._scheduler = scheduler;
  this.state = 'ready';
  this.mailbox = [];

}

Actor.prototype = {

  run: function() {

    switch (this.state) {

      case 'receive':
        this._receive();
        break;

      case 'ready':
        this._actor.apply(this);
        break;

    }

  },

  receive: function() {
    this.state = 'receive';

    this._defer = Q.defer(0);

    if (this.mailbox.length) {
      this._ready();
    } else {
      this._wait();
    }

    return this._defer.promise;
  },

  _receive: function() {
    var message = this.mailbox.pop();

    this._defer.resolve(message);
  },

  send: function(message) {
    this.mailbox.unshift(message);

    if (this.state == 'receive') {
      this._ready();
    }
  },

  loop: function() {
    this.state = 'ready';
    this._ready()
  },

  goto: function(f){
    this._actor = f;
    this.loop();
  },

  _ready: function() {
    this._scheduler.actorReady(this);
  },

  _wait: function() {
    this._scheduler.actorWait(this);
  }

};

module.exports = Actor;
