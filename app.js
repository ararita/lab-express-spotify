require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  //"/artist-search" comes from the form <form action="/artist-search">, from index.hbs

  // return (
  spotifyApi
    .searchArtists(req.query.artist)
    //"query" is property of req
    //"artist" in req.query.artist comes from index.hbs, from name prop in name="artist"
    .then((data) => {
      // console.log("req.query.artist", req.query.artist);
      // res.json(data.body.artists);
      // console.log("data from the api", data);
      // console.log(data.body.artists.items[0]);
      res.render("artist-search-results", {
        dataFromApi: data.body.artists.items,
      });
    })
    .catch((err) => console.log("Error in searchArtists: ", err));
  // );
});

//req.params.<the name of the route parameter from the "app.get("/albums:artistId"...>
app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      // res.json(data.body.items[0]);

      // console.log("-----albums", data.body.items[0]);
      res.render("albums", {
        albumsData: data.body.items,
      });
    })
    .catch((err) => console.log("Error in get albums: ", err));
});

app.get("/tracks/:tracksId", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.tracksId)
    .then((data) => {
      // console.log(data.body);
      // res.json(data.body.items[0]);
      res.render("tracks", {
        tracksData: data.body.items,
      });
    })
    .catch((err) => console.log("Error in get tracks: ", err));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
