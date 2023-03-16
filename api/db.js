import pkg from "pg";

const {Client} = pkg; 

export const client = new Client({
    "host" : "localhost",
    "user" : "root",
    "password" : "123456789",
    "database" : "latihan"
});

await client.connect();