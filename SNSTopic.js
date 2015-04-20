var AWS = require('aws-sdk'); 
var util = require('util');
var fs = require('fs');

// configure AWS
AWS.config.update({
  'region': 'us-east-1'
});

var sns = new AWS.SNS();

//Publishes Messages to the SQS Queue based on the Subscription created in create.js
exports.publish = function(mesg) {
  var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

  //Takes parameters based on the Config file
  var publishParams = { 
    TopicArn : config.TopicArn,
    Message: mesg
  };

  //Publishes the Messages using the parameters
  sns.publish(publishParams, function(err, data) {
    console.log(data); //Displays the Request IDs and Message IDs for the message
  });
};

