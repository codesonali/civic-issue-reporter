require("dotenv").config();
const express=require("express");
const connectDB=require("./config/db");
const authRoutes = require("./routes/authRoutes");
const issueRoutes = require("./routes/issueRoutes");

const app=express();
app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/issues", issueRoutes);

const PORT=process.env.PORT||5000;

app.get("/",(req,res)=>{
    res.send("Civic Issue Reporter API is running");
})


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
