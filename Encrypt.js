// dependencies
var async = require('async');
var AWS = require('aws-sdk');
var util = require('util');

// get reference to S3 client 
var s3 = new AWS.S3({ apiVersion: '2006-03-01' });
 
exports.handler = function(event, context) {
    // Read options from the event.
    console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));
    var srcBucket = event.Records[0].s3.bucket.name;
    // Object key may have spaces or unicode non-ASCII characters.
    var srcKey    =
    decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));  

    // Download the image from S3, transform, and upload to a different S3 bucket.
/*    async.waterfall([
        function encrypt(next) {
            // Download the image from S3 into a buffer.
            s3.getObject({
                    Bucket: srcBucket,
                    Key: srcKey
                },
                next);
            },
        function checkencryptiong(contentType, data, next) {
            // Stream the transformed image to a different S3 bucket.
            s3.putObject({
                    Bucket: dstBucket,
                    Key: dstKey,
                    Body: data,
                    ContentType: contentType
                },
                next);
            }
        ], function (err) {
            if (err) {
                console.error(
                    'Unable to encrypt ' + srcBucket + '/' + srcKey +
                    ' due to an error: ' + err
                );
            } else {
                console.log(
                    'Successfully encrypted ' + srcBucket + '/' + srcKey
                );
            }

            context.done();
        }
    ); */
    context.done();
};
