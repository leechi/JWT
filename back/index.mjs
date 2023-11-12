import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookieparser"
import cors from "cors"

const app = express()
dotenv.config()


app.listen(process.env.PORT, ()=>{
    console.log(`server is on ${process.env.PORT}`)
})