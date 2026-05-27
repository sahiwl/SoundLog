import mongoose from "mongoose";

export  const  connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI as string)
        console.log(`MongoDB connected: ${conn}`);
    } catch (error : unknown) {
        console.error(`MongoDB connection error: ${error}`);
        process.exit(1);
    }
}