import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './database/dbconnection.js'
import userRoutes from './routes/user.route.js'
dotenv.config({})
const app = express()
const port = process.env.PORT

// database connection
connectDB()
//middlewares
app.use(
    cors({
        origin:["http://localhost:5173"],
        credentials:true,
    })
);

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.get("/api/v1/status",(req,res)=>{
    res.status(200).send({
        message:"you are live",
    })
})

app.use("/api/v1/user",userRoutes)


//port listining

app.listen(port,()=>{
    console.log(`server running on the port ${port}`)
    console.log("http://localhost:8000")
})

