// src/pages/TableMapping.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddTableForm from "../components/AddTableForm.jsx";
import TableList from "../components/TableList.jsx";
import { API_URL } from "./api.js";

export default function TableMapping() {
    const [tables, setTables] = useState([]);
    const navigate = useNavigate();

    const fetchTables = () => {
        fetch(`${API_URL}/tables`)
            .then(res => res.json())
            .then(data => setTables(data))
            .catch(err => console.error(err));
    };

    useEffect(() => { fetchTables(); }, []);

    const handleTableAdded = (newTable) => {
        setTables(prev => [...prev, newTable]);
    };

    const handleBackClick = () => {
        navigate("/admin");
    };

    const handleLogout = () => {
        // Clear any admin session data if needed
        localStorage.removeItem('adminToken'); // if you have admin authentication
        sessionStorage.clear();

        // Navigate to login or home page
        navigate("/login");
    };

    const handleDownloadQR = (table) => {
        if (!table.qrCodeBase64) {
            alert("QR code not available for this table!");
            return;
        }

        // Create a temporary <a> element to trigger download
        const link = document.createElement("a");
        link.href = `data:image/png;base64,${table.qrCodeBase64}`;
        link.download = `table-${table.tableNumber}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = (tableId) => {
        if (!window.confirm("Are you sure you want to delete this table?")) {
            return; // stop if user clicks "Cancel"
        }

        fetch(`${API_URL}/tables/${tableId}`, {
            method: "DELETE"
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to delete table");
                // Re-fetch all tables to refresh UI
                fetchTables();
            })
            .catch(err => {
                console.error(err);
                alert("Failed to delete table");
            });
    };

    return (
        <div className="table-mapping">
            {/* Navbar */}
            <nav className="dashboard-navbar">
                <div className="navbar-content">
                    <h1>Table Mapping</h1>
                    <div className="navbar-nav">
                        <div className="table-count">{tables.length} Tables</div>
                        <div className="back" onClick={handleBackClick}>
                            <img src="/back.png" height="35px" alt="Back" />
                        </div>
                        {/* Logout Button */}
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="mapping-content">
                {/* Left: Form */}
                <section className="form-section"><h2>Add New Table</h2>
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

                                // Re-fetch all tables from backend to refresh UI
                                fetchTables();

                                form.reset();
                            } catch (err) {
                                console.error(err);
                                alert("Failed to add table");
                            }
                        }}
                    >
                        <div className="form-group"><label>Table Number</label> <input type="text" name="tableNumber"
                                                                                       required/></div>
                        <div className="form-group"><label>Location</label> <input type="text" name="location"/></div>
                        <div className="form-group"><label>Type</label> <select name="type" required>
                            <option value="HIGH">High Table</option>
                            <option value="LOW">Low Table</option>
                        </select></div>
                        <button type="submit" className="add-btn">Add Table</button>
                    </form>
                </section>

                {/* Right: List of Tables */}
                <section className="tables-section">
                    {tables.length === 0 ? (
                        <div className="no-tables">
                            <div className="no-tables-icon">🍽️</div>
                            <h2>No Tables Added</h2>
                            <p>Add tables using the form on the left to get started</p>
                        </div>
                    ) : (
                        <div className="tables-list">
                            {tables.map((table) => (
                                <div key={table.id} className="table-card">
                                    <div>
                                        <h3 className="table-title">Table {table.tableNumber}</h3>
                                        <p className="table-location">
                                            📍 {table.location}
                                        </p>
                                        <p className="table-type">
                                            {table.type === "HIGH" ? "🔝 High Table" : "⬇️ Low Table"}
                                        </p>
                                    </div>
                                    <div className="card-actions">
                                        <button
                                            className="download-btn"
                                            onClick={() => handleDownloadQR(table)}
                                        >
                                            ⬇️ Download QR
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(table.id)}
                                        >
                                            ❌ Delete
                                        </button>
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
                .table-mapping { min-height: 100vh; background: #f5f7fa; font-family: 'OpenSans','Segoe UI',sans-serif; width: 100%; }
                @font-face { font-family: 'OpenSans'; src: url('/OpenSans.ttf') format('opentype'); }

                /* Navbar */
                .dashboard-navbar { background: #222; color: white; padding: 1rem 0; width: 100%; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; }
                .navbar-content { width: 100%; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center; }
                .navbar-nav { display: flex; gap: 1rem; align-items: center; }
                .navbar-content h1 { font-size: 2em; font-weight:500;}
                .table-count { background: gray; padding: 0.4rem 0.8rem; border-radius: 20px; font-weight: 500; }
                .back { cursor: pointer; transition: transform 0.2s ease; }
                .back:hover { transform: scale(1.1); }

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

                    .navbar-content {
                        padding: 0 1rem;
                    }

                    .navbar-nav {
                        gap: 0.8rem;
                    }

                    .logout-btn {
                        padding: 6px 12px;
                        font-size: 0.8rem;
                    }
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