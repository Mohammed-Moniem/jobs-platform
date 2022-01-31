const AWS = require("aws-sdk");

const S3 = new AWS.S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  s3ForcePathStyle: true,
  region: process.env.S3_REGION,
  signatureVersion: "v4",
});

module.exports = async (fileName) => {
  const s3Params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
  };
  await S3.deleteObject(s3Params).promise();
};
