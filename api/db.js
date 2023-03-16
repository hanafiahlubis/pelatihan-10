import pkg from "pg";

const { Client } = pkg;

export const client = new Client({
    "host": "localhost",
    "user": "postgres",
    "password": "123456789",
    "database": "postgres"
});

await client.connect();