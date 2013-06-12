describe('Blobber', function() {

  it('should be constructed', function() {
    var b = new Blobber();
    b.should.have.property('upload');
    b.should.have.property('download');
    b.should.have.property('uploadProgress');
  });

  it('should be able to download files', function(done) {
    var b = new Blobber();
    b.download('http://127.0.0.1:3000/test.png', false, function(err, file) {
      try {
        expect(err).to.equal(null, 'Error is not null');
        expect(file).to.be.instanceOf(File);
        return done();
      } catch (e) {
        return done(e);
      }
    });
  });

  it('should be able to upload files', function(done) {
    var b = new Blobber();

    b.download('http://127.0.0.1:3000/test.png', false, function(err, file) {
      try {
        expect(err).to.equal(null, 'Error is not null');
        expect(file).to.be.instanceOf(File);
      } catch (e) {
        return done(e);
      }

      b.upload('/in', {attachment : file}, function (err, res) {
        try {
          expect(err).to.equal(null, 'Error is not null');

          var jres = JSON.parse(res);
          expect(jres.type).to.equal('image/png');
          expect(jres.size).to.equal(5);
          expect(jres.name).to.equal('test.png');

          done();
        } catch (e) {
          return done(e);
        }
      });


    });

  });
});