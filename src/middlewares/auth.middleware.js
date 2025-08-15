import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

//to login
export const isAuth = async(req,res,next)=>{
    try {
        const token = req.cookies.token
        console.log(token)

        if(!token){
            return res.status(401).json({
                message:"Unauthorized",
                success:false
            })
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({
                message:"not a valid token",
                success:false
            })
        }
        req.id = decoded.userId;
       req.user = await User.findById(decoded.userId).select("-password");
       next()

    } catch (error) {
        console.log("error occured in Authenticatio",error)
        return res.status(401).send({
            message:"Authentication Failed",
            success:false
        })
    }
}

//for admin
export const isAdmin = async (req,res,next)=>{
    if(!req.user || req.user.role!="admin"){
        return res.status(403).json({
            message:"Access of admin is denied",
            success:false
        })
    }
    next()
}

//for normal user
export const isUser = async (req,res,next)=>{
    if(!req.user || req.user.role!="user"){
        return res.status(403).json({
            message:"Access of user is denied",
            success:false
        })
    }
    next()
}