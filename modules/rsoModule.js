class RSOModule {
  constructor(
    options = {
      clientID: null,
      clientSecret: null,
      redirectURI: null,
    }
  ) {
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
    console.log("RSO Module is ready to use");
  }
}

module.exports = RSOModule;
