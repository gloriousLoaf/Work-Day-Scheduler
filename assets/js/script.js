// $(document).ready(function () {          // .ready was causing some strange problems. don't need it?

// today's date in jumbotron
let $todaysDate = moment().format("dddd, MMMM Do YYYY");
$("#currentDay").text($todaysDate);

// $timeBlock used in getSchedule() & colorCode()
let $timeBlock = $(".time-block");
let schedule = [];

// fillSchedule() puts user entry & hour-block into schedEntry{} that's pushed to schedule[] & stored locally
function fillSchedule() {
    // loop through time-blocks
    $timeBlock.each(function () {
        let $eachTimeBlock = $(this);
        let $hourBlock = parseInt($eachTimeBlock.attr("hour-block"));

        // holds hour-block info & user input for each entry
        let schedEntry = {
            hour: $hourBlock,
            entry: "",
        }
        schedule.push(schedEntry);
        console.log(schedEntry)
    });
    // store stringified schedule[]
    localStorage.setItem("events", JSON.stringify(schedule));
}

// colorCode() dynamically updates classes to show accurate colors
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

// createSchedule() uses info from fillSchedule()
function createSchedule() {
    // pull stored info from fillSchedule(), put into schedule as JSON
    schedule = localStorage.getItem("events");
    schedule = JSON.parse(schedule);

    // loop through schedule[] and put unique schedEntry info into vars         < .each()?
    for (let i = 0; i < schedule.length; i++) {
        let eachHour = schedule[i].hour;
        let eachEntry = schedule[i].entry;
        // selector that grabs hour-block by eachHour value and adds eachTask as child
        $("[hour-block=" + eachHour + "]").children("textarea").val(eachEntry);
    }
    console.log(schedule);
}

/* saveButton() is not functional yet. textarea entries just disappear */

// saveButton() grabs hour & task entry, loops them into schedule[], store stringified, call createSchedule()
function saveButton() {
    let getHourBlock = $(this).parent().attr("hour-block");
    let getEntry = (($(this).parent()).children("textarea")).val();

    // find schedule index that corresponds to hour-block, updates that task with user input
    for (i = 0; i < schedule.length; i++) {             // .each()?
        if (schedule[i].hour == getHourBlock) {
            schedule[i].entry = getEntry;
        }
    }
    // store stringified schedule[]
    localStorage.setItem("events", JSON.stringify(schedule));
    createSchedule();
}

/* This section below is still a mess! */

// call colorCode() to set up the page
colorCode();
// if local storage is empty, call fillSchedule()
// if (!localStorage.getItem("tasks")) {
fillSchedule();
// }
// create schedule from local storage
createSchedule();

let $saveBtn = $(".saveBtn");
$saveBtn.on("click", function () {
    saveButton();
})

// });
