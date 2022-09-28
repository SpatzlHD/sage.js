"use strict";
const Region = require("../data/regions");
const ValorantAPI = require("./ValorantAPI");
const { EventEmitter } = require("events");

class Client extends EventEmitter {
  constructor(api_key, region = Region.NorthAmerica) {
    super();
    this.api_key = api_key;
    this.region = region;
    if (!this.api_key) {
      throw new Error("No Api Key provided");
    }
    this.intervall = 10;
    this.intervallInMS = this.intervall * 60 * 1000;
    this.api = new ValorantAPI(this.api_key, this.region);
    this.initInterval()
    
  }
  initInterval(){
    setInterval(async () => {
      const status = await this.api.getStatus();
      if (status.maintenances.length > 0) {
        this.emit("maintenance", status.maintenances[0]);
      } else if (status.incidents.length > 0) {
        this.emit("incident", status.incidents[0]);
      }
      
    }, this.intervall);
  }
  test(){
    this.emit("test","Das ist ein Test")
  }
}

module.exports = Client;
