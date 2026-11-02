require("dotenv").config();
const express=require("express");
const connectDB=require("./config/db");

const app=express();
const PORT=process.env.PORT||5000;

app.get("/",(req,res)=>{
    res.send("Civic Issue Reporter API is running");
})
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
