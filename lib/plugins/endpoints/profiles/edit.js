/* eslint no-reserved-keys: 0 */
/* eslint no-shadow: 0 */

'use strict';

var Profile = require('../../../models/profile');
var User = require('../../../models/user');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'PUT',
    path: '/profiles/{profileId}',
    config: {
      validate: {
        params: {
          profileId: Joi.string().hex().length(24)
        },
        payload: {
          firstName: Joi.string().min(2).required(),
          lastName: Joi.string().min(2).required(),
          photo: Joi.object().keys({
            base64: Joi.string(),
            filename: Joi.string(),
            filesize: Joi.number(),
            filetype: Joi.string()
          }),
          portfolio: Joi.array(),
          skills: Joi.array().required(),
          exposure: Joi.array().required(),
          bio: Joi.string().required(),
          location: Joi.string().required(),
          interests: Joi.array().required(),
          remote: Joi.boolean().required(),
          relocate: Joi.boolean().required(),
          locationPref: Joi.array().required(),
          education: Joi.string(),
          available: Joi.boolean(),
          contact: Joi.object().keys({
            email: Joi.string(),
            phone: Joi.string(),
            website: Joi.string()
          }),
          social: Joi.object().keys({
            github: Joi.string(),
            twitter: Joi.string(),
            linkedIn: Joi.string(),
            stackoverflow: Joi.string()
          })
        }
      },
      description: 'Create a profile',
      handler: function(request, reply){
        User.findOne({_id: request.auth.credentials._id}, function(err, user){
          if(err){ return reply().code(400); }
          if(user.role === 10){
            Profile.findByIdAndUpdate(request.params.profileId, request.payload, {new: true}, function(err, profile){
              return reply(profile).code(err ? 400 : 200);
            });
          }else{
            return reply().code(400);
          }
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'profiles.edit'
};
