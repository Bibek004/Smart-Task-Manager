// src/pages/ProfilePage.jsx
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import '../styles/ProfilePage.css';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { user, logout } = useContext(AuthContext);
    const [profileData, setProfileData] = useState({ name: '', email: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');

    const navigate = useNavigate();


    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');



    useEffect(() => {
        if (user) {
            // Fetch user profile data from the backend
            axios.get('http://localhost:3000/api/auth/user', { withCredentials: true })
                .then(res => {
                    //console.log(res.data);
                    setProfileData(res.data);
                    setNewName(res.data.name);
                    setNewEmail(res.data.email);
                })
                .catch(err => console.error('Failed to fetch user data:', err));
        }
    }, [user]);

    const handleEditToggle = () => setIsEditing(!isEditing);

    const handleSaveChanges = () => {
        axios.put('http://localhost:3000/api/auth/user', { name: newName, email: newEmail }, { withCredentials: true })
            .then(res => {
                setProfileData(res.data);
                setIsEditing(false);
            })
            .catch(err => console.error('Failed to update profile:', err));
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")){ 
        axios.delete('http://localhost:3000/api/auth/user', { withCredentials: true })
            .then(() => {
                logout();
            })
            .catch(err => console.error('Failed to delete account:', err));
        }
    };

    const handlePasswordUpdate = () => {
        axios.put('http://localhost:3000/api/auth/user/update-password',
            { currentPassword, newPassword },
            { withCredentials: true }
        )
            .then(() => {
                alert("Password updated successfully");
                setCurrentPassword('');
                setNewPassword('');
            })
            .catch(err => {
                console.error("Password update failed:", err);
                alert("Failed to update password. Make sure your current password is correct.");
            });
    };

    const handleDeleteAllTasks = () => {
        if (window.confirm("Are you sure you want to delete ALL your tasks? This cannot be undone.")) {
            axios.delete('http://localhost:3000/api/tasks', { withCredentials: true })
                .then(() => {
                    alert("All tasks deleted successfully");
                })
                .catch(err => {
                    console.error("Failed to delete tasks:", err);
                    alert("Error deleting tasks");
                });
        }
    };


    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Profile</h2>
                <div className="profile-header-button">
                    <button onClick={() => navigate("/dashboard")}>Return to dashboard</button>
                    <button onClick={logout}>Logout</button>
                </div>


            </div>

            <div className="profile-details">
                <div>
                    <strong>Name:</strong>
                    {isEditing ? (
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    ) : (
                        <p>{profileData.name}</p>
                    )}
                </div>

                <div>
                    <strong>Email:</strong>
                    {isEditing ? (
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />
                    ) : (
                        <p>{profileData.email}</p>
                    )}
                </div>

                {/* Password Update Section */}
                <div className="update-password">
                    <h3>Update Password</h3>
                    <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button onClick={handlePasswordUpdate}>Update Password</button>
                </div>



                <div className="profile-actions">

                    {isEditing ? (
                        <button onClick={handleSaveChanges}>Save Changes</button>
                    ) : (
                        <button onClick={handleEditToggle}>Edit Profile</button>
                    )}

                    {/* Delete All Tasks Section */}
                    <button
                        onClick={handleDeleteAllTasks}
                        className="danger-btn"
                    >
                        Delete All Tasks
                    </button>

                    <button className="delete-account" onClick={handleDeleteAccount}>Delete Account</button>
                </div>
            </div>

        </div>
    );
};

export default ProfilePage;
