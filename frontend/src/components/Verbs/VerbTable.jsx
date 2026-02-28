import { useEffect, useState } from "react";

const API = "http://localhost:3001";

export default function VerbTable({ refreshTrigger }) {
  const [verbs, setVerbs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const load = async () => {
    const res = await fetch(`${API}/verbs`);
    const data = await res.json();
    setVerbs(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    load();
  }, [refreshTrigger]);

  const startEdit = v => {
    setEditingId(v.id);
    setEditData({ ...v });
  };

  const saveEdit = async () => {
    const formData = new FormData();
    formData.append("present", editData.present.toUpperCase());
    formData.append("past", editData.past.toUpperCase());
    formData.append("past_participle", editData.past_participle.toUpperCase());
    formData.append("spanish", editData.spanish.toUpperCase());
    formData.append("type", editData.type);
    formData.append("is_active", editData.is_active);

    if (editData.image) formData.append("image", editData.image);

    await fetch(`${API}/verbs/${editingId}`, {
      method: "PUT",
      body: formData
    });

    setEditingId(null);
    load();
  };

  const deleteVerb = async id => {
    if (window.confirm("Are you sure you want to delete this word?")) {
      await fetch(`${API}/verbs/${id}`, { method: "DELETE" });
      load();
    }
  };

  return (
    <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Spanish</th>
          <th>Present</th>
          <th>Past</th>
          <th>Past Participle</th>
          <th>Type</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {verbs.map(v => (
          <tr key={v.id}>
            <td>{v.id}</td>

            <td>
              {editingId === v.id
                ? <input value={editData.spanish}
                  onChange={e => setEditData({ ...editData, spanish: e.target.value })} />
                : v.spanish}
            </td>

            <td>
              {editingId === v.id
                ? <input value={editData.present}
                  onChange={e => setEditData({ ...editData, present: e.target.value })} />
                : v.present}
            </td>

            <td>
              {editingId === v.id
                ? <input value={editData.past}
                  onChange={e => setEditData({ ...editData, past: e.target.value })} />
                : v.past}
            </td>

            <td>
              {editingId === v.id
                ? <input value={editData.past_participle}
                  onChange={e => setEditData({ ...editData, past_participle: e.target.value })} />
                : v.past_participle}
            </td>

            <td>
              {editingId === v.id ? (
                <select value={editData.type}
                  onChange={e => setEditData({ ...editData, type: e.target.value })}>
                  <option value="regular">REGULAR</option>
                  <option value="irregular">IRREGULAR</option>
                </select>
              ) : v.type}
            </td>

            <td>
              {editingId === v.id ? (
                <select value={editData.is_active}
                  onChange={e => setEditData({ ...editData, is_active: parseInt(e.target.value) })}>
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              ) : v.is_active === 1 ? "Active" : "Inactive"}
            </td>

            <td>
              {editingId === v.id ? (
                <>
                  <button onClick={saveEdit}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(v)}>Edit</button>
                  <button onClick={() => deleteVerb(v.id)}>Delete</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}