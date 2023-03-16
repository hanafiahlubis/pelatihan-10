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

app.get("/api/mahasiswa", async (_req, res) => {
    res.send((await client.query("select * from mahasiswa")).rows[0]);
})

app.get("/api/mahasiswa/:id", async (req, res) => {
    res.send(cd(await client.query(`select * from mahasiswa where id = '${req.params.id}' `)));
})



app.listen(3000);