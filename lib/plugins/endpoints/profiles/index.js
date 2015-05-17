'use strict';

var Profile = require('../../../models/profile');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/profiles',
    config: {
      description: 'get a list of profiles',
      handler: function(request, reply){
        var queryObj = request.query;
        var pageNum = queryObj.page;
        var limitPerPage = 10;
        var skill = queryObj.skill ? queryObj.skill : null;
        var locationPref = queryObj.locationPref ? queryObj.locationPref : null;
        console.log(skill, 'skillllllllllllllllllllllllllllllls');

        Profile.find(function(e, p){
          if(e){ return reply().code(400); }
          var totalLength = p.length;
          Profile.find({$or: [
            {skills: {$all: queryObj.skill}},
            {locationPref: {$all: locationPref}},
            {relocate: queryObj.relocate}
            ]},
            function(err, profiles){
            if(err){ return reply().code(400); }
            return reply({profiles: profiles, total: totalLength});
          }).limit(limitPerPage).skip((pageNum - 1) * limitPerPage);
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'profiles.index'
};
