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
    res.send(await client.query(`select * from mahasiswa where id = ${req.params.id}`));
});
app.post("/api/tambah/mahasiswa", async (req, res) => {
    await client.query(`insert into mahasiswa values(${req.body.id} ,'${req.body.nama}',${req.body.umur})`)
    res.send("Berhasil Menabah Data");
});
app.delete("/api/delete/mahasiswa", async (_req, res) => {
    await client.query(`delete from mahasiswa`);
    res.send("Berhasil Menghapus Data Mahasiswa semuanya");
});



app.listen(3000);