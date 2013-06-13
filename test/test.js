/* global describe:true, it:true, expect:true, Blobber:true, File:true */
describe('Blobber', function() {

  it('should be constructed', function() {
    var b = new Blobber();
    b.should.have.property('upload');
    b.should.have.property('download');
    b.should.have.property('uploadProgress');
  });

  it('should be able to download files', function(done) {
    var b = new Blobber();
    b.download('/test.png', false, function(err, file) {
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

    b.download('/test.png', false, function(err, file) {
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


  it('should callback after 404 while uploading', function(done) {
    var b = new Blobber();
    b.download('/test.png', false, function(err, file) {
      b.upload('/in/404', {attachment : file}, function (err, res) {
        try {
          expect(err).to.equal(404, 'Error is not 404');
          done();
        } catch (e) {
          return done(e);
        }
      });
    });
  });

  it('should callback after connection breaking while downloading', function(done) {
    var b = new Blobber();
    b.download('/out/break', false, function(err, file) {
      try {
        expect(err).to.equal(-1, 'Error is not -1');
        done();
      } catch (e) {
        return done(e);
      }
    });
  });

  it('should callback after connection breaking while uploading', function(done) {
    var b = new Blobber();
    b.download('/test.png', false, function(err, file) {
      b.upload('/in/break', {attachment : file}, function (err, res) {
        try {
          expect(err).to.equal(-1, 'Error is not -1');
          done();
        } catch (e) {
          return done(e);
        }
      });
    });
  });



});