'use strict';

var User = require('../../../models/user');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'POST',
    path: '/users',
    config: {
      // auth: false,
      validate: {
        payload: {
          email: Joi.string().email().lowercase().trim().required(),
          firstName: Joi.string(),
          lastName: Joi.string(),
          company: Joi.string(),
          role: Joi.number(),
          password: Joi.string().trim().required()
        }
      },
      description: 'Create a user',
      handler: function(request, reply){
        // make sure that the person doing this is an admin
        // if(user.role === 'admin')
        //

        User.register(request.payload, function(err, user){
          if(err || !user){return reply().code(400); }

          return reply(user);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'users.create'
};
