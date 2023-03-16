import express from "express";

const app = express();

app.use((req,res,next)=>{
    if(req.headers.authorization === "Bearer abcd"){
        next();
    }else{
        res.status(401);
        res.send("Token Salah");
    }
});

app.use(express.json());
app.use(express.static("public"));


