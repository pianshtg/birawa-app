import path from "path"
import { pool } from ".."
import fs from 'fs'

async function seeder() {
    try {
        const seederFile = path.join(__dirname, 'seeder.sql')
        console.log(`Reading seeder file from: ${seederFile}`)

        const seederQuery = fs.readFileSync(seederFile, 'utf8')
        console.log("Running the query...")

        await pool.query(seederQuery)
        console.log('Database tables created and seeded successfully!')
        
    } catch (error) {
        console.error("Error seeding the database:", error)
    } finally {
        await pool.end()
        console.log("Database connection closed.")
    }
}

seeder()