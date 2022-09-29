"use strict";
const Region = require("../data/regions");
const ValorantAPI = require("./ValorantAPI");
const { EventEmitter } = require("events");
const Regions = require("../data/regions");
const RSOModule = require("../modules/rsoModule");


/**
 * Creates a new Client instance that can be used to work with useful methods and properties.
 * @class Client
 * @param {object} options - Client options
 * @returns {Client}
 * @example
 * const client = new Client({
 *  api: api,
 *  statusListener: true,
 * }); // Create a new client instance
 */
class Client extends EventEmitter {
  constructor(
    options = {
      /**
       * The region you want to use. Default is "North America". You can use the Regions object to get the region you want. *This is only if you whant to create a new instance of the ValorantAPI class.*
       * @type {string}
       * @example
       * const client = new Client({
       *  region: Regions.Europe
       *  newAPIinstance: true
       * }); // Default region is "NorthAmerica"
       */
      region: Regions.NorthAmerica,
      /**
       * Your Valorant API key. *This is only required if you whant to create a new instance of the ValorantAPI class.*
       * @type {string}
       * @example
       * const client = new Client({newAPIinstance: true, api_key: "YOUR_API_KEY" });
       *
       */
      api_key,
      /**
       * If you whant to create a event listener for the status of the game. Default is false.
       * @type {boolean}
       * @example
       * const client = new Client({statusListener: true});
       * client.on("maintenance", (maintenance) => {
       *  console.log(maintenance);
       * })
       * client.on("incident", (incident) => {
       *  console.log(incident);
       * })
       */
      statusListener: false,
      /**
       * Define if you want to create a new instance of the ValorantAPI class. Default is false. If you set this to true you have to provide an api_key and a region.
       * @type {boolean}
       * @example
       * const client = new Client({newAPIinstance: true, api_key: "YOUR_API_KEY", region: Regions.Europe });
       * // or if you already have an instance of the ValorantAPI class
       * const client = new Client({api: api});
       */
      newAPIinstance: false,
      /**
       * The instance of the ValorantAPI class. *This is only required if you whant to use an existing instance of the ValorantAPI class.*
       * @type {ValorantAPI}
       * @example
       * const client = new Client({api: api});
       */
      api: null,
      /**
       * The intervall of the status listener. Default is to 10 minutes you can change it but keep in mind that a shorter intevall is not good because of riots ratelimit.
       * @type {number}
       * @example
       * const client = new Client({statusListener: true, intervall: 5}); // input the time in minutes
       */
      statusListenerIntervall: 10,
      /**
       * If your application is using RSO you can use this module to handle the RSO flow for you. Default is false.
       * @type {boolean}
       * @example
       * const client = new Client({rso: true});
       */
      enableRSOModule: false,
      /**
       * Provide the options for the RSO Module
       * @type {object}
       * @example
       * const client = new Client({
       *  rso:true
       *  rsoModuleOptions:{
       *    clientID: "*the clientID of the application*",
       *    clientSecret: "*the secret of the application*",
       *    redirectURI: "the redirect URL that is used by riotgames"
       *  }
       * })
       */
      rsoModuleOptions: {
        /**
         * The cientID of the application
         * @type {string}
         */
        clientID,
        /**
         * The secret of the application
         * @type {string}
         */
        clientSecret,
        /**
         * The redirect URL that is used by riotgames
         * @type {string}
         */
        redirectURI,
        port,
        existingExpressApp:false,
        expressApp:null
      },
    }
  ) {
    super();
    this.api;
    this.RSOModule;
    if (options.newAPIinstance) {
      this.api_key = options.api_key;
      this.region = region;
      if (!this.api_key) {
        throw new Error("No Api Key provided");
      }

      this.api = new ValorantAPI(this.api_key, this.region);
    } else {
      this.api = options.api;
    }

    this.statusCheck = options.statusListener;
    if (this.statusCheck) {
      this.intervall = options.statusListenerIntervall || 10;

      this.intervallInMS = this.intervall * 60 * 1000;
      this.initStatusInterval();
    }
    if (options.enableRSOModule) {
      if (
        !options.rsoModuleOptions.clientID ||
        !options.rsoModuleOptions.clientSecret ||
        !options.rsoModuleOptions.redirectURI
      )
        throw new Error(
          "You need to provide all RSO module options to use the module"
        );
          
      this.initRSOModule(options.rsoModuleOptions);
    }
  }
  initStatusInterval() {
    setInterval(async () => {
      
      const status = await this.api.getStatus();

      if (status.maintenances.length > 0) {
        this.emit("maintenance", status.maintenances[0]);
      } else if (status.incidents.length > 0) {
        this.emit("incident", status.incidents[0]);
      }
    }, this.intervallInMS);
  }
  initRSOModule(options) {
    if(!options.existingExpressApp){
    const optionsSend = {
      clientID: options.clientID,
      clientSecret: options.clientSecret,
      redirectURI: options.redirectURI,
      port: 3001,
      existingExpressApp:false
    }
    this.RSOModule = new RSOModule(
      optionsSend
      
    );
    }else{
      const optionsToSend= {
        clientID: options.clientID,
        clientSecret: options.clientSecret,
        redirectURI: options.redirectURI,
        existingExpressApp:true,
        expressApp:options.expressApp

      }
      this.RSOModule = new RSOModule(
        options
      );
    }
  }
}

module.exports = Client;
