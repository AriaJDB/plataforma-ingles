import { useState } from "react";

const API = "http://localhost:3001";

export default function GameWordManager() {
  const [globalStatus, setGlobalStatus] = useState(1);
  const [selectedTables, setSelectedTables] = useState({
    book: false, spelling: false, verbs: false, adjectives: false, nouns: false
  });

  // Estados de visibilidad (desplegables)
  const [showBook, setShowBook] = useState(false);

  // Filtros específicos para Book Words
  const [useRange, setUseRange] = useState(false);
  const [bookFilters, setBookFilters] = useState({
    startMonth: 1, finishMonth: 12,
    startWeek: 1, finishWeek: 4,
    startPage: 1, finishPage: 500,
    category: "ALL", topic: "ALL"
  });

  const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

  const handleApply = async () => {
    try {
      const response = await fetch(`${API}/game-manager/bulk-update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: globalStatus,
          tables: selectedTables,
          bookFilters: { ...bookFilters, useRange }
        })
      });
      
      if (response.ok) {
        alert("Actualización masiva completada con éxito");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al procesar la solicitud");
    }
  };

  return (
    <div>
      {/* 1. Selector de Estado (Activo/Inactivo) */}
      <div style={{ marginBottom: "20px" }}>
        <select value={globalStatus} onChange={e => setGlobalStatus(parseInt(e.target.value))}>
          <option value={1}>ACTIVO</option>
          <option value={0}>INACTIVO</option>
        </select>
      </div>

      {/* 2. Lista de Tablas con Checkboxes */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        
        {/* BOOK WORDS (Con menú desplegado) */}
        <div>
          <button onClick={() => setShowBook(!showBook)}>
            {showBook ? "▼" : "▶"} Book words
          </button>
          <input 
            type="checkbox" 
            checked={selectedTables.book}
            onChange={e => setSelectedTables({...selectedTables, book: e.target.checked})}
          />

          {showBook && (
            <div style={{ marginLeft: "20px", border: "1px solid gray", padding: "10px" }}>
              <div>
                <input 
                  type="checkbox" 
                  id="rangeToggle" 
                  checked={useRange} 
                  onChange={e => setUseRange(e.target.checked)} 
                />
                <label htmlFor="rangeToggle"> Activar filtros de rango (Month/Week/Page)</label>
              </div>

              {/* Filtros de Rango (Bloqueados si useRange es false) */}
              <div style={{ opacity: useRange ? 1 : 0.5, pointerEvents: useRange ? "auto" : "none" }}>
                <p><strong>Rangos:</strong></p>
                <label>Start month: </label>
                <select value={bookFilters.startMonth} onChange={e => setBookFilters({...bookFilters, startMonth: parseInt(e.target.value)})}>
                  {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
                
                <label> Finish month: </label>
                <select value={bookFilters.finishMonth} onChange={e => setBookFilters({...bookFilters, finishMonth: parseInt(e.target.value)})}>
                  {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>

                <br />

                <label>Start week: </label>
                <select value={bookFilters.startWeek} onChange={e => setBookFilters({...bookFilters, startWeek: parseInt(e.target.value)})}>
                  {[1, 2, 3, 4].map(w => <option key={w} value={w}>{w}</option>)}
                </select>

                <label> Finish week: </label>
                <select value={bookFilters.finishWeek} onChange={e => setBookFilters({...bookFilters, finishWeek: parseInt(e.target.value)})}>
                  {[1, 2, 3, 4].map(w => <option key={w} value={w}>{w}</option>)}
                </select>

                <br />

                <label>Start page: </label>
                <input type="number" value={bookFilters.startPage} onChange={e => setBookFilters({...bookFilters, startPage: e.target.value})} />
                
                <label> Finish page: </label>
                <input type="number" value={bookFilters.finishPage} onChange={e => setBookFilters({...bookFilters, finishPage: e.target.value})} />
              </div>

              {/* Filtros de Categoría y Tema (Siempre disponibles) */}
              <div style={{ marginTop: "10px" }}>
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
              </div>
            </div>
          )}
        </div>

        {/* RESTO DE TABLAS (Sin filtros específicos por ahora) */}
        {["spelling", "verbs", "adjectives", "nouns"].map(table => (
          <div key={table}>
            <span>▶ {table.charAt(0).toUpperCase() + table.slice(1)} </span>
            <input 
              type="checkbox" 
              checked={selectedTables[table]}
              onChange={e => setSelectedTables({...selectedTables, [table]: e.target.checked})}
            />
          </div>
        ))}
      </div>

      <button onClick={handleApply} style={{ marginTop: "20px", fontWeight: "bold" }}>
        APLICAR CAMBIOS
      </button>
    </div>
  );
}