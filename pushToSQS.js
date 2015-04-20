var AWS = require('aws-sdk'),
	awsCredentialsPath = './credentials.json',
	sqsQueueUrl = 'https://sqs.us-west-2.amazonaws.com/336828499216/AbsintheCustomer',
	sqs;

//Load credentials from local json file
AWS.config.loadFromPath(awsCredentialsPath);

//Instantiate SQS Client
var sqs = new AWS.SQS();

// function to read messages off the queue created.
// I am not sure we need this, but I am putting it here, just in case.
// This function returns only one message for some reason, I am gonna check up with the TA about this.  
// Use this only for testing. Not required for project.
function readMessage() {
	sqs.receiveMessage({
		QueueUrl: sqsQueueUrl,
		MaxNumberOfMessages: 2, // how many messages do we wanna retrieve?
		VisibilityTimeout: 60, // seconds - how long we want a lock on this job
		WaitTimeSeconds: 3 // seconds - how long should we wait for a message?
	}, function(err, data) {
		// If there are any messages to get
		var sqs_message_body;
		if (data.Messages) {
			var message = data.Messages[0];
			//sqs_message_body = JSON.parse(data.Messages[0].Body);
			console.log(message);
		}
	});
}

readMessage();

// function to push messages onto the queue. 
exports.sendMessage = function(Message) {
	sqs.sendMessage({
		QueueUrl: sqsQueueUrl,
		MessageBody: Message
	}, function(err, data) {});
};
