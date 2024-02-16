import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";


export const registerController = async(req,res) => {
    try {
        const {name,email,password,phone,address,answer} =req.body
        //validation
        if(!name){
            return res.send({message:'name is required'})
        }
        if(!email){
            return res.send({message:'email is required'})
        }
        if(!password){
            return res.send({message:'password is required'})
        }
        if(!phone){ 
            return res.send({message:'phone number is required'})
        }
        if(!address){
            return res.send({message:'address is required'})
        }
        if(!answer){
            return res.send({message:'answer is required'})
        }

        //check user
        const existinguser = await userModel.findOne({email})

        //check existing user
        if(existinguser){
            return res.status(200).send({
                success:false,
                message:'Already registered,Please LOGIN'
            })
        }

        // Register User
        const hashedPassword = await hashPassword(password)
        //now we need to save hashed password
        const user = await new userModel({name,email,phone,address,password:hashedPassword,answer}).save();
        res.status(201).send({
            success:true,
            message:'User registered successfully',
            user
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Registration',
            error
        })
    }
};

// POST LOGIN
export const loginController = async(req,res)=> {
    try {
       const {email,password} = req.body
        if(!email || !password){
          return res.status(404).send({
            success:false,
            message:'Invalid Details'
          })
        }
        //check user i.e. jiska password compare karne ja rhe hai wo user hai bhi ya nhi
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Email is not registered.'
            })
        }
        // now password ko compare kara ke check karenge
        const match = await comparePassword(password,user.password)
        if(!match){
         return res.status(200).send({
          success:false,
          message:'Incorrect Password'
         })   
        }

        //token creating
        const token = await JWT.sign({_id: user._id},process.env.JWT_SECRET,{
          expiresIn:"7d"  
        });
        
        res.status(200).send({
            success:true,
            message:"login successfully",
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role
            },
            token,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in login.',
            error

        })
    }
};


//forgotPasswordController

//isme user se email,newpassword get karenge and 
export const forgotPasswordController= async (req,res)=> {
   try {
    const {email,answer,newPassword} = req.body;
     if(!email){
        res.status(400).send({message:'Email is required.'})
     }
     if(!answer){
        res.status(400).send({message:'Answer is required.'})
     }
     if(!newPassword){
        res.status(400).send({message:'New Password is required.'})
     }
     //now we have to check email and answer if registered and correct then only we will change password
      
     const user = await userModel.findOne({email,answer})
     //Validation of above line
     if(!user){
        return res.status(404).send({
            success:false,
            message:"Wrong Email or Answer"
        })
     }
     // update passwors so database me hashed paaword store karenge
     const hashed = await hashPassword(newPassword);
     await userModel.findByIdAndUpdate(user._id,{password:hashed})
     res.status(200).send({
        success:true,
        message:"Password Updated Successfully."
     })
   } catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:'something went wrong',
        error
    })
   }
}


//test controller
export const testController = (req,res) =>{
    res.send("Protected route.")
}

//update profile
export const updateProfileController = async(req,res) => {
   try {
    const {name,email,password,address,phone} = req.body
    //find user
    const user = await userModel.findById(req.user._id)
    //password check
    if(password && password.length <6 ){
        return res.json({ error:'At least 6 length password is required.'})
    }
    
    //password hash karna h
    const hashedPassword = password? await hashPassword(password) : undefined
    const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
        name:name||user.name,//name milta hai toh update nhi toh user ke andar jo name hai use as itis rakho
        password: hashedPassword || user.password,
        address:address || user.address

    },{new:true})
    
    res.status(200).send({
        success:true,
        message:"Profile Updated Successfully",
        updatedUser
    })

   } catch (error) {
    console.log(error)
    res.status(400).send({
        success:false,
        message:'Error while updating profile',
        error
    })
   } 
}