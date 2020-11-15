import "./css/styles.css";
import countriesApi from "./js/fetch-contries";
import countryTpl from "./templates/country-card.hbs";
import countriesTpl from "./templates/list-countries.hbs";
import getRefs from "./js/get-refs";

import { info, error } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
const refs = getRefs();
const debounce = require("lodash.debounce");
let findCountry = "";

refs.input.addEventListener(
  "input",
  debounce(() => {
    onSearch();
  }, 500)
);

function onSearch() {
  resetSearch();
  findCountry = refs.input.value;
  countriesApi(findCountry)
    .then(addMarkup)
    .catch((error) => console.log(error));
}

function resetSearch() {
  refs.countriesContainer.innerHTML = "";
}

function addMarkup(countries) {
  if (countries.length === 1) {
    resetSearch();
    markupContries(countryTpl, countries);
  } else if (countries.length > 1 && countries.length <= 10) {
    resetSearch();
    markupContries(countriesTpl, countries);
  } else if (countries.length > 10) {
    resultMessage(
      error,
      "To many matches found. Please enter a more specific query!"
    );
  } else {
    resultMessage(info, "No matches found!");
  }
}

function resultMessage(typeInfo, textInfo) {
  typeInfo({
    text: `${textInfo}`,
    closerHover: true,
    shadow: true,
    mouseReset: false,
    delay: 2000,
  });
}

function markupContries(tpl, countries) {
  refs.countriesContainer.insertAdjacentHTML("beforeend", tpl(countries));
}
