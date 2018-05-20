// fs is a core Node package for reading and writing files
var fs = require("fs");

//request npm package
var request = require("request");
var dotenv = require("dotenv").config();

//import npm package keys.js and Twitter
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

// Grabs command from the terminal
var command = process.argv[2];
var searchValue = "";

// Puts together the search value into one string
for (var i = 3; i < process.argv.length; i++) {
    searchValue += process.argv[i] + " ";
};

// Error Functions 
function errorFunction(error) {
    if (error) {
        return console.log("Error occured: ", error);
    }
};

// ------------------------ TWITTER MY-TWEETS ---------------------- //
function getTweets() {

    var client = new Twitter(keys.twitter);

    var params = {
        screen_name: 'orangejuicesmo1',
        trim_user: true,
        count: 20
    };

    // using the npm
    client.get('statuses/user_timeline', params, function (error, tweets) {
        if (error) {
            console.log(error);
        }
        else {
            // for loop to run through the length of my account's tweets
            console.log("\n-------------TWEET ME-------------\n");
            for (i = 0; i < tweets.length; i++) {
                // adds number and dot before to show order
                console.log((i + 1) + ". " + tweets[i].text);
            }
        }
    });
}

// ------------------------ OMDB MOVIES---------------------- //

function searchMovie(searchValue) {

    // Default search value if no movie is given
    if (searchValue == "") {
        searchValue = "Mr. Nobody";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + searchValue.trim() + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (respError, response, body) {

        errorFunction();

        if (JSON.parse(body).Error == 'Movie not found!') {

            console.log("\nI'm sorry, we could not find " + searchValue + "! Please try again.\n")

            fs.appendFile("log.txt", "I'm sorry, we could not find " + searchValue + "! Please try again.\n\n-----OMDB Log Entry End-----\n\n", errorFunctionEnd());

        } else {

            movieBody = JSON.parse(body);

            console.log("\n--------------- OMDB Search Results ---------------\n");
            console.log("Movie Title: " + movieBody.Title);
            console.log("Year: " + movieBody.Year);
            console.log("IMDB rating: " + movieBody.imdbRating);

            // If there's no rating
            if (movieBody.Ratings.length < 2) {

                console.log("There is no Rotten Tomatoes Rating for this movie.")

                fs.appendFile("log.txt", "Movie Title: " + movieBody.Title + "\nYear: " + movieBody.Year + "\nIMDB rating: " + movieBody.imdbRating + "\nRotten Tomatoes Rating: There is no Rotten Tomatoes Rating for this movie \nCountry: " + movieBody.Country + "\nLanguage: " + movieBody.Language + "\nPlot: " + movieBody.Plot + "\nActors: " + movieBody.Actors + "\n\n-----OMDB Log Entry End-----\n\n", errorFunction());

            } else {

                console.log("Rotten Tomatoes Rating: " + movieBody.Ratings[[1]].Value);

                fs.appendFile("log.txt", "Movie Title: " + movieBody.Title + "\nYear: " + movieBody.Year + "\nIMDB rating: " + movieBody.imdbRating + "\nRotten Tomatoes Rating: " + movieBody.Ratings[[1]].Value + "\nCountry: " + movieBody.Country + "\nLanguage: " + movieBody.Language + "\nPlot: " + movieBody.Plot + "\nActors: " + movieBody.Actors + "\n\n-----OMDB Log Entry End-----\n\n", errorFunction());
            }

            console.log("Country: " + movieBody.Country);
            console.log("Language: " + movieBody.Language);
            console.log("Plot: " + movieBody.Plot);
            console.log("Actors: " + movieBody.Actors);
            console.log("\n------------------------------------------------\n");
        };
    });
};


// ------------------------ SPOTIFY ---------------------- //

function searchSong() {

    var spotify = new Spotify(keys.spotify);
       
      spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
      console.log(data); 
      });
    }

// ------------------------ DO-WHAT-IT-SAYS ---------------------- //
function randomSearch() {

    fs.readFile("random.txt", "utf8", function (respError, data) {

        var randomArray = data.split(", ");

        errorFunction();

        if (randomArray[0] == "spotify-this-song") {
            searchSong(randomArray[1]);
        } else if (randomArray[0] == "movie-this") {
            searchMovie(randomArray[1]);
        } else {
            getTweets();
        }
    });
};

// ------------------------ MAIN SWITCH CASE ---------------------- //

switch (command) {
    case "my-tweets":
        getTweets();
        break;
    case "spotify-this-song":
        searchSong(searchValue);
        break;
    case "movie-this":
        searchMovie(searchValue);
        break;
    case "do-what-it-says":
        randomSearch();
        break;
    default:
        console.log("\nI'm sorry, " + command + " is not working. Please try one of the following commands: \n\n  1. To search a movie: node liri.js movie-this (with desired movie title following) \n\n  2. To search Spotify for a song: node liri.js spotify-this-song (with desired song title following) \n\n  3. To see my last 20 tweets from Twitter: node liri.js my-tweets \n");
};