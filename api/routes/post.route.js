import express from "express"



const router = express.Router()

router.get("/test",(req,res) => {
    console.log("router works");
})


router.post("/test",(req,res) => {
    console.log("post route!");
})
router.put("/test",(req,res) => {
    console.log("update route!");
})
router.delete("/test",(req,res) => {
    console.log("delete works!");
})

export default router