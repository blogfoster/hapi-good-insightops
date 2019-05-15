# hapi-good-insightops

Good Reporter for InsightOps, formerly known as LogEntries. This is uses
the recent [r7insight_node](https://www.npmjs.com/package/r7insight_node) package.

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


## License

[MIT](LICENSE)


