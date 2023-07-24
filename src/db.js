import { createPool } from "mysql2/promise";
import { dbhost, dbname, dbpass, dbport, dbuser } from './config.js'
export const pool = createPool({
  host: dbhost,
  user: dbuser,
  password: dbpass,
  port: dbport,
  database: dbname,
});
