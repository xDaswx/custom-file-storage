import path from 'path';
import fs from 'fs';
import S3 from 'aws-sdk/clients/s3';
require('dotenv').config()

const bucketName = process.env.AWS_BUCKET_NAME as string;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;



const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
});


const savefile =  async (file:Express.Multer.File) => {
  const originalPath = path.join(__dirname,'..','../public/media', file.filename);

  const fileStream = fs.readFileSync(originalPath);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  const awsResponse = s3.upload(uploadParams).promise();
  fs.unlinkSync(originalPath)
  console.log(originalPath+' Excluido');
  return awsResponse
}


const getFileStream = (fileKey:string) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }

  const pipe = s3.getObject(downloadParams).createReadStream()
  return pipe
}


const deleteFile = (filename: string)=> {
    const awsResponse = s3.deleteObject({
        Bucket: bucketName,
        Key: filename,
      })
      .promise();

    return awsResponse
  }


export default {
  savefile,
  getFileStream,
  deleteFile
}