import { useEffect, useState } from "react";
const API = "http://localhost:3001";

export default function StudentTable({ refreshTrigger }) {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const load = async () => {
    try {
      const res = await fetch(`${API}/students`);
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
    }
  };

  useEffect(() => { load(); }, [refreshTrigger]);

  const startEdit = s => {
    setEditingId(s.id);
    setEditData({
      ...s,
      firstName: s.firstName || "",
      lastName: s.lastName || "",
      is_active: s.is_active
    });
  };

  const saveEdit = async () => {
    try {
      const res = await fetch(`${API}/students/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: editData.firstName.toUpperCase(),
          lastName: editData.lastName.toUpperCase(),
          is_active: editData.is_active
        })
      });

      if (res.ok) {
        setEditingId(null);
        load();
      }
    } catch (error) {
      console.error("Error al editar:", error);
    }
  };

  return (
    <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", marginTop: "20px" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Apellido</th>
          <th>Nombre</th>
          <th>Status</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {students.map(s => (
          <tr key={s.id}>
            <td>{s.id}</td>

            <td>
              {editingId === s.id ? (
                <input
                  value={editData.lastName}
                  onChange={e => setEditData({ ...editData, lastName: e.target.value.toUpperCase() })}
                />
              ) : s.lastName}
            </td>

            <td>
              {editingId === s.id ? (
                <input
                  value={editData.firstName}
                  onChange={e => setEditData({ ...editData, firstName: e.target.value.toUpperCase() })}
                />
              ) : s.firstName}
            </td>

            <td>
              {editingId === s.id ? (
                <select value={editData.is_active} onChange={e => setEditData({ ...editData, is_active: parseInt(e.target.value) })}>
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              ) : s.is_active === 1 ? "Active" : "Inactive"}
            </td>

            <td>
              {editingId === s.id ? (
                <>
                  <button className="save-btn" onClick={saveEdit}>Save</button>
                  <button className="delete-btn" onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <button className="edit-btn" onClick={() => startEdit(s)}>Edit</button>
                  <button
                    className="delete-btn"
                    onClick={async () => {
                      if (window.confirm(`¿Eliminar a ${s.firstName} ${s.lastName}?`)) {
                        await fetch(`${API}/students/${s.id}`, { method: "DELETE" });
                        load();
                      }
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}