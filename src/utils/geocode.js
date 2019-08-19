const request = require("request");
const HttpStatus = require("http-status-codes");

const mapBoxAccessToken =
  "pk.eyJ1IjoiZmVybmFuYWxlZ3JpYSIsImEiOiJjanpjcnY0NjcwMTExM2pscWFkMnIyNHB0In0.j1X6zZ_l7SkYynrdtPHWCA";

const geocode = address => {
  const url = `http://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json`;

  const qs = {
    limit: 1,
    language: "en",
    access_token: mapBoxAccessToken
  };

  return new Promise((resolve, reject) => {
    request({ url, json: true, qs }, (error, response) => {
      if (error) {
        reject({
          message: "Unable to connect to location service!",
          statusCode: HttpStatus.SERVICE_UNAVAILABLE
        });
      } else if (response.statusCode != HttpStatus.OK) {
        reject({
          message: "Unable to find location",
          statusCode: response.statusCode
        });
      } else {
        const { features } = response.body;
        if (features.length > 0) {
          const {
            center: [longitude, latitude],
            place_name
          } = features[0];
          resolve({
            latitude,
            longitude,
            location: place_name
          });
        } else {
          reject({
            message: "No relevant results matched your query :(",
            statusCode: HttpStatus.OK
          });
        }
      }
    });
  });
};

module.exports = geocode;
