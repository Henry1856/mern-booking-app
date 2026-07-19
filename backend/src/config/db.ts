import mongoose from "mongoose";

const connectDB = async()=>{
     try{
        const uri = process.env.MONGODB_CONNECTION_STRING;
        if (!uri) {
            throw new Error('Environment variable MONGODB_CONNECTION_STRING is not defined');
        }

        const connect = await mongoose.connect(uri, {
            dbName:"mern-booking-app"
        })
        console.log("database connected successfully");
    }
    catch(err)
    {
        console.log(err);
        process.exit(1);
    }
};

export default connectDB;
