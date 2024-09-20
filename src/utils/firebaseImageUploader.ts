import { Bucket } from '@google-cloud/storage'; 
import { Request } from "express";
import UserRepository from '../infrastructure/repositories/UserRepository';
import { IUser } from '../doamin/entities/User';


const userRepository = new UserRepository();

class FirebaseImageUploader {
    private bucket: Bucket;
  
    constructor(bucket: Bucket) {
      this.bucket = bucket;
    }
  
    async uploadImage(req: Request,email:string|undefined,userProfile:boolean|undefined): Promise<{ url: string } | null> {
      return new Promise((resolve, reject) => {
        if (!req.file) {
          return reject(new Error('No file uploaded.'));
        }
  
        const timestamp = Date.now();
        const originalName = req.file.originalname;
        const newFileName = `${timestamp}${originalName}`;
        
        const blob = this.bucket.file(newFileName);
        const blobStream = blob.createWriteStream({
          metadata: {
            contentType: req.file.mimetype,
          },
        });
  
        blobStream.on('error', (err) => {
          return reject(err);
        });
  
        blobStream.on('finish', async () => {
          try {
            const encodedFileName = encodeURIComponent(newFileName);
            const profile = `https://firebasestorage.googleapis.com/v0/b/${this.bucket.name}/o/${encodedFileName}?alt=media`;
            if(email && userProfile){
                await userRepository.updateUserProfile(profile,email)
            }
            resolve({ url: profile.trim() });
          } catch (err) {
            reject(err);
          }
        });
  
        blobStream.end(req.file.buffer);
      });
    }
  }
  

  export default FirebaseImageUploader