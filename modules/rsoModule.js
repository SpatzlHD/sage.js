const express = require("express");
const { EventEmitter } = require("events");
const axios = require("axios");
class tokenRefresher extends EventEmitter {
  constructor(expiresIn) {
    this.interval = expiresIn * 1000;
    this.refreshToken;
    this.clientID;
    this.clientSecret;
    this.redirectURI;
    this.tokenURL;
  }
  async initRefresher() {
    setTimeout(async () => {}, this.interval);
  }
}
class RSOModule extends EventEmitter {
  constructor(options) {
    super();
    this.app;
    this.existingApp;
    this.port = options.port || 3001;
    this.clientID = options.clientID;
    this.clientSecret = options.clientSecret;
    this.redirectURI = options.redirectURI;
    this.accessToken;
    this.refreshToken;
    this.tokenType;
    this.expiresIn;
    this.scope;
    this.code;
    this.authURL = "https://auth.riotgames.com/api/v1/authorization";
    this.tokenURL = "https://auth.riotgames.com/api/v1/token";
    this.revokeURL = "https://auth.riotgames.com/api/v1/revoke";
    this.userURL = "https://auth.riotgames.com/userinfo";
    this.scope = "openid offline_access";
  }
  async initModule() {
    this.app = express();
    this.app.get("/", (req, res) => {
      this.url = `${this.authURL}?client_id=${this.clientID}&redirect_uri=${this.redirectURI}&response_type=code&scope=${this.scope}`;
      res.redirect(this.url);
    });
    this.app.get(this.redirectURI, async (req, res) => {
      this.code = req.query.code;
      this.tokenResponse = await axios.post(this.tokenURL, {
        Headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          user: this.clientID,
          pass: this.clientSecret,
        },
        form: {
          grant_type: "authorization_code",
          code: this.code,
          redirect_uri: this.redirectURI,
        },
      });
      if (this.tokenResponse.status !== 200) {
        res.send(
          "Error while getting your access tokens. Please try again later."
        );
        this.emit(
          "error",
          "Error while getting token\n" + this.tokenResponse.data
        );

        return;
      }
      this.token = this.tokenResponse.data;

      res.send("You can close this tab now");
      this.emit("code", this.token);
    });

    this.server = this.app.listen(this.port, () => {
      this.host = this.server.address().address;
      this.port = this.server.address().port;
      this.emit(
        "ready",
        `RSO Module ready. The app is listening at http://${this.host}:${this.port}`
      );
    });
  }
}

module.exports = RSOModule;
