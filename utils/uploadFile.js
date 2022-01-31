const AWS = require("aws-sdk");

const S3 = new AWS.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  s3ForcePathStyle: true,
  region: process.env.S3_REGION,
  signatureVersion: "v4",
});

module.exports = async (name, data, mime, bucket) => {
  const buffer = Buffer.from(
    data.replace(/^data:\w+\/\w+;base64,/, ""),
    "base64"
  );

  const s3Params = {
    Key: name,
    Bucket: bucket,
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: mime,
  };

  await S3.putObject(s3Params).promise();
};
