// Import required modules
const NodeHelper = require("node_helper");
const request = require("request");

// Create Node helper
module.exports = NodeHelper.create({
  start: function () {
    console.log("MMM-TVGuide helper started...");
  },

  // Handle any incoming socket notifications
  socketNotificationReceived: function (notification, payload) {
    // Check if the notification is to fetch schedule data
    if (notification === "GET_SCHEDULE") {
      this.getSchedule(payload);
    }
  },

  // Fetch TV schedule data
  getSchedule: function (config) {
    var self = this;

    // Create URL
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const url = `https://tvguide.vg.no/backend/api/tv-schedule?page=1&perPage=3&date=${formattedDate}&tz=Europe%2FOslo`;

    // Make request to fetch TV schedule data
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // Parse and send data as JSON
        var scheduleData = JSON.parse(body);
        self.sendSocketNotification("SCHEDULE_DATA", scheduleData.data);
      } else {
        // Report errors
        console.error("Error fetching TV schedule:", error);
      }
    });
  }
});
