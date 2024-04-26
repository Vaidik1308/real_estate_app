import express from "express"
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";



const app = express()

app.use(express.json())

app.use("/api/posts",postRoute)
app.use("/api/auth", authRoute)

app.use("/" , (req,res) => {
    res.send("hello world")
    console.log("Home page");
})

app.listen(8800, () => {
    console.log("server is running");
})