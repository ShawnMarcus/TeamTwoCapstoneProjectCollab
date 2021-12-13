// ------- GLOBALLY SCOPED VARIABLES ---------------
let city = "";
let apiKeyFore = "31bc0639ecbf46fe8fb7a18255b9f63c";
let lon;
let lat;
let userInput;
let natParkCode;
let chosenPark;
let imgSource;
let parkInfo = $("#parkInfo");
let rain = "";

//clears function
function clear() {
    $("#parkList").empty()
    $("#appInfo").hide()
}

function clearParkInfo() {
    $("#columns").empty();
    $("#directions").empty();
    $("#campgrounds").empty();
    $("#selectedAlerts").empty();
    $("#fullName").empty();
    $("#weather").remove();
    
}

function autoComplete() {

    let stateCodes = ("AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY").split(" ");
    $( "#user-input" ).autocomplete({
        source: stateCodes
    });
    
}

// Page Load
function onLoad() {
    $("#appInfo").show();
    $("#parkList").hide();
    $("#parkInfo").hide();
    $("#goBack").hide();
    $("#progressbar").hide();
    clearStorage();
    autoComplete();
}

// Getting Info From Park
function stateParks() {
    
    let queryURL = "https://developer.nps.gov/api/v1/parks?stateCode=" + userInput + "&api_key=8Mvx3Lnd1BgLAuyl8VNeOCL5jxVIYfmhBrnxwNWu";

    $("#progressbar").show();

    $.ajax({
        url: queryURL,
        method: "GET"

    }).then(function (response) {
        console.log(response);
        $("#progressbar").hide();
        for (let i = 0; i < response.data.length; i++) {
            lat = response.data[i].latitude;
            lon = response.data[i].longitude;
            let name = response.data[i].fullName;
            natParkCode = response.data[i].parkCode;
            entranceFee = response.data[i].entranceFees[0];

            let parkCard = $("<div class='col s12 m6 l4 xl3' id='parkSearchResults'>")
            let cardDiv = $("<div class='card large'> ");
            let imgDiv = $("<div class= 'card-image'>");
            let parkImage = $(`<img data-code="${natParkCode}" class='imgOfPark' src=''/>`);
            let parkName = $(`<span class = 'card-title'>${name}<span>`);

            let desDiv = $("<div class='card-content'>");
            let description = $(`<p> ${response.data[i].description}</p>`);

            let imgSrc = "";

            if (response.data[i].images.length === 0) {
                imgSrc = "assets/images/npsdefault.jpg"
            } else {
                imgSrc = response.data[i].images[0].url;

            }

            parkImage.attr({
                "src": imgSrc,
                "data-lat": lat,
                "data-lon": lon
            });


            // for the Park List Div
            imgDiv.append(parkImage, parkName);
            desDiv.append(description);
            cardDiv.append(imgDiv, desDiv);
            parkCard.append(cardDiv);
            $("#parkList").append(parkCard);



        }
    })

}

// Park Activities
function choosePark(chosenPark) {

    // Campground Details
    $.ajax({
        url: "https://developer.nps.gov/api/v1/campgrounds?parkCode=" + chosenPark + "&api_key=8Mvx3Lnd1BgLAuyl8VNeOCL5jxVIYfmhBrnxwNWu",
        method: "GET"
    }).then(function (response) {
        console.log(response);
        
        let campUl = $("<ul>");
        if (response.data.length < 1) {
            $("#campgrounds").append("<p> This park does not offer any camping. </p>");
            console.log("false")
            
        } else {
                for (let i = 0; i < response.data.length; i++) {
                console.log(response.data[i].name);
                let campLi = $("<li>").text(response.data[i].name);
                campUl.append(campLi);

                $("#campgrounds").append(campUl)
            }

        }
        
    })

    // Activities and Directions for Park
    $.ajax({
        url: "https://developer.nps.gov/api/v1/parks?stateCode=" + userInput + "&api_key=8Mvx3Lnd1BgLAuyl8VNeOCL5jxVIYfmhBrnxwNWu",
        method: "GET"
    }).then(function (response) {


        for (let i = 0; i < response.data.length; i++) {
            if (response.data[i].parkCode === chosenPark) {
                console.log(response.data[i].fullName);
                $("#fullName").text(response.data[i].fullName);

                let acts = response.data[i].activities
        
                let actLi = $("#columns")

                $("#directions").text(response.data[i].directionsInfo);


                for (let j = 0; j < acts.length; j++) {
                    let item = $("<li>").text(acts[j].name);
                    
                    actLi.append(item);
                }

            }
        }
    })
}

