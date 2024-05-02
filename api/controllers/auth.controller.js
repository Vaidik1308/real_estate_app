import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from 'jsonwebtoken'



export const register = async (req,res) => {
    // operations
    const {username, password, email} = req.body

    //hash our password
    const hashedPassword = await bcrypt.hash(password,10)
    //create new user and save it to the db
    // console.log(hashedPassword,"Register successfully");

    try {
        const newUser = await prisma.user.create({
            data:{
                username,
                password:hashedPassword,
                email,
            }
        })
        res.status(201).json({message:"User Created Successfully"})    
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Failed to registering user!!"})
    }

    
}
export const login = async (req,res) => {
    const {username,password} = req.body;
    console.log(username,password);
    try {
        //if the user exists
        const user = await prisma.user.findUnique({
            where:{username}
        })

        console.log(user);

        if(!user) return res.status(401).json({message:"Invalid Credentials"})
        console.log(user);
    
        //check user password is correct
        const isPasswordValid = await bcrypt.compare(password,user.password)

        if(!isPasswordValid) return res.status(401).json({message:"Invalid password"})
        
        const age = 1000*60*60*24*7;
         const token = jwt.sign({
            id:user.id,

         },process.env.JWT_SECRET_KEY,{expiresIn:age})

        //generate cookie token and hand it to the user
        // res.setHeader("Set-Cookie","test=" + "myValue").json("success")
        const {password:userPassword,...userInfo} = user
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:age
        }).status(200).json(userInfo)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Failed to Login!"})
    }

}
export const logout = (req,res) => {
    // operations
    res.clearCookie("token").status(200).json({message:"Logout Successfully"});
}