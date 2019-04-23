require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");

var logStream = fs.createWriteStream("log.txt", {flags: "a"});

var axios = require("axios");
var inquirer = require("inquirer");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var validCommands = ["make-profile", "concert-this", "spotify-this-song", "movie-this", "do-what-it-says", "read-profile", "help"];

var moment = require("moment");
var currentTime = moment().format("dddd, MMMM D YYYY, h:mm:ss a");

var action = process.argv[2];
var input = [];

function User(name, bands, songs, movies){
  this.name = name;
  this.bands = bands;
  this.songs = songs;
  this.movies = movies;
}

switch (action){
  /* case "hello":
    fs.readFile("welcome.txt", "utf-8", function(err, data){
      if (err) {
        console.log(err);
      }
    
      console.log(data);
      console.log("-----------");
    }) 
    
    inquirer
      .prompt ([
        {
        type: "confirm",
        message: "Would you like to create a user profile?",
        choices: ["yes", "no"],
        name: "creator"
        }
      ]).then(function(inquirerResponse){
        
        if (inquirerResponse.creator === true) {
          
          makeProfile ();
        }
      })
      logStream.write("\n" + currentTime + " --- " + "hello");
      break; */

    case "make-profile":
      makeProfile();
      logStream.write("\n" + currentTime + " --- " + "make-profile");
      break;

    case "concert-this":
      if (process.argv.length === 3){
        input.push("Ravi Coltrane");
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
      if (process.argv.length === 3){
        input.push("Game of Pricks");
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
      if (process.argv.length === 3){
        input.push("Mr. Nobody");
      }
      else {
        for (var m = 3; m < process.argv.length; m++){ 
        input.push(process.argv[m]);
        }
      }
      movieInfo();
      logStream.write("\n" + currentTime + " --- " + "movie-this");
      break;

    case "read-profile":
      if (process.argv.length === 3){
        console.log("\nTry again with a user name.");
      }
      else {
        for (var p = 3; p < process.argv.length; p++){
          input.push(process.argv[p]);
        }
      }
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
      })
      logStream.write("\n" + currentTime + " --- " + "do-what-it-says");
      break;

    case "help":
      fs.readFile("help.txt", "utf-8", function (err, data){
        if (err) {
          console.log(err);
        }
        console.log("\n" + data);
      })
      logStream.write("\n" + currentTime + " --- " + "help");
      
      break;

    default:
      console.log("\nValid commands:\n");
      for (var c = 0; c < validCommands.length; c++){
        console.log ('"' + validCommands[c] + '"');
      }
      logStream.write("\n" + currentTime + " --- " + "invalid-command");
      
}

function makeProfile(){
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter a username",
        name: "userName"
      },

      {
        type: "input",
        message: "Add some of your favorite artists separated by a comma",
        name: "userBands"
      },

      {
        type: "input",
        message: "Add some of your favorite songs separate by a comma",
        name: "userSongs"
      },

      {
        type: "input",
        message: "Add some of your favorite movies separated by a comma",
        name: "userMovies"
      }
    ]).then(function (inquirerResponse){
        var bandsArray = inquirerResponse.userBands.split(",");
        var songsArray = inquirerResponse.userSongs.split(",");
        var moviesArray = inquirerResponse.userMovies.split(",");
        var newUser = new User(
          inquirerResponse.userName,
          bandsArray,
          songsArray,
          moviesArray
        ) 
    })

}

function concertDisplay(){
  var artistName = input.join(" ");

  var artistUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp&date=upcoming";
 
  var call = "concert-this" + "," + artistName;

  axios.get(artistUrl).then(
    function(response){
      console.log("\n" + artistName);
      for (var d = 0; d < 5; d ++){
        console.log("\n" + response.data[d].venue.city)
        console.log(moment(response.data[d].datetime).format("MM/DD/YY"))
        console.log(response.data[d].venue.name);
        console.log(" ");
      }
    }
  );
  
  fs.writeFile("recent.txt", call, function(err){
    if (err){
      console.log(err);
    }
  });
}

function songSearch(){
  var songName = input.join(" ");

  var call = "spotify-this" + "," + songName;

  spotify.search({type: "track", query: songName}, 
  function(err, data){
    if (err){
      console.log(err);
    }
    for (var t = 0; t < 5; t++){
      console.log("\nArtist: " + data.tracks.items[t].album.artists[0].name);
      console.log("Track: " + data.tracks.items[t].name);
      console.log("Preview: " + data.tracks.items[t].preview_url);
      console.log("Album: " + data.tracks.items[t].album.name);
    }
  });
  
  fs.writeFile("recent.txt", call, function(err){
    if (err){
      console.log(err);
    }
  });
}

function movieInfo(){
  var movieName = input.join(" ");

  var movieUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  var call = "movie-this" + "," + movieName;

  axios.get(movieUrl).then(
    function(response){
      console.log("\n" + response.data.Title);
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
  
  fs.writeFile("recent.txt", call, function(err){
    if (err){
      console.log(err);
    }
  });
}

function callProfile(){
  console.log("call-profile");

}




  


