const weatherForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const messsageOne = document.querySelector("#message-1");
const messsageTwo = document.querySelector("#message-2");

weatherForm.addEventListener("submit", e => {
  e.preventDefault();
  const address = searchInput.value;
  const url = new URL("http://localhost:3000/weather");
  url.searchParams.append("address", address);
  messsageOne.textContent = "Loading...";
  messsageTwo.textContent = "";
  fetch(url).then(response => {
    response.json().then(data => {
      if (!data.error) {
        messsageOne.textContent = data.location;
        messsageTwo.textContent = data.forecast;
      } else {
        messsageOne.textContent = data.error;
      }
    });
  });
});
