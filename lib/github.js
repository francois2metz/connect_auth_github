var auth = require('connect-auth')

var github_auth_middleware = function() {
    return function(req, res, next) {
        req.authenticate(['github'], function(error, authenticated) {
            if(error) {
                // Something has gone awry, behave as you wish.
                console.log( error );
                res.end();
            }
            else {
                if( authenticated === undefined ) {
                    // The authentication strategy requires some more browser interaction, suggest you do nothing here!
                } else {
                    if (req.isAuthenticated()) {
                        // check github auth
                        next();
                    }
                    else console.log('not authenticated') && res.end();
                }
            }});
    }
};

module.exports = function connect(options) {
    var server = auth({strategies:[auth.Github({appId : options.appId,
                                                appSecret: options.appSecret,
                                                callback: options.callback})],
                       trace: true});        
    server.use(github_auth_middleware());
    return server;
}
