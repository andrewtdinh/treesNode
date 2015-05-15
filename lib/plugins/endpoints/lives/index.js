'use strict';

var Life = require('../../../models/life');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/lives',
    config: {
      description: 'Show all lives',
      handler: function(request, reply){
        Life.find(function(err, lives){
          return reply({lives: lives}).code(err ? 400 : 200);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'lives.index'
};
