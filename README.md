# hapi-good-insightops

Good Reporter for InsightOps, formerly known as LogEntries. This is uses
the recent [r7insight_node](https://www.npmjs.com/package/r7insight_node) package.

Was tested with:

- Hapi 16.7.0 and Good 7.3.0
- Hapi 17.8.1 and Good 8.1.1

## Installation

```bash
$ npm install --save hapi-good-insightops
```

## Usage

```javascript
const Hapi = require('hapi')
const GoodInsightOps = require('hapi-good-insightops')
const server = new Hapi.Server()


// the options object is passed through to the insightOps logger. You have full access
// to all configuration as noted in the r7insight_node docs 
const insightOpsOptions = {
  minLevel: 1,
  token: '<your token>',
  region: 'eu'  
}

const goodOptions = {
  reporters: {
    insightOps: [new GoodInsightOps(insightOpsOptions)]
    }
}

server
  .register({
    plugin: require('good'),
    goodOptions
  })
  .then(() => {
    return server.start()
  })
  .then(() => {
    console.info(`Server started at ${server.info.uri}`)
  })
```

## About log levels

The plugin translates between Hapi.js events like `ops`, `request` & `response` and the InsightOps log levels.
See the [defaultLevels](https://github.com/blogfoster/hapi-good-insightops/blob/master/index.js#L7) object in the code.

When directly using [Hapi's logging feature](https://hapijs.com/tutorials/logging?lang=en_US), i.e. `server.log()` and
`request.log()`,  you can add tags to inform the plugin what log level to use. For example:

```javascript
server.log(['error'], 'something broke!')
server.log(['debug','tag2'], 'this is a debug statement with another tag')
server.log(['emerg'], 'no clue what emerg means')
```

Valid tags are the standard insightOps log levels with `error` added for convenience.

```
debug
info
notice
warning
err
error
crit
alert
emerg
```

## License

[MIT](LICENSE)


