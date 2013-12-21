Actor = require('./Actor');

function JActor() {
  this._readyActors = [];
  this._scheduled = false;
}

JActor.prototype = {

  go: function(f) {
    var actor = new Actor(f, this);

    this.actorReady(actor);

    return actor
  },

  run: function() {
    this._scheduled = true;
    setTimeout(this.schedule.bind(this))
  },

  stop: function() {
    this._scheduled = false;
  },

  schedule: function() {

    var readyActors = this._readyActors;
    this._readyActors = [];

    readyActors.forEach(function(actor) {
      actor.run()
    });

    if (!this._readyActors.length) {
      this.stop();
    } else {
      this.run();
    }

  },

  actorReady: function(actor) {
    if (this._readyActors.indexOf(actor) < 0) {
      this._readyActors.push(actor);
      if (!this._scheduled) {
        this.run()
      }
    }
  },

  actorWait: function(actor) {

  }

};

module.exports = JActor;