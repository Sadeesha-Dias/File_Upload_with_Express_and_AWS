const {S3} = require("aws-sdk")
const uuid = require("uuid").v4;

exports.awsS3FileUpload = async (files) => 
{
    const s3 = new S3();

    //for a single file upload
    // const param = {
    //     Bucket: process.env.AWS_S3_BUCKET_NAME,
    //     Key: `Uploaded_Files/${uuid()}-${files.originalname}`,
    //     Body: files.buffer
    // };

    //return await s3.upload(param).promise(); 

    //for multiple file uploads
    const multiParams = files.map(file => {
        return {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `Uploaded_Files/${uuid()}-${file.originalname}`,
            Body: file.buffer
        };
    });

    return await Promise.all(multiParams.map(param => s3.upload(param).promise()));
}