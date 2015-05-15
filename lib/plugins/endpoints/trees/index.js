'use strict';

var Tree = require('../../../models/tree');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/trees',
    config: {
      description: 'Get all trees for a particular user',
      handler: function(request, reply){
        Tree.find({ownerId: request.auth.credentials._id}, function(err, trees){
          return reply({trees: trees}).code(err ? 400 : 200);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'trees.index'
};
