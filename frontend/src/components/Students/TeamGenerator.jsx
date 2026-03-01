import { useState, useEffect } from "react";
import "../../styles/pages/AdminStyles.css";

const API = "http://localhost:3001";

export default function TeamGenerator() {
  const [students, setStudents] = useState([]);
  const [groupSize, setGroupSize] = useState(2);
  const [teams, setTeams] = useState([]);

  // Cargar estudiantes al montar el componente
  useEffect(() => {
    fetch(`${API}/students`)
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(err => console.error("Error cargando alumnos:", err));
  }, []);

  const generateTeams = () => {
    if (students.length === 0) return alert("No hay estudiantes registrados");

    // 1. Clonar y mezclar lista (Fisher-Yates Shuffle)
    let shuffled = [...students].sort(() => Math.random() - 0.5);
    
    // 2. Agrupar
    const result = [];
    for (let i = 0; i < shuffled.length; i += groupSize) {
      result.push(shuffled.slice(i, i + groupSize));
    }
    setTeams(result);
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Formar Equipos Aleatorios</h1>
        <p>Configura cuántos niños quieres por equipo y deja que el sistema los mezcle.</p>
      </header>

      <div className="stat-card" style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <label>Alumnos por equipo: </label>
          <input 
            type="number" 
            min="2" 
            max={students.length} 
            value={groupSize} 
            onChange={(e) => setGroupSize(parseInt(e.target.value))}
            style={{ width: '60px', padding: '8px', marginLeft: '10px' }}
          />
        </div>
        <button onClick={generateTeams} className="apply-btn" style={{ margin: 0 }}>
          Generar Equipos ✨
        </button>
      </div>

      <div className="teams-grid">
        {teams.map((team, index) => (
          <div key={index} className="team-card">
            <div className="team-header">Equipo {index + 1}</div>
            <ul className="team-list">
              {team.map(s => (
                <li key={s.id}>{s.firstName} {s.lastName}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}