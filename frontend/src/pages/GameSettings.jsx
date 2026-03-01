import GameWordManager from "../components/GameManager/GameWordManager";

export default function GameSettings() {
  return (
    <div className="manager-wrapper">
      <div className="manager-container">
        <h1>Configuración de Palabras para Juegos</h1>
        <p>Selecciona qué grupos de palabras estarán activos o inactivos en la plataforma.</p>
        <hr />
        <GameWordManager />
      </div>
    </div>
  );
}