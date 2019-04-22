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
var input = [];


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
      if (process.argv.length === 3) {
        input.push("Ravi" + "Coltrane");
      }
      else {
        for (var a = 3; a < process.argv.length; a++){
          input.push(process.argv[a]);
        }
      }
      concertDisplay();
      logStream.write("\n" + currentTime + " --- " + "concert-this");
      break;

    case "spotify-this":
      if (process.argv.length === 3) {
        input.push("Game" + "of" + "Pricks");
      }
      else {
        for (var s = 3; s < process.argv.length; s++){
          input.push(process.argv[s]);
        }
      }
      songSearch();
      logStream.write("\n" + currentTime + " --- " + "spotify-this");
      break;

    case "movie-this":
      if (process.argv.length === 3) {
        input.push("Mr." + "Nobody");
      }
      else {
        for (var m = 3; m < process.argv.length; m++) { 
        input.push(process.argv[m]);
        }
      }
      movieInfo();
      logStream.write("\n" + currentTime + " --- " + "movie-this");
      break;

    case "read-profile":
      callProfile();
      logStream.write("\n" + currentTime + " --- " + "read-profile");
      break;

    case "do-what-it-says":
      fs.readFile("recent.txt", "utf-8", function(err, data){
        if (err){
          console.log(err);
        }
        var dataArray = data.split(",");
        input.push(dataArray[1]);
        
        if (dataArray[0] === "concert-this"){
          concertDisplay();
        }
        else if (dataArray[0] === "spotify-this"){
          songSearch();
        }
        else if (dataArray[0] === "movie-this"){
          movieInfo();
        }
        else if (dataArray[0] === "read-profile"){
          callProfile();
        }
      })
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
      console.log("Valid commands" + validCommands);
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
        message: "Add some of your favorite bands separated by a comma",
        name: "userBands"
      },

      {
        type: "input",
        message: "Add some of your favorite songs separate by a comma",
        name: "userSongs"
      },

      {
        type: "input",
        message: "Add someo of your favorite movies separated by a comma",
        name: "userMovies"
      }
    ]).then(function (inquirerResponse){
        var profile = inquirerResponse.username;
        var bandsArray = inquirerResponse.userBands.split(",");
        var songsArray = inquirerResponse.userSongs.split(",");
        var moviesArray = inquirerResponse.userMovies.split(",");

        obj[profile] = {bands: bandsArray,
                        songs: songsArray,
                        movies: moviesArray};
    })
}

function concertDisplay() {
  var artistName = input.join(" ");

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
  var songName = input.join(" ");

  spotify.search({type: "track", query: songName}, 
  function (err, data) {
    if (err) {
      console.log(err);
    }
    console.log(data);
  });
}

function movieInfo() {
  var movieName = input.join(" ");

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

function callProfile() {
  console.log("call-profile");
}




  


