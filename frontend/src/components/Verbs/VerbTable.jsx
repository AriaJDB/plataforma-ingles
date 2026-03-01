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

  useEffect(() => { load(); }, [refreshTrigger]);

  const startEdit = v => {
    setEditingId(v.id);
    setEditData({ 
      ...v, 
      spanish: v.spanish || "", present: v.present || "", 
      past_simple: v.past_simple || "", past_participle: v.past_participle || "",
      gerund: v.gerund || "", third_person: v.third_person || "", phonetic: v.phonetic || ""
    });
  };

  const saveEdit = async () => {
    const formData = new FormData();
    const fields = ['spanish', 'present', 'past_simple', 'past_participle', 'gerund', 'third_person', 'phonetic', 'type', 'is_active'];
    fields.forEach(f => formData.append(f, editData[f]));
    if (editData.newImage) formData.append("image", editData.newImage);

    const res = await fetch(`${API}/verbs/${editingId}`, { method: "PUT", body: formData });
    if (res.ok) { setEditingId(null); load(); }
  };

  return (
    <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th>ID</th><th>Spanish</th><th>Present</th><th>Past Simple</th><th>Past Participle</th>
          <th>Gerund</th><th>Third Person</th><th>Phonetic</th><th>Type</th><th>Status</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {verbs.map(v => (
          <tr key={v.id}>
            <td>{v.id}</td>
            <td>{editingId === v.id ? <input value={editData.spanish} onChange={e => setEditData({...editData, spanish: e.target.value})}/> : v.spanish}</td>
            <td>{editingId === v.id ? <input value={editData.present} onChange={e => setEditData({...editData, present: e.target.value})}/> : v.present}</td>
            <td>{editingId === v.id ? <input value={editData.past_simple} onChange={e => setEditData({...editData, past_simple: e.target.value})}/> : v.past_simple}</td>
            <td>{editingId === v.id ? <input value={editData.past_participle} onChange={e => setEditData({...editData, past_participle: e.target.value})}/> : v.past_participle}</td>
            <td>{editingId === v.id ? <input value={editData.gerund} onChange={e => setEditData({...editData, gerund: e.target.value})}/> : v.gerund}</td>
            <td>{editingId === v.id ? <input value={editData.third_person} onChange={e => setEditData({...editData, third_person: e.target.value})}/> : v.third_person}</td>
            <td>{editingId === v.id ? <input value={editData.phonetic} onChange={e => setEditData({...editData, phonetic: e.target.value})}/> : v.phonetic}</td>
            <td>
              {editingId === v.id ? 
                <select value={editData.type} onChange={e => setEditData({...editData, type: e.target.value})}><option value="REGULAR">REGULAR</option><option value="IRREGULAR">IRREGULAR</option></select> 
                : v.type}
            </td>
            <td>
              {editingId === v.id ? 
                <select value={editData.is_active} onChange={e => setEditData({...editData, is_active: parseInt(e.target.value)})}><option value={1}>Active</option><option value={0}>Inactive</option></select>
                : (v.is_active === 1 ? "Active" : "Inactive")}
            </td>
            <td>
              {editingId === v.id ? (
                <>
                  <button onClick={saveEdit}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <button className="edit-btn" onClick={() => startEdit(v)}>Edit</button>
                  <button className="delete-btn" onClick={async () => { if(window.confirm("Delete?")) { await fetch(`${API}/verbs/${v.id}`, {method:"DELETE"}); load(); } }}>Delete</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}