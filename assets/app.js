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

database.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {

  var sv = snapshot.val();
  //==============================================================================
  //below is where i am having issues.
  //==============================================================================
  trainDiff = moment().diff(moment.unix(sv.time), "minutes");

  // get the remainder of time by using 'moderator' with the frequency & time difference, store in var
  trainRemainder = trainDiff % sv.frequency;

  // subtract the remainder from the frequency, store in var
  minutesTillArrival = sv.frequency - trainRemainder;

  // add minutesTillArrival to now, to find next train & convert to standard time format
  nextTrainTime = moment().add(minutesTillArrival, "mm").format("hh:mm");
  //==============================================================================
  //above is where im having issues.
  //==============================================================================
  console.log(sv.trainName);
  console.log(sv.destination);
  console.log(sv.firstTrain);
  console.log(sv.frequency);
  console.log(minutesTillArrival);
  console.log(nextTrainTime);


  var tdtrainName = $('<td>').text(sv.trainName);
  var tddestination = $('<td>').text(sv.destination);
  var tdfirstTrain = $('<td>').text(sv.firstTrain);
  var tdfrequency = $('<td>').text(sv.frequency);
  var tdnextArrival = $('<td>').text(nextTrainTime);
  var tdminutesAway = $('<td>').text(minutesTillArrival);
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
