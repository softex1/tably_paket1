import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./api.js";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getCurrentAdmin = () => {
        const adminData = sessionStorage.getItem('adminData');
        return adminData ? JSON.parse(adminData) : null;
    };

    const fetchUsers = async () => {
        try {
            const admin = getCurrentAdmin();
            if (!admin) return;

            console.log("Fetching users from:", `${API_URL}/admin/users`);

            const res = await fetch(`${API_URL}/admin/users`, {
                headers: {
                    "Authorization": `Bearer ${admin.token}`
                }
            });

            console.log("Response status:", res.status);

            if (res.ok) {
                const data = await res.json();
                console.log("Users data:", data);
                setUsers(data);
            } else {
                console.error("Failed to fetch users:", res.status, res.statusText);
                setMessage("Failed to load users");
            }
        } catch (err) {
            console.error("Error fetching users:", err);
            setMessage("Error loading users");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        const admin = getCurrentAdmin();
        if (!admin) {
            navigate("/login");
            return;
        }

        if (!username.trim() || !password.trim()) {
            setMessage("Username and password are required");
            setLoading(false);
            return;
        }

        try {
            console.log("Adding user:", username);

            const res = await fetch(`${API_URL}/admin/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${admin.token}`
                },
                body: JSON.stringify({ username, password })
            });

            console.log("Add user response status:", res.status);

            if (res.ok) {
                setUsername("");
                setPassword("");
                setMessage("User added successfully!");
                fetchUsers();
            } else {
                const errorText = await res.text();
                console.error("Add user error:", errorText);
                setMessage(errorText || "Failed to add user");
            }
        } catch (err) {
            console.error("Add user error:", err);
            setMessage("Failed to add user");
        } finally {
            setLoading(false);
        }
    };

    const handleBackClick = () => {
        navigate("/tables");
    };

    const handleLogout = () => {
        sessionStorage.removeItem('adminData');
        navigate("/login");
    };

    return (
        <div className="users-page">
            <nav className="dashboard-navbar">
                <div className="navbar-content">
                    <h1>User Management</h1>
                    <div className="navbar-nav">
                        <div className="user-count">{users.length} Users</div>
                        <div className="back" onClick={handleBackClick}>
                            <img src="/back.png" height="35px" alt="Back" />
                        </div>
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="users-content">
                <section className="form-section">
                    <h2>Add New User</h2>
                    <form onSubmit={handleAddUser} className="user-form">
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required
                                disabled={loading}
                            />
                        </div>
                        <button type="submit" disabled={loading} className="add-btn">
                            {loading ? "Adding..." : "Add User"}
                        </button>
                        {message && (
                            <p className={message.includes("successfully") ? "success-message" : "error-message"}>
                                {message}
                            </p>
                        )}
                    </form>
                </section>

                <section className="users-section">
                    {users.length === 0 ? (
                        <div className="no-users">
                            <div className="no-users-icon">👥</div>
                            <h2>No Users Found</h2>
                            <p>{message || "Add users using the form on the left"}</p>
                        </div>
                    ) : (
                        <div className="users-list">
                            <h3>Admin Users</h3>
                            {users.map((user) => (
                                <div key={user.id} className="user-card">
                                    <div>
                                        <h4 className="user-username">{user.username}</h4>
                                        <p className="user-id">ID: {user.id}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <style jsx>{`
                * { margin: 0; padding: 0; box-sizing: border-box; }
                #root { width: 100%; }
                .users-page { min-height: 100vh; background: #f5f7fa; font-family: 'OpenSans','Segoe UI',sans-serif; width: 100%; }
                @font-face { font-family: 'OpenSans'; src: url('/OpenSans.ttf') format('opentype'); }

                .dashboard-navbar { background: #222; color: white; padding: 1rem 0; width: 100%; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; }
                .navbar-content { width: 100%; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center; }
                .navbar-nav { display: flex; gap: 1rem; align-items: center; }
                .navbar-content h1 { font-size: 2em; font-weight:500;}
                .user-count { background: gray; padding: 0.4rem 0.8rem; border-radius: 20px; font-weight: 500; }
                .back { cursor: pointer; transition: transform 0.2s ease; }
                .back:hover { transform: scale(1.1); }

                .logout-btn {
                    background: #e74c3c;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: 600;
                    transition: background 0.3s ease;
                }
                .logout-btn:hover { background: #c0392b; }

                .users-content { display: flex; padding: 2rem; gap: 2rem; min-height: calc(100vh - 80px); }
                .form-section, .users-section { flex: 1; }

                .form-section { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); height: fit-content; }
                .form-section h2 { margin-bottom: 1.5rem; color: #2c3e50; }
                .user-form { display: flex; flex-direction: column; gap: 1rem; }
                .form-group { display: flex; flex-direction: column; }
                .form-group label { margin-bottom: 0.5rem; font-weight: 600; color: #333; }
                .form-group input { padding: 0.6rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; }
                .form-group input:disabled { background-color: #f5f5f5; }
                .add-btn { background: green; color: white; border: none; padding: 0.8rem; border-radius: 8px; cursor: pointer; font-weight: 600; transition: background 0.2s ease; }
                .add-btn:hover:not(:disabled) { background: #222; }
                .add-btn:disabled { background: #95a5a6; cursor: not-allowed; }

                .success-message { color: #27ae60; margin-top: 1rem; }
                .error-message { color: #e74c3c; margin-top: 1rem; }

                .users-section { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                .users-section h3 { margin-bottom: 1.5rem; color: #2c3e50; }
                .users-list { display: flex; flex-direction: column; gap: 1rem; }
                .user-card { background: #f8f9fa; border-radius: 8px; padding: 1rem; border-left: 4px solid #9b59b6; }
                .user-username { font-size: 1.1rem; font-weight: 600; color: #222; margin: 0; }
                .user-id { color: #7f8c8d; font-size: 0.8rem; margin: 0.25rem 0 0 0; }

                .no-users { text-align: center; padding: 3rem 2rem; }
                .no-users-icon { font-size: 3rem; margin-bottom: 1rem; }
                .no-users h2 { margin-bottom: 0.5rem; font-size: 1.5rem; color: #2c3e50; }
                .no-users p { color: #7f8c8d; }

                @media (max-width: 992px) {
                    .users-content { flex-direction: column; }
                    .navbar-content { padding: 0 1rem; }
                    .navbar-nav { gap: 0.8rem; }
                    .logout-btn { padding: 6px 12px; font-size: 0.8rem; }
                }

                @media (max-width: 768px) {
                    .navbar-content { flex-direction: column; gap: 0.5rem; text-align: center; }
                    .navbar-nav { justify-content: center; gap: 0.8rem; margin-top: 0.5rem; flex-wrap: wrap; }
                    .logout-btn { padding: 5px 10px; font-size: 0.7rem; }
                    .users-content { padding: 1rem; }
                }
            `}</style>
        </div>
    );
}