var colors = require('colors');
var moment = require('moment');

var eventHandlers = {

  /**
   * On a new outage
   * @param {Object} service
   * @param {Object} outage
   * @param {Object} outage.error check error
   * @param {number} outage.timestamp outage timestamp
   */

  onNewOutage: function (service, outage) {
    var errorMsg = service.name + ' down!'.red + '. Error: ' + JSON.stringify(outage.error).red;
    console.log(errorMsg);
  },

  /**
   * Failed ping on an existing outage
   * @param {Object} service
   * @param {Object} outage
   * @param {Object} outage.error check error
   * @param {number} outage.timestamp outage timestamp
   */

  onCurrentOutage: function (service, outage) {
    var errorMsg = service.name + ' is still down!'.red + '. Error: ' + JSON.stringify(outage.error).red;
    console.log(errorMsg);
  },

  /**
   * Failed check (it will be an outage or not according to service.failuresToBeOutage
   * @param {Object} service
   * @param {Object} data
   * @param {Object} data.error check error
   * @param {number} data.currentFailureCount number of consecutive check failures
   */

  onFailedCheck: function (service, data) {
    var errorMsg = service.name + ' check failed!'.red + '. Error: ' + JSON.stringify(data.error).red;
    console.log(errorMsg);
  },

  /**
   * Warning alert
   * @param {Object} service
   * @param {Object} data
   * @param {number} data.elapsedTime (ms)
   */

  onLatencyWarning: function (service, data) {
    var msg = service.name + ' latency warning'.yellow + '. Took: ' + (data.elapsedTime + ' ms.').yellow;
    console.log(msg);
  },

  /**
   * Service is back online
   * @param {Object} service
   * @param {Object} lastOutage
   * @param {Object} lastOutage.error
   * @param {number} lastOutage.timestamp (ms)
   */

  onServiceBack: function (service, lastOutage) {
    var duration = moment.duration(+new Date() - lastOutage.timestamp, 'seconds');
    console.log(service.name.white + ' is back'.green + '. Down for '.gray + duration.humanize().white);
  },

  /**
   * Service is responding correctly
   * @param {Object} service
   * @param {Object} data
   * @param {number} data.elapsedTime (ms)
   */

  onServiceOk: function (service, data) {
    var serviceOkMsg = service.name + ' responded ' + 'OK!'.green;
    var responseTimeMsg = data.elapsedTime + ' ms.';
    console.log(serviceOkMsg, responseTimeMsg.gray);
  }
};

function ConsolePlugin(watchmen) {
  watchmen.on('new-outage', eventHandlers.onNewOutage);
  watchmen.on('current-outage', eventHandlers.onCurrentOutage);
  watchmen.on('service-error', eventHandlers.onFailedCheck);

  watchmen.on('latency-warning', eventHandlers.onLatencyWarning);
  watchmen.on('service-back', eventHandlers.onServiceBack);
  watchmen.on('service-ok', eventHandlers.onServiceOk);
}

exports = module.exports = ConsolePlugin;