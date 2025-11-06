"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "./login.css"; 
import { API_URL } from '@/config'; 

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}admin/login`,
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      );

      console.log(res.data.success);

      console.log(res);
      
        if (res.data?.success) {

          localStorage.setItem("token", res.data?.data?.admin?.token);

          localStorage.setItem("auth", "admin");
          document.cookie = "auth=admin; path=/;";
          document.cookie = `token=${res.data?.data?.admin?.token}; path=/;`;

          setTimeout(() => router.push("/admin"), 300);
        } else {

          setError(res.data?.error || "Invalid credentials. Please try again.");
        }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Admin Login</h2>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-footer">
          © {new Date().getFullYear()} Handis Admin Portal
        </p>
      </div>
    </div>
  );
}
