import express from "express";
import { client } from "./db.js";
const app = express();

app.use((req, res, next) => {
    if (req.headers.authorization === "Bearer abcd") {
        next();
    } else {
        res.status(401);
        res.send("Token Salah");
    }
});

app.use(express.json());
app.use(express.static("public"));

app.get("/api/mahasiswa" ,async (req, res) => {
    res.send(await client.query("select * from mahasiswa"));
})

app.listen(3000);

