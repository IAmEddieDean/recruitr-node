'use strict';

var User = require('../../../models/user');
var Joi = require('joi');
var Bcrypt = require('bcrypt');

exports.register = function(server, options, next){
  server.route({
    method: 'PUT',
    path: '/users/{userId}',
    config: {
      validate: {
        params: {
          userId: Joi.string().hex().length(24).required()
        },
        payload: {
          email: Joi.string().email().lowercase().trim(),
          password: Joi.string().trim(),
          role: Joi.number(),
          createdAt: Joi.date(),
          firstName: Joi.string(),
          lastName: Joi.string(),
          company: Joi.string()
        }
      },
      description: 'Edit a user',
      handler: function(request, reply){
        User.findById(request.auth.credentials._id, function(err, user){
          if(err || user.role < 10){
            return reply().code(400);
          }
          User.findOne({_id: request.params.userId}, function(error, validUser){
            if(!validUser || error){ return reply().code(400); }
            validUser.email = request.payload.email;
            if(validUser.password){
              validUser.password = Bcrypt.hashSync(request.payload.password, 8);
            }
            validUser.firstName = request.payload.firstName;
            validUser.lastName = request.payload.lastName;
            validUser.company = request.payload.company;
            validUser.role = request.payload.role;
            validUser.save(function(er, savedUser){
              return reply(savedUser).code(er ? 400 : 200);
            });
          });
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'users.edit'
};
