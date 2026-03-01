import { useEffect, useState } from "react";

const API = "http://localhost:3001";

export default function NounTable({ refreshTrigger }) {
  const [nouns, setNouns] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const load = async () => {
    try {
      const res = await fetch(`${API}/nouns`);
      const data = await res.json();
      setNouns(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading nouns:", error);
    }
  };

  useEffect(() => {
    load();
  }, [refreshTrigger]);

  const startEdit = (n) => {
    setEditingId(n.id);
    setEditData({ ...n });
  };

  const saveEdit = async () => {
    const formData = new FormData();
    formData.append("spanish", editData.spanish.toUpperCase());
    formData.append("english", editData.english.toUpperCase());
    formData.append("plural", editData.plural.toUpperCase());
    formData.append("phonetic", editData.phonetic.toUpperCase());
    formData.append("is_active", editData.is_active);

    // Si el usuario seleccionó una nueva imagen en el input file
    if (editData.newImage) {
      formData.append("image", editData.newImage);
    }

    await fetch(`${API}/nouns/${editingId}`, {
      method: "PUT",
      body: formData,
    });

    setEditingId(null);
    load();
  };

  const deleteNoun = async (id) => {
    if (window.confirm("Are you sure you want to delete this word?")) {
      await fetch(`${API}/nouns/${id}`, { method: "DELETE" });
      load();
    }
  };

  return (
    <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Spanish</th>
          <th>English</th>
          <th>Plural</th>
          <th>Phonetic</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {nouns.map((n) => (
          <tr key={n.id}>
            <td>{n.id}</td>

            <td>
              {editingId === n.id ? (
                <input
                  value={editData.spanish}
                  onChange={(e) => setEditData({ ...editData, spanish: e.target.value })}
                />
              ) : (
                n.spanish
              )}
            </td>

            <td>
              {editingId === n.id ? (
                <input
                  value={editData.english}
                  onChange={(e) => setEditData({ ...editData, english: e.target.value })}
                />
              ) : (
                n.english
              )}
            </td>



            <td>
              {editingId === n.id ? (
                <input
                  value={editData.plural}
                  onChange={(e) => setEditData({ ...editData, plural: e.target.value })}
                />
              ) : (
                n.plural
              )}
            </td>

            <td>
              {editingId === n.id ? (
                <input
                  value={editData.phonetic}
                  onChange={(e) => setEditData({ ...editData, phonetic: e.target.value })}
                />
              ) : (
                n.phonetic
              )}
            </td>

            <td>
              {editingId === n.id ? (
                <select
                  value={editData.is_active}
                  onChange={(e) => setEditData({ ...editData, is_active: parseInt(e.target.value) })}
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              ) : n.is_active === 1 ? (
                "Active"
              ) : (
                "Inactive"
              )}
            </td>


            <td>
              {editingId === n.id ? (
                <>
                  <button onClick={saveEdit}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(n)}>Edit</button>
                  <button onClick={() => deleteNoun(n.id)}>Delete</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}