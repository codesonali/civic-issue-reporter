require("dotenv").config();
const express=require("express");

const app=express();
const PORT=process.env.PORT||5000;

app.get("/",(req,res)=>{
    res.send("Civic Issue Reporter API is running");
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});