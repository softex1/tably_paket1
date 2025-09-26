import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./api.js";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            if (!res.ok) {
                const errorData = await res.text();
                setError(errorData || "Invalid username or password");
                setLoading(false);
                return;
            }

            const data = await res.json();

            if (data.token) {
                // Use sessionStorage instead of localStorage
                sessionStorage.setItem('adminData', JSON.stringify({
                    token: data.token,
                    adminId: data.adminId,
                    username: data.username
                }));
                navigate("/admin");
            } else {
                setError("Login failed: No token received");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Login failed, try again");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>ЛОГИРАЊЕ</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="КОРИСНИЧКО ИМЕ"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="ЛОЗИНКА"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Се логира..." : "ЛОГИРАЈ СЕ"}
                </button>
                {error && <p className="error">{error}</p>}
            </form>
            <style>{`
                .login-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f5f7fa;
                    font-family: 'Segoe UI', sans-serif;
                    flex-direction: column;
                }

                #root {
                    width: 100%;
                }

                h2 {
                    margin-bottom: 1.5rem;
                    color: #2c3e50;
                }

                form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    background: white;
                    padding: 2rem;
                    border-radius: 10px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    width: 300px;
                }

                input {
                    padding: 0.8rem;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    font-size: 1rem;
                    transition: border-color 0.3s ease;
                }

                input:focus {
                    outline: none;
                    border-color: #3498db;
                }

                input:disabled {
                    background-color: #f5f5f5;
                    cursor: not-allowed;
                }

                button {
                    background: #222;
                    color: white;
                    padding: 0.8rem;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 600;
                    transition: background 0.3s ease;
                }

                button:hover:not(:disabled) {
                    background: #444;
                }

                button:disabled {
                    background: #95a5a6;
                    cursor: not-allowed;
                }

                .error {
                    color: #e74c3c;
                    font-size: 0.9rem;
                    margin-top: -0.5rem;
                    text-align: center;
                }
            `}</style>
        </div>
    );
}