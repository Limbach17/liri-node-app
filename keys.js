console.log('this is loaded...');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};


var fs = require("fs");
var logStream = fs.createWriteStream("log.txt", {flags: "a"});

var axios = require("axios");
var inquirer = require("inquirer");
var spotify = require("node-spotify-api");
var validCommands = ["make-profile", "concert-this", "spotify-this-song", "movie-this", "do-what-it-says", "read-profile", "help"];
var userProfiles = require("./userData.js");

var moment = require("moment");
var currentTime = moment().format("dddd, MMMM DO YYYY, h:mm:ss a");

var action = process.argv[2];

/* fs.readFile("welcome.txt", "utf-8", function(err, data){
  if (err) {
    console.log(err);
  }

  console.log(data);
  console.log("-----------");
  console.log("Valid commands: " + validCommands);
  console.log("-----------");
}) 

inquirer
  .prompt ([
    {
    type: "ccheckbox",
    message: "Would you like to create a user profile?",
    choices: ["yes", "no"],
    name: "creator"
    }
  ]).then(function(inquirerResponse){
    inquirerResponse.creator;

    if (inquirerResponse.creator === "yes") {
      
      makeProfile ();
    }
  }) */

switch (action){
  case "make-profile":
    makeProfile();
    logStream.write("\n" + currentTime + " --- " + "make-profile");
    break;

  case "concert-this":
    concertDisplay();
    logStream.write("\n" + currentTime + " --- " + "concert-this");
    break;

  case "spotify-this":
    songSearch();
    logStream.write("\n" + currentTime + " --- " + "spotify-this");
    break;

  case "movie-this":
    movieInfo();
    logStream.write("\n" + currentTime + " --- " + "movie-this");
    break;

  case "do-what-it-says":
    console.log("I want it that way");
    logStream.write("\n" + currentTime + " --- " + "do-what-it-says");
    break;

  case "read-profile":
    console.log("Read profile");
    logStream.write("\n" + currentTime + " --- " + "read-profile");
    break;

  case "help":
    fs.readFile("help.txt", "utf-8", function (err, data){
      if (err) {
        console.log(err);
      }
      console.log(" ");
      console.log(data);
    })
    logStream.write("\n" + currentTime + " --- " + "help");
    break;

  default:
    console.log(validCommands);
    logStream.write("\n" + currentTime + " --- " + "invalid-command");
}
  
function makeProfile() {
  inquirer
    .prompt ([
      {
        type: "input",
        message: "Enter a username",
        name: "username"
      },

      {
        type: "input",
        message: "Add some of your favorite bands",
        name: "userBands"
      },

      {
        type: "input",
        message: "Add some of your favorite songs",
        name: "userSongs"
      },

      {
        type: "input",
        message: "Add someo of your favorite movies",
        name: "userMovies"
      }
    ]).then(function (inquirerResponse){
        console.log(inquirerResponse);
    })
}

function concertDisplay() {
  var artist = [];

  if (process.argv.length === 3) {
    artist.push("Ravi" + "Coltrane");
  }

  else {
    for (var a = 3; a < process.argv.length; a++){
      artist.push(process.argv[a]);
    }
  }

  var artistName = artist.join(" ");

  var artistUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp&date=upcoming";

  axios.get(artistUrl).then(
    function(response) {
      console.log(" ");
      console.log(artistName);
      console.log(" ");
      for (var d = 0; d < response.data.length; d ++){
        console.log(response.data[d].venue.city)
        console.log(response.data[d].datetime)
        console.log(response.data[d].venue.name);
        console.log(" ");
      }
    }
  );
}

function songSearch() {
  var song = [];

  if (process.argv.length === 3) {
    song.push("Game" + "of" + "Pricks");
  }

  else {
    for (var s = 3; s < process.argv.length; s++){
      song.push(process.argv[s]);
    }
  }
  
  var songName = song.join(" ");

  spotify.search({type: "track", query: songName}, 
  function (err, data) {
    if (err) {
      console.log(err);
    }
    console.log(data);
  });
}


function movieInfo() {
  var movie = [];

  if (process.argv.length === 3) {
    movie.push("Mr." + "Nobody");
  }

  else {
    for (var m = 3; m < process.argv.length; m++) { 
    movie.push(process.argv[m]);
    }
  }

  var movieName = movie.join(" ");

  var movieUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  axios.get(movieUrl).then(
    function(response) {
      console.log(" ");
      console.log(response.data.Title);
      console.log("Released: " + response.data.Year);
      
      for (var i = 0; i < response.data.Ratings.length; i ++){
        console.log(response.data.Ratings[i].Source + " Rating: " + response.data.Ratings[i].Value);
      }
      
      console.log("Produced in: " + response.data.Country);
      console.log("Languages: " + response.data.Language);
      console.log("Plot: " + response.data.Plot);
      console.log("Starring: " + response.data.Actors);
    }
  );
}




  


