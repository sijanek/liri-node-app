require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");



var getArtistNames = function (artist) {
    return artist.name;
};
var getMeSpotify = function (songName) {
    console.log("Checking Song Name", songName)
    if (songName.length === 0) {
        songName = "The Sign by Ace of Base";
        
    }

    spotify.search(
        { type: 'track', query: songName },
        function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }

            var songs = data.tracks.items;
            for (var i = 0; i < songs.length; i++) {
                console.log(i);
                console.log("artist(s): " + songs[i].artists.map(getArtistNames));
                console.log("song name: " + songs[i].name);
                console.log("preview song: " + songs[i].preview_url);
                console.log("album: " + songs[i].album.name);
                console.log("----------------------------------------");

            }


        }

    );
};

var getMyBands = function (artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryURL).then(function (response) {
        var jsonData = response.data;

        if (!jsonData.length) {
            console.log("No results found for " + artist);
            return;
        }

        console.log("Upcoming concerts for" + artist + ":");

        for (var i = 0; i < jsonData.length; i++) {
            var concert = jsonData[i];
            console.log(concert.venue.city + "," + (concert.venue.region || concert.venue.country) +
                " at " + concert.venue.name + " " + moment(concert.datetime).format("MM/DD/YYYY")
            );
        }
    }
    );
};
var getMeMovie = function (movieName) {
    if (movieName === undefined) {
        movieName = "Mr Nobody";
    }
    var urlTop = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

    axios.get(urlTop).then(function (response) {
        var jsonData = response.data;

        console.log("Title: " + jsonData.Title);
        console.log("Year: " + jsonData.Year);
        console.log("Rated: " + jsonData.Rated);
        console.log("IMDB Rating: " + jsonData.imdbRating);
        console.log("Country: " + jsonData.Country);
        console.log("Language: " + jsonData.Language);
        console.log("Plot: " + jsonData.Plot);
        console.log("Actors: " + jsonData.Actors);
        console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
    });

};

var doWhatItSays = function () {
    fs.readFile("random.txt", "utf8", function (error, data) {
        console.log(data);
        var dataArr = data.split(",");
        if (dataArr.length === 2) {
            pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length === 1) {
            pick(dataArr[0]);

        }
    });
};

var pick = function (caseData, functionData) {
    console.log("THIS IS WHAT THE USER WANTS", functionData);
    switch (caseData) {
        case "concert-this":
            getMyBands(functionData);
            break;
        case "spotify-this-song":
            getMeSpotify(functionData);
            break;
        case "movie-this":
            getMeMovie(functionData);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;

        default:
            console.log("Liri does not know that");
    }
};

var runThis = function (argOne, argTwo) {
    pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv.slice(3).join(" "));