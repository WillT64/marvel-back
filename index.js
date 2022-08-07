const express = require("express");
const cors = require("cors");
const axios = require("axios");
const morgan = require("morgan");

require("dotenv").config();

const app = express();
app.use(cors({ origin: "http://localhost:8888" }));
app.use(morgan("dev"));

const port = process.env.PORT || 5000;

// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8888");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.get("/characters", async (req, res) => {
  try {
    const filter = Object.keys(req.query)
      .map((elem) => {
        if (elem === "skip") {
          if (req.query[elem] < 0) {
            return "skip=0";
          } else {
            return `${elem}=${+req.query[elem] * (+req.query.limit || 0)}`;
          }
        } else {
          return `${elem}=${req.query[elem]}`;
        }
      })
      .join("&");

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.REACT_APP_API_KEY}&${filter}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
  }
});

app.get("/comics", async (req, res) => {
  try {
    const filter = Object.keys(req.query)
      .map((elem) => {
        return `${elem}=${req.query[elem]}`;
      })
      .join("&");

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.REACT_APP_API_KEY}&${filter}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
  }
});

app.get("/characters/:characterId", async (req, res) => {
  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/character/${req.params.characterId}?apiKey=${process.env.REACT_APP_API_KEY}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
  }
});

app.get("/comics/:characterId", async (req, res) => {
  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${req.params.characterId}?apiKey=${process.env.REACT_APP_API_KEY}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
  }
});

app.get("/comic/:comicId", async (req, res) => {
  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comic/${req.params.comicId}?apiKey=${process.env.REACT_APP_API_KEY}`
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => console.log(`Server started on port ${port}`));
