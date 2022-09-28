"use strict";

const axios = require("axios");
const Regions = require("../data/regions");
const Local = require("../data/local");

/**
 * Init the Riot Api class to interact with the Riot Api
 * @class ApiWrapper
 * @param {string} apiKey - The Riot Api Key
 * @param {string} region - The region to use default set to NA
 */

class ApiWrapper {
  constructor(apiKey, region = Regions.NorthAmerica) {
    this.apiKey = apiKey;
    this.region = region;
    this.local = false;
    if (!this.apiKey) {
      throw new Error("No Api Key provided");
    }
    axios.defaults.headers.common["X-Riot-Token"] = this.apiKey;
    axios.defaults.baseURL = `https://${this.region.toLowerCase()}.api.riotgames.com/val/`;
  }
  /**
   * Get Content of the game
   * @returns {Promise<ContentObject>} - The content of the game
   * @memberof ApiWrapper
   * @example const data = await api.getContent();
   * console.log(data);
   * 
   **/
  async getContent() {
    const url = "content/v1/contents";
    const response = await axios.get(url);
    return response.data;
    // axios
    //   .get(url)
    //   .then((res) => {
    //     console.log(res.data);
    //     return res.data;
    //   })
    //   .catch((err) => {
    //     throw new Error(err);
    //   });
  }
}

module.exports = ApiWrapper;
