const Logger = require('r7insight_node');
const Stream = require('stream');

const handlers = ['log', 'error', 'request', 'response', 'ops'];

// maps Good event types to insightOps log levels. See https://github.com/rapid7/r7insight_node#log-levels
const defaultLevels = {
  ops: 0,
  response: 1,
  log: 1,
  error: 4,
  request: 1,
};

class GoodInsightOps extends Stream.Writable {
  constructor(config) {
    super({ objectMode: true, decodeStrings: true });
    this.logger = new Logger(config);
    this.minLevel = config.minLevel || 1;
  }

  _write(event, encoding, callback) {
    const { event: type } = event;

    if (handlers.includes(type) && defaultLevels[type] >= this.minLevel) {
      this.log(defaultLevels[type], event);
    }
    callback();
  }

  log(lvl, payload) {
    this.logger.log(lvl, payload);
  }
}

module.exports = GoodInsightOps;
