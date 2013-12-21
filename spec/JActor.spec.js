var JActor = require("../src/JActor");

describe('Headroom', function() {

  var jactor;

  beforeEach(function() {
    jactor = new JActor();
  });

  it('Create actor', function(done) {

    runs(function() {
      jactor.go(function() {
        done()
      });
    });

  });

  it('Send & Receive message', function(done) {
    var message = { hello: "Hi" };

    var actor = jactor.go(function() {
      this.receive().then(function(m) {
        expect(m).toBe(message);
        done();
      })
    });

    actor.send(message);
  });


  it('Send & Receive message to list of actors', function(done) {
    var message = { hello: "Hi" };

    var actor = jactor.go(function() {
      this.receive().then(function(m) {
        expect(m).toBe(message);
        done();
      })
    });

    var actor2 = jactor.go(function() {
      this.receive().then(function(m) {
        expect(m).toBe(message);
        actor.send(m)
      })
    });

    actor2.send(message);
  });

  it('Send several messages to actor', function(done) {
    var count = 0;
    var isDone = false;

    var actor = jactor.go(function() {
      this.receive().then(function(m) {

        switch (m) {

          case 'done':
            isDone = true;
            break;

          default :
            count++;
            this.loop()
        }

      }.bind(this))
    });

    [1, 2, 3].forEach(function(i) {
      actor.send(i);
    });

    setTimeout(function() {
      actor.send('done');
      setTimeout(function() {
        expect(count).toBe(3);
        expect(isDone).toBeTruthy();
        done()
      }, 100)
    }, 100)

  });

  it('Actors chain message send.', function(done) {

    function init() {

      this.receive().then(function(m) {
        this.id = m;

        if (m < 10) {
          this.child = jactor.go(init);
          this.child.send(m + 1);
        }

        this.goto(work);
      }.bind(this))

    }

    function work() {
      this.receive().then(function(m) {
        m.push(this.id);
        if (this.child) {
          this.child.send(m);
        }
      }.bind(this))
    }

    var actor = jactor.go(init);
    var m = [];

    actor.send(0);
    actor.send(m);

    setTimeout(
      function() {
        expect(m.length).toBe(11);
        for (var i = 0; m.length; i++) {
          expect(m.shift()).toBe(i);
        }
        done();
      }, 100);

  });

  it('Actor ring.', function(done){

    function init() {

      this.receive().then(function(m) {
        this.id = m.id || 1;

        if (this.id < m.count) {
          this.child = jactor.go(init);
          this.child.send({ id: this.id + 1, first: m.first || this, count: m.count});
        } else {
          this.child = m.first
        }

        this.goto(work);
      }.bind(this))

    }

    function work() {
      this.receive().then(function(m) {
        m.push(this.id);
        this.child.send(m);
        this.loop();
      }.bind(this))
    }

    var actor = jactor.go(init);
    var m = [];

    actor.send({count: 20});
    actor.send(m);

    setTimeout(
      function() {
        expect(m.length > 0).toBeTruthy();
        done();
      }, 500);

  });


});
