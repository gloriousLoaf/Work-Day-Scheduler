// $(document).ready(function () {              // doc.ready is being a jerk. see line 101 for other setup

// $timeBlock used in colorCode() & fillSchedule()
let $timeBlock = $(".time-block");

// today's date from moment.js in jumbotron
let $todaysDate = moment().format("dddd, MMMM Do YYYY");
$("#currentDay").text($todaysDate);

// main array to hold all hour-block info and user entries
let schedule = [];

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
colorCode();

// fillSchedule() creates template Obj for hours & entries, pushes to local storage as JSON
function fillSchedule() {
    // loop through time-blocks, create schedEntry{}
    $timeBlock.each(function () {
        let $eachTimeBlock = $(this);
        let $hourBlock = parseInt($eachTimeBlock.attr("hour-block"));
        // holds hour-block info & user input for each entry
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
fillSchedule();

// createSchedule() uses info from fillSchedule()
function createSchedule() {
    // pull info stored by fillSchedule(), put into schedule as JSON
    schedule = localStorage.getItem("events");
    schedule = JSON.parse(schedule);

    // I really want this to work. MDN research at work!
    let i;
    for (let [hour, entry] of Object.entries(schedule)) {
        let eachHour = hour[i];
        let eachEntry = entry[i];
        // selector that grabs hour-block by eachHour value and adds eachEntry as child
        $("[hour-block=" + eachHour + "]").children("textarea").val(eachEntry);
    }
    console.log(schedule);
}

// saveButton() grabs hour & entry, loops them into schedule[], store stringified, call createSchedule()
function saveButton() {
    // some notes....                                                   // here!
    let getHourBlock = $(this).parent().attr("hour-block");
    let getEntry = (($(this).parent()).children("textarea")).val();

    // if (!localStorage.getItem("events")) {

    // find schedule index that corresponds to hour-block, updates that event with user input
    for (i = 0; i < schedule.length; i++) {
        if (schedule[i].hour == getHourBlock) {              // can i for-of this, or .each()?
            schedule[i].entry = getEntry;
        }
    }
    // store stringified schedule[]
    localStorage.setItem("events", JSON.stringify(schedule));
    createSchedule();
    // }
}

// // .saveBtn listener
let $clicked = $(".saveBtn")
$clicked.on("click", saveButton);


// we're setup. now check local storage. if empty, call fillSchedule(), else createSchedule()
$(document).ready(function () {
    //     if (localStorage.getItem("events")) {
    //         fillSchedule();
    //     }
    //     else {
    //         createSchedule();
    //     }
    // });
    // $(document).ready(function () {
    let check = localStorage.getItem("events");
    if (check = null) {
        fillSchedule();
    }
    else if (localStorage.getItem("events")) {
        createSchedule();
    }

});



// CODE GRAVEYARD

// begin older setup
// $(document).ready(function () {

//     // $timeBlock used in colorCode() & fillSchedule()
//     let $timeBlock = $(".time-block");

//     // today's date from moment.js in jumbotron
//     let $todaysDate = moment().format("dddd, MMMM Do YYYY");
//     $("#currentDay").text($todaysDate);

//     // main array to hold all hour-block info and user entries
//     let schedule = [];

//     // colorCode() dynamically updates classes based on local time
//     function colorCode() {
//         // for each block, add appropriate class, remove others
//         $timeBlock.each(function () {
//             // current hour from moment.js
//             let now = moment().format("H");
//             let $colorBlock = $(this);
//             let $hourBlock = parseInt($colorBlock.attr("hour-block"));
//             // past
//             if ($hourBlock < now) {
//                 $colorBlock.addClass("past").removeClass("present future");
//             }
//             // present
//             else if ($hourBlock == now) {
//                 $colorBlock.addClass("present").removeClass("past future");
//             }
//             // future
//             else if ($hourBlock > now) {
//                 $colorBlock.addClass("future").removeClass("past present");
//             }
//         });
//     }
//     // call it!
//     colorCode();

//     // fillSchedule() creates template Obj for hours & entries, pushes to local storage as JSON
//     function fillSchedule() {
//         // loop through time-blocks, create schedEntry{}
//         $timeBlock.each(function () {
//             let $eachTimeBlock = $(this);
//             let $hourBlock = parseInt($eachTimeBlock.attr("hour-block"));
//             // holds hour-block info & user input for each entry
//             let schedEntry = {
//                 hour: $hourBlock,
//                 entry: "",
//             }
//             // push Obj to schedule[]
//             schedule.push(schedEntry);
//             console.log(schedEntry)
//         });
//         // store stringified schedule[]
//         localStorage.setItem("events", JSON.stringify(schedule));
//     }

//     // createSchedule() uses info from fillSchedule()
//     function createSchedule() {
//         // pull stored info from fillSchedule(), put into schedule as JSON
//         schedule = localStorage.getItem("events");
//         schedule = JSON.parse(schedule);

//         // loop through schedule[] and put unique schedEntry info into vars
//         // for (let i = 0; i < schedule.length; i++) {
//         //     let eachHour = schedule[i].hour;
//         //     let eachEntry = schedule[i].entry;
//         //     // selector that grabs hour-block by eachHour value and adds eachEntry as child
//         //     $("[hour-block=" + eachHour + "]").children("textarea").val(eachEntry);
//         // }

//         // above commented-out for-loop is cool, but I really want to use this. MDN research at work!
//         for (const [key, value] of Object.entries(schedule)) {
//             let eachHour = key[i];
//             let eachEntry = value[i];
//             // selector that grabs hour-block by eachHour value and adds eachEntry as child
//             $("[hour-block=" + eachHour + "]").children("textarea").val(eachEntry);
//         }
//         console.log(schedule);
//     }

//     // check local storage, call fillSchedule() or createSchedule()
//     if (!localStorage.getItem("tasks")) {
//         fillSchedule();
//     }
//     // else {
//     // create schedule from local storage
//     createSchedule();
//     // }

//     // saveButton() grabs hour & entry, loops them into schedule[], store stringified, call createSchedule()
//     function saveButton() {
//         // some notes....                                                   // here!
//         let getHourBlock = $(this).parent().attr("hour-block");
//         let getEntry = (($(this).parent()).children("textarea")).val();

//         // find schedule index that corresponds to hour-block, updates that event with user input
//         for (i = 0; i < schedule.length; i++) {
//             if (schedule[i].hour == getHourBlock) {              // can i for-of this, or .each()?
//                 schedule[i].entry = getEntry;
//             }
//         }
//         // store stringified schedule[]
//         localStorage.setItem("events", JSON.stringify(schedule));
//         createSchedule();
//     }

//     // .saveBtn listener
//     let $clicked = $(".saveBtn")
//     $clicked.on("click", saveButton);

// });