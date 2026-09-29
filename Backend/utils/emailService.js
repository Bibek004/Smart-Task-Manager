// Import nodemailer package for sending emails from Node.js
const nodemailer = require('nodemailer');

// Create a transporter object that defines the email service and login credentials
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,     // smtp.resend.com
    port: process.env.EMAIL_PORT,     // 587
    secure: false,                    // true for port 465, false for 587
    auth: {
        user: process.env.EMAIL_USER,   // 'resend'
        pass: process.env.EMAIL_PASS    // your Resend API key
    }
});

// Create and export a function to send emails
const sendReminderEmail = async (to, subject, text) => {
    try {
        // Use transporter to send the email
        await transporter.sendMail({
            from: 'smartTaskManager@resend.dev', // This is required by Resend for free plans
            to,        // Receiver's email address
            subject,   // Email subject
            text       // Body of the email (plain text)
        });

        // Log success message in the server
        console.log("Reminder email sent to:", to);

    } catch (err) {
        // Catch and log any error that occurs while sending the email
        console.error("Failed to send email:", err.message);
    }
};

// Export the function so we can use it in routes or controllers
module.exports = sendReminderEmail;
