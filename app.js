$(document).ready(function () {
    // console.log("ready");

    // firebase database configuration...
    var config = {
        apiKey: "AIzaSyBzs40yJ6XZsze1l1MQ4XlJQWyd2nzdV9M",
        authDomain: "train-scheduler-proj.firebaseapp.com",
        databaseURL: "https://train-scheduler-proj.firebaseio.com",
        projectId: "train-scheduler-proj",
        storageBucket: "train-scheduler-proj.appspot.com",
        messagingSenderId: "448535817181"
    };

    firebase.initializeApp(config);

    // set database to firebase
    var database = firebase.database();

    // before, i wasn't able to get the original data from the database to display when the page loads, 
    // but making the table update global by pushing all the data to firebase worked great!
    var updatedTable = database.ref().on("child_added", function (childsnapshot) {
        console.log("this is the database stuff: ", childsnapshot.val())
        var rows = $("<tr>");
        $(rows).append("<td>" + childsnapshot.val().name + "</td>"
            + "<td>" + childsnapshot.val().dest + "</td>"
            + "<td>" + childsnapshot.val().freq + "</td>"
            + "<td>" + childsnapshot.val().arriv + "</td>"
            + "<td>" + childsnapshot.val().minA + "</td>");
        $("tbody").append(rows)
    });


    // when submit button is clicked...
    $("#submit-button").on("click", function (event) {
        event.preventDefault();

        // $("tbody").empty();
        // train data to send to firebase (working)
        var trainData = {
            name: $("#train-name").val().trim(),
            dest: $("#destination").val().trim(),
            time: $("#firstTrainTime").val().trim(),
            freq: $("#frequency-min").val().trim(),
            arriv: arrivalTime,
            minA: minutesAway
        }
        // make sure all the inputs are filled out (working)
        if (trainData.name === "" ||
            trainData.dest === "" ||
            trainData.time === "" ||
            trainData.freq === "") {
            alert("Please fill out all boxes.")
        } else {
            // if we're all filled out, the data will get sent to the database (working)
            var firstTymeConverted = moment(trainData.time, "HH:mm").subtract(1, "years");
            // console.log(firstTymeConverted);

            // creating differential time (not working?)
            var diffTime = moment().diff(moment(firstTymeConverted), "minutes");
            // console.log("this is the time from the database: ", moment(time));
            // console.log("is moment working?", diffTime)

            var tRemainder = diffTime % trainData.freq;
            // console.log(tRemainder);

            // how much time is left until next train arrives (working)
            var minutesAway = trainData.freq - tRemainder;
            // console.log("minutes away: ", minutesAway);

            // time next train arrives
            var arrivalTime = moment().add(minutesAway, "minutes").format("HH:mm");
            // console.log("arrival time: ", arrivalTime);

            // object to push to firebase
            var trainData = {
                name: $("#train-name").val().trim(),
                dest: $("#destination").val().trim(),
                time: $("#firstTrainTime").val().trim(),
                freq: $("#frequency-min").val().trim(),
                arriv: arrivalTime,
                minA: minutesAway
            }
            // send data to firebase
            database.ref().push(trainData);
            // clear input fields from form
            $("#train-name").val(""),
                $("#destination").val(""),
                $("#firstTrainTime").val(""),
                $("#frequency-min").val("")
        }

    });

});
