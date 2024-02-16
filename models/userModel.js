import mongoose from "mongoose";

//Now we will create SCHEMA here
const userSchema = new mongoose.Schema({
    //creating objects inside schema
   name:{
    type:String,
    required:true,
    trim:true
    //In Mongoose, the trim option within a schema field definition specifies whether to remove 
    //leading and trailing whitespace characters from a string before saving it to the database. 
   },
   email:{
     type:String,
     required:true,
     unique:true
   },
   password:{
    type:String,
    required:true
   },
   phone:{
    type:String,
    required:true
   },
   address:{
    type:{},
    required:true
   },
   answer:{
    type:String,
    required:true
   },
   role:{
    type:Number,
    default:0
   }
},{timestamps:true})
//whenever new user will be created its timestamp will get recorrded.

export default mongoose.model('users',userSchema)//we have collection of users in mongodb
//userSchema ka reference de diya and with help of
//userSchema we will create model