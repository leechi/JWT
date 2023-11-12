import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { login, logout, accessToken, refreshToken, loginSuccess } from "./controller/index.mjs";

const app = express();
dotenv.config();

// 미들웨어 기본설정
app.use(express.json());
// 쿠키를 사용해서 jwt를 사용할 예정
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.post('/login', login);
app.get('/accesstoken', accessToken);
app.get('/refreshtoken', refreshToken);
app.get('/login/success', loginSuccess);
app.post('/logout', logout);

app.listen(process.env.PORT, () => {
    console.log(`server is on ${process.env.PORT}`);
});
