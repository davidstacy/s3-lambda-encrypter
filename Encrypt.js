// dependencies
var async = require('async');
var AWS = require('aws-sdk');
var util = require('util');

// get reference to S3 client 
var s3 = new AWS.S3({ apiVersion: '2006-03-01' });
 
exports.handler = function(event, context) {
  if (event.Records == null) {
    context.fail('Error', "Event has no records.");
    return;
  }
    
  // Process all records in the event asynchronously.
  async.each(event.Records, processRecord, function (err) {
    if (err) {
      context.fail('Error', "One or more objects could not be encrypted.");    
    } else {
      context.succeed();
    }
  });
};


// processRecord
//
// Iterator function for async.each (called by the handler above).
//
// 1. Gets the head of the object to determine it's current encryption state.
// 2. Gets the encryption configuration from the bucket's tags.
// 3. Copies the object with the desired encryption.
function processRecord(record, callback) {
  if (record.s3 == null) {
      callback("Event record is missing s3 structure.");
      return;
  }
  
  // The bucket and key are part of the event data
  var bucket = record.s3.bucket.name;
  var key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
  
  console.log('Processing ' + bucket + '/' + key);
  
  // Get the head data to determine if the object is already encrypted.
  console.log('Getting object head');
  s3.headObject({
    Bucket: bucket,
    Key: key
  }, function (err, data) {
    if (err) {
      console.log('Error getting object head:');
      console.log(err, err.stack); // an error occurred
      callback("Error getting object head: " + bucket + '/' + key);
    } else if (data.ServerSideEncryption != 'AES256') {
      // Copy the object adding the encryption
      console.log('Updating object');
      lkey = key.toLowerCase();
      s3.copyObject({
        Bucket: bucket,
        Key: lkey,
                    
        CopySource: encodeURIComponent(bucket + '/' + key),
        MetadataDirective: 'COPY',
        ServerSideEncryption: 'AES256',
        StorageClass: storageClass
      }, function (err, data) {
        if (err) {
          console.log('Error updating object:');
          console.log(err, err.stack); // an error occurred
          callback("Error updating object: " + err);
        } else {
          console.log(bucket + '/' + key + ' updated.');
          callback();
        }
      });
    } else {
      console.log(bucket + '/' + key + " is already encrypted using 'AES256'.");
      callback();
    }
  });
}


