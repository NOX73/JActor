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

  })


});
