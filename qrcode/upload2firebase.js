const {Storage} = require('@google-cloud/storage');
const express = require("express");

const app = new express();


const storage = new Storage({
    keyFilename: "qr-package-firebase-adminsdk-h96h8-39f11ec4bc.json",
 });

let bucketName = "gs://qr-package.appspot.com";

let filename = 'qrcode_corrent.png';

// Testing out upload of file
const uploadFile = async() => {

    // Uploads a local file to the bucket
    await storage.bucket(bucketName).upload(filename, {
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        
        // By setting the option `destination`, you can change the name of the
        // object you are uploading to a bucket.
        metadata: {
            // Enable long-lived HTTP caching headers
            // Use only if the contents of the file will never change
            // (If the contents will change, use cacheControl: 'no-cache')
            cacheControl: 'public, max-age=31536000',
        },
});

console.log(`${filename} uploaded to ${bucketName}.`);
}

uploadFile();

app.listen(process.env.PORT || 8088, () => { console.log('node server running');})