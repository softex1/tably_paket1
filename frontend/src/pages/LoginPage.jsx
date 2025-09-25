import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./api.js";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                setError("Invalid username or password");
                return;
            }

            const data = await res.json();
            localStorage.setItem("adminToken", data.token); // store JWT/session token
            navigate("/admin");
        } catch (err) {
            console.error(err);
            setError("Login failed, try again");
        }
    };

    return (
        <div className="login-container">
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
                {error && <p className="error">{error}</p>}
            </form>
            <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f7fa;
          font-family: 'Segoe UI', sans-serif;
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
        }
        button {
          background: #222;
          color: white;
          padding: 0.8rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
        button:hover {
          background: #444;
        }
        .error {
          color: red;
          font-size: 0.9rem;
          margin-top: -0.5rem;
        }
      `}</style>
        </div>
    );
}
