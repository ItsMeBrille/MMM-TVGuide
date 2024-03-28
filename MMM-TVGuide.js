Module.register('MMM-TVGuide', {
  defaults: {},

  start: function () {
    this.sendSocketNotification('FETCH_TV_PROGRAMS');
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === 'TV_PROGRAMS') {
      this.processTVPrograms(payload);
    }
  },

  processTVPrograms: function (data) {
    // Process and display TV programs
    // Example: Iterate through data and create HTML to display listings
    const programs = data.data;
    // Your code to process and display TV programs
  },

  getStyles: function () {
    return ['MMM-TVGuide.css']; // Add CSS file if styling is needed
  }
});
