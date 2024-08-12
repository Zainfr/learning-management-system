import connectDB from "./db/index.js"
import dotenv from "dotenv"
import app from './app.js'

dotenv.config({
    path: './env',
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 3001, ()=>{
        console.log(`Server is running at ${process.env.PORT}`);
    })
}).catch((err) => {
    //if DB connection is Failed ,
    console.log(`MONGO_DB Connection Failed!: `,err)
    process.exit(1)
});