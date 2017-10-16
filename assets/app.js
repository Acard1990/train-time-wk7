// Initialize Firebase
var config = {
  apiKey: "AIzaSyDV9y1lqb4bkCa5yOiM_pVIgJrffH-dVpw",
  authDomain: "train-scheduler-2ab54.firebaseapp.com",
  databaseURL: "https://train-scheduler-2ab54.firebaseio.com",
  projectId: "train-scheduler-2ab54",
  storageBucket: "train-scheduler-2ab54.appspot.com",
  messagingSenderId: "414421903105"
};
firebase.initializeApp(config);

var database = firebase.database();
var trainName = "";
var destination = "";
var firstTrain = "";
var frequency = ""; //note parseInt this var

$("#submit-button").on("click", function(event) {
  event.preventDefault();

  // Grabbed values from text boxes
  trainName = $("#trainName").val().trim();
  destination = $("#destination").val().trim();
  firstTrain = $("#firstTrain").val().trim();
  frequency = $("#frequency").val().trim();
  //var frequency2 = Number.parseInt(frequency);
  //console.log(typeof frequency2);//object


  // Code for handling the push
  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTrain").val("");
  $("#frequency").val("");
});


database.ref().orderByChild("dateAdded").on("child_added", function(snap) {

  //var sv = snapshot.val();
  //==============================================================================
  //Everything commented out is what I was orignally working with.  I ended up getting
  //help and rewrote most of the below parts.  
  //==============================================================================

  // First Time (pushed back 1 year to make sure it comes before current time)
  //var firstTimeConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
  //console.log(typeof firstTimeConverted);
  //var firstTimeC2 = Number.parseInt(firstTimeConverted);
  //console.log(typeof firstTimeC2);



  // Current Time
  //var currentTime = moment();
  //console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
  //console.log(typeof currentTime); // correct

  // Difference between the times
  //var diffTime = moment().diff(moment(firstTimeC2), "minutes");
  //var diffTime2 = Number.parseInt(diffTime);
  //console.log("DIFFERENCE IN TIME: " + diffTime2);//


  // Time apart (remainder)
  //var tRemainder = diffTime2 % frequency;
  //console.log(tRemainder);b
  //console.log('tRemainder', typeof tRemainder); //wrong probably because of diffTime var

  // Minute Until Train
  //var tMinutesTillTrain = frequency - tRemainder;
  //console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
  //console.log('tMinutesTillTrain',typeof tMinutesTillTrain); // wrong probably because of tRemainder
  // Next Train
  //var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  //console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
  //console.log(typeof nextTrain); // correct
  //==============================================================================
  var trainName = snap.val().trainName;
  // store value of destination snapshot in destination var
  var destination = snap.val().destination;
  // store value of firstTrain snapshot in firstTrain var
  var firstTrain = snap.val().firstTrain;
  // store value of frequency snapshot in frequency var
  var frequency = snap.val().frequency;
  // converting entered time to military time in case non-military time is entered and store in convertTime var
  var convertTime = moment(firstTrain, "HH:mm");
  // find the different between the current time (i.e. moment()) and the convertTime and store in diff var
  var diff = moment().diff(moment(convertTime), "minutes");
  // modulus operation to find the remainder of diff divided by frequency and store it in remainder var
  var remainder = diff % frequency;
  // difference between frequency and remainder to get time till next train and store it in minTrain var
  var minTrain = frequency - remainder;
  // add the time till next the next train to the current time, format it in militay time, and store it in nextTrain var
  var nextTrain = moment().add(minTrain, "minutes").format("HH:mm");

  var tdtrainName = $('<td>').text(trainName);
  var tddestination = $('<td>').text(destination);
  var tdfirstTrain = $('<td>').text(firstTrain);
  var tdfrequency = $('<td>').text(frequency);
  var tdnextArrival = $('<td>').text(nextTrain);
  var tdminutesAway = $('<td>').text(minTrain);
  var tr = $('<tr>');


  tr.append(tdtrainName)
    .append(tddestination)
    .append(tdfirstTrain)
    .append(tdfrequency)
    .append(tdnextArrival)
    .append(tdminutesAway);

  $('#train-info').append(tr);

  // Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});
