var createvar = require('./create');
createvar.initialize();

var snsvar = require('./SNSTopic.js');
var sqsreadvar = require('./readFromSQS');

for (var i=0; i < 10; i++) //Modify message number here
{
  snsvar.publish("message: " + i); //Modify message content here
}
sqsreadvar.readSQSMesg();