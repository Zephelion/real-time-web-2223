import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.CONNECTION_STRING;

export const connectDB = () =>{
    try{
        mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology:true,
        });
        console.log('DB - connected')
    }   catch(err){
        console.log('error occured while trying')
        throw err;
    }
};