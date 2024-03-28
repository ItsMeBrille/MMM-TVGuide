Module.register("MMM-TVGuide", {
  defaults: {
    channels: ["NRK1", "TV 2 Direkte"], // Default list of channels
    firstTime: "19:00", // Default time to filter from
    maxElements: 5, // Default maximum number of elements to show (ca. 3 * `channels` length)
    updateInterval: 6 // Update interval in hours
  },

  start: function () {
    this.schedule = [];
    this.getData();
  },

  getData: function () {
    this.sendSocketNotification("GET_SCHEDULE", this.config);
    var self = this;
    setTimeout(function () {
      self.getData();
    }, self.config.updateInterval * 3600000); // Fetch data every `updateInterval` hours
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "SCHEDULE_DATA") {
      this.schedule = payload;
      this.updateDom();
    }
  },

  getStyles: function () {
    return ["MMM-TVGuide.css"];
  },

  getDom: function () {
    var wrapper = document.createElement("table");
    wrapper.className = "tv-schedule";

    if (this.schedule.length === 0) {
      var row = document.createElement("tr");
      var cell = document.createElement("td");
      cell.innerHTML = "Laster...";
      row.appendChild(cell);
      wrapper.appendChild(row);
      return wrapper;
    }

    var filteredSchedule = this.filterSchedule(this.schedule);
    var allListings = filteredSchedule.reduce(function (accumulator, channel) {
      return accumulator.concat(channel.listings.map(function (listing) {
        listing.channelName = channel.channel.name;
        return listing;
      }));
    }, []);

    allListings.sort(function (a, b) {
      return new Date(a.startsAt) - new Date(b.startsAt);
    });

    var maxElements = Math.min(allListings.length, this.config.maxElements); // Limit the number of elements to show
    for (var i = 0; i < maxElements; i++) {
      var listing = allListings[i];
      var row = document.createElement("tr");

      var channelCell = document.createElement("td");
      channelCell.innerHTML = listing.channelName;

      var titleCell = document.createElement("td");
      titleCell.innerHTML = listing.title.title;

      var timeCell = document.createElement("td");
      var startTime = new Date(listing.startsAt).toLocaleTimeString('no-NO', { timeStyle: 'short' });
      var endTime = new Date(listing.endsAt).toLocaleTimeString('no-NO', { timeStyle: 'short' });
      timeCell.innerHTML = startTime + " - " + endTime;

      row.appendChild(channelCell);
      row.appendChild(titleCell);
      row.appendChild(timeCell);

      wrapper.appendChild(row);
    }

    return wrapper;
  },

  filterSchedule: function (schedule) {
    var self = this;
    var firstTimeParts = self.config.firstTime.split(":");
    var filterDate = new Date();
    filterDate.setHours(parseInt(firstTimeParts[0]));
    filterDate.setMinutes(parseInt(firstTimeParts[1]));

    var currentTime = new Date();

    return schedule.filter(function (channel) {
      return self.config.channels.includes(channel.channel.name);
    }).map(function (channel) {
      channel.listings = channel.listings.filter(function (listing) {
        var startTime = new Date(listing.startsAt);
        var endTime = new Date(listing.endsAt);
        return (currentTime >= startTime && currentTime <= endTime) || (startTime >= filterDate && startTime > currentTime);
      });
      return channel;
    }).filter(function (channel) {
      return channel.listings.length > 0;
    });
  }
});
