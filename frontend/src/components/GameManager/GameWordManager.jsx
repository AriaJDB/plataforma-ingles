import { useState } from "react";

const API = "http://localhost:3001";

export default function GameWordManager() {
  const [globalStatus, setGlobalStatus] = useState(1);
  const [selectedTables, setSelectedTables] = useState({
    book: false, spelling: false, verbs: false, adjectives: false, nouns: false
  });

  const [showSections, setShowSections] = useState({ book: false, spelling: false, verbs: false, adjectives: false, nouns: false });

  const [useRange, setUseRange] = useState(false);
  const [bookFilters, setBookFilters] = useState({
    startMonth: 1, finishMonth: 12, startWeek: 1, finishWeek: 4, startPage: 1, finishPage: 500, category: "ALL", topic: "ALL"
  });

  const [idFilters, setIdFilters] = useState({
    spelling: { start: 1, end: 100 },
    adjectives: { start: 1, end: 100 },
    nouns: { start: 1, end: 100 }
  });

  const [verbType, setVerbType] = useState("ALL");
  const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

  const handleApply = async () => {
    const response = await fetch(`${API}/game-manager/bulk-update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: globalStatus, tables: selectedTables, bookFilters: { ...bookFilters, useRange }, idFilters, verbType })
    });
    if (response.ok) alert("Done!");
  };

  return (
    <div className="admin-container">
      <div className="stat-card" style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "20px" }}>
        <h3>Estado a aplicar:</h3>
        <select value={globalStatus} onChange={e => setGlobalStatus(parseInt(e.target.value))}>
          <option value={1}>ACTIVO</option>
          <option value={0}>INACTIVO</option>
        </select>
      </div>

      <div className="dashboard-menu" style={{ gridTemplateColumns: "1fr" }}>

        {/* BOOK WORDS SECTION */}
        <div className="menu-item" style={{ flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
            <span onClick={() => setShowSections({ ...showSections, book: !showSections.book })} style={{ cursor: "pointer" }}>
              {showSections.book ? "▼" : "▶"} <strong>Book Words</strong>
            </span>
            <input type="checkbox" checked={selectedTables.book} onChange={e => setSelectedTables({ ...selectedTables, book: e.target.checked })} />
          </div>

          {showSections.book && (
            <div style={{ marginTop: "15px", padding: "15px", background: "#f9f9f9", borderRadius: "8px", width: "100%" }}>
              <input type="checkbox" checked={useRange} onChange={e => setUseRange(e.target.checked)} /> Activar Filtros de Rango
              <div style={{ opacity: useRange ? 1 : 0.5, pointerEvents: useRange ? "auto" : "none", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px" }}>
                <div>
                  <label>Start Month: </label>
                  <select value={bookFilters.startMonth} onChange={e => setBookFilters({ ...bookFilters, startMonth: parseInt(e.target.value) })}>
                    {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label>Finish Month: </label>
                  <select value={bookFilters.finishMonth} onChange={e => setBookFilters({ ...bookFilters, finishMonth: parseInt(e.target.value) })}>
                    {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label>Start week: </label>
                  <select value={bookFilters.startWeek} onChange={e => setBookFilters({ ...bookFilters, startWeek: parseInt(e.target.value) })}>
                    {[1, 2, 3, 4].map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label> Finish week: </label>
                  <select value={bookFilters.finishWeek} onChange={e => setBookFilters({ ...bookFilters, finishWeek: parseInt(e.target.value) })}>
                    {[1, 2, 3, 4].map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>

                <div>
                  <label>Start page: </label>
                  <input type="number" value={bookFilters.startPage} onChange={e => setBookFilters({ ...bookFilters, startPage: e.target.value })} />
                </div>

                <div>
                  <label> Finish page: </label>
                  <input type="number" value={bookFilters.finishPage} onChange={e => setBookFilters({ ...bookFilters, finishPage: e.target.value })} />
                </div>
              </div>
              {/* Aquí van los inputs de Week y Page que ya tenías */}
              <p><strong>Filtros generales:</strong></p>

                <label>Category: </label>
                <select value={bookFilters.category} onChange={e => setBookFilters({...bookFilters, category: e.target.value})}>
                  <option value="ALL">ALL</option>
                  <option value="VOCABULARY">VOCABULARY</option>
                  <option value="VERB">VERB</option>
                  <option value="NOUN">NOUN</option>
                  <option value="ADJECTIVE">ADJECTIVE</option>
                </select>

                <label> Topic: </label>
                <select value={bookFilters.topic} onChange={e => setBookFilters({...bookFilters, topic: e.target.value})}>
                  <option value="ALL">ALL</option>
                  <option value="KEY WORDS">KEY WORDS</option>
                  <option value="ACADEMIC WORDS">ACADEMIC WORDS</option>
                </select>
            </div>//el div de style
          )}
        </div>

        {/* VERBS SECTION */}
        <div className="menu-item" style={{ justifyContent: "space-between" }}>
          <span onClick={() => setShowSections({ ...showSections, verbs: !showSections.verbs })} style={{ cursor: "pointer" }}>
            {showSections.verbs ? "▼" : "▶"} <strong>Verbs</strong>
          </span>
          {showSections.verbs && (
            <select value={verbType} onChange={e => setVerbType(e.target.value)}>
              <option value="ALL">ALL TYPES</option>
              <option value="REGULAR">REGULAR</option>
              <option value="IRREGULAR">IRREGULAR</option>
            </select>
          )}
          <input type="checkbox" checked={selectedTables.verbs} onChange={e => setSelectedTables({ ...selectedTables, verbs: e.target.checked })} />
        </div>

        {/* RANGOS ID (Spelling, Nouns, Adjectives) */}
        {["spelling", "nouns", "adjectives"].map(table => (
          <div key={table} className="menu-item" style={{ flexDirection: "column", alignItems: "flex-start" }}>
            <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
              <span onClick={() => setShowSections({ ...showSections, [table]: !showSections[table] })} style={{ cursor: "pointer" }}>
                {showSections[table] ? "▼" : "▶"} <strong>{table.toUpperCase()}</strong>
              </span>
              <input type="checkbox" checked={selectedTables[table]} onChange={e => setSelectedTables({ ...selectedTables, [table]: e.target.checked })} />
            </div>
            {showSections[table] && (
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <input type="number" placeholder="ID Start" value={idFilters[table].start} onChange={e => setIdFilters({ ...idFilters, [table]: { ...idFilters[table], start: parseInt(e.target.value) } })} />
                <input type="number" placeholder="ID End" value={idFilters[table].end} onChange={e => setIdFilters({ ...idFilters, [table]: { ...idFilters[table], end: parseInt(e.target.value) } })} />
              </div>
            )}
          </div>
        ))}

      </div>

      <button className="apply-btn" onClick={handleApply} style={{ width: "100%", marginTop: "20px", padding: "15px", background: "#0366d6", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
        APLICAR CAMBIOS MASIVOS
      </button>
    </div>
  );
}