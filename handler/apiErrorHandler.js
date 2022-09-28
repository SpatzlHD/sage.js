class ApiErrorHandler {
  constructor(error) {
    this.error = error;
    this.isProductionKey = false;
  }

  handle() {
    const e = this.error;
    if (e.response.status === 403) {
      if (this.isProductionKey) {
        throw new Error(
          `You are trying to use a development key, please use a production key to use this endpoint\n\nRiot API Error message: ${e.response.data.status.message}`
        );
      } else {
        throw new Error(
          `You are trying to use a invalid api key please check your api key\n\nRiot API Error message: ${e.response.data.status.message}`
        );
      }
    } else if (e.response.status === 404) {
      throw new Error(
        `The Content you are trying to get is not available\nTry to check your query\n\nRiot API Error message: ${e.response.data.status.message}`
      );
    } else if (e.response.status === 429) {
      throw new Error(
        `You are being rate limited by Riot Games\nTry again later\n\nRiot API Error message: ${e.response.data.status.message}`
      );
    } else if (e.response.status === 500) {
      throw new Error("Riot Games Servers are currently down\nTry again later");
    } else {
      throw new Error(`An unknown error occured\n${e}`);
    }
  }
}

module.exports = ApiErrorHandler;
