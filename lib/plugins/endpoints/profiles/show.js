'use strict';

var Profile = require('../../../models/profile');
var Joi = require('joi');
var User = require('../../../models/user');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/profiles/{profileId}',
    config: {
      validate: {
        params: {
          profileId: Joi.string().hex().length(24).required()
        }
      },
      description: 'get a single profile and restrict data for viewers',
      handler: function(request, reply){
        User.findById(request.auth.credentials._id, function(er, user){
          if(!user || er){ return reply().code(400); }
            Profile.find(function(err, profiles){
              var result = {};
              profiles.forEach(function(profile, index){
                if(profile._id == request.params.profileId){
                  result.profile = profile;
                  result.next = profiles[index + 1] ? profiles[index + 1]._id : null;
                  result.prev = profiles[index - 1] ? profiles[index - 1]._id : null;
                  if(user.role < 5){
                    result.profile.lastName = null;
                    result.profile.contact = null;
                    result.profile.social = null;
                }
              }
              });
              return reply(result).code(err ? 400 : 200);
            });
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'profiles.show'
};
