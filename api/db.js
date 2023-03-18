import pkg from "pg";

const { Client } = pkg;

export const client = new Client({
    "host": "db.gfyxmythpcokpikhlvpv.supabase.co",
    "user": "postgres",
    "password": "aliganteng123",
    "database": "postgres"
});

await client.connect();