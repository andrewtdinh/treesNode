'use strict';

var Tree = require('../../../models/tree');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'PUT',
    path: '/trees/{treeId}/grow',
    config: {
      validate: {
        params: {
          treeId: Joi.string().hex().length(24).required()
        }
      },
      description: 'Grow a tree',
      handler: function(request, reply){
        Tree.findOne({ownerId: request.auth.credentials._id, _id: request.params.treeId}, function(err, tree){
          if(err){ return reply().code(400); }
          var max = 50000;
          var height = tree.height;
          var odds = height / max;
          var isDead = false;
          if(odds > 0.9){
            odds = 0.9;
          }
          var roll = Math.random();
          if(roll < odds){
            // damage
            tree.health -= Math.floor(Math.random() * 26);
            if(tree.health < 0){
              isDead = true;
            }
          }else{
            // grow
            tree.height += Math.floor(Math.random() * 51);
            if(tree.height > 50000){
              tree.height = 50000;
            }
          }
          if(isDead){
            tree.remove(function(){
              return reply(tree);
            });
          }else{
            tree.save(function(){
              return reply(tree);
            });
          }
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'trees.grow'
};
