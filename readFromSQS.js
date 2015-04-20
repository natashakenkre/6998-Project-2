var AWS = require('aws-sdk'); 
var util = require('util');
var async = require('async');
var fs = require('fs');

// configure AWS
AWS.config.update({
      'region': 'us-east-1'
});

var sqs = new AWS.SQS();

module.exports = {
  readSQSMesg : function () {
    var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
   
    //Gets parameters of the Message based on the config.json file
    var receiveMessageParams = 
    {
      QueueUrl: config.QueueUrl,
      MaxNumberOfMessages: 10
    };

    //Function to get messages from the SQS queue
    function getMessages() 
    {
      sqs.receiveMessage(receiveMessageParams, receiveMessageCallback);
    }

    //Allows you to retrieve, manipulate and delete used messages
    function receiveMessageCallback(err, data) 
    {
      console.log("Received message: ");
      console.log(data.MessageId);  //Displays the details of each recieved message

      if (data && data.Messages && data.Messages.length > 0) 
      {
        for (var i=0; i < data.Messages.length; i++) 
        {
          //Manipulate what needs to be done with the message here. Currently, this displays the details of each recieved message.
          console.log(data);
          
          //Gets parameters of the Message based on the config.json file
          var deleteMessageParams = 
          {
            QueueUrl: config.QueueUrl,
            ReceiptHandle: data.Messages[0].ReceiptHandle
          };

          //Calls the delete message function defined below to delete the message after evaluating it
          sqs.deleteMessage(deleteMessageParams, deleteMessageCallback);
        }
        getMessages(); //Gets the next message on the queue
      } 
      else {
        process.stdout.write("-");
      }
    }

    function deleteMessageCallback(err, data) 
    {
      //Manipulate what needs to be done with the deleted message here. Currently, this displays the details of each deleted message.
      console.log("Deleted Message: ");
      console.log(data);
    }

    //Sets the timeout for the entire process. Stops if no messages recieved. 
    setTimeout(getMessages(), 100);

  }
}