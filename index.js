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

const levelTags = [
  'debug',
  'info',
  'notice',
  'warning',
  'err',
  'error',
  'crit',
  'alert',
  'emerg',
];

class GoodInsightOps extends Stream.Writable {
  constructor(config) {
    super({ objectMode: true, decodeStrings: true });
    this.logger = new Logger(config);
    this.minLevel = config.minLevel || 1;
  }

  _write(event, encoding, callback) {
    const { event: type } = event;

    if (handlers.includes(type) && defaultLevels[type] >= this.minLevel) {
      const logLevel = event.tags
        ? GoodInsightOps._mapTagToLevel(event.tags) || defaultLevels[type]
        : defaultLevels[type];
      this.log(logLevel, event);
    }
    callback();
  }

  static _mapTagToLevel(tags) {
    for (let tag of tags) {
      if (levelTags.includes(tag)) {
        // 'error' is a convenience, insightOpts only knows "err"
        return tag === 'error' ? 'err' : tag;
      }
    }
    return null;
  }

  log(lvl, payload) {
    try {
      this.logger.log(lvl, payload);
    } catch (err) {
      // Lambda plays dirty with sockets, so we ignore this error
      if (err.message !== 'write after end') throw err;
    }
  }
}

module.exports = GoodInsightOps;
