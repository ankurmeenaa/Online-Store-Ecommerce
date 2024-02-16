import express from "express";
import {registerController,loginController,testController, forgotPasswordController, updateProfileController} from '../controllers/authController.js'
import { requireSignIn,isAdmin } from "../middlewares/authMiddleware.js";

//Router Object as we are routing in seperate file
 const router = express.Router()

//Register || POST
router.post('/register',registerController)

// LOGIN || POST
router.post('/login',loginController)

//FORGOT Password || POST
router.post('/forgot-password',forgotPasswordController)

//test route for checking token working

router.get('/test',requireSignIn,isAdmin,testController)//here middleware of token is added for route protection

//Protected routes for dashboard
router.get('/user-auth',requireSignIn,(req,res) => {
res.status(200).send({ok:true})
})

//Protected routes for Admin dashboard
router.get('/admin-auth',requireSignIn,isAdmin,(req,res) => {
    res.status(200).send({ok:true})
    })

    //update profile
    router.put('/profile',requireSignIn,updateProfileController)

export default router;