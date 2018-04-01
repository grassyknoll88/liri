require("dotenv").config();

var liriCommand = process.argv[2];

var keys = require("./keys.js");
var request = require("request");
var fs = require("fs");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api')
var client = new Twitter(keys.twitterKeys);
var spotify = new Spotify(keys.spotifyKeys);

//Switches between user selected function
var choice = function(caseData, functionData) {
    switch (liriCommand) {
        case 'my-tweets':
            loadTweets();
            break;
        case 'spotify-this-song':
            mySpotify(liriCommand);
            break;
        case 'movie-this':
            movieThis(liriCommand);
            break;
        case 'do-what-it-says':
            random();
            break;
    };
}

var runFunc = function(argOne, argTwo) {
    choice(argOne, argTwo);
};
(process.argv[2], process.argv[3]);

//tweet retrieval function
var loadTweets = function() {
    var params = {
        screen_name: "Grassy_Knoll88"
    };
    client.get("statuses/user_timeline", params, function(
        error,
        tweets,
        response
    ) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log('********************');
                console.log(tweets[i].created_at);
                console.log(tweets[i].text);
                console.log('********************');
            }
        } else {
            console.log(error);
        }
    });
};


//spotify data retrieval function
function mySpotify(liriCommand) {
    if (liriCommand == null) {
        liriCommand = 'The Sign';
    }
    spotify.search({
        type: 'track',
        query: liriCommand,
        limit: 5
    }, function(error, data) {
        if (error) {
            console.log('Error occurred: ' + error);
            return;
        }
        console.log('********************');
        console.log('Artist(s): ' + data.tracks.items[0].artists[0].name);
        console.log('Song Title: ' + data.tracks.items[0].name);
        console.log('Preview Link: ' + data.tracks.items[0].preview_url);
        console.log('Album: ' + data.tracks.items[0].album.name);
        console.log('********************');
    });
}


//OMDB data retrieval function 
function movieThis(liriCommand) {
    if (liriCommand == null) {
        liriCommand = 'Mr. Nobody';
    }
    request("http://www.omdbapi.com/?t=" + liriCommand + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log('********************');
            console.log('Movie Title: ' + JSON.parse(body).Title);
            console.log('Release Year: ' + JSON.parse(body).Year);
            console.log('IMDb Rating: ' + JSON.parse(body).imdbRating);
            console.log('Country: ' + JSON.parse(body).Country);
            console.log('Language: ' + JSON.parse(body).Language);
            console.log('Plot: ' + JSON.parse(body).Plot);
            console.log('Lead Actors: ' + JSON.parse(body).Actors);
            console.log('********************');
        }
    });
}

function random() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            console.log(error);
        } else {
            mySpotify(data[1]);
        }
    });
}