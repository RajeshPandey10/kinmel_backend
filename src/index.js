import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config({})
const app = express()
const port = process.env.PORT

// database connection

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

//Routes



//port listining

app.listen(port,()=>{
    console.log(`server running on the port ${port}`)
})

