import { useEffect, useState } from "react";

const API = "http://localhost:3001";


export default function BookTable({ refreshTrigger }) {
  const [words, setWords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const load = async () => {
    const res = await fetch(`${API}/book-words`);
    const data = await res.json();
    setWords(data);
  };

  useEffect(() => { 
    load(); 
  }, [refreshTrigger]);

  const startEdit = (word) => {
    setEditingId(word.id);
    setEditData({ ...word });
  };

  const saveEdit = async () => {
    await fetch(`${API}/book-words/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData)
    });

    setEditingId(null);
    load();
  };

  const deleteWord = async id => {
    if (window.confirm("Are you sure you want to delete this word?")) {
    await fetch(`${API}/book-words/${id}`, {
      method: "DELETE"
    });
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
          <th>Month</th>
          <th>Week</th>
          <th>Category</th>
          <th>Topic</th>
          <th>Page</th>
          <th>Phonetic</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {words.map(w => (
          <tr key={w.id}>
            <td>{w.id}</td>

            {/* ENGLISH */}
            <td>
              {editingId === w.id ? (
                <input
                  value={editData.english}
                  onChange={e =>
                    setEditData({ ...editData, english: e.target.value.toUpperCase() })
                  }
                />
              ) : (
                w.english
              )}
            </td>

            {/* SPANISH */}
            <td>
              {editingId === w.id ? (
                <input
                  value={editData.spanish}
                  onChange={e =>
                    setEditData({ ...editData, spanish: e.target.value.toUpperCase() })
                  }
                />
              ) : (
                w.spanish
              )}
            </td>

            {/* MONTH */}
            <td>
              {editingId === w.id ? (
                <select
                  value={editData.month}
                  onChange={e =>
                    setEditData({ ...editData, month: e.target.value })
                  }
                >
                  {[
                    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
                    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
                  ].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              ) : (
                w.month
              )}
            </td>

            {/* WEEK */}
            <td>
              {editingId === w.id ? (
                <select
                  value={editData.week}
                  onChange={e =>
                    setEditData({ ...editData, week: e.target.value })
                  }
                >
                  {[1, 2, 3, 4].map(week => (
                    <option key={week} value={week}>{week}</option>
                  ))}
                </select>
              ) : (
                w.week
              )}
            </td>

            {/* CATEGORY */}
            <td>
              {editingId === w.id ? (
                <select
                  value={editData.category}
                  onChange={e =>
                    setEditData({ ...editData, category: e.target.value })
                  }
                >
                  <option value="VERB">VERB</option>
                  <option value="NOUN">NOUN</option>
                  <option value="ADJECTIVE">ADJECTIVE</option>
                </select>
              ) : (
                w.category
              )}
            </td>

            {/* TOPIC */}
            <td>
              {editingId === w.id ? (
                <select
                  value={editData.topic}
                  onChange={e =>
                    setEditData({ ...editData, topic: e.target.value })
                  }
                >
                  <option value="KEY WORDS">KEY WORDS</option>
                  <option value="ACADEMIC WORDS">ACADEMIC WORDS</option>
                  <option value="LEARNING STRATEGIES">LEARNING STRATEGIES</option>
                </select>
              ) : (
                w.topic
              )}
            </td>

            {/* PAGE */}
            <td>
              {editingId === w.id ? (
                <input
                  type="number"
                  value={editData.page}
                  min="1"
                  onChange={e =>
                    setEditData({ ...editData, page: e.target.value })
                  }
                />
              ) : (
                w.page
              )}
            </td>

            {/* PHONETIC */}
            <td>
              {editingId === w.id ? (
                <input
                  type="text"
                  value={editData.phonetic}
                  onChange={e =>
                    setEditData({ ...editData, phonetic: e.target.value })
                  }
                />
              ) : (
                w.phonetic
              )}
            </td>

            {/* IS_ACTIVE */}
            <td>
              {editingId === w.id ? (
                <select
                  value={editData.is_active}
                  onChange={e =>
                    setEditData({ ...editData, is_active: parseInt(e.target.value) })
                  }
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              ) : (
                w.is_active === 1 ? "Active" : "Inactive"
              )}
            </td>

            {/* ACTIONS */}
            <td>
              {editingId === w.id ? (
                <>
                  <button onClick={saveEdit}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(w)}>Edit</button>
                  <button onClick={() => deleteWord(w.id)}>Delete</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}