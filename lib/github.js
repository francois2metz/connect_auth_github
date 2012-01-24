var auth = require('connect-auth')
, request = require('request')
;

function GithubRequest(user) {
    this.user = user;
}
GithubRequest.prototype = {
    request: function(path, callback) {
        request({
            url: 'https://api.github.com/'+ path +'?access_token='+ this.user.token}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                callback(null, body)
            } else {
                callback(response, null);
            }
        })
    },

    orgAccess: function(name, callback) {
        var user = this.user;
        this.request('orgs/'+ name +'/members', function(err, orgs) {
            if (err) return console.log(err) && callback(false);

            orgs = JSON.parse(orgs);
            var users = orgs.map(function(org) { return org.login });

            if (users.indexOf(user.login) == -1) callback(false);
            else callback(true);
        })
    }
}


var githubAuthMiddleware = function() {
    return function(req, res, next) {
        req.authenticate(['github'], function(error, authenticated) {
            if (error) {
                // Something has gone awry, behave as you wish.
                console.log(error);
                res.end();
            }
            else {
                if (authenticated === undefined) {
                    // The authentication strategy requires some more browser interaction, suggest you do nothing here!
                } else {
                    if (req.isAuthenticated()) {
                        var token = req.session["access_token"];
                        var user = req.getAuthDetails().user;
                        user.token = token;
                        req.github_user = user;
                        req.github = new GithubRequest(user);
                        next();
                    }
                    else console.log('not authenticated') && res.end();
                }
            }});
    }
};

function githubOrgAccess(name) {
    return function(req, res, next) {
        req.github.orgAccess(name, function(access) {
            if (access) next();
            else res.end();
        });
    }
}

module.exports = function connect(options) {
    var server = auth({strategies:[auth.Github({appId : options.appId,
                                                appSecret: options.appSecret,
                                                callback: options.callback})],
                       trace: (options.debug || false)});
    server.use(githubAuthMiddleware());
    return server;
}

module.exports.orgAccess = function(options, name) {
    var server = module.exports(options);
    server.use(githubOrgAccess(name));
    return server;
}
