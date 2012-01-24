var connect = require('connect')
, github = require(__dirname +'/../')
;

var server = connect.createServer(
    connect.cookieParser(),
    connect.session({ secret: 'keyboard cat' }),
    github({
        appId: "",
        appSecret: "",
        callback: "http://localhost:9001/auth/github_callback"
    }),
    connect.router(function(app){
        app.get('/', function(req, res, next) {
            res.end('Hello There, '+ req.github.user.name  +'!'+ req.github.user.token +"\n");
        });
        app.get('/orgs/:id', function(req, res, next){
            // populates req.params.id
            req.github.orgAccess(req.params.id, function(access) {
                if (!access) return res.end('unauthorized')
                res.end('Hello.')
            })
        });
    })
);

server.listen(9001, function() {
    console.log('server listen at http://localhost:9001');
});
