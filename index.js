var colors = require('colors');
var moment = require('moment');

var eventHandlers = {

  /**
   * On a new outage
   * @param service
   * @param outage
   */

  onNewOutage: function (service, outage) {
    var errorMsg = service.name + ' down!'.red + '. Error: ' + JSON.stringify(outage.error).red;
    console.log(errorMsg);
  },

  /**
   * Failed ping on an existing outage
   * @param service
   * @param outage
   */

  onCurrentOutage: function (service, outage) {
    var errorMsg = service.name + ' is still down!'.red + '. Error: ' + JSON.stringify(outage.error).red;
    console.log(errorMsg);
  },

  /**
   * Warning alert
   * @param service
   * @param data.elapsedTime ms
   */

  onLatencyWarning: function (service, data) {
    var msg = service.name + ' latency warning'.yellow + '. Took: ' + (data.elapsedTime + ' ms.').yellow;
    console.log(msg);
  },

  /**
   * Service is back online
   * @param service
   * @param lastOutage
   */

  onServiceBack: function (service, lastOutage) {
    var duration = moment.duration(+new Date() - lastOutage.timestamp, 'seconds');
    console.log(service.name.white + ' is back'.green + '. Down for '.gray + duration.humanize().white);
  },

  /**
   * Service is responding correctly
   * @param service
   * @param data
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

  watchmen.on('latency-warning', eventHandlers.onLatencyWarning);
  watchmen.on('service-back', eventHandlers.onServiceBack);
  watchmen.on('service-ok', eventHandlers.onServiceOk);
}

exports = module.exports = ConsolePlugin;