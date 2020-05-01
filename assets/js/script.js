/* On first load or refresh */
$(document).ready(function () {

    // today's date from moment.js in jumbotron
    let $todaysDate = moment().format("dddd, MMMM Do YYYY");
    $("#currentDay").text($todaysDate);

    /* Current weather, based on zip by IP address (I'm pretty proud of this) */

    // IP Geolocation: https://ip-api.com/
    // This function grabs user zip, feeds it to openweathermaps api, displays weather
    // Only as accurate as network data (no VPNs etc.)
    // I really went my own way with this, but thanks to inspiration found at:
    // https://stackoverflow.com/questions/33946925/how-do-i-get-geolocation-in-openweather-api
    let locationIP = "http://ip-api.com/json/?fields=zip";
    $.getJSON(locationIP).done(function (location) {
        // vars to get just the zip from ip-api JSON
        locationIP = location.zip;
        let realIP = locationIP;
        // plug zip info into openweathermap ajax call
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?zip=" + realIP + "&units=imperial&appid=c3632a824cb9d8b82f74d0ec35c2639b";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // vars for city name & current temp
            let city = response.name;
            let temp = parseInt(response.main.temp);
            // concat & display!
            let displayWeather = city + ", " + temp + "°F";
            $("#currentWeather").text(displayWeather);
        });
    });

    // sets up color scheme, see line 54
    colorCode();

    // schedule logic:
    // if empty, fillSchedule() sets up a blank template, see line 80
    if (!localStorage.getItem("events")) {
        fillSchedule();
    }
    // otherwise, createSchedule() pulls local storage info, see line 99
    createSchedule();
});


/* Creating our schedule */

// $timeBlock used in colorCode() & fillSchedule()
let $timeBlock = $(".time-block");

// colorCode() dynamically updates classes based on local time
function colorCode() {
    // for each block, add appropriate class, remove others
    $timeBlock.each(function () {
        // current hour from moment.js
        let now = moment().format("H");
        let $colorBlock = $(this);
        let $hourBlock = parseInt($colorBlock.attr("hour-block"));
        // past
        if ($hourBlock < now) {
            $colorBlock.addClass("past").removeClass("present future");
        }
        // present
        else if ($hourBlock == now) {
            $colorBlock.addClass("present").removeClass("past future");
        }
        // future
        else if ($hourBlock > now) {
            $colorBlock.addClass("future").removeClass("past present");
        }
    });
}

// main array to hold all hour-block info and user entries
let schedule = [];

// fillSchedule() creates template Obj for hours & entries, pushes to local storage as JSON
function fillSchedule() {
    // loop through time-blocks, create schedEntry{} properties
    $timeBlock.each(function () {
        let $eachTimeBlock = $(this);
        let $hourBlock = parseInt($eachTimeBlock.attr("hour-block"));
        // hour holds hour-block info, entry creates a blank string (for now)
        let schedEntry = {
            hour: $hourBlock,
            entry: "",
        }
        // push Obj to schedule[]
        schedule.push(schedEntry);
        console.log(schedEntry)
    });
    // store stringified schedule[]
    localStorage.setItem("events", JSON.stringify(schedule));
}

// createSchedule() uses info from fillSchedule()
function createSchedule() {
    // pull info stored by fillSchedule(), parse back to Obj, put into schedule
    schedule = localStorage.getItem("events");
    schedule = JSON.parse(schedule);
    // fill new vars with properties of Obj
    for (let i = 0; i < schedule.length; i++) {
        let eachHour = schedule[i].hour;
        let eachEntry = schedule[i].entry;
        // selector that grabs hour-block by eachHour value and adds eachEntry value to child textarea
        $("[hour-block=" + eachHour + "]").children("textarea").val(eachEntry);
        // $("textarea").css("color", "white");
    }
    console.log(schedule);
}


/* Saving & Clearing schedule events */

// saveButton() grabs user inputs, loops them into schedule[], store stringified, call createSchedule()
function saveButton() {
    // vars to grab user entry and where it happened
    let getHourBlock = $(this).parent().attr("hour-block");
    let getEntry = (($(this).parent()).children("textarea")).val();
    // find schedule[] index that corresponds to hour-block, updates entry value with user input
    for (i = 0; i < schedule.length; i++) {
        if (schedule[i].hour == getHourBlock) {
            schedule[i].entry = getEntry;
        }
    }
    // store stringified schedule[]
    localStorage.setItem("events", JSON.stringify(schedule));
    createSchedule();
}

// jQuery UI! colorShift() shows visual confirmation of saved entry
function colorShift() {
    // get the sibling textarea of specific saveBtn click
    let $colorClick = $(this).siblings("textarea");
    // animate color from black to white to black
    $colorClick.animate({
        color: "#fff",
    }, 600);
    $colorClick.animate({
        color: "#000",
    }, 600);
}

// .saveBtn listener calls saveButton() & colorShift()
let $clicked = $(".saveBtn");
$clicked.on("click", saveButton);
$clicked.on("click", colorShift);

// clearSchedule clears local storage, empties entire schedule
function clearSchedule() {
    localStorage.clear();
    // empty schedule[]
    schedule = [];
    // reset Obj for new data
    fillSchedule();
    // clear out hour-blocks
    createSchedule();
}

// .clear-schedule listener calls clearSchedule()
let $clear = $(".clear-schedule");
$clear.on("click", clearSchedule);