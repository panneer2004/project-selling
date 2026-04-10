import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://your-backend-url/api/projects";
export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    description: "",
    techStack: "",
    price: "",
    video: null,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await axios.get(API);
    setProjects(res.data || []);
  };

  /* ================= ADD / UPDATE ================= */

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    Object.keys(form).forEach((k) => {
      if (form[k]) fd.append(k, form[k]);
    });

    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, fd);
      } else {
        await axios.post(API, fd);
      }

      fetchProjects();
      resetForm();
    } catch {
      alert("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setForm({
      title: "",
      shortDescription: "",
      description: "",
      techStack: "",
      price: "",
      video: null,
    });
  };

  /* ================= ACTIONS ================= */

  const editProject = (p) => {
    setEditId(p.id);
    setForm({
      title: p.title,
      shortDescription: p.shortDescription,
      description: p.description,
      techStack: p.techStack,
      price: p.price,
      video: null,
    });
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete project?")) return;
    await axios.delete(`${API}/${id}`);
    fetchProjects();
  };

  const toggleStatus = async (id, status) => {
    await axios.patch(`${API}/${id}/status`, {
      status: status === "available" ? "sold" : "available",
    });
    fetchProjects();
  };

  return (
    <div style={styles.page}>
      {/* FORM */}
      <div style={styles.card}>
        <h2>{editId ? "Edit Project" : "Add New Project"}</h2>

        <form onSubmit={submit} style={styles.form}>
          <div style={styles.grid}>
            <input
              style={styles.input}
              placeholder="Project Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />

            <input
              style={styles.input}
              placeholder="Price (₹)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>

          <input
            style={styles.input}
            placeholder="Short Description"
            value={form.shortDescription}
            onChange={(e) =>
              setForm({ ...form, shortDescription: e.target.value })
            }
            required
          />

          <input
            style={styles.input}
            placeholder="Tech Stack"
            value={form.techStack}
            onChange={(e) =>
              setForm({ ...form, techStack: e.target.value })
            }
          />

          <textarea
            style={styles.textarea}
            placeholder="Full Description"
            rows={4}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <label style={styles.fileBox}>
            Upload Demo Video
            <input
              type="file"
              hidden
              accept="video/*"
              onChange={(e) =>
                setForm({ ...form, video: e.target.files[0] })
              }
            />
          </label>

          <button style={styles.button} disabled={loading}>
            {loading ? "Saving..." : editId ? "Update Project" : "Add Project"}
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div style={styles.card}>
        <h2>Projects ({projects.length})</h2>

        <div style={styles.table}>
          <div style={styles.rowHeader}>
            <span>Title</span>
            <span>Price</span>
            <span>Stack</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {projects.map((p) => (
            <div key={p.id} style={styles.row}>
              <span>{p.title}</span>
              <span>₹{p.price}</span>
              <span>{p.techStack}</span>

              <span>
                <button
                  style={{
                    ...styles.status,
                    background:
                      p.status === "sold" ? "#ef4444" : "#22c55e",
                  }}
                  onClick={() => toggleStatus(p.id, p.status)}
                >
                  {p.status}
                </button>
              </span>

              <span style={styles.actions}>
                <button
                  style={styles.edit}
                  onClick={() => editProject(p)}
                >
                  ✏ Edit
                </button>
                <button
                  style={styles.delete}
                  onClick={() => deleteProject(p.id)}
                >
                  ❌ Delete
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: { padding: "40px", color: "#fff" },

  card: {
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
    borderRadius: "20px",
    padding: "30px",
    marginBottom: "30px",
    boxShadow: "0 25px 60px rgba(0,0,0,.6)",
  },

  form: { display: "flex", flexDirection: "column", gap: "16px" },

  grid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "16px",
  },

  input: {
    background: "rgba(0,0,0,0.6)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "12px",
    padding: "14px",
    color: "#fff",
  },

  textarea: {
    background: "rgba(0,0,0,0.6)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "12px",
    padding: "14px",
    color: "#fff",
  },

  fileBox: {
    padding: "14px",
    border: "1px dashed rgba(255,255,255,0.25)",
    borderRadius: "12px",
    textAlign: "center",
    cursor: "pointer",
  },

  button: {
    padding: "14px",
    borderRadius: "14px",
    background: "linear-gradient(135deg,#3b82f6,#2563eb)",
    border: "none",
    color: "#fff",
    fontWeight: "600",
  },

  table: { marginTop: "20px" },

  rowHeader: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 2fr 1fr 2fr",
    fontWeight: "600",
    paddingBottom: "10px",
    borderBottom: "1px solid rgba(255,255,255,0.15)",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 2fr 1fr 2fr",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },

  status: {
    border: "none",
    padding: "6px 14px",
    borderRadius: "20px",
    color: "#fff",
    cursor: "pointer",
  },

  actions: {
    display: "flex",
    gap: "10px",
  },

  edit: {
    background: "#f59e0b",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
  },

  delete: {
    background: "#ef4444",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
  },
};
