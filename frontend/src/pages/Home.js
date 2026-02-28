import { Link } from "react-router-dom";
import "../styles/pages/Home.css";

function Home() {
  return (
    <div className="home-container">

      {/* Botón dashboard */}
      <Link to="/dashboard" className="dashboard-btn">
        Dashboard profesora
      </Link>

      <h1 className="home-title">
        Juegos educativos
      </h1>

      <div className="games-container">
        <Link to="/memorama">
          <button className="game-btn">
            Memory Game
          </button>
        </Link>

        <Link to="/superlatives">
          <button className="game-btn">Superlatives Game</button>
        </Link>

      </div>

    </div>
  );
}

export default Home;
