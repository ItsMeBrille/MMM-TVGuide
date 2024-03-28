const NodeHelper = require('node_helper');
const request = require('request');

module.exports = NodeHelper.create({
  start: function () {
    console.log('TVGuide module helper started...');
  },

  fetchTVPrograms: function () {
    const url = 'https://tvguide.vg.no/backend/api/tv-schedule?page=1&perPage=3&date=2024-03-28&tz=Europe%2FOslo';
    request(url, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const data = JSON.parse(body);
        this.sendSocketNotification('TV_PROGRAMS', data);
      } else {
        console.error('Failed to fetch TV programs:', error);
      }
    });
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === 'FETCH_TV_PROGRAMS') {
      this.fetchTVPrograms();
    }
  }
});
