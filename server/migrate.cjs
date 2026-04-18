const { createClient } = require('@supabase/supabase-js');
const mysql = require('mysql2/promise');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const mysqlConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

async function migrate() {
    let connection;
    try {
        connection = await mysql.createConnection(mysqlConfig);
        console.log('Connected to MySQL');

        // 1. Migrate Applications
        console.log('Migrating applications...');
        const { data: apps, error: appError } = await supabase.from('applications').select('*');
        if (appError) throw appError;

        for (const app of apps) {
            const query = `
                INSERT INTO applications 
                (id, full_name, email, phone, location, expertise, experience, portfolio, skills, min_rate, max_rate, bio, status, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE full_name=VALUES(full_name)
            `;
            await connection.execute(query, [
                app.id, app.full_name, app.email, app.phone, app.location,
                app.expertise, app.experience, app.portfolio, app.skills,
                app.min_rate, app.max_rate, app.bio, app.status, app.created_at
            ]);
        }
        console.log(`Migrated ${apps.length} applications.`);

        // 2. Migrate Contacts
        console.log('Migrating contacts...');
        const { data: contacts, error: contactError } = await supabase.from('contacts').select('*');
        if (contactError) throw contactError;

        for (const contact of contacts) {
            const query = `
                INSERT INTO contacts (id, full_name, email, phone, subject, message, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE full_name=VALUES(full_name)
            `;
            await connection.execute(query, [
                contact.id, contact.full_name, contact.email, contact.phone,
                contact.subject, contact.message, contact.created_at
            ]);
        }
        console.log(`Migrated ${contacts.length} contacts.`);

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

migrate();
