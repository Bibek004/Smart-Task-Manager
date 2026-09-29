const cron = require('node-cron');
const Task = require('../models/task');
const User = require('../models/user');
const sendReminderEmail = require('../utils/emailService');
const { DateTime } = require('luxon');

//Overdue Task update at 2:00 AM

cron.schedule('0 2 * * *', async () => {
    const now = DateTime.now();

    try {
        //Finding all the users in our database
        const users = await User.find();


        for (const user of users) {
            //Checking for all the users

            if (!user || !user.email) continue;

            //Finding all the Overdue Tasks of a particular user
            const userTask = await Task.find({
                userId: user._id,
                deadline: { $lt: now.toJSDate() }
            });


            if (userTask.length === 0) continue;

            const taskList = [];

            for (const task of userTask) {

                const originalDeadline = task.deadline;

                if (task.repeat == "None") {

                    // Delete non-repeating overdue task
                    await Task.deleteOne({ _id: task._id });
                    console.log(`Deleted task: ${task.title}`);

                }
                else{

                    // Update deadline based on repeat frequency
                    let newDeadline = DateTime.fromJSDate(task.deadline);

                    if(task.repeat === 'daily') {
                        newDeadline = newDeadline.plus({ days: 1 });
                    } 
                    else if (task.repeat === 'weekly') {
                        newDeadline = newDeadline.plus({ weeks: 1 });
                    } 
                    else if (task.repeat === 'monthly') {
                        newDeadline = newDeadline.plus({ months: 1 });
                    }

                    task.deadline = newDeadline.toJSDate();
                    await task.save();
                }
                if(task.isCompleted == false){ 
                    taskList.push(
                        `• ${task.title} (Was due: ${DateTime.fromJSDate(originalDeadline).toLocaleString(DateTime.DATETIME_MED)})`
                    );
                }
            }

            if (taskList.length === 0) continue;

            const subject = `You had ${taskList.length} overdue task(s)`;
            const text = `Hi ${user.name || ''},\n\nThe following tasks are overdue :\n\n${taskList.join('\n')}\n\n– Smart Task Manager`;

            await sendReminderEmail(user.email, subject, text);
        }

        console.log(`[CRON] Overdue task cleanup completed at ${now.toFormat('HH:mm')}`);
    } catch (err) {
        console.error('[CRON] Error in overdue cleanup job:', err.message);
    }
});
