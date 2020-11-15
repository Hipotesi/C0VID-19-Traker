// https://corona.lmao.ninja/v2/countries/

const apiURL = "https://corona.lmao.ninja/v2/countries/";
const covidSearch = document.getElementById("covidSearch");
const search = covidSearch.querySelector("#search");

function formatNumber(num) {
  return String(num).replace(/(.)(?=(\d{3})+$)/g, "$1,");
}

async function getCovidData() {
  const apiResponse = await fetch(apiURL);
  const data = await apiResponse.json();
  return data;
}

async function getCovidDataPerCountry(country) {
  const apiResponse = await fetch(
    `https://corona.lmao.ninja/v2/countries/${country}`
  );
  const data = await apiResponse.json();
  searchResultUI([data]);
}

function searchResultUI(data) {
  const searchResult = document.querySelector(".search__result");
  for (const item of data) {
    loader(searchResult);
    setTimeout(() => {
      searchResult.innerHTML = `
    <div class="flag">
        <img src=${item.countryInfo.flag} alt="" />
    </div>
     <ul>
        <li>
        <p>
            Cases: ${formatNumber(item.cases)} | Today: ${formatNumber(
        item.todayCases
      )} | Active: ${formatNumber(item.active)} </br>
            Deaths: ${formatNumber(item.deaths)} | Recovered: ${formatNumber(
        item.recovered
      )} </br>
            Critical ${formatNumber(item.critical)}
          </p>
        </li>
     </ul>
    `;
    }, 2000);
  }
}

async function worldPhilData() {
  const response = await getCovidData();
  const worldStatEl = document.querySelector(".world__status");
  const philStatEl = document.querySelector(".phil__status");

  let wordlCases = 0;
  let wordlDeaths = 0;
  let wordlRecovered = 0;
  let worldData = "";
  for (const data of response) {
    worldData = {
      cases: (wordlCases += data.cases),
      deaths: (wordlDeaths += data.deaths),
      recovered: (wordlRecovered += data.recovered),
    };
  }
  worldStatEl.innerHTML = `
  <div class="status__item">
    <h2 id="wconfirmed">${worldData.cases}</h2>
    <p class="confirmed">confirmed</p>
   </div>
   <div class="status__item">
    <h2 id="wdeaths">${worldData.deaths}</h2>
    <p class="deaths">deaths</p>
   </div>
   <div class="status__item">
    <h2 id="wrecovered">${worldData.recovered}</h2>
    <p class="recovered">recovered</p>
   </div>  
  `;
  worldNumStatEffect({ wconfirmed, wdeaths, wrecovered }, worldData);

  response.forEach((res) => {
    if (res.country === "Spain") {
      philStatEl.innerHTML = `
        <div class="status__item">
        <h2 id="pconfirmed">${res.cases}</h2>
        <p class="confirmed">confirmed</p>
       </div>
       <div class="status__item">
        <h2 id="pdeaths">${res.deaths}</h2>
        <p class="deaths">deaths</p>
       </div>
       <div class="status__item">
        <h2 id="precovered">${res.recovered}</h2>
        <p class="recovered">recovered</p>
       </div>  
        `;

      philNumStatEffect({ pconfirmed, pdeaths, precovered }, res);
    }
  });
}

function worldNumStatEffect(id, data) {
  const confirmed = new CountUp(id.wconfirmed, 0, data.cases);
  const deaths = new CountUp(id.wdeaths, 0, data.deaths);
  const recovered = new CountUp(id.wrecovered, 0, data.recovered);
  confirmed.start();
  deaths.start();
  recovered.start();
}

function philNumStatEffect(id, data) {
  const confirmed = new CountUp(id.pconfirmed, 0, data.cases);
  const deaths = new CountUp(id.pdeaths, 0, data.deaths);
  const recovered = new CountUp(id.precovered, 0, data.recovered);
  confirmed.start();
  deaths.start();
  recovered.start();
}

function showErrorMessage(message) {
  const smallEl = document.createElement("small");
  smallEl.classList.add("error");
  smallEl.textContent = message;
  covidSearch.insertBefore(smallEl, covidSearch.lastChild);
  setTimeout(() => {
    smallEl.remove();
  }, 2000);
}

function loader(searchResult) {
  const loader = document.createElement("img");
  loader.className = "loader";
  loader.src = "img/loader.gif";
  covidSearch.insertBefore(loader, covidSearch.lastChild);
  searchResult.innerHTML = "";
  setTimeout(() => {
    loader.remove();
  }, 2000);
}

// event
document.addEventListener("DOMContentLoaded", worldPhilData);

covidSearch.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value;

  if (!searchTerm) {
    showErrorMessage("Please enter a country");
  } else {
    getCovidDataPerCountry(searchTerm);
  }

  covidSearch.reset();
});
