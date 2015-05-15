/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var CP = require('child_process');
var Path = require('path');
var Sinon = require('sinon');
var Server = require('../../../../lib/server');
var Tree = require('../../../../lib/models/tree');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var beforeEach = lab.beforeEach;
var after = lab.after;

var server;

describe('PUT /trees/{treeId}/grow', function(){
  before(function(done){
    Server.init(function(err, srvr){
      if(err){ throw err; }
      server = srvr;
      done();
    });
  });

  beforeEach(function(done){
    var db = server.app.environment.MONGO_URL.split('/')[3];
    CP.execFile(Path.join(__dirname, '../../../../scripts/clean-db.sh'), [db], {cwd: Path.join(__dirname, '../../../../scripts')}, function(){
      done();
    });
  });

  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });

  it('should grow the tree', function(done){
    server.inject({method: 'PUT', url: '/trees/f00000000000000000000002/grow', credentials: {_id: 'a00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.health).to.be.within(75, 100);
      expect(response.result.height).to.be.within(200, 250);
      done();
    });
  });

  it('should cause damage', function(done){
    var stub = Sinon.stub(Math, 'random');
    stub.onCall(0).returns(0).onCall(1).returns(0.5);
    server.inject({method: 'PUT', url: '/trees/f00000000000000000000002/grow', credentials: {_id: 'a00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.health).to.equal(87);
      stub.restore();
      done();
    });
  });

  it('should cause grow', function(done){
    var stub = Sinon.stub(Math, 'random');
    stub.onCall(0).returns(0.99).onCall(1).returns(0.7);
    server.inject({method: 'PUT', url: '/trees/f00000000000000000000002/grow', credentials: {_id: 'a00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.height).to.equal(235);
      stub.restore();
      done();
    });
  });

  it('should cause db error', function(done){
    var stub = Sinon.stub(Tree, 'findOne').yields(new Error());
    server.inject({method: 'PUT', url: '/trees/f00000000000000000000002/grow', credentials: {_id: 'a00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
  it('should cause the odds to be more than 0.9', function(done){
    server.inject({method: 'PUT', url: '/trees/f00000000000000000000005/grow', credentials: {_id: 'a00000000000000000000002'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.health).to.be.within(75, 100);
      expect(response.result.height).to.be.within(46000, 46050);
      done();
    });
  });
  it('should cause the tree height to be capped at 50000', function(done){
    var stub = Sinon.stub(Math, 'random');
    stub.onCall(0).returns(0.99);
    server.inject({method: 'PUT', url: '/trees/f00000000000000000000004/grow', credentials: {_id: 'a00000000000000000000002'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.height).to.equal(50000);
      stub.restore();
      done();
    });
  });
});
