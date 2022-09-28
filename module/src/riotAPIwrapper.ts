"use strict";

import axios from "axios";
import { Regions } from "../data/regions";

console.log(Regions);

/**
 * Init the Riot Api class to interact with the Riot Api
 * @class ApiWrapper
 * @param {string} apiKey - The Riot Api Key
 * @param {string} region - The region to use default set to NA
 */

export class ApiWrapper {
  apiKey: string;
  region: string;
  constructor(apiKey: string, region = Regions.NorthAmerica) {
    this.apiKey = apiKey;
    this.region = region;
  }
}
