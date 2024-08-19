import mongoose from "mongoose"
import { DB_NAME } from "../constants/constants.js"
import {createSemester} from "../middlewares/semOperations.js"
const connectDB = async () => {
    try{
        const connection = await mongoose.connect(
            `${process.env.MONGO_DB_URI}/${DB_NAME}`
        )
        console.log("Database Connected")
    } catch (error){
        console.log("Connection Failed : ",error)
        process.exit(1)
    }
}

createSemester();

export default connectDB