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
    
}

const refreshToken = (req,res)=>{

}


const loginSuccess = (req,res)=>{

}


const logout = (req,res)=>{

}

export {login, loginSuccess, logout, accessToken, refreshToken}