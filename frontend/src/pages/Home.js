import { Link } from "react-router-dom";
import "../styles/pages/Home.css";

function Home() {
  return (
    <div className="home-container">
      {/* Botón dashboard - Manteniendo un estilo diferente para la profesora */}
      <nav className="top-nav">
        <Link to="/dashboard" className="teacher-access-btn">
          Teacher Dashboard 🍎
        </Link>
      </nav>

      <header className="home-header">
        <h1 className="home-title">Educational Games</h1>
        <p className="home-subtitle">Choose a game and start learning!</p>
      </header>

      <div className="games-grid">
        <Link to="/memorama" className="game-card memory">
          <div className="game-icon">🧠</div>
          <span className="game-name">Memory Game</span>
        </Link>

        <Link to="/superlatives" className="game-card superlatives">
          <div className="game-icon">🏆</div>
          <span className="game-name">Superlatives</span>
        </Link>

        {/* Ejemplo de cómo se verían los futuros juegos */}
        <Link to="/spelling" className="game-card spelling">
          <div className="game-icon">🐝</div>
          <span className="game-name">Spelling Bee</span>
        </Link>

        <Link to="/vocabulary" className="game-card vocabulary">
          <div className="game-icon">📚</div>
          <span className="game-name">Vocabulary</span>
        </Link>
      </div>
    </div>
  );
}

export default Home;