const NodeHelper = require("node_helper");
const request = require("request");

module.exports = NodeHelper.create({
    start: function () {
        console.log("MMM-TVGuide helper started...");
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "GET_SCHEDULE") {
            this.getSchedule(payload);
        }
    },

    getSchedule: function (config) {
        var url = "https://tvguide.vg.no/backend/api/tv-schedule?page=1&perPage=3&date=2024-03-28&tz=Europe%2FOslo";
        var self = this;

        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var scheduleData = JSON.parse(body);
                self.sendSocketNotification("SCHEDULE_DATA", scheduleData.data);
            } else {
                console.error("Error fetching TV schedule:", error);
            }
        });
    }
});
