import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const BASE = "/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "登录失败");
      }
      const data = await res.json();
      login(data.access_token, data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: 40, width: 380,
        boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>⚽</div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>加美墨世界杯</h1>
          <p style={{ margin: "4px 0 0", color: "#999", fontSize: 14 }}>智能投注管理系统</p>
        </div>

        {error && (
          <div style={{
            background: "#fff2f0", border: "1px solid #ffccc7", borderRadius: 8,
            padding: "8px 12px", color: "#ff4d4f", fontSize: 13, marginBottom: 16,
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, color: "#666", marginBottom: 6 }}>用户名</label>
            <input
              value={username} onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%", padding: "10px 14px", border: "1px solid #d9d9d9",
                borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box",
              }}
              placeholder="请输入用户名" required
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, color: "#666", marginBottom: 6 }}>密码</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%", padding: "10px 14px", border: "1px solid #d9d9d9",
                borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box",
              }}
              placeholder="请输入密码" required
            />
          </div>
          <button
            type="submit" disabled={loading}
            style={{
              width: "100%", padding: "12px", borderRadius: 8, border: "none",
              background: loading ? "#91caff" : "#1677ff", color: "#fff",
              fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >{loading ? "登录中..." : "登 录"}</button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#999" }}>
          还没有账号？<Link to="/register" style={{ color: "#1677ff", textDecoration: "none" }}>立即注册</Link>
        </div>
      </div>
    </div>
  );
}
