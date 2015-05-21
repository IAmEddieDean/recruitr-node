/* eslint handle-callback-err: 0 */
'use strict';

var Profile = require('../../../models/profile');
var User = require('../../../models/user');

function scrubData(profiles){
  profiles = profiles.map(function(p){
    p.lastName = null;
    return p;
  });
  return profiles;
}

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
        var totalLength = 0;
        var userLevel = false;
        User.findById(request.auth.credentials._id, function(err, user){
          userLevel = user.role > 4 ? true : false;
        });
        if(queryObj.skill || queryObj.locationPref || queryObj.relocate){
          Profile.find({$or: [
            {skills: {$all: queryObj.skill}},
            {locationPref: {$all: queryObj.locationPref}},
            {relocate: queryObj.relocate}
          ]},
          function(err, profiles){
            totalLength = profiles.length;
            profiles = userLevel ? profiles : scrubData(profiles);
            return reply({profiles: profiles, total: totalLength});
          }).limit(limitPerPage).skip((pageNum - 1) * limitPerPage);
        }else{
          Profile.find(function(err2, allProfiles){
            totalLength = allProfiles.length;
            allProfiles = userLevel ? allProfiles : scrubData(allProfiles);
            return reply({profiles: allProfiles, total: totalLength});
          }).limit(limitPerPage).skip((pageNum - 1) * limitPerPage);
        }
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'profiles.index'
};
