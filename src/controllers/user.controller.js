import mongoose from "mongoose";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const registerUser = async (req,res)=>{
try {
   const {username,phone,password,email}  = req.body;
   if(!username || !phone || !email || !password){
   return res.status(401).json({
    message:"please fill all the field",
    success:false
   })

   }
 const isExistingUser = await User.findOne({email});
 if(isExistingUser){
    return res.status(401).json({
        message:"user already exist",
        success:false
    })
 }
  const isExistingUsername = await User.findOne({username});
 if(isExistingUsername){
    return res.status(401).json({
        message:"user already exist",
        success:false
    })
 }
 
let user = await User.create({
    username,
    email,
    password,
    phone
})

if(!user){
    return res.status(500).json({
        message:"internal server error",
        success:false
    })
}
res.status(201).json({
 message:"user registered successfully",
 success:true,
 data:user
})
} catch (error) {
    console.log("registration fail!!",error)
}
}

export const loginUser = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(401).json({
                message:"All field are required",
                success:false
            })
        }
        let user = await User.findOne({email})
        if(!user){
            return res.status(401).json({
                message:"Invalid credentials",
                success:false
            })
        }
        let isPasswordCorrect = await user.comparePassword(password);
        if(!isPasswordCorrect){
            return res.status(401).json({
                message:"Invalid credentials",
                success:false
            })
        }
        const token = await jwt.sign({
            userId:user._id,
        },process.env.JWT_SECRET,{expiresIn:'7d'})

        const userData = {
            _id:user._id,
            username:user.username,
            email:user.email,
            role:user.role,
            phone:user.phone
        }
    return res.cookie("token",token,{
      httpOnly:true,
      sameSite:true,
      maxAge:7*24*60*60*1000,
      secure:false
    }).json({
        message:`hello ${user.username}`,
        success:true,
        user:userData
    })
    } catch (error) {
        console.error("error during login",error.message)
        
    }
}


