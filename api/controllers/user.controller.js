import prisma from "../lib/prisma.js";
import bcrypt from 'bcrypt'

export const getUsers = async (req,res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Failed to get Users"})
    }
}
export const getUser = async (req,res) => {
    // const {username,email,password} = req.json()
    const id = req.params.id;
    try {
        const userById = await prisma.user.findUnique({
            where:{
                id
            }
        })
        res.status(200).json(userById)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Failed to get User"})
    }
}
export const updateUser = async (req,res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
    const {password,avatar,...body} = req.body

    if(id !== tokenUserId){
        return res.status(403).json({message:"Not authorize to access the user"})
    } 
    let updatedPassword;
    try {

        if(password){
            updatedPassword = await bcrypt.hash(password,10)
        }
        const updateUser = await prisma.user.update({
            where:{id},
            data:{
                ...body,
                ...(updatedPassword && {password:updatedPassword}),
                ...(avatar && {avatar}),
            }
        })

        const {password:userPassword,...rest} = updateUser

        res.status(200).json(rest)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Failed to update User"})
    }
}
export const deleteUsers = async (req,res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
    if(id !== tokenUserId) {
        return res.status(303).json({message:"not authorize to access the user"})
    }
    try {
        await prisma.user.delete({
            where:{id}
        })
        res.status(200).json({message:"User Deleted...."})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Failed to delete User"})
    }
}