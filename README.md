# connect_auth_github

Like https://github.com/atmos/sinatra_auth_github but for connect.

**Warning: The API is not yet complete**

## Install

    npm install connect_auth_github

## Usage

```javascript
var connect = require('connect');

var server = connect.createServer(
    connect.cookieParser(),
    connect.session({ secret: 'keyboard cat' }),
    github({
        appId: "app-id",
        appSecret: "app-secret",
        callback: "http://localhost/auth/github_callback"
      })
);
```

### Authenticate and ensure the user have access to the org 'foo'

```javascript
var connect = require('connect');

var server = connect.createServer(
    connect.cookieParser(),
    connect.session({ secret: 'keyboard cat' }),
    github.orgAccess({
        appId: "app-id",
        appSecret: "app-secret",
        callback: "http://localhost/auth/github_callback"
      }, 'foo')
);
```

## License

(c) 2012 François de Metz

Mainly inspired by [atmos's](https://github.com/atmos) [sinatra_auth_github](https://github.com/atmos/sinatra_auth_github).

BSD
