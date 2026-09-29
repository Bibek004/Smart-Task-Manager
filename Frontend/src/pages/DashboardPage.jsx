// src/pages/DashboardPage.jsx
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import AddTaskForm from '../components/AddTaskForm';
import EditTaskForm from '../components/EditTaskForm'; // ✅ NEW
import '../styles/DashboardPage.css'

import {useNavigate} from 'react-router-dom';

const DashboardPage = () => {
	const { user, logout } = useContext(AuthContext);

	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState('All');
	const [showForm, setShowForm] = useState(false);
	const [editingTaskId, setEditingTaskId] = useState(null); // ✅
	const [editedTask, setEditedTask] = useState(null); // ✅

	const navigate = useNavigate(); // For redirecting

	useEffect(() => {
		if (!user) return;

		axios
			.get('http://localhost:3000/api/tasks', { withCredentials: true })
			.then((res) => {
				setTasks(res.data);
				setLoading(false);
			})
			.catch((err) => {
				console.error('Failed to fetch tasks:', err);
				setLoading(false);
			});
	}, [user]);

	// Filter logic
	const filteredTasks = tasks.filter((task) => {
		if (filter === 'Completed') return task.completed;
		if (filter === 'Incomplete') return !task.completed;
		if (filter === 'Overdue')
			return new Date(task.deadline) < new Date() && !task.completed;
		return true;
	});

	// Stats
	const total = tasks.length;
	const completed = tasks.filter((t) => t.completed).length;
	const incomplete = total - completed;

	// Start editing
	const startEdit = (task) => {
		setEditingTaskId(task._id);
		setEditedTask(task);
	};

	// Cancel edit
	const cancelEdit = () => {
		setEditingTaskId(null);
		setEditedTask(null);
	};

	// Save edited task
	const saveEdit = async (updatedData) => {
		try {
			const res = await axios.put(
				`http://localhost:3000/api/tasks/${editingTaskId}`,
				updatedData,
				{ withCredentials: true }
			);
			const updatedTask = res.data;

			setTasks((prev) =>
				prev.map((t) => (t._id === editingTaskId ? updatedTask : t))
			);

			cancelEdit();
		} catch (err) {
			console.error('Error updating task:', err);
		}
	};

	// Delete Task
	const handleDelete = async (id) => {
		try {
			await axios.delete(`http://localhost:3000/api/tasks/${id}`, { withCredentials: true });
			setTasks(prev => prev.filter(task => task._id !== id));  // update UI
		} catch (err) {
			console.error("Failed to delete task:", err);
		}
	};


	// Toggle completion status of a task
	const toggleTaskCompletion = (taskId, currentStatus) => {
		axios
			.put(`http://localhost:3000/api/tasks/${taskId}`, { completed: !currentStatus }, { withCredentials: true })
			.then((res) => {
				// Update task in state
				setTasks((prev) =>
					prev.map((task) => (task._id === taskId ? { ...task, completed: !currentStatus } : task))
				);
			})
			.catch((err) => {
				console.error('Error toggling task completion:', err);
			});
	};


	return (
		<div className="dashboard-container">
			{/* Welcome + Logout */}
			<div className="dashboard-header">
				<h2>Welcome, {user?.name || 'User'} 👋</h2>
				<div className='dashboard-header-btn'>
					<button onClick={() => navigate("/profile")}>Profile</button>
					<button onClick={logout}>Logout</button>
				</div>
				
			</div>

			{/* Summary */}
			<div className="task-summary">
				<p>Total: {total}</p>
				<p>Completed: {completed}</p>
				<p>Incomplete: {incomplete}</p>
			</div>

			{/* Filters */}
			<div className="task-filters">
				{['All', 'Completed', 'Incomplete', 'Overdue'].map((f) => (
					<button
						key={f}
						onClick={() => setFilter(f)}
						className={filter === f ? 'active' : ''}
					>
						{f}
					</button>
				))}
			</div>

			{/* Add Task */}
			<div className="add-task-section">
				<button onClick={() => setShowForm(!showForm)}>
					{showForm ? 'Cancel' : 'Add New Task'}
				</button>
				{showForm && (
					<AddTaskForm
						onTaskAdded={(newTask) =>
							setTasks((prev) => [
								...prev,
								{ ...newTask, deadline: new Date(newTask.deadline) },
							])
						}
					/>
				)}
			</div>

			{/* Task List */}
			<div className="task-list">
				{loading ? (
					<p>Loading tasks...</p>
				) : filteredTasks.length === 0 ? (
					<p>No tasks to show.</p>
				) : (
					<ul>
						{filteredTasks.map((task) => (
							<li key={task._id} className="task-item">
								{editingTaskId === task._id ? (
									<EditTaskForm
										task={editedTask}
										onSave={saveEdit}
										onCancel={cancelEdit}
									/>
								) : (
									<>
										<div className="task-details">
											<div className='task-subdetails'>
												<strong>{task.title}</strong>
												<span>
													• {task.category}
												</span>

												<span>
													•{' '} {new Date(task.deadline).toLocaleString()}
												</span>

												<span>
													{task.repeat ? `• Repeats: ${task.repeat}` : ''}
												</span>
											</div>

											<span>
												{task.completed ? '✅' : '❌'}{' '}
											</span>
										</div>

										<div className="task-actions">
											<button
												className="complete-btn"
												onClick={() => toggleTaskCompletion(task._id, task.completed)}
											>
												{task.completed ? 'Mark Incomplete' : 'Mark Complete'}
											</button>
											<button className="edit-btn" onClick={() => startEdit(task)}>✏️ Edit</button>
											<button className="delete-btn" onClick={() => handleDelete(task._id)}>❌ Delete</button>
										</div>
									</>
								)}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default DashboardPage;
