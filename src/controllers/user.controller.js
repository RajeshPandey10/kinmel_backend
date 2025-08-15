import mongoose from "mongoose";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { username, phone, password, email } = req.body;
    if (!username || !phone || !email || !password) {
      return res.status(401).json({
        message: "please fill all the field",
        success: false,
      });
    }
    const isExistingUser = await User.findOne({ email });
    if (isExistingUser) {
      return res.status(401).json({
        message: "user already exist",
        success: false,
      });
    }
    const isExistingUsername = await User.findOne({ username });
    if (isExistingUsername) {
      return res.status(401).json({
        message: "user already exist",
        success: false,
      });
    }

    let user = await User.create({
      username,
      email,
      password,
      phone,
    });

    if (!user) {
      return res.status(500).json({
        message: "internal server error",
        success: false,
      });
    }
    res.status(201).json({
      message: "user registered successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    console.log("registration fail!!", error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "All field are required",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }
    let isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }
    const token = await jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: false,
      })
      .json({
        message: `hello ${user.username}`,
        success: true,
        user: userData,
      });
  } catch (error) {
    console.error("error during login", error.message);
  }
};

export const logoutUser = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "logged out",
      success: true,
    });
  } catch (error) {
    console.error("Error during logout", error.message);
    return res.status(500).json({
      message: "internal server error",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user's id",
        success: false,
      });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).json({
      data: user,
      sucess: true,
    });
  } catch (error) {
    console.log("eroor fetching user's profile", error);
    res.status(500).json({
      message: "internal server error",
    });
  }
};
export const editProfile = async (req, res) => {
  try {
    const { username, email, phone } = req.body;
    const userId = req.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "user not found",
        sucess: false,
      });
    }
    (user.username = username || user.username),
      (user.email = email || user.email);
    user.phone = phone || user.phone;
    await user.save();
    let userInfo = await User.findById(user._id).select("-password");
    return res.status(200).json({
      message: "profile updated",
      sucess: true,
      user: userInfo,
    });
  } catch (error) {
    console.log("error while updating user profile", error);
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      sucess: true,
      data: users,
    });
  } catch (error) {
    console.log("eroor when fetching all user", error);
    res.status(500).json({ sucess: false ,
        message:"internal server error"
    });
  }
};

export const getMyInfo = async (req,res)=>{
    try {
        const user = await User.findById(req.id);
        return res.status(200).json({
            message:"success fully get info",
            data:user,
            sucess:true
        })
    } catch (error) {
        console.log("error when geeting the info",error)
        res.status(400).json({ sucess: false ,
        message:"error on fething info"
    });
    }
}