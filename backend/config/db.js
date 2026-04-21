import mongoose from "mongoose";

const connectDB = async () => {
    try{
        mongoose.connect(process.env.MONGO_URI, {dbName:'shopsphere'});
        console.log('✅ Connected to DataBase');
        
    }catch(error){
        console.log('❌ Connection to database failed: ', error);
    }
}

export default connectDB;