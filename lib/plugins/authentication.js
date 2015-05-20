'use strict';

exports.register = function(server, options, next){
  var authenticate = {
    key: server.app.environment.LOCAL_SECRET,
    validateFunc: function(jwt, cb){
      console.log('hello!!!!!!!!!!!!!!!!!!');
      var past = jwt.iat;
      var now = Date.now() / 1000;
      var future = past + server.app.environment.LOCAL_EXPIRE * 3600;

      if(past < now && now < future){
        console.log(jwt.sub);
        return cb(null, true, {_id: jwt.sub});
      }

      return cb();
    }
  };

  server.expose({authenticate: authenticate});
  return next();
};

exports.register.attributes = {
  name: 'authentication'
};
