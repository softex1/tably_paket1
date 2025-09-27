import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./api.js";
import { useTranslation } from "../contexts/TranslationContext.jsx";
import LanguageSwitcher from "../components/LanguageSwitcher.jsx";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const getCurrentAdmin = () => {
        const adminData = sessionStorage.getItem('adminData');
        return adminData ? JSON.parse(adminData) : null;
    };

    const fetchUsers = async () => {
        try {
            const admin = getCurrentAdmin();
            if (!admin) return;

            const res = await fetch(`${API_URL}/admin/users`, {
                headers: {
                    "Authorization": `Bearer ${admin.token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setUsers(data);
                setMessage("");
            } else {
                console.error("Failed to fetch users:", res.status, res.statusText);
                setMessage(t('failedToLoadUsers'));
            }
        } catch (err) {
            console.error("Error fetching users:", err);
            setMessage(t('errorLoadingUsers'));
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
            setMessage(t('usernamePasswordRequired'));
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/admin/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${admin.token}`
                },
                body: JSON.stringify({ username, password })
            });

            if (res.ok) {
                setUsername("");
                setPassword("");
                setMessage(t('userAddedSuccess'));
                fetchUsers();
            } else {
                const errorText = await res.text();
                setMessage(errorText || t('failedToAddUser'));
            }
        } catch (err) {
            console.error("Add user error:", err);
            setMessage(t('failedToAddUser'));
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setOldPassword("");
        setNewPassword("");
        setMessage("");
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setOldPassword("");
        setNewPassword("");
        setMessage("");
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        const admin = getCurrentAdmin();
        if (!admin) {
            navigate("/login");
            return;
        }

        if (!oldPassword.trim() || !newPassword.trim()) {
            setMessage(t('oldNewPasswordRequired'));
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/admin/users/${editingUser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${admin.token}`
                },
                body: JSON.stringify({
                    oldPassword: oldPassword,
                    newPassword: newPassword
                })
            });

            const responseText = await res.text();

            if (res.ok) {
                setMessage(t('passwordUpdatedSuccess'));
                setEditingUser(null);
                setOldPassword("");
                setNewPassword("");
                fetchUsers();
            } else {
                setMessage(responseText || t('failedToUpdatePassword'));
            }
        } catch (err) {
            console.error("Update password error:", err);
            setMessage(t('failedToUpdatePassword'));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        setMessage("");
        setLoading(true);

        const admin = getCurrentAdmin();
        if (!admin) {
            navigate("/login");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/admin/users/${userId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${admin.token}`
                }
            });

            const responseText = await res.text();

            if (res.ok) {
                setMessage(t('userDeletedSuccess'));
                setDeleteConfirm(null);
                fetchUsers();
            } else {
                setMessage(responseText || t('failedToDeleteUser'));
            }
        } catch (err) {
            console.error("Delete user error:", err);
            setMessage(t('failedToDeleteUser'));
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
                    <h1>{t('userManagement')}</h1>
                    <div className="navbar-nav">
                        <div className="user-count">{users.length} {t('users')}</div>



                        <div className="back" onClick={handleBackClick}>
                            {/*<img src="/back.png" height="35px" alt={t('back')} />*/}
                            <b>{t('Back')}</b>
                        </div>
                        <button className="logout-btn" onClick={handleLogout}>
                            {t('logout')}
                        </button>
                        {/* Language Selector */}
                        <div className="navbar-language-selector">
                            <LanguageSwitcher variant="navbar" />
                        </div>
                        <div className="support-btn" onClick={() => navigate("/contact")}>
                            <span className="support-icon">🛠️</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="users-content">
                <section className="form-section">
                    <h2>{editingUser ? t('editUser') : t('addNewUser')}</h2>
                    {editingUser ? (
                        <form onSubmit={handleUpdatePassword} className="user-form">
                            <div className="form-group">
                                <label>{t('username')}</label>
                                <input
                                    type="text"
                                    value={editingUser.username}
                                    disabled
                                    className="disabled-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('oldPassword')}</label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    placeholder={t('enterOldPassword')}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('newPassword')}</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder={t('enterNewPassword')}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-buttons">
                                <button type="submit" disabled={loading} className="update-btn">
                                    {loading ? t('updating') + "..." : t('updatePassword')}
                                </button>
                                <button type="button" onClick={handleCancelEdit} disabled={loading} className="cancel-btn">
                                    {t('cancel')}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleAddUser} className="user-form">
                            <div className="form-group">
                                <label>{t('username')}</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder={t('enterUsername')}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('password')}</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t('enterPassword')}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <button type="submit" disabled={loading} className="add-btn">
                                {loading ? t('adding') + "..." : t('addUser')}
                            </button>
                        </form>
                    )}
                    {message && (
                        <p className={message.includes("success") ? "success-message" : "error-message"}>
                            {message}
                        </p>
                    )}
                </section>

                <section className="users-section">
                    {users.length === 0 ? (
                        <div className="no-users">
                            <div className="no-users-icon">👥</div>
                            <h2>{t('noUsersAdded')}</h2>
                            <p>{message || t('addUsersToStart')}</p>
                        </div>
                    ) : (
                        <div className="users-list">
                            <h3>{t('adminUsers')}</h3>
                            {users.map((user) => (
                                <div key={user.id} className="user-card">
                                    <div className="user-info">
                                        <h4 className="user-username">{user.username}</h4>
                                        <p className="user-id">ID: {user.id}</p>
                                    </div>
                                    <div className="user-actions">
                                        <button
                                            onClick={() => handleEditUser(user)}
                                            disabled={loading}
                                            className="edit-btn"
                                        >
                                            {t('edit')}
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(user.id)}
                                            disabled={loading}
                                            className="delete-btn"
                                        >
                                            {t('delete')}
                                        </button>
                                    </div>

                                    {deleteConfirm === user.id && (
                                        <div className="delete-confirmation">
                                            <p>{t('confirmDeleteUser')}</p>
                                            <div className="confirmation-buttons">
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    disabled={loading}
                                                    className="confirm-delete-btn"
                                                >
                                                    {t('yes')}
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(null)}
                                                    disabled={loading}
                                                    className="cancel-delete-btn"
                                                >
                                                    {t('no')}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <style>{`
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

                /* Navbar Language Selector */
                .navbar-language-selector {
                    display: flex;
                    align-items: center;
                }
                
                .back {
                    cursor: pointer;
                    padding: 0.5rem 1rem;
                    background: #555;
                    border-radius: 5px;
                    transition: background 0.3s ease;
                }

                .back:hover {
                    background: #777;
                }
                
                .support-icon:hover {
                    cursor: pointer;
                    transform: scale(2);
                }

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
                .disabled-input { background-color: #f9f9f9 !important; color: #666; }

                .form-buttons { display: flex; gap: 1rem; }
                .add-btn { background: green; color: white; border: none; padding: 0.8rem; border-radius: 8px; cursor: pointer; font-weight: 600; transition: background 0.2s ease; }
                .update-btn { background: #3498db; color: white; border: none; padding: 0.8rem; border-radius: 8px; cursor: pointer; font-weight: 600; transition: background 0.2s ease; flex: 1; }
                .cancel-btn { background: #95a5a6; color: white; border: none; padding: 0.8rem; border-radius: 8px; cursor: pointer; font-weight: 600; transition: background 0.2s ease; flex: 1; }
                .add-btn:hover:not(:disabled), .update-btn:hover:not(:disabled) { background: #222; }
                .cancel-btn:hover:not(:disabled) { background: #7f8c8d; }
                .add-btn:disabled, .update-btn:disabled, .cancel-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                .success-message { color: #27ae60; margin-top: 1rem; }
                .error-message { color: #e74c3c; margin-top: 1rem; }

                .users-section { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                .users-section h3 { margin-bottom: 1.5rem; color: #2c3e50; }
                .users-list { display: flex; flex-direction: column; gap: 1rem; }
                .user-card { background: #f8f9fa; border-radius: 8px; padding: 1rem; border-left: 4px solid #9b59b6; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; }
                .user-info { flex: 1; }
                .user-username { font-size: 1.1rem; font-weight: 600; color: #222; margin: 0; }
                .user-id { color: #7f8c8d; font-size: 0.8rem; margin: 0.25rem 0 0 0; }

                .user-actions { display: flex; gap: 0.5rem; margin-left: 1rem; }
                .edit-btn { background: #3498db; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
                .delete-btn { background: #e74c3c; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
                .edit-btn:hover:not(:disabled) { background: #2980b9; }
                .delete-btn:hover:not(:disabled) { background: #c0392b; }
                .edit-btn:disabled, .delete-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                .delete-confirmation { width: 100%; margin-top: 1rem; padding: 1rem; background: #fff3f3; border-radius: 4px; border-left: 4px solid #e74c3c; }
                .delete-confirmation p { margin-bottom: 0.5rem; color: #c0392b; }
                .confirmation-buttons { display: flex; gap: 0.5rem; }
                .confirm-delete-btn { background: #e74c3c; color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
                .cancel-delete-btn { background: #95a5a6; color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
                .confirm-delete-btn:hover:not(:disabled) { background: #c0392b; }
                .cancel-delete-btn:hover:not(:disabled) { background: #7f8c8d; }

                .no-users { text-align: center; padding: 3rem 2rem; }
                .no-users-icon { font-size: 3rem; margin-bottom: 1rem; }
                .no-users h2 { margin-bottom: 0.5rem; font-size: 1.5rem; color: #2c3e50; }
                .no-users p { color: #7f8c8d; }

                @media (max-width: 992px) {
                    .users-content { flex-direction: column; }
                    .navbar-content { padding: 0 1rem; }
                    .navbar-nav { gap: 0.8rem; }
                    .logout-btn { padding: 6px 12px; font-size: 0.8rem; }
                    .user-card { flex-direction: column; align-items: flex-start; }
                    .user-actions { margin-left: 0; margin-top: 1rem; width: 100%; justify-content: flex-end; }
                }

                @media (max-width: 768px) {
                    .navbar-content { flex-direction: column; gap: 0.5rem; text-align: center; }
                    .navbar-nav { justify-content: center; gap: 0.8rem; margin-top: 0.5rem; flex-wrap: wrap; }
                    .logout-btn { padding: 5px 10px; font-size: 0.7rem; }
                    .users-content { padding: 1rem; }
                    .form-buttons { flex-direction: column; }
                }
            `}</style>
        </div>
    );
}