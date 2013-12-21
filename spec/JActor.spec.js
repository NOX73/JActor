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
    var res;
    var message = { hello: "Hi" };

    var actor = jactor.go(function() {
      this.receive().then(function(m) {
        expect(m).toBe(message);
        done();
      })
    });

    actor.send(message);
  })

});
