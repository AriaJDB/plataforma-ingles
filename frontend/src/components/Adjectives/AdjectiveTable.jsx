import { useEffect, useState } from "react";

const API = "http://localhost:3001";

export default function AdjectiveTable({ refreshTrigger }) {
  const [adjectives, setAdjectives] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const load = async () => {
    try {
      const res = await fetch(`${API}/adjectives`);
      const data = await res.json();
      setAdjectives(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading adjectives:", error);
    }
  };

  useEffect(() => { 
    load(); 
  }, [refreshTrigger]);

  const startEdit = a => {
    setEditingId(a.id);
    // Aseguramos que los campos no sean null para que los inputs no fallen
    setEditData({ 
      ...a,
      comparative: a.comparative || "",
      superlative: a.superlative || "",
      phonetic: a.phonetic || ""
    });
  };

  const saveEdit = async () => {
    const formData = new FormData();
    // Usamos (valor || "") para que el .toUpperCase() no de error si el campo está vacío
    formData.append("spanish", (editData.spanish || "").toUpperCase());
    formData.append("english", (editData.english || "").toUpperCase());
    formData.append("comparative", (editData.comparative || "").toUpperCase());
    formData.append("superlative", (editData.superlative || "").toUpperCase());
    formData.append("phonetic", (editData.phonetic || "").toUpperCase());
    formData.append("is_active", editData.is_active);

    if (editData.newImage) formData.append("image", editData.newImage);

    await fetch(`${API}/adjectives/${editingId}`, {
      method: "PUT",
      body: formData
    });

    setEditingId(null);
    load();
  };

  const deleteAdjective = async id => {
    if (window.confirm("Are you sure?")) {
      await fetch(`${API}/adjectives/${id}`, { method: "DELETE" });
      load();
    }
  };

  return (
    <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", marginTop: "20px" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Spanish</th>
          <th>English</th>
          <th>Comparative</th>
          <th>Superlative</th>
          <th>Phonetic</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {adjectives.map(a => (
          <tr key={a.id}>
            <td>{a.id}</td>
            <td>
              {editingId === a.id
                ? <input value={editData.spanish} onChange={e => setEditData({ ...editData, spanish: e.target.value })}/>
                : a.spanish}
            </td>
            <td>
              {editingId === a.id
                ? <input value={editData.english} onChange={e => setEditData({ ...editData, english: e.target.value })}/>
                : a.english}
            </td>
            <td>
              {editingId === a.id
                ? <input value={editData.comparative} onChange={e => setEditData({ ...editData, comparative: e.target.value })}/>
                : a.comparative}
            </td>
            <td>
              {editingId === a.id
                ? <input value={editData.superlative} onChange={e => setEditData({ ...editData, superlative: e.target.value })}/>
                : a.superlative}
            </td>
            <td>
              {editingId === a.id
                ? <input value={editData.phonetic} onChange={e => setEditData({ ...editData, phonetic: e.target.value })}/>
                : a.phonetic}
            </td>
            <td>
              {editingId === a.id ? (
                <select value={editData.is_active} onChange={e => setEditData({ ...editData, is_active: parseInt(e.target.value) })}>
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              ) : a.is_active === 1 ? "Active" : "Inactive"}
            </td>
            
            <td>
              {editingId === a.id ? (
                <>
                  <button onClick={saveEdit}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(a)}>Edit</button>
                  <button onClick={() => deleteAdjective(a.id)}>Delete</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}