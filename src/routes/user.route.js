import express,{Router} from 'express'
import { editProfile, getAllUser, getMyInfo, getProfile, loginUser, logoutUser, registerUser } from '../controllers/user.controller.js'
import { isAdmin, isAuth } from '../middlewares/auth.middleware.js'


const router = Router()

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/logout",logoutUser)
router.get("/profile/:id",isAuth,getProfile)
router.get("/all",isAuth,isAdmin,getAllUser)
router.get("/getMyInfo",isAuth,getMyInfo)
router.patch("/profile/edit",isAuth,editProfile)

export default router