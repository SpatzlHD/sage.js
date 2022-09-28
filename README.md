## Sage.js

> sage.js is a powerful javascript library to help you build an application based on the official Riotgames Valorant API.

---

### Installation

```plaintext
npm i sage.js
```

---

### Getting Started

_Before you start, please note that the valorant api can only be used with a production api key._

To start, you first have to import the library and init the ValorantAPI class of the api.

```javascript
const { ValorantAPI, Regions } = require("sage.js");

//init the ValorantAPI class for the region you can use all that are provided by the Regions object of the library
const api = new ValorantAPI("*your api key*", Regions.NorthAmerica);
```

The ValorantAPI class provides functions for all the at [Riot Developer Portal (riotgames.com)](https://developer.riotgames.com/apis) listed valorant endpoints.

To call an endpoint you can just do:

```javascript
//returns a object of content that is used by the game
const data = await api.getContent();
```

To use the match endpoints you have to use the .match prefix:

```javascript
//returns the data of a match by the id
cost matchData = await api.match.getByID("*matchID*")
```

#### A list of all available functions for the ValorantAPI class:

<table><tbody><tr><td><a href="https://github.com/SpatzlHD/sage.js/wiki/Valorant-API-methodes#.getContent()">.getContent()</a></td><td>Get content optionally filtered by locale</td></tr><tr><td><a href="https://github.com/SpatzlHD/sage.js/wiki/Valorant-API-methodes#getbyid">.match.getByID("*matchId*")</a></td><td>Get match by id</td></tr><tr><td><a href="https://github.com/SpatzlHD/sage.js/wiki/Valorant-API-methodes#getlistbypuuid">.match.getListbyPuuid("*puuid*")</a></td><td>Get matchlist for games played by puuid</td></tr><tr><td><a href="https://github.com/SpatzlHD/sage.js/wiki/Valorant-API-methodes#getbyqueueid">.match.getbyQueueID("queueId")</a></td><td>Get recent matches</td></tr><tr><td><a href="https://github.com/SpatzlHD/sage.js/wiki/Valorant-API-methodes#getcompetitiveleaderboard">.getCompetitiveLeaderbord("*actId*")</a></td><td>Get leaderboard for the competitive queue</td></tr><tr><td><a href="https://github.com/SpatzlHD/sage.js/wiki/Valorant-API-methodes#getstatus">.getStatus()</a></td><td>Get VALORANT status for the given platform.</td></tr></tbody></table>

---

### License

MIT

---

### Legal

Riot Games, VALORANT, and any associated logos are trademarks, service marks, and/or registered trademarks of Riot Games, Inc.

This project is in no way affiliated with, authorized, maintained, sponsored or endorsed by Riot Games, Inc or any of its affiliates or subsidiaries.

I, the project owner and creator, am not responsible for any legalities that may arise in the use of this project. Use at your own risk.
