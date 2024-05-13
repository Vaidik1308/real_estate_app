import prisma from '../lib/prisma.js'


export const getPosts = async (req,res) => {
    const query = req.query;
    // console.log(query);
    try {
        const posts = await prisma.post.findMany({
            where:{
                city:query.city || undefined,
                type:query.type || undefined,
                property:query.property || undefined,
                bathroom:parseInt(query.bathroom) || undefined,
                price:{
                    gte:parseInt(query.minPrice) || 0,
                    lte:parseInt(query.maxPrice) || 100000,
                },

            }
        });
        res.status(200).json(posts)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Failed to get the posts"})
    }
}
export const getPost = async (req,res) => {
    const id = req.params.id;
    try {
        const post = await prisma.post.findUnique({
            where:{id},
            include:{
                postDetail:true,
                user:{
                    select:{
                        username:true,
                        avatar:true
                    }
                }
            }
        })
        res.status(200).json(post)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Unable to get the post"})
    }
}
export const addPost = async (req,res) => {
    const body = req.body;
    const tokenUserId = req.userId
    try {
        const newPost = await prisma.post.create({
            data:{
                ...body.postData,
                userId:tokenUserId,
                postDetail:{
                    create:body.postDetails,
                }
            }
        })
        res.status(200).json(newPost);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Unable to create the posts"})
    }
}
export const updatePost = async (req,res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Unable to update the posts"})
    }
}
export const deletePost = async (req,res) => {
    const id =  req.params.id;
    const tokenUserId = req.userId;
    try {
        const post = await prisma.post.findUnique({
            where:{id}
        })
        if(post.userId !== tokenUserId){
            return res.status(303).json({message:"not authorize to delete this post"})
        }
        const deletedPost = await prisma.post.delete({
            where:{id}
        })
        res.status(200).json({message:"post deleted successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Unable to delete the posts"})
    }
}