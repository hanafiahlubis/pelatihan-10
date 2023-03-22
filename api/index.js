import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from 'cookie-parser';
import { client } from "./db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// percobaan 
// const token = jwt.sign({
//     masuk: "dsadasda"
// }, "rahasia");

// console.log(token);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

app.use((req, res, next) => {
    if (req.path.startsWith("/assets") || req.path.startsWith("/api")) {
        next();
    } else {
        if (req.cookies.token) {
            if (req.path.startsWith("/login")) {
                res.redirect("/")
            } else {
                next();
            }
        } else {
            if (req.path.startsWith("/login")) {
                next();
            } else {
                res.redirect("/login");
            }
        }
    }
});

// dapatkan token / dinamis
app.post("/api/login", async (req, res) => {
    const results = await client.query(`select * from mahasiswa where nim ='${req.body.nim}'`);
    // console.log(results.rows[0]);
    if (results.rows.length > 0) {
        if (await bcrypt.compare(req.body.password,results.rows[0].password)) {
            const token = jwt.sign(
                results.rows[0],
                process.env.SECRET_KEY
            );
            res.cookie("token", token);
            res.send(token);
        } else {
            res.status(401);
            res.send("password salah");
        }
    } else {
        res.status(401);
        res.send("Mahasiswa tidak di temukkan");
    }
});

// middlewere
app.use((req, res, next) => {
    if (req.cookies.token) {
        try {
            jwt.verify(req.cookies.token, process.env.SECRET_KEY);
            next();
        } catch (err) {
            res.status(200);
            res.send("Anda Harus Login lagi");
        }
    } else {
        res.status(200);
        res.send("Anda Harus Login Terlebih Dahulu");
    }

    //cara token manual
    // if (req.headers.authorization === "Bearer abcd") {
    //     next();
    // } else {
    //     res.status(401);
    //     res.send("Token Salah");
    // }
});


app.get("/api/me", (req, res) => {
    res.json(jwt.verify(req.cookies.token, process.env.SECRET_KEY))
});


// root Mahasiswa

app.get("/api/mahasiswa", async (_req, res) => {
    const data = await client.query("select * from mahasiswa");
    res.send(data.rows);
});

app.get("/api/mahasiswa/:id", async (req, res) => {
    res.send(await client.query(`select * from mahasiswa where id = ${req.params.id}`));
});
app.post("/api/tambah/mahasiswa", async (req, res) => {
    const salt = await bcrypt.genSalt();
    const hast = await bcrypt.hash(req.body.password, salt);
    console.log(hast);
    await client.query(`insert into mahasiswa values(DEFAULT ,'${req.body.nim}','${req.body.nama}','${hast}')`)
    res.send("Berhasil Menabah Data");
});

app.put("/api/update/mahasiswa", async (req, res) => {
    await client.query(`update mahasiswa set nama ='${req.body.nama}'`);
    res.send("Berhasil mengganti nama");
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

app.put("/api/update/pelatihan", async (req, res) => {
    await client.query(`update pelatihan set nama ='${req.body.nama}'`);
    res.send("Berhasil mengganti nama");
});

app.listen(3000);