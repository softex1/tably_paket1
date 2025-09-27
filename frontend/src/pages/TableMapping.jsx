// src/pages/TableMapping.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./api.js";
import { useTranslation } from "../contexts/TranslationContext.jsx";
import LanguageSwitcher from "../components/LanguageSwitcher.jsx";

export default function TableMapping() {
    const [tables, setTables] = useState([]);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [password, setPassword] = useState("");
    const [tableToDelete, setTableToDelete] = useState(null);
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Get current admin info from sessionStorage
    const getCurrentAdmin = () => {
        const adminData = sessionStorage.getItem('adminData');
        if (adminData) {
            return JSON.parse(adminData);
        }
        return null;
    };

    const fetchTables = () => {
        fetch(`${API_URL}/tables`)
            .then(res => res.json())
            .then(data => setTables(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        // Check if admin is logged in
        const admin = getCurrentAdmin();
        if (!admin) {
            navigate("/login");
            return;
        }
        fetchTables();
    }, [navigate]);

    const handleBackClick = () => {
        navigate("/admin");
    };

    const handleLogout = () => {
        sessionStorage.removeItem('adminData');
        navigate("/login");
    };

    const handleDownloadQR = (table) => {
        if (!table.qrCodeBase64) {
            alert(t('qrNotAvailable'));
            return;
        }

        const link = document.createElement("a");
        link.href = `data:image/png;base64,${table.qrCodeBase64}`;
        link.download = `table-${table.tableNumber}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = (tableId, tableNumber) => {
        const admin = getCurrentAdmin();
        if (!admin) {
            navigate("/login");
            return;
        }

        setTableToDelete({ id: tableId, number: tableNumber });
        setShowPasswordModal(true);
        setPassword("");
        setPasswordError("");
    };

    const confirmDelete = () => {
        const admin = getCurrentAdmin();
        if (!admin) {
            navigate("/login");
            return;
        }

        if (!password.trim()) {
            setPasswordError(t("passwordRequired"));
            return;
        }

        fetch(`${API_URL}/tables/${tableToDelete.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${admin.token}` // ✅ ADD THIS LINE
            },
            body: JSON.stringify({ password }),
        })
            .then(async (res) => {
                if (res.ok) {
                    fetchTables(); // refresh table list
                    setShowPasswordModal(false);
                    setTableToDelete(null);
                    setPassword("");
                } else {
                    const errorText = await res.text();
                    setPasswordError(errorText || t("invalidPassword"));
                }
            })
            .catch((err) => {
                console.error(err);
                setPasswordError(t("failedToDeleteTable"));
            });
    };


    const cancelDelete = () => {
        setShowPasswordModal(false);
        setTableToDelete(null);
        setPassword("");
        setPasswordError("");
    };

    return (
        <div className="table-mapping">
            {/* Password Confirmation Modal */}
            {showPasswordModal && (
                <div className="modal-overlay">
                    <div className="password-modal">
                        <h3>{t('confirmDelete')}</h3>
                        <p>{t('confirmDeleteMessage', { tableNumber: tableToDelete?.number })}</p>
                        <p>{t('enterPassword')}</p>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('enterPassword')}
                            className="password-input"
                            autoFocus
                        />

                        {passwordError && <p className="error-message">{passwordError}</p>}

                        <div className="modal-actions">
                            <button onClick={cancelDelete} className="cancel-btn">
                                {t('cancel')}
                            </button>
                            <button onClick={confirmDelete} className="confirm-delete-btn">
                                {t('deleteTable')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Navbar */}
            <nav className="dashboard-navbar">
                <div className="navbar-content">
                    <h1>{t('tableMapping')}</h1>
                    <div className="navbar-nav">
                        <div className="table-count">{tables.length} {t('tables')}</div>

                        {/* Back Button */}
                        <div className="back" onClick={handleBackClick}>
                            {/*<img src="/back.png" height="35px" alt={t('back')} />*/}
                            <b>{t('Back')}</b>
                        </div>

                        {/* Users Button */}
                        <div className="users-btn" onClick={() => navigate("/users")}>
                            <span style={{fontSize: '1.5rem'}}>👥</span>
                        </div>

                        {/* Logout Button */}
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

            {/* Main Content */}
            <main className="mapping-content">
                {/* Left: Form */}
                <section className="form-section">
                    <h2>{t('addNewTable')}</h2>
                    <form
                        className="table-form"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const form = e.target;
                            const newTable = {
                                tableNumber: form.tableNumber.value,
                                location: form.location.value,
                                type: form.type.value,
                            };

                            try {
                                await fetch(`${API_URL}/tables`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(newTable),
                                });

                                fetchTables();
                                form.reset();
                            } catch (err) {
                                console.error(err);
                                alert(t('failedToAddTable'));
                            }
                        }}
                    >
                        <div className="form-group">
                            <label>{t('tableNumber')}</label>
                            <input type="text" name="tableNumber" required />
                        </div>
                        <div className="form-group">
                            <label>{t('location')}</label>
                            <input type="text" name="location" />
                        </div>
                        <div className="form-group">
                            <label>{t('type')}</label>
                            <select name="type" required>
                                <option value="HIGH">{t('highTable')}</option>
                                <option value="LOW">{t('lowTable')}</option>
                            </select>
                        </div>
                        <button type="submit" className="add-btn">{t('addTable')}</button>
                    </form>
                </section>

                {/* Right: List of Tables */}
                <section className="tables-section">
                    {tables.length === 0 ? (
                        <div className="no-tables">
                            <div className="no-tables-icon">🍽️</div>
                            <h2>{t('noTablesAdded')}</h2>
                            <p>{t('addTablesToStart')}</p>
                        </div>
                    ) : (
                        <div className="tables-list">
                            {tables.map((table) => (
                                <div key={table.id} className="table-card">
                                    <div>
                                        <h3 className="table-title">{t('table')} {table.tableNumber}</h3>
                                        <p className="table-location">
                                            {table.location || t('mainHall')}
                                        </p>
                                        <p className="table-type">
                                            {table.type === "HIGH" ? " " + t('highTable') : " " + t('lowTable')}
                                        </p>
                                    </div>
                                    <div className="card-actions">
                                        <button
                                            className="download-btn"
                                            onClick={() => handleDownloadQR(table)}
                                        >
                                            ⬇️ {t('downloadQR')}
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(table.id, table.tableNumber)}
                                        >
                                            ❌ {t('delete')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <style>{`
                * { margin: 0; padding: 0; box-sizing: border-box; }

                #root { width: 100%; }
                .table-mapping { min-height: 100vh; background: #f5f7fa; font-family: 'OpenSans','Segoe UI',sans-serif; width: 100%; }
                @font-face { font-family: 'OpenSans'; src: url('/OpenSans.ttf') format('opentype'); }

                .users-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                    color: white;
                    font-weight: 500;
                }

                .users-btn:hover {
                    transform: scale(1.1);
                }

                .users-btn span {
                    font-size: 0.9rem;
                }

                /* Navbar Language Selector */
                .navbar-language-selector {
                    display: flex;
                    align-items: center;
                }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .password-modal {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    width: 90%;
                    max-width: 400px;
                    text-align: center;
                }

                .password-modal h3 {
                    color: #e74c3c;
                    margin-bottom: 1rem;
                    font-size: 1.5rem;
                }

                .password-modal p {
                    margin-bottom: 1rem;
                    color: #555;
                }

                .password-input {
                    width: 100%;
                    padding: 0.8rem;
                    border: 2px solid #ddd;
                    border-radius: 8px;
                    font-size: 1rem;
                    margin-bottom: 1rem;
                }

                .password-input:focus {
                    outline: none;
                    border-color: #3498db;
                }

                .error-message {
                    color: #e74c3c;
                    margin-bottom: 1rem;
                    font-size: 0.9rem;
                }

                .modal-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }

                .cancel-btn {
                    background: #95a5a6;
                    color: white;
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background 0.2s ease;
                }

                .cancel-btn:hover {
                    background: #7f8c8d;
                }

                .confirm-delete-btn {
                    background: #e74c3c;
                    color: white;
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background 0.2s ease;
                }

                .confirm-delete-btn:hover {
                    background: #c0392b;
                }
                
                .support-icon:hover {
                    cursor: pointer;
                    transform: scale(1.2);
                }

                /* Navbar */
                .dashboard-navbar { background: #222; color: white; padding: 1rem 0; width: 100%; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; }
                .navbar-content { width: 100%; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center; }
                .navbar-nav { display: flex; gap: 1rem; align-items: center; }
                .navbar-content h1 { font-size: 2em; font-weight:500;}
                .table-count { background: gray; padding: 0.4rem 0.8rem; border-radius: 20px; font-weight: 500; }
                .back { cursor: pointer; transition: transform 0.2s ease; }
                .back:hover { transform: scale(1.1); }
                
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
                
                /* Logout Button */
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

                .logout-btn:hover {
                    background: #c0392b;
                }

                /* Layout */
                .mapping-content { display: flex; padding: 2rem; gap: 2rem; }
                .form-section, .tables-section { flex: 1; }

                /* Form Section */
                .form-section { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); display: flex; flex-direction: column; }
                .form-section h2 { margin-bottom: 1.5rem; color: #2c3e50; }
                .table-form { display: flex; flex-direction: column; gap: 1rem; }
                .form-group { display: flex; flex-direction: column; }
                .form-group label { margin-bottom: 0.5rem; font-weight: 600; color: #333; }
                .form-group input, .form-group select { padding: 0.6rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; }
                .add-btn { background: green; color: white; border: none; padding: 0.8rem; border-radius: 8px; cursor: pointer; font-weight: 600; margin-top: 0.5rem; transition: background 0.2s ease; }
                .add-btn:hover { background: #222; }

                /* Tables Section */
                .tables-list { display: flex; flex-direction: column; gap: 1rem; }
                .table-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 4px solid #54a0ff; display: flex; justify-content: space-between; align-items: center; transition: transform 0.2s ease, box-shadow 0.2s ease; }
                .table-card:hover { transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.1); }
                .table-title { font-size: 1.3rem; font-weight: 700; color: #222; }
                .table-location, .table-type { font-size: 0.95rem; color: #555; }
                .card-actions { display: flex; flex-direction: column; gap: 0.5rem; margin-left: 1rem; }
                .download-btn, .delete-btn { border: none; padding: 0.6rem 1rem; border-radius: 6px; cursor: pointer; font-weight: 600; }
                .download-btn { background: #3498db; color: white; }
                .download-btn:hover { background: #2980b9; }
                .delete-btn { background: #e74c3c; color: white; }
                .delete-btn:hover { background: #c0392b; }

                /* Empty state */
                .no-tables { text-align: center; padding: 4rem 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                .no-tables-icon { font-size: 3rem; margin-bottom: 1rem; }
                .no-tables h2 { margin-bottom: 0.5rem; font-size: 1.5rem; color: #2c3e50; }
                .no-tables p { color: #7f8c8d; }

                /* Responsive */
                @media (max-width: 992px) {
                    .mapping-content { flex-direction: column; }
                    .navbar-content { padding: 0 1rem; }
                    .navbar-nav { gap: 0.8rem; }
                    .logout-btn { padding: 6px 12px; font-size: 0.8rem; }
                }

                @media (max-width: 768px) {
                    .navbar-content {
                        flex-direction: column;
                        gap: 0.5rem;
                        text-align: center;
                    }
                    .navbar-nav {
                        justify-content: center;
                        gap: 0.8rem;
                        margin-top: 0.5rem;
                        flex-wrap: wrap;
                    }
                    .logout-btn {
                        padding: 5px 10px;
                        font-size: 0.7rem;
                    }
                    .mapping-content {
                        padding: 1rem;
                    }
                }
            `}</style>
        </div>
    );
}