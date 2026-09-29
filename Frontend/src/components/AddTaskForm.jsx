import { useState } from 'react';
import axios from 'axios';
import '../styles/TaskForm.css';


const AddTaskForm = ({ onTaskAdded }) => {
    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [category, setCategory] = useState('Other');
    const [repeat, setRepeat] = useState('None');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'http://localhost:3000/api/tasks',
                { title, deadline: new Date(deadline), priority, category, repeat },
                { withCredentials: true }
            );
            // If you are not getting the updated task list on the dashboard page check if the response.data.task is the newly formed task or not      
            onTaskAdded(response.data.task); // Add to list
            setTitle('');
            setDeadline('');
            setPriority('Medium');
            setCategory('');
            setRepeat('None');
            setError('');
        } catch (err) {
            setError('Failed to add task. Try again.');
            console.error(err);
        }
    };

    return (
        <form className="add-task-form" onSubmit={handleSubmit}>
            <h3>Add New Task</h3>
            {error && <p className="error">{error}</p>}

            <div className="form-row">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task Title"
                    required
                />
                <input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                />
            </div>

            <div className="form-row">
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="Medium">Select Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>

                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Other">Select Category</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Study">Health</option>
                    <option value="Other">Other</option>
                </select>

                <select value={repeat} onChange={(e) => setRepeat(e.target.value)}>
                    <option value="None">Repeat ?</option>
                    <option value="None">None</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                </select>
            </div>

            <div className="form-row">
                <button type="submit">Add Task</button>
            </div>
        </form>

    );
};

export default AddTaskForm;
