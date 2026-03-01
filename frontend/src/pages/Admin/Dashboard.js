import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/pages/AdminStyles.css";

const API = "http://localhost:3001";

function Dashboard() {
  const [stats, setStats] = useState({ words: 0, students: 0, teams: 0 });

  useEffect(() => {
    // Función para obtener los contadores reales de la DB
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API}/stats/summary`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error cargando estadísticas:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-wrapper">
      <div className="admin-container">
        <header className="admin-header">
          <h1>Dashboard Profesora</h1>
          <p>Bienvenida al centro de control educativo.</p>
        </header>

        <div className="dashboard-grid">
          <div className="stat-card">
            <h3>Total Palabras</h3>
            <p className="stat-number">{stats.words}</p>
            <span className="stat-detail">Base de datos actualizada</span>
          </div>
          <div className="stat-card">
            <h3>Alumnos</h3>
            <p className="stat-number">{stats.students}</p>
            <span className="stat-detail">Inscritos este ciclo</span>
          </div>
        </div>

        <h2 className="section-title">Accesos Directos</h2>

        <nav className="dashboard-menu">
          <Link to="/words" className="menu-item">
            <div className="menu-icon">📚</div>
            <div className="menu-text">
              <strong>Banco de Palabras</strong>
              <span>Gestiona Verbos, Nouns y Adjectives</span>
            </div>
          </Link>
          <Link to="/students" className="menu-item">
            <div className="menu-icon">👩‍🎓</div>
            <div className="menu-text">
              <strong>Alumnos</strong>
              <span>Progreso y seguimiento individual</span>
            </div>
          </Link>

          <Link to="/teams" className="menu-item">
            <div className="menu-icon">🤝</div>
            <div className="menu-text">
              <strong>Formar Equipos</strong>
              <span>Organiza grupos para actividades</span>
            </div>
          </Link>

          <Link to="/game-settings" className="menu-item">
            <div className="menu-icon">⚙️</div>
            <div className="menu-text">
              <strong>Selector de Palabras</strong>
              <span>Configura qué palabras aparecerán en clase</span>
            </div>
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default Dashboard;