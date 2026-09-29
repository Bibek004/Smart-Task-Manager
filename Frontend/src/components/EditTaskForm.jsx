// src/components/EditTaskForm.jsx
import { useState } from 'react';
import '../styles/TaskForm.css';

const EditTaskForm = ({ task, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: task.title || '',
    deadline: new Date(task.deadline).toISOString().slice(0, 16),
    priority: task.priority || 'Medium',
    category: task.category || '',
    repeat: task.repeat || 'None',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="edit-task-form">
      <h3>Edit Task</h3>

      <div className="form-row">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Task Title"
        />
        <select name="category" value={formData.category} onChange={handleChange}>
                <option value="">Select Category</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Study">Health</option>
                <option value="Other">Shopping</option>
            </select>
      </div>

      <div className="form-row">
        <input
          name="deadline"
          type="datetime-local"
          value={formData.deadline}
          onChange={handleChange}
          required
        />
        <select name="priority" value={formData.priority} onChange={handleChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select name="repeat" value={formData.repeat} onChange={handleChange}>
          <option value="None">None</option>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
      </div>

      <div className="form-row">
        <button type="submit">💾 Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default EditTaskForm;
