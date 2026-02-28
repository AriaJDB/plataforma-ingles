import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard Profesora</h1>

      <ul>
        <li><Link to="/words">Banco de palabras</Link></li>
        <li><Link to="/students">Alumnos</Link></li>
        <li><Link to="/teams">Formar equipos</Link></li>
        <li><Link to="/game-settings">Selector de palabras</Link></li>
      </ul>
    </div>
  );
}

export default Dashboard;
