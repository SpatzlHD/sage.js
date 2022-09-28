"use strict";

const axios = require("axios");
const Regions = require("../data/regions");
const Locale = require("../data/locale");
const Queue = require("../data/queue");
const ApiErrorHandler = require("../handler/apiErrorHandler");

/**
 * Init the Riot Api class to interact with the Riot Api
 * *Learn more about the Riotgames Valorant Api here: https://developer.riotgames.com/docs/valorant*
 * @class ValorantAPI
 * @param {string} apiKey - The Riot Api Key
 * @param {string} region - The region to use default set to NA
 * @example const api = new ValorantAPI("*Your API Key**", Regions.NorthAmerica);
 * //get a Match by match id
 * const MatchData = await api.match.getByID("**Match ID**");
 * console.log(MatchData);
 */

class ValorantAPI {
  constructor(apiKey, region = Regions.NorthAmerica) {
    this.apiKey = apiKey;
    this.region = region;
    this.locale = false;
    if (!this.apiKey) {
      throw new Error("No Api Key provided");
    }

    axios.defaults.headers.common["X-Riot-Token"] = this.apiKey;
    axios.defaults.baseURL = `https://${this.region.toLowerCase()}.api.riotgames.com/val/`;
  }
  /**
   * Get Content of the game
   * @returns {Promise<>} - The content of the game
   * @memberof ValorantAPI
   * @example const data = await api.getContent();
   * console.log(data);
   *
   **/
  async getContent() {
    if (this.local) {
      if (!Locale[this.locale])
        throw new Error("Invalid Local language key provided");
      if (Locale[this.local] != this.locale)
        throw new Error(
          "The Local Language key doesn't match the correct format you have to specify the local key in! Try doing it like this: en_US or use the Local object provided by this package"
        );
      try {
        const url = `content/v1/contents?locale=${this.locale}`;
        const { data } = await axios.get(url);
        return data;
      } catch (e) {
        new ApiErrorHandler(e).handle();
      }
    }
    try {
      const url = "content/v1/contents";
      const { data } = await axios.get(url);
      return data;
    } catch (e) {
      throw new Error(e);
    }
  }
  match = {
    /**
     * Get Match by Match ID
     * Read more about the Match Data Object here: https://developer.riotgames.com/apis#val-match-v1/GET_getMatch
     * *Please note that you can use this endpoint only with a production API key*.
     * @param {string} matchID - The ID of the Match you want to get
     * @returns {Promise<MatchDto>} - The Data of the Match belonging to the ID *Find out more about the MatchDto types here: https://developer.riotgames.com/apis#val-match-v1/GET_getMatch*
     * @memberof ValorantAPI
     * @example const data = await api.getMatch("matchID");
     * console.log(data);
     **/
    async getByID(matchID) {
      if (!matchID) throw new Error("No Match ID provided");
      try {
        const url = `match/v1/matches/${matchID}`;
        /**
         * @type {MatchDto}
         */
        const { data } = await axios.get(url);
        return data;
      } catch (e) {
        const error = new ApiErrorHandler(e);
        error.isProductionKey = true;
        error.handle();
      }
    },

    /**
     * Get Matchlist by PUUID
     * Read more about the Matchlist Data Object here: https://developer.riotgames.com/apis#val-match-v1/GET_getMatchlist
     * *Please note that you can use this endpoint only with a production API key*.
     * @param {string} puuid - The PUUID of the Player you want to get the Matchlist from
     * @returns {Promise<MatchlistDto>} - The Data of the Matchlist belonging to the PUUID *Find out more about the MatchlistDto types here: https://developer.riotgames.com/apis#val-match-v1/GET_getMatchlist*
     * @memberof ValorantAPI
     * @example const data = await api.getMatchlist("puuid");
     * console.log(data);
     **/
    async getListbyPuuid(puuid) {
      if (!puuid)
        throw new Error(
          "You have to specify a User PUUID to use this endpoint"
        );
      try {
        const url = `match/v1/matchlists/by-puuid/${puuid}`;
        /**
         * @type {MatchlistDto}
         */
        const { data } = await axios.get(url);
        return data;
      } catch (error) {
        const err = new ApiErrorHandler(error);
        err.isProductionKey = true;
        err.handle();
      }
    },
    /**
     * Get PUUIDs of recently played matches in a given region by a queue ID use the Queue object to use the official queue IDs
     * **Implementation Note:** Returns a list of match ids that have completed in the last 10 minutes for live regions and 12 hours for the esports routing value. NA/LATAM/BR share a match history deployment. As such, recent matches will return a combined list of matches from those three regions. Requests are load balanced so you may see some inconsistencies as matches are added/removed from the list.
     * *Please note that you can use this endpoint only with a production API key.*
     * @memberof ValorantAPI
     * @param {string} queueID
     * @returns Promise<RecentMatchesDto> A list of Puuids of recently played matches in a given region by a queue ID. Read more about the RecentMatchesDto here: https://developer.riotgames.com/apis#val-match-v1/GET_getRecent
     * @example const data = await api.getRecentMatches(Queue.Competitive);
     * console.log(data);
     * //returns RecentMatchesDto
     */
    async getbyQueueID(queueID = Queue.Competetive) {
      if (!queueID) throw new Error("No Queue ID provided");
      try {
        const url = `match/v1/recent-matches/by-queue/${queueID}`;
        /**
         * @type {RecentMatchesDto}
         */
        const { data } = await axios.get(url);
        return data;
      } catch (error) {
        const err = new ApiErrorHandler(error);
        err.isProductionKey = true;
        err.handle();
      }
    },
  };
  /**
   * Get the competitive leaderbord for the given region from a past act ID
   * @param {string} actID - The ID of the Act you want to get the Leaderboard from (You can get the Act ID from the Content Endpoint). *Please note the current Act is not available in the Leaderboard Endpoint*
   * @param {number} size - The size of the Leaderboard you want to get (	Defaults to 200. Valid values: 1 to 200.)
   * @param {number} startIndex - The start index of the Leaderboard you want to get (Defaults to 0.)
   * @returns {Promise<LeaderboardDto>} - The Data of the Leaderboard belonging to the Act ID *Find out more about the LeaderboardDto types here: https://developer.riotgames.com/apis#val-leaderboards-v1/GET_getLeaderboard*
   * @memberof ValorantAPI
   */
  async getCompetitiveLeaderbord(actID, size = 200, startIndex = 0) {
    if (!actID) throw new Error("No Act ID provided");
    try {
      const url = `ranked/v1/leaderboards/by-act/${actID}?size=${size}&startIndex=${startIndex}`;
      /**
       * @type {LeaderboardDto}
       */
      const { data } = await axios.get(url);
      return data;
    } catch (e) {
      new ApiErrorHandler(e).handle();
    }
  }

  /**
   * Get the curent status of the Game in the given region
   * @returns {Promise<PlatformDataDto} The current Staus of the Game you
   * @memberof ValorantAPI
   * @example const data = await api.getStatus();
   * console.log(data);
   */

  async getStatus() {
    try {
      const url = "status/v1/platform-data";
      /**
       * @type {PlatformDataDto}
       */
      const { data } = await axios.get(url);
      return data;
    } catch (e) {
      new ApiErrorHandler(e).handle();
    }
  }
}

module.exports = ValorantAPI;
