import { createPool } from "mysql2/promise";

export const pool = createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

export async function testConnection () {
    try {
        const connection = await pool.getConnection()
        console.log("Connected to the database!")
        // const [testQuery] = await pool.query(
        //     "select * from city where countrycode = 'IDN';"
        // )
        // console.log(testQuery)
        connection.release()
    } catch (err) {
        console.error("Unable to connect to the database:", err)
        throw err
    }
}