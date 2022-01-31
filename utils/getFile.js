const AWS = require("aws-sdk");

const S3 = new AWS.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  s3ForcePathStyle: true,
  region: process.env.S3_REGION,
  signatureVersion: "v4",
});

module.exports = async (fileName, bucket) => {
  const s3Params = {
    Bucket: bucket,
    Key: fileName,
  };
  const file = await S3.getObject(s3Params).promise();
  return file.Body.toString("base64");
};
