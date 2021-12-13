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