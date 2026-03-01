import { useEffect, useState } from "react";

const API = "http://localhost:3001";

export default function SpellingTable({ refreshTrigger }) {
  const [words, setWords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const load = async () => {
    const res = await fetch(`${API}/spelling-words`);
    const data = await res.json();
    setWords(data);
  };

  useEffect(() => {
    load();
  }, [refreshTrigger]);

  const startEdit = w => {
    setEditingId(w.id);
    setEditData({ ...w });
  };

  const saveEdit = async () => {
    const formData = new FormData();
    formData.append("english", editData.english.toUpperCase());
    formData.append("spanish", editData.spanish.toUpperCase());
    formData.append("phonetic", editData.phonetic.toUpperCase());
    formData.append("is_active", editData.is_active);

    if (editData.image) formData.append("image", editData.image);

    await fetch(`${API}/spelling-words/${editingId}`, {
      method: "PUT",
      body: formData
    });

    setEditingId(null);
    load();
  };

  const deleteWord = async id => {
    if (window.confirm("Are you sure you want to delete this word?")) {
      await fetch(`${API}/spelling-words/${id}`, { method: "DELETE" });
      load();
    }
  };

  return (
    <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>English</th>
          <th>Spanish</th>
          <th>Phonetic</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {words.map(w => (
          <tr key={w.id}>
            <td>{w.id}</td>

            <td>
              {editingId === w.id ? (
                <input value={editData.english}
                  onChange={e => setEditData({ ...editData, english: e.target.value })} />
              ) : w.english}
            </td>

            <td>
              {editingId === w.id ? (
                <input value={editData.spanish}
                  onChange={e => setEditData({ ...editData, spanish: e.target.value })} />
              ) : w.spanish}
            </td>

            <td>
              {editingId === w.id ? (
                <input value={editData.phonetic}
                  onChange={e => setEditData({ ...editData, phonetic: e.target.value })} />
              ) : w.phonetic}
            </td>

            <td>
              {editingId === w.id ? (
                <select value={editData.is_active}
                  onChange={e => setEditData({ ...editData, is_active: parseInt(e.target.value) })}>
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              ) : w.is_active === 1 ? "Active" : "Inactive"}
            </td>

            <td>
              {editingId === w.id ? (
                <>
                  <button onClick={saveEdit}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <button className="edit-btn" onClick={() => startEdit(w)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteWord(w.id)}>Delete</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}