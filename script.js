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