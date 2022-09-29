const express = require("express");
const { EventEmitter } = require("events");

class RSOModule extends EventEmitter {
  constructor(options) {
    console.log(options)
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
    this.state;
    this.code;
    this.authURL = "https://auth.riotgames.com/api/v1/authorization";
    this.tokenURL = "https://auth.riotgames.com/api/v1/token";
    this.revokeURL = "https://auth.riotgames.com/api/v1/revoke";
    this.userURL = "https://auth.riotgames.com/userinfo";
    this.scope = "openid offline_access";
  }
  async initModule() {
    this.app = express();
    this.app.get(this.redirectURI, (req, res) => {
      res.send("Hello World!");
    });

    this.app.listen(this.port, () => {
      this.emit("ready", `RSO Module is running on port ${this.port}`);
    });
  }
}

module.exports = RSOModule;
