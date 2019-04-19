console.log('this is loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

var fs = require("fs");

var axios = require("axios");

var action = process.argv[2];

switch (action) {

  case "concert-this":
    
    var bandName = [];

    for (var b = 3; b < process.argv.length; b++) {
      bandName.push(process.argv[b]);
      console.log(bandName);
    }
    
    var bandsUrl = "//rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(bandsUrl).then(
      function(response) {
        console.log(response);
      }
    )


}
