const { Storage } = require('@google-cloud/storage');
const fs = require("fs");
// const express = require("express");
var app = require('express')();
const { number } = require('mathjs');
const { nextTick } = require('process');
var server = require('http').Server(app);
const qrcode_read = require("../qrcode/qrcodeReader.js");
const redis_del = require("../redis/RedisDeleteInfo.js");
const redis_func = require("../redis/RedisDeleteInfo.js");

// module.exports = async

module.exports = function get_all_files() {
  const storage = new Storage({
    keyFilename: "../qrcode/qr-package-firebase-adminsdk-h96h8-39f11ec4bc.json",
  });
  let bucketName = "gs://qr-package.appspot.com";
  // directory path
  const dir = '../qrcode/downloaded_qrcode';
  // Testing out upload of file
  async function deliv_process() {
    try {
      await delte_dir(dir);
      await create_dir(dir);
      await redis_func.publish_delete("ok");
      const [files] = await storage.bucket(bucketName).getFiles();
      await Promise.all(files.map(async (file) => {
        try {
          let file_name = file.name;
          var key = get_png_and_key(file_name,storage,bucketName);
        }
        catch (err) {
          console.log(err);
        }
        finally {
          await redis_func.delete_key(key);
        }
      }));
    }
    catch (err) {
      console.log(err);
    }
  }
  deliv_process();
  // app.listen(process.env.PORT || 8088, () => { console.log('node server running'); })
}

server.listen(8089, function () {
  console.log('firebase is running on port 8089');
});

async function get_png_and_key(file_name,storage,bucketName) {
  try {
    var key = file_name.replace('.png', '');
    let destFilename = '../qrcode/downloaded_qrcode/' + file_name;
    let options = { destination: destFilename, };
    await storage.bucket(bucketName).file(file_name).download(options);
    // await read_key(file_name);
    await storage.bucket(bucketName).file(file_name).delete();
  }
  catch (err) {
    console.log(err);
  }
  finally {
    return key;
  }
}

async function delte_dir(dir) {
  try {
    fs.rmdirSync(dir, { recursive: true });
  } catch (err) {
    console.error(`Error while deleting ${dir}.`);
  }
}
async function create_dir(dir) {
  fs.mkdir(dir, function (err) {
    if (err) {
      console.log(err)
    }
  });
}
async function read_key(file_name) {
  key = await qrcode_read.do_all(file_name);
  return file_name.replace('.png', '');
  try {
    await qrcode_read.do_all(file_name);
  }
  catch
  {
    console.log("qr code read")
  }
}