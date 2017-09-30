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
  var frequency2 = parseInt(frequency);
  console.log(typeof frequency2);//object


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
  // trainDiff = moment().diff(moment.unix(sv.time), "minutes");
  //
  // trainRemainder = trainDiff % sv.frequency;
  //
  // minutesTillArrival = sv.frequency - trainRemainder;
  //
  // nextTrainTime = moment().add(minutesTillArrival, "mm").format("hh:mm");
  //==============================================================================

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
  console.log(firstTimeConverted);
  console.log(typeof firstTimeConverted); //correct

  // Current Time
  var currentTime = moment();
  //var curTime = currentTime.toISOString();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
  console.log(typeof currentTime); // correct

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  //diffTime.toString();
  console.log("DIFFERENCE IN TIME: " + diffTime);
  console.log(typeof diffTime); // wrong believe issue is with type of value caused by .diff
  var diffTime2 = parseInt(diffTime);
  console.log(typeof diffTime2);// states number still

  // Time apart (remainder)
  var tRemainder = diffTime % frequency;
  console.log(tRemainder);
  console.log(typeof tRemainder); //wrong probably because of diffTime var

  // Minute Until Train
  var tMinutesTillTrain = frequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
  console.log(typeof tMinutesTillTrain); // wrong probably because of tRemainder
  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
  console.log(typeof nextTrain); // correct
  //==============================================================================
  // console.log(sv.trainName);
  // console.log(sv.destination);
  // console.log(sv.firstTrain);
  // console.log(sv.frequency);
  // console.log(trainDiff);
  // console.log(trainRemainder);
  // console.log(nextTrainTime);
  // console.log(minutesTillArrival);
  // console.log(typeof trainDiff); // number
  // console.log(typeof trainRemainder); // number
  // console.log(typeof nextTrainTime); //string, displays properly
  // console.log(typeof minutesTillArrival); // number


  var tdtrainName = $('<td>').text(sv.trainName);
  var tddestination = $('<td>').text(sv.destination);
  var tdfirstTrain = $('<td>').text(sv.firstTrain);
  var tdfrequency = $('<td>').text(sv.frequency);
  var tdnextArrival = $('<td>').text(nextTrain);
  var tdminutesAway = $('<td>').text(tMinutesTillTrain);
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
