class ApiErrorHandler {
  constructor(error) {
    this.error = error;
    this.isProductionKey = false;
  }

  handle() {
    const e = this.error;
    const status = e.response.status;
    if (status === 400) {
      throw new Error(
        `Status Code: ${status} - ${e.response.data.status.message}\n\nThis error indicates that there is a syntax error in the request and the request has therefore been denied.`
      );
    } else if (status === 401) {
      throw new Error(
        `Status Code: ${status} - ${e.response.data.status.message}\n\nThis error indicates that the request being made did not contain the necessary authentication credentials (e.g., an API key) and therefore the client was denied access.`
      );
    } else if (status === 403) {
      if (this.isProductionKey) {
        throw new Error(
          `Status Code: ${status} - ${e.response.data.status.message}\n\nThis error indicates that the server understood the request but refuses to authorize it. There is no distinction made between an invalid path or invalid authorization credentials (e.g., an API key). You are probably using a development key on a production key only endpoint.`
        );
      } else {
        throw new Error(
          `Status Code: ${status} - ${e.response.data.status.message}\n\nThis error indicates that the server understood the request but refuses to authorize it. There is no distinction made between an invalid path or invalid authorization credentials (e.g., an API key).`
        );
      }
    } else if (e.response.status === 404) {
      throw new Error(
        `Status Code: ${status} - ${e.response.data.status.message}\n\nThis error indicates that the server has not found a match for the API request being made. No indication is given whether the condition is temporary or permanent.`
      );
    } else if (e.response.status === 429) {
      throw new Error(
        `Status Code: ${status} - ${e.response.data.status.message}\n\nThis error indicates that the application has exhausted its maximum number of allotted API calls allowed for a given duration.\n\nTry again in ${e.response.headers["retry-after"]} seconds.`
      );
    } else if (e.response.status === 500) {
      throw new Error(
        `${status} - ${e.response.data.status.message}\n\nThis error indicates an unexpected condition or exception which prevented the server from fulfilling an API request.`
      );
    } else if (status === 503) {
      throw new Error(
        `${status} - ${e.response.data.status.message}\n\nThis error indicates the server is currently unavailable to handle requests because of an unknown reason. The Service Unavailable response implies a temporary condition which will be alleviated after some delay.`
      );
    } else {
      throw new Error(`An unknown error occured\n${e}`);
    }
  }
}

module.exports = ApiErrorHandler;
