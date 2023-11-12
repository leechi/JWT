import db from '../db.mjs'
import jwt from 'jsonwebtoken'

const login = (req,res, next)=>{
    const {email, password} = req.body

    const userInfo = db.filter(item => {
        return item.email === email
    })[0]
    if(!userInfo){
        res.status(403).json("Not Authorized");
    }else{
        try{
            // accessToken 발급
            const accessToken = jwt.sign({
                id : userInfo.id,
                username : userInfo.email,
                email : userInfo.email
            }, process.env.ACCESS_SECRET, {
                expiresIn : "1m",
                issuer : 'leechi'
            })
            // refreshToken 발급
            const refreshToken = jwt.sign({
                id : userInfo.id,
                username : userInfo.email,
                email : userInfo.email
            }, process.env.REFRECH_SECRET, {
                expiresIn : "24h",
                issuer : 'leechi'
            })
            // token 전송
            res.cookie("accessToken", accessToken, {
                secure : false, // 현재 http를 사용중이라서 false
                httpOnly : true,
            })
            res.cookie("refreshToken", refreshToken, {
                secure:false,
                httpOnly:true,
            })
            res.status(200).json("login success")
        }catch(error){
            res.status(500).json(error)
        }
    }
}

const accessToken = (req,res)=>{
    const token = req.cookies.accessToken
    const data = jwt.verify(token, process.env.ACCESS_SECRET)
    const userData = db.filter(item => {
        return item.email === data.email
    })[0]
    const {password, ...others} = userData;


    res.status(200).json(others)
}

const refreshToken = (req,res)=>{
    // 용도 : access token을 갱신.
    const token = req.cookies.refreshToken;
    const data = jwt.verify(token, process.env.REFRECH_SECRET)
    const userData = db.filter(item=>{
      return item.email === data.email;
    })[0]

    // access Token 새로 발급
    const accessToken = jwt.sign({
      id : userData.id,
      username : userData.username,
      email : userData.email,
    }, process.env.ACCESS_SECRET, {
      expiresIn : '1m',
      issuer : 'leechi',
    });
    res.cookie("accessToken", accessToken, {
        secure : false, // 현재 http를 사용중이라서 false
        httpOnly : true,
    })

    res.status(200).json("Access Token Recreated")
}


const loginSuccess = (req,res)=>{
    const token = req.cookies.accessToken
    const data = jwt.verify(token, process.env.ACCESS_SECRET)
    const userData = db.filter(item =>{
        return item.email === data.email
    })[0]

    res.status(200).json(userData)
}


const logout = (req,res)=>{
    res.cookie('accessToken', '');
    res.status(200).json('Logout Success')
}

export {login, loginSuccess, logout, accessToken, refreshToken}