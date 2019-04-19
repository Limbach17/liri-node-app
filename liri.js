require("dotenv").config();

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

action = process.argv[2];

switch (action) {
    
    case "concert-this": 
        var bandName = process.argv[3];
}