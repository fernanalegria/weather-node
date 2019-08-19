const path = require("path");

const express = require("express");
const hbs = require("hbs");
const HttpStatus = require("http-status-codes");

const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

// Port and paths for Express config
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

const app = express();

// Setup handlebars engine and views directory
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Fernando Alegría",
    message: "Use this site to get your weather!"
  });
});
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    name: "Fernando Alegría"
  });
});
app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Fernando Alegría",
    helpText: "This is some helpful text."
  });
});
app.get("/weather", (req, res) => {
  const address = req.query.address;
  if (!address) {
    return res.status(HttpStatus.BAD_REQUEST).send({
      error: "Address must be provided"
    });
  }

  geocode(address)
    .then(({ latitude, longitude, location }) =>
      Promise.all([forecast(latitude, longitude), location])
    )
    .then(([{ forecast }, location]) =>
      res.status(HttpStatus.OK).send({
        location,
        address,
        forecast
      })
    )
    .catch(error =>
      res.status(error.statusCode).send({
        error: error.message
      })
    );
});
app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.status(HttpStatus.BAD_REQUEST).send({
      error: "Search must be provided"
    });
  }
  res.send({
    products: []
  });
});
app.get("/help/*", (req, res) => {
  res.render("not-found", {
    errorMessage: "Help article not found",
    title: "404 Not Found",
    name: "Fernando Alegría"
  });
});
app.get("*", (req, res) => {
  res.render("not-found", {
    errorMessage: "Page not found",
    title: "404 Not Found",
    name: "Fernando Alegría"
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
