import express from "express"
import userRoute from './routes/userRoute.js';

const app = express();

app.use('/',userRoute)

app.listen(5000,function(){
    console.log(`App is running on ${process.env.PORT}`)
})

export default app;