import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import usersRoute from './routes/usersRoute.js'
import videoRoute from './routes/videoRoutes.js'
import commentRoute from './routes/commentRoute.js'
import authRoute from './routes/authRoute.js'
import cookieparser from 'cookie-parser'
const app = express();
dotenv.config({ path: './config.env' });
const connect = () => {
    mongoose.connect(process.env.DATABASE, {
        useNewUrlParser: true,
    }).then(() => {
        console.log("DB connection success");
    })
}
app.use(cookieparser())
app.use(express.json())
app.use("/api/auth", authRoute)
app.use('/api/users', usersRoute)
app.use('/api/videos', videoRoute)
app.use('/api/comments', commentRoute)

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message
    })

})
app.listen(8001, () => {
    connect();
    console.log("connected");
})
