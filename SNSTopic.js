var AWS = require('aws-sdk'); 
var util = require('util');
var config = require('./config.json');

// configure AWS
AWS.config.update({
  'region': 'us-east-1'
});

var sns = new AWS.SNS();

//Publishes Messages to the SQS Queue based on the Subscription created in create.js
function publish(mesg) {
  
  //Takes parameters based on the Config file
  var publishParams = { 
    TopicArn : config.TopicArn,
    Message: mesg
  };

  //Publishes the Messages using the parameters
  sns.publish(publishParams, function(err, data) {
    console.log(data); //Displays the Request IDs and Message IDs for the message
  });
}

//Allows you to send the actual message using the function defined above
for (var i=0; i < 10; i++) //Modify message number here
{
  publish("message: " + i); //Modify message content here
}
