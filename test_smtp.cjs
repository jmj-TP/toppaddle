const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Load the .env.local file
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testEmail() {
    console.log("Testing SMTP Connection...");
    console.log("Host:", process.env.SMTP_HOST);
    console.log("Port:", process.env.SMTP_PORT);
    console.log("User:", process.env.SMTP_USER ? "***" + process.env.SMTP_USER.substring(process.env.SMTP_USER.length - 10) : "MISSING");
    console.log("Pass:", process.env.SMTP_PASSWORD ? "***" + process.env.SMTP_PASSWORD.substring(process.env.SMTP_PASSWORD.length - 4) : "MISSING");

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_PORT === '465',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    try {
        await transporter.verify();
        console.log("✅ SMTP Connection Successful! Credentials are valid.");
    } catch (error) {
        console.error("❌ SMTP Connection Failed:");
        console.error(error);
    }
}

testEmail();
