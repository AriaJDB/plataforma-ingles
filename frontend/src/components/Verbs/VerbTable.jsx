import { useEffect, useState } from "react";

const API = "http://localhost:3001";

export default function VerbTable({ refreshTrigger }) {
  const [verbs, setVerbs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const load = async () => {
    try {
      const res = await fetch(`${API}/verbs`);
      const data = await res.json();
      setVerbs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar verbos:", error);
    }
  };

  useEffect(() => {
    load();
  }, [refreshTrigger]);

  const startEdit = v => {
    setEditingId(v.id);
    // IMPORTANTE: Usamos el operador || "" para que si el valor es null, 
    // se convierta en un texto vacío y no rompa los inputs.
    setEditData({ 
      ...v,
      spanish: v.spanish || "",
      present: v.present || "",
      past: v.past || "",
      past_participle: v.past_participle || "",
      gerund: v.gerund || "",
      third_person: v.third_person || "",
      phonetic: v.phonetic || ""
    });
  };

  const saveEdit = async () => {
    const formData = new FormData();
    // Protegemos el toUpperCase con (valor || "")
    formData.append("spanish", (editData.spanish || "").toUpperCase());
    formData.append("present", (editData.present || "").toUpperCase());
    formData.append("past", (editData.past || "").toUpperCase());
    formData.append("past_participle", (editData.past_participle || "").toUpperCase());
    formData.append("gerund", (editData.gerund || "").toUpperCase());
    formData.append("third_person", (editData.third_person || "").toUpperCase());
    formData.append("phonetic", (editData.phonetic || "").toUpperCase());
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
          <th>Gerund</th>
          <th>Third Person</th>
          <th>Phonetic</th>
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
                : (v.spanish || "").toUpperCase()}
            </td>

            <td>
              {editingId === v.id
                ? <input value={editData.present}
                  onChange={e => setEditData({ ...editData, present: e.target.value })} />
                : (v.present || "").toUpperCase()}
            </td>

            <td>
              {editingId === v.id
                ? <input value={editData.past}
                  onChange={e => setEditData({ ...editData, past: e.target.value })} />
                : (v.past || "").toUpperCase()}
            </td>

            <td>
              {editingId === v.id
                ? <input value={editData.past_participle}
                  onChange={e => setEditData({ ...editData, past_participle: e.target.value })} />
                : (v.past_participle || "").toUpperCase()}
            </td>

            <td>
              {editingId === v.id
                ? <input value={editData.gerund}
                  onChange={e => setEditData({ ...editData, gerund: e.target.value })} />
                : (v.gerund || "---")}
            </td>

            <td>
              {editingId === v.id
                ? <input value={editData.third_person}
                  onChange={e => setEditData({ ...editData, third_person: e.target.value })} />
                : (v.third_person || "---")}
            </td>

            <td>
              {editingId === v.id
                ? <input value={editData.phonetic}
                  onChange={e => setEditData({ ...editData, phonetic: e.target.value })} />
                : (v.phonetic || "---")}
            </td>

            <td>
              {editingId === v.id ? (
                <select value={editData.type}
                  onChange={e => setEditData({ ...editData, type: e.target.value })}>
                  <option value="REGULAR">REGULAR</option>
                  <option value="IRREGULAR">IRREGULAR</option>
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