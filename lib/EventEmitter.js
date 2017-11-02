const events = require('events');
const _EMITTER = new events.EventEmitter();
_EMITTER.id = Math.random();

module.exports = _EMITTER;