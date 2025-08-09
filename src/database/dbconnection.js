import mongoose from 'mongoose'

async function connectDB() {
try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("mongoDB connected successfully")
} catch (error) {
    console.log("Mongodb connection fail",error)
} 
}

export default connectDB;



