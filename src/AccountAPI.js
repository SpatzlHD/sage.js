const axios = require("axios");
const Shards = require("../data/shards");
const ApiErrorHandler = require("../handler/apiErrorHandler");

class AccountAPI {
  constructor(apiKey, shard = Shards.America) {
    this.apiKey = apiKey;
    this.shard = shard;
    if (!this.apiKey) {
      throw new Error("No Api Key provided");
    }
    if (!Shards[this.shard]) throw new Error("Invalid Shard ID provided");

    axios.defaults.headers.common["X-Riot-Token"] = this.apiKey;
    axios.defaults.baseURL = `https://${this.shard}.api.riotgames.com/riot/account/v1/`;
  }
  /**
   * Get an account by its puuid
   * @param {string} puuid The puuid of the the account you want to get
   * @returns {Promise<AccountDto>} - The Data of the Account belonging to the puuid *Find out more about the AccountDto types here: https://developer.riotgames.com/apis#account-v1/GET_getByPuuid*
   */
  async getByPuuid(puuid) {
    if (!puuid) throw new Error("No Puuid provided");
    try {
      const url = `accounts/by-puuid/${puuid}`;
      /**
       * @type {AccountDto}
       */
      const { data } = await axios.get(url);
      return data;
    } catch (e) {
      new ApiErrorHandler(e).handle();
    }
  }
  /**
   * Get an account by its game name and tag line
   * @param {string} gameName When querying for a player by their riot id, the gameName and tagLine query params are required. However not all accounts have a gameName and tagLine associated so these fields may not be included in the response.
   * @param {string} tagLine When querying for a player by their riot id, the gameName and tagLine query params are required. However not all accounts have a gameName and tagLine associated so these fields may not be included in the response.
   * @returns {Promise<AccountDto>} - The Data of the Account belonging to the gameName and tagLine *Find out more about the AccountDto types here: https://developer.riotgames.com/apis#account-v1/GET_getByRiotId*
   */
  async getByRiotId(gameName, tagLine) {
    if (!gameName || !tagLine)
      throw new Error("No GameName or TagLine provided");
    try {
      const url = `accounts/by-riot-id/${gameName}/${tagLine}`;
      /**
       * @type {AccountDto}
       */
      const { data } = await axios.get(url);
      return data;
    } catch (e) {
      new ApiErrorHandler(e).handle();
    }
  }
  /**
   * Get account by access token
   * *Please note: The access token is **not** the same as the API key*
   * @param {string} access_token The access token of the account you want to get
   * @returns {Promise<AccountDto>} - The Data of the Account belonging to the access_token *Find out more about the AccountDto types here: https://developer.riotgames.com/apis#account-v1/GET_getByAccessToken*
   */
  async getByAuthorization(access_token) {
    if (!access_token) throw new Error("No Authorization provided");
    try {
      const url = `accounts/me`;
      /**
       * @type {AccountDto}
       */
      const { data } = await axios.get(url, {
        headers: {
          Authorization: access_token,
        },
      });
      return data;
    } catch (e) {
      new ApiErrorHandler(e).handle();
    }
  }
  /**
   * Get active shard for player
   * @param {string} puuid The puuid of the the account you want to get
   * @returns {Promise<ActiveShardDto>} - The Data of the Active Shard belonging to the puuid *Find out more about the ActiveShardDto types here: https://developer.riotgames.com/apis#account-v1/GET_getActiveShardForPlayer*
   */
  async getActiveShardForPlayer(puuid) {
    if (!puuid) throw new Error("No Puuid provided");
    try {
      const url = `active-shards/by-game/val/by-puuid/${puuid}`;
      /**
       * @type {ActiveShardDto}
       */
      const { data } = await axios.get(url);
      return data;
    } catch (e) {
      new ApiErrorHandler(e).handle();
    }
  }
}
module.exports = AccountAPI;
