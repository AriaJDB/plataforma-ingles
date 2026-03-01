import { useState, useEffect } from "react";
import "../../styles/pages/AdminStyles.css";

const API = "http://localhost:3001";

export default function TeamGenerator() {
  const [students, setStudents] = useState([]);
  const [groupSize, setGroupSize] = useState(2);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch(`${API}/students`)
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(err => console.error("Error cargando alumnos:", err));
  }, []);

  const generateTeams = () => {
    const activeStudents = students.filter(s => s.is_active === 1);

    if (activeStudents.length === 0) {
      return alert("No hay estudiantes activos para formar equipos");
    }

    if (activeStudents.length < groupSize) {
      return alert(`Solo hay ${activeStudents.length} alumnos activos. Elige un tamaño de grupo menor.`);
    }

    let shuffled = [...activeStudents].sort(() => Math.random() - 0.5);
    
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
        <p>Solo se incluirán los estudiantes marcados como <strong>ACTIVOS</strong>.</p>
      </header>

      <div className="stat-card" style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <label>Alumnos por equipo: </label>
          <input 
            type="number" 
            min="2" 
            max={students.filter(s => s.is_active === 1).length} // Ajuste del max dinámico
            value={groupSize} 
            onChange={(e) => setGroupSize(parseInt(e.target.value))}
            style={{ width: '60px', padding: '8px', marginLeft: '10px' }}
          />
          <small style={{ marginLeft: '10px', color: '#666' }}>
            ({students.filter(s => s.is_active === 1).length} activos)
          </small>
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