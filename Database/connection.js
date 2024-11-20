/** Work in progress ..
 * Separation of task
 */
const { Pool } = require('pg');
const dbParams = {
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
};
const db = new Pool(dbParams);
db.connect();
export default db;
