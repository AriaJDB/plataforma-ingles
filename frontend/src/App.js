import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import Words from "./pages/Admin/WordAdmin";
import Students from "./pages/Admin/Students";
import Home from "./pages/Admin/Home";
import Teams from "./pages/Admin/Teams";
import MemoryGame from "./pages/games/MemoryGame";
import SuperlativesGame from "./pages/games/SuperlativesGame";
import UnscrambleGame from "./pages/games/UnscrambleGame";
import GameSettings from "./pages/Admin/GameSettings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/words" element={<Words />} />
        <Route path="/students" element={<Students />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/game-settings" element={<GameSettings />} />

        
        {/* Rutas para los jueguitos */}
        <Route path="/memorama" element={<MemoryGame />} />
        <Route path="/superlatives" element={<SuperlativesGame />} />
        <Route path="/unscramble" element={<UnscrambleGame />} />

        {/* Juegos futuros */}
        <Route path="/game1" element={<h2>Juego 1</h2>} />
        <Route path="/game2" element={<h2>Juego 2</h2>} />
        <Route path="/game3" element={<h2>Juego 3</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
