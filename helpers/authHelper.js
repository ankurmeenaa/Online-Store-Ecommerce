// here we will create 2 functions.
// 1st for hashing and 2nd for comparing

import bcrypt from 'bcrypt'

export const hashPassword = async(password)=> {
    //above we are receiving plain pasword
    try {
    const saltRounds = 10;//hashing rounds see in npm website
       const hashedPassword =await bcrypt.hash(password,saltRounds); 
       return hashedPassword;
    } catch (error) {
       console.log(error); 
    }
};

export const comparePassword = async (password,hashedPassword) => {
    return bcrypt.compare(password,hashedPassword);
};