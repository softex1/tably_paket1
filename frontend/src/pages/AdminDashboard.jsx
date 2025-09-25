import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const [calls, setCalls] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCalls();

        const interval = setInterval(() => {
            fetchCalls();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const fetchCalls = () => {
        fetch("http://localhost:8080/api/admin/calls/recent")
            .then(res => res.json())
            .then(data => setCalls(data))
            .catch(err => console.error("Error fetching calls:", err));
    };

    const handleResolve = (id) => {
        fetch(`http://localhost:8080/api/admin/calls/${id}/resolve`, { method: "POST" })
            .then(res => res.json())
            .then(updatedCall => {
                setCalls(prev =>
                    prev.map(c => c.id === id ? { ...c, resolved: true } : c)
                );
                setTimeout(() => {
                    setCalls(prev => prev.filter(c => c.id !== id));
                }, 30000);
            })
            .catch(err => console.error("Error resolving call:", err));
    };

    const handleAddClick = () => {
        navigate("/tables");
    };

    return (
        <div className="admin-dashboard">
            {/* Navbar */}
            <nav className="dashboard-navbar">
                <div className="navbar-content">
                    <h1>Admin Dashboard</h1>
                    <div className="navbar-nav">
                        <div className="call-count">{calls.length} Active Calls</div>
                        <div className="add" onClick={handleAddClick} style={{ cursor: "pointer" }}>
                            <img
                                src="/add.png"
                                height="35px"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                                alt="Add Table"
                            />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="dashboard-content">
                {calls.length === 0 ? (
                    <div className="no-calls">
                        <div className="no-calls-icon">📞</div>
                        <h2>No Active Calls</h2>
                        <p>New calls will appear here when customers request assistance</p>
                    </div>
                ) : (
                    <div className="calls-grid">
                        {calls
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map((call) => {
                                const minutesPassed = Math.floor(
                                    (Date.now() - new Date(call.createdAt)) / 60000
                                );

                                let callTypeClass = "";
                                let callTypeIcon = "";
                                if (call.resolved) {
                                    callTypeClass = "resolved";
                                    callTypeIcon = "✅";
                                } else if (call.type === "WAITER") {
                                    callTypeClass = "waiter";
                                    callTypeIcon = "👨‍🍳";
                                } else {
                                    callTypeClass = "bill";
                                    callTypeIcon = "💰";
                                }

                                return (
                                    <div key={call.id} className={`call-card ${callTypeClass}`}>
                                        {/* Centered Table Number */}
                                        <div className="table-number-container">
                                            <h2 className="table-number">TABLE {call.table.tableNumber}</h2>
                                        </div>

                                        {/* Call details below */}
                                        <div className="call-details">
                                            <div className="call-type">
                                                <span className="call-icon">{callTypeIcon}</span>
                                                {call.type === "WAITER" ? "Waiter Call" : "Bill Request"}
                                            </div>

                                            <div className="table-location">
                                                <span className="location-icon">📍</span>
                                                {call.table.location || "Main Hall"}
                                            </div>

                                            <div className="time-badge">{minutesPassed}m ago</div>
                                        </div>

                                        {/* Action button */}
                                        {!call.resolved && (
                                            <button
                                                onClick={() => handleResolve(call.id)}
                                                className="resolve-btn"
                                            >
                                                Mark as Resolved
                                            </button>
                                        )}
                                        {call.resolved && (
                                            <div className="resolved-label">
                                                Resolved ✓
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                )}
            </main>

            <style jsx>{`
                /* Reset and base styles */
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                #root {
                    min-width: 100%;
                }

                .navbar-nav {
                    display: flex;
                    flex-direction: row;
                    gap: 1rem;
                    align-items: center;
                }

                .add {
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }

                .add:hover {
                    transform: scale(1.1);
                }

                .admin-dashboard {
                    min-height: 100vh;
                    background: #f5f7fa;
                    font-family: 'OpenSans' ,'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    width: 100%;
                    overflow-x: hidden;
                }

                @font-face {
                    font-family: 'OpenSans';
                    src: url('/OpenSans.ttf') format('opentype');
                }

                /* Navbar */
                .dashboard-navbar {
                    background: #222;
                    color: white;
                    padding: 1rem 0;
                    width: 100%;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                .navbar-content {
                    width: 100%;
                    margin: 0 auto;
                    padding: 0 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .navbar-content h1 {
                    margin: 0;
                    font-size: 1.5rem;
                    font-weight: 600;
                }

                .call-count {
                    background: gray;
                    padding: 0.4rem 0.8rem;
                    border-radius: 20px;
                    font-weight: 500;
                }

                /* Main content */
                .dashboard-content {
                    width: 100%;
                    margin: 0;
                    padding: 2rem;
                    min-height: calc(100vh - 80px);
                }

                /* No calls state */
                .no-calls {
                    text-align: center;
                    padding: 4rem 2rem;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }

                .no-calls-icon {
                    font-size: 4rem;
                    margin-bottom: 1.5rem;
                }

                .no-calls h2 {
                    color: #2c3e50;
                    margin: 0 0 1rem 0;
                }

                .no-calls p {
                    color: #7f8c8d;
                    margin: 0;
                    font-size: 1.1rem;
                }

                /* Calls grid */
                .calls-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                    width: 100%;
                }

                /* Call card */
                .call-card {
                    background: white;
                    border-radius: 12px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    border-left: 4px solid;
                    display: flex;
                    flex-direction: column;
                    text-align: center;
                }

                .call-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
                }

                .call-card.waiter {
                    border-left-color: #ff9f43;
                }

                .call-card.bill {
                    border-left-color: #54a0ff;
                }

                .call-card.resolved {
                    border-left-color: #2ecc71;
                    opacity: 0.8;
                }

                /* Centered table number */
                .table-number-container {
                    margin-bottom: 1.2rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid #f1f2f6;
                }

                .table-number {
                    margin: 0;
                    color: #222;
                    font-size: 2rem;
                    font-weight: 700;
                }

                /* Call details */
                .call-details {
                    margin-bottom: 1.5rem;
                }

                .call-type {
                    color: #5a6778;
                    margin-bottom: 0.8rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    font-size: 1.1rem;
                }

                .call-icon {
                    font-size: 1.4rem;
                }

                .table-location {
                    color: #222;
                    margin-bottom: 0.8rem;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }

                .location-icon {
                    font-size: 1rem;
                }

                .time-badge {
                    background: #f1f2f6;
                    color: #222;
                    padding: 0.4rem 0.8rem;
                    border-radius: 12px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    display: inline-block;
                }

                .resolve-btn {
                    background: green;
                    color: white;
                    border: none;
                    padding: 0.8rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    margin-top: auto;
                    transition: background 0.2s ease;
                }

                .resolve-btn:hover {
                    background: #222;
                }

                .resolved-label {
                    color: #2ecc71;
                    font-weight: 600;
                    text-align: center;
                    margin-top: auto;
                    padding: 0.5rem;
                    font-size: 1.1rem;
                }

                /* Responsive adjustments for tablet */
                @media (max-width: 1024px) {
                    .navbar-content {
                        padding: 0 1.5rem;
                    }

                    .dashboard-content {
                        padding: 1.5rem;
                    }

                    .calls-grid {
                        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                        gap: 1.2rem;
                    }

                    .call-card {
                        padding: 1.2rem;
                        border-radius: 10px;
                        border-left-width: 3px;
                        box-shadow: 0 3px 5px rgba(0,0,0,0.05);
                        transition: all 0.2s ease;
                        margin: 0;
                        width: 100%;
                        box-sizing: border-box;
                    }

                    .call-card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 5px 10px rgba(0,0,0,0.1);
                    }

                    .table-number {
                        font-size: 1.8rem;
                    }

                    .resolve-btn {
                        padding: 0.7rem;
                        font-size: 0.9rem;
                    }

                    .no-calls {
                        padding: 3rem 1.5rem;
                        max-width: 500px;
                        border-radius: 10px;
                        box-shadow: 0 3px 5px rgba(0,0,0,0.05);
                    }

                    .no-calls-icon {
                        font-size: 3.5rem;
                        margin-bottom: 1.2rem;
                    }

                    .no-calls h2 {
                        font-size: 1.6rem;
                    }

                    .no-calls p {
                        font-size: 1rem;
                    }
                }

                /* Responsive adjustments for mobile */
                @media (max-width: 768px) {
                    .navbar-content {
                        padding: 0 1rem;
                        flex-direction: column;
                        gap: 0.5rem;
                        text-align: center;
                    }

                    .navbar-nav {
                        justify-content: center;
                        gap: 1rem;
                        margin-top: 0.5rem;
                    }

                    .dashboard-content {
                        padding: 1rem;
                        min-height: calc(100vh - 72px);
                    }

                    .calls-grid {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }

                    .call-card {
                        padding: 1rem;
                        border-radius: 8px;
                        border-left-width: 3px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                        transition: all 0.2s ease;
                        margin: 0;
                        width: 100%;
                        box-sizing: border-box;
                    }

                    .call-card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    }

                    .table-number {
                        font-size: 1.6rem;
                    }

                    .resolve-btn {
                        padding: 0.7rem;
                        font-size: 0.9rem;
                    }

                    .no-calls {
                        padding: 2rem 1rem;
                        margin: 0;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                        background: #f8f9fa;
                        border: 1px solid #e9ecef;
                        text-align: center;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 300px;
                        width: 90%;
                        max-width: 90%;
                        position: relative;
                        top: 0;
                        left: 0;
                        transform: none;
                        margin: 2rem auto;
                    }

                    .no-calls-icon {
                        font-size: 3rem;
                        margin-bottom: 1rem;
                    }

                    .no-calls h2 {
                        font-size: 1.5rem;
                        margin-bottom: 0.5rem;
                    }

                    .no-calls p {
                        font-size: 1rem;
                        max-width: 90%;
                        margin: 0 auto;
                    }
                }

                /* Large desktop adjustments */
                @media (min-width: 1440px) {
                    .calls-grid {
                        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                        gap: 2rem;
                    }

                    .dashboard-content {
                        padding: 3rem;
                    }

                    .call-card {
                        padding: 1.8rem;
                        border-radius: 14px;
                    }

                    .table-number {
                        font-size: 2.2rem;
                    }
                }
            `}</style>
        </div>
    );
}