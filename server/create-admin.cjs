const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const mysqlConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

async function createAdmin(email, plainPassword) {
    let connection;
    try {
        connection = await mysql.createConnection(mysqlConfig);
        console.log('Connected to MySQL...');

        // 1. تشفير كلمة المرور (Hashing) مثلما تفعل Supabase
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);

        // 2. إدخال المستخدم في قاعدة البيانات
        await connection.execute(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashedPassword]
        );

        console.log(`✅ User ${email} created successfully!`);
        console.log(`You can now login with email: ${email} and password: ${plainPassword}`);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.error(`❌ User ${email} already exists.`);
        } else {
            console.error('❌ Failed to create user:', error);
        }
    } finally {
        if (connection) await connection.end();
    }
}

// أخذ البريد وكلمة المرور من موجه الأوامر (Terminal) أو استخدام قيم افتراضية
const email = process.argv[2] || 'admin@effect.com';
const password = process.argv[3] || 'admin123';

createAdmin(email, password);
