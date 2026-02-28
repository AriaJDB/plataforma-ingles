import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Words from "./pages/WordAdmin";
import Students from "./pages/Students";
import Home from "./pages/Home";
import Teams from "./pages/Teams";
import MemoryGame from "./pages/games/MemoryGame";
import SuperlativesGame from "./pages/games/SuperlativesGame";
import GameSettings from "./pages/GameSettings";

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


        {/* Juegos futuros */}
        <Route path="/game1" element={<h2>Juego 1</h2>} />
        <Route path="/game2" element={<h2>Juego 2</h2>} />
        <Route path="/game3" element={<h2>Juego 3</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
