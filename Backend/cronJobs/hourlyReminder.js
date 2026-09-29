// Import required modules
const cron = require('node-cron');                       // For scheduling cron jobs
const Task = require('../models/task');                  // Task model
const User = require('../models/user');                  // User model
const sendReminderEmail = require('../utils/emailService');  // Email utility
const { DateTime } = require('luxon');                   // For easier time calculations



// Schedule this job to run every 10 minutes (*/10 * * * *)

cron.schedule('*/10 * * * *', async () => {
    // Get the current time
    const now = DateTime.now();

    // Calculate time one hour from now
    const oneHourLater = now.plus({ hours: 1 });

    try {
        // Find tasks that:
        // - Have NOT been reminded yet (reminderSent: false)
        // - Whose deadline is within the next hour
        const tasks = await Task.find({
            reminderSent: false,
            deadline: {
                $gte: now.toJSDate(),         // Deadline >= now
                $lte: oneHourLater.toJSDate() // Deadline <= now + 1 hour
            }
        }).populate('userId');            // Populate user details


        // Loop through each task and send a reminder
        for (const task of tasks) {
            const user = task.userId;

            // If no user or email is found, skip this task
            if (!user || !user.email) continue;


            // Build the subject and body of the email
            const subject = `Task Due in 1 Hour: ${task.title}`;
            const text = `Hello ${user.name || 'there'},\n\n` +
                `This is a reminder that your task "${task.title}" is due at ` +
                `${DateTime.fromJSDate(task.deadline).toLocaleString(DateTime.DATETIME_MED)}.\n\n` +
                `Stay productive!\n\n- Smart Task Manager`;

                
            // Send the reminder email
            await sendReminderEmail(user.email, subject, text);

            // Mark this task as reminded to avoid duplicate emails
            task.reminderSent = true;
            await task.save();
        }

        // Log success for debugging and visibility
        console.log(`[CRON] 1-hour reminders sent at ${now.toFormat('HH:mm')}`);
    } catch (err) {
        // Catch and log any unexpected errors
        console.error('[CRON] Error in 1-hour reminder job:', err.message);
    }
});
