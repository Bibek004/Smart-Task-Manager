const cron = require('node-cron');
const Task = require('../models/task');
const User = require('../models/user');
const sendReminderEmail = require('../utils/emailService');
const { DateTime } = require('luxon');



// Run daily at 4:00 AM server time


cron.schedule('0 4 * * *', async () => {
    const now = DateTime.now(); // Current time
    const startOfDay = now.startOf('day'); // Today 00:00
    const endOfDay = now.endOf('day');     // Today 23:59:59

    try {
        // Fetch all users
        const users = await User.find();

        for (const user of users) {
            if (!user || !user.email) continue;

            // Find all tasks for the user that are due today
            const todaysTasks = await Task.find({
                userId: user._id,
                deadline: {
                    $gte: startOfDay.toJSDate(),
                    $lte: endOfDay.toJSDate()
                }
            });

            // Skip users who have no tasks today
            if (todaysTasks.length === 0) continue;

            // Build email body
            const taskList = todaysTasks.map(task =>
                `• ${task.title} (Due: ${DateTime.fromJSDate(task.deadline).toLocaleString(DateTime.TIME_SIMPLE)})`
            ).join('\n');

            const subject = `Your Tasks for Today (${now.toLocaleString(DateTime.DATE_FULL)})`;
            const text = `Good morning ${user.name || ''},\n\nHere are your tasks scheduled for today:\n\n${taskList}\n\nStay focused and have a great day!\n\n- Smart Task Manager`;

            // Send the email
            await sendReminderEmail(user.email, subject, text);
        }

        console.log(`[CRON] Daily summary emails sent at ${now.toFormat('HH:mm')}`);
    } catch (err) {
        console.error('[CRON] Error in daily summary job:', err.message);
    }
});


