const request = require("request");
const HttpStatus = require("http-status-codes");

const darkSkyAccessToken = "f28be019945ccdd18f324671fe55747f";

const forecast = (latitude, longitude) => {
  const url = `https://api.darksky.net/forecast/${darkSkyAccessToken}/${latitude},${longitude}`;

  const qs = {
    units: "si",
    lang: "en",
    exclude: "minutely,hourly,alerts,flags"
  };

  return new Promise((resolve, reject) => {
    request({ url, json: true, qs }, (error, response) => {
      if (error) {
        reject({
          message: "Unable to connect to forecast service!",
          statusCode: HttpStatus.SERVICE_UNAVAILABLE
        });
      } else if (response.statusCode != HttpStatus.OK) {
        reject({
          message: "Unable to find location",
          statusCode: response.statusCode
        });
      } else {
        const {
          currently: { temperature, precipProbability },
          daily: { summary }
        } = response.body;
        resolve({
          forecast: `${summary} It is currently ${temperature} degrees out. There is a ${precipProbability}% chance of rain.`
        });
      }
    });
  });
};

module.exports = forecast;
