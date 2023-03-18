import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { client } from "./db.js";
import jwt from "jsonwebtoken";


const token =  jwt.sign({
    masuk: "dsadasda"
}, "rahasia");

console.log(token);
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

// root Mahasiswa

app.get("/api/mahasiswa", async (_req, res) => {
    res.send((await client.query("select * from mahasiswa")).rows[0]);
});

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
app.delete("/api/delete/mahasiswa/:id", async (req, res) => {
    await client.query(`delete from mahasiswa where id = ${req.params.id}`);
    res.send("Berhasil Menghapus Data satu Mahasiswa");
});

// ROUTE PELATIHAN
app.get("/api/pelatihan", async (_req, res) => {
    res.send((await client.query("select * from pelatihan")).rows[0]);
});
app.get("/api/pelatihan/:id", async (req, res) => {
    res.send((await client.query(`select * from pelatihan where id = ${req.params.id}`)).rows[0]);
});
app.post("/api/tambah/pelatihan", async (req, res) => {
    console.log(req.body);
    await client.query(`insert into pelatihan  values (DEFAULT,'${req.body.nama}')`)
    res.send("Berhasil Menabah Data pelatihan");
});
app.listen(3000);