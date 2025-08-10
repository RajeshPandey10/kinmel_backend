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

