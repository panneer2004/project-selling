import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminProjects from "./AdminProjects";
import AdminAnalytics from "./AdminAnalytics";

const API = "https://your-backend-url/api/projects";
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">Admin Panel</h2>

        <button
          className={activeTab === "dashboard" ? "active" : ""}
          onClick={() => setActiveTab("dashboard")}
        >
          📊 Dashboard
        </button>

        <button
          className={activeTab === "projects" ? "active" : ""}
          onClick={() => setActiveTab("projects")}
        >
          📦 Projects
        </button>

        <button
          className={activeTab === "analytics" ? "active" : ""}
          onClick={() => setActiveTab("analytics")}
        >
          📈 Analytics
        </button>

        <button className="logout" onClick={logout}>
          🚪 Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="content">
        {activeTab === "dashboard" && <DashboardHome />}
        {activeTab === "projects" && <AdminProjects />}
        {activeTab === "analytics" && <AdminAnalytics />}
      </main>
    </div>
  );
}

/* ================= DASHBOARD ================= */

function DashboardHome() {
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    sold: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(API);
      const projects = res.data || [];

      setStats({
        total: projects.length,
        available: projects.filter(p => p.status === "available").length,
        sold: projects.filter(p => p.status === "sold").length,
      });
    } catch (err) {
      console.error("Dashboard fetch error", err);
    }
  };

  return (
    <>
      <h1>Dashboard</h1>
      <div className="stats">
        <Stat title="Total Projects" value={stats.total} />
        <Stat title="Available" value={stats.available} />
        <Stat title="Sold" value={stats.sold} />
      </div>
    </>
  );
}

function Stat({ title, value }) {
  return (
    <div className="stat-card">
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}
