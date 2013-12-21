describe('Headroom', function() {

  it('Create actor', function() {
    var res = false;

    runs(function () {
      JActor.go(function() {
        res = true;
      });
    });

    waits(100);

    runs(function () {
      expect(res).toBeTruthy()
    });


  });

});
