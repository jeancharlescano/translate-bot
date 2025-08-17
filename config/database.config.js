import { Pool } from 'pg'
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password:process.env.DBPASSWD,
  database: process.env.DBNAME,
  port: 5432,
})

pool.connect;