// Alerts for Closures and COVID Details

function getAlerts(chosenPark) {

    if (!chosenPark) {
        return false
    }

    let alertUrl = `https://developer.nps.gov/api/v1/alerts?parkCode=${chosenPark}&stateCode=${userInput}&api_key=HtphDBtSdwAKMfdRhxg6VcvTpgK8vRGyDRko6hx2`

    $.ajax({
        url: alertUrl,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        let alerts = response.data
        
        for (let i = 0; i < alerts.length; i++) {
            let alertDes = alerts[i].description;
            let alertCat = alerts[i].category;
            let alertTitle = alerts[i].title;

            let alertHead = $(`<h6> ${alertTitle} </h6>`);
            let alertSubhead = $(`<p> ${alertCat}</p>`);
            let alertInfo = $(`<p> ${alertDes} </p>`);

            $("#selectedAlerts").append(alertHead, alertSubhead, alertInfo);
        }

    })
}

// Weather!
function forecast(parkLat, parkLon) {

    if (!parkLat && !parkLon) {
        return false;
    }

    let forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lon=${parkLon}&lat=${parkLat}&key=${apiKeyFore}&units=i&days=3`

    $.ajax({
        url: forecastUrl,
        method: "GET"
    }).then(function (response) {
        let forecast = response.data
        console.log(response)
        let weatherDiv = $("<div class='wrapper container' id='weather'>");
        let forecastDiv = $("<div class='row days center-align'>");
        let cardDiv = $("<div class='col s12 offset-m1 center-align'>");

        for (let i = 0; i < forecast.length; i++) {

            let weatherCode = forecast[i].weather.code
            console.log(weatherCode)
            let weatherDes = forecast[i].weather.description
            console.log(weatherDes)
            let iconCode = forecast[i].weather.icon

            let cardPanel = $("<div class = 'card-panel teal lighten-5 col s12 m3  center-align days'>");

            let date = $(`<h6> ${moment.unix(forecast[i].ts).format("M/D/YY")} </h6> `);
            let temp = $(`<p> Temperature: ${forecast[i].temp} &degF </p> `);
            let icon = $(`<img>`)
            icon.attr({
                "src": `assets/icons/${iconCode}.png`,
                "data-weatherCode": weatherCode
            });


            ifRaining(weatherCode, weatherDes);
            cardPanel.append(date, temp, icon, rain);
            cardDiv.append(cardPanel);
            forecastDiv.append(cardDiv)
            weatherDiv.append(forecastDiv)
            $("#parkInfo").append(weatherDiv)


        }

    })

}

// This SHOULD pull up TripAdvisor's API for alternate activities if the Weather API indicates bad weather.
function ifRaining(weatherCode) {

    if (weatherCode < 800) {
        rain = `<p> Looks like the weather is not great. Look up other activities in the area?</p>
        <p> <a href='https://www.tripadvisor.com' target='_blank'>Trip Advisor</a> </p>`
    } else {
        rain = "<p>The weather is great for an adventure!</p>";
    }
    return rain;
}

// Keeps Previous Searches in the Search Box
function saveUserInput() {
    localStorage.setItem("input", JSON.stringify(userInput));
}

function getUserInput() {
    userInput = JSON.parse(localStorage.getItem("input")) || "";
    stateParks();
}

function clearStorage() {
    localStorage.clear();
}

// ---- FUNCTION CALLS ----
onLoad();

// ----- CLICK EVENTS ------
$(document).on("click", ".imgOfPark", function () {
    $("#parkList").hide();
    $("#parkInfo").show();
    $("#goBack").show();
    let parkLat = $(this).data("lat");
    let parkLon = $(this).data("lon");
    let chosenPark = $(this).data("code");
    console.log(chosenPark);
    forecast(parkLat, parkLon);
    choosePark(chosenPark);
    getAlerts(chosenPark);
});

$("#add-park").on("click", function (event) {
    event.preventDefault();
    clear();
    $("#parkList").show();
    $("#parkInfo").hide();
    userInput = $("#user-input").val().trim();
    console.log(userInput);
    stateParks();
    $("#user-input").val("");
    saveUserInput();
    clearParkInfo();
});

$("#goBack").on("click", function () {
    $("#parkInfo").hide();
    $("#parkList").show();
    clearParkInfo();
    
})

let input = document.getElementById("user-input");

// Execute a function when the user presses the "enter" key on the keyboard (instead of using a separate select button we are using this)
input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("add-park").click();
  }
});