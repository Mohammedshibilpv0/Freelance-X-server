import mongoose from "mongoose";

export const connectDB=async ()=>{
    try{
        await mongoose.connect('mongodb://localhost:27017/DevConnect')
        console.log('Mongodb Connected');
        
    }catch(err){
        console.log('Failed to connect MongoDB',err);
        process.exit(1);
    }
}