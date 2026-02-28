import { useEffect, useState } from "react";
import "../../styles/pages/games/MemoryGame.css";

const API = "http://localhost:3001";

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [win, setWin] = useState(false);

  // Estados para la mecánica Say-Spell-Say
  const [spellMode, setSpellMode] = useState(false);
  const [spellText, setSpellText] = useState("");
  const [spellTimer, setSpellTimer] = useState(null);

  useEffect(() => {
    loadGame();
  }, []);

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const loadGame = async () => {
    try {
      const res = await fetch(`${API}/game-manager/active-words`);
      const data = await res.json();

      if (data.length < 6) {
        alert("No hay suficientes palabras activas para jugar. Activa al menos 6 en el panel de control.");
        return;
      }

      const shuffled = [...data].sort(() => 0.5 - Math.random());
      const selectedWords = shuffled.slice(0, 6);

      let gameCards = [];

      selectedWords.forEach((word) => {
        // Carta de Texto
        gameCards.push({
          id: `${word.folder}_${word.id}_word`,
          pairId: `${word.folder}_${word.id}`,
          type: "word",
          value: word.english,
          folder: word.folder,
        });

        // Carta de Imagen
        gameCards.push({
          id: `${word.folder}_${word.id}_img`,
          pairId: `${word.folder}_${word.id}`,
          type: "image",
          value: word.english,
          folder: word.folder,
        });
      });

      gameCards.sort(() => 0.5 - Math.random());

      gameCards = gameCards.map((card, index) => ({
        ...card,
        number: index + 1,
      }));

      setCards(gameCards);
      setWin(false);
    } catch (error) {
      console.error("Error al cargar el juego:", error);
    }
  };

  const nuevoJuego = () => {
    setSelected([]);
    setMatched([]);
    setWin(false);
    loadGame();
  };

  const selectCard = (card) => {
    if (spellMode || selected.length === 2) return;
    if (selected.find((c) => c.id === card.id)) return;
    if (matched.includes(card.pairId)) return;

    const newSelected = [...selected, card];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setTimeout(() => checkMatch(newSelected), 700);
    }
  };

  const checkMatch = async (pair) => {
    if (pair[0].pairId === pair[1].pairId) {
      const wordToSpell = pair[0].value;

      // 1. Inicia Say-Spell-Say (Fondo oscuro)
      setSpellMode(true);
      setSpellText("Say-Spell-Say!");
      await wait(2000);

      // 2. Contador 3, 2, 1
      setSpellText("");
      setSpellTimer(3); await wait(1000);
      setSpellTimer(2); await wait(1000);
      setSpellTimer(1); await wait(1000);
      setSpellTimer(null);

      // 3. Palabra completa por 3 segundos
      setSpellText(wordToSpell);
      await wait(3000);

      // 4. Letra por letra (2 segundos cada una)
      for (let i = 1; i <= wordToSpell.length; i++) {
        setSpellText(wordToSpell.substring(0, i));
        await wait(2000);
      }

      // 5. Palabra completa final por 3 segundos
      setSpellText(wordToSpell);
      await wait(3000);

      // Finalización de la secuencia
      setMatched((prev) => [...prev, pair[0].pairId]);
      setSpellMode(false);
      setSpellText("");
    }
    setSelected([]);
  };

  useEffect(() => {
    if (matched.length === 6 && cards.length > 0) {
      setWin(true);
    }
  }, [matched, cards]);

  return (
    <div className="memory-container">
      <h2 className="memory-title">Memory card game</h2>

      <button className="memory-btn" onClick={nuevoJuego}>
        New game
      </button>

      {win && (
        <div className="memory-win">
          🎉 Congratulations! You found all the pairs 🎉
        </div>
      )}

      {/* OVERLAY DE SAY-SPELL-SAY */}
      {spellMode && (
        <div className="say-spell-overlay">
          <div className="say-spell-box">
            {spellText === "Say-Spell-Say!" ? (
              <span className="say-spell-title">{spellText}</span>
            ) : spellTimer ? (
              <span className="say-spell-timer">{spellTimer}</span>
            ) : (
              <span className="say-spell-content">{spellText}</span>
            )}
          </div>
        </div>
      )}

      <div className="memory-grid">
        {cards.map((card) => {
          const flipped =
            selected.find((c) => c.id === card.id) ||
            matched.includes(card.pairId);

          const isMatched = matched.includes(card.pairId);

          return (
            <div
              key={card.id}
              className={`memory-card ${flipped ? "flipped" : ""} ${
                isMatched ? "matched" : ""
              }`}
              onClick={() => selectCard(card)}
            >
              <div className="card-inner">
                <div className="card-front">{card.number}</div>

                <div className="card-back">
                  {card.type === "word" ? (
                    <span>{card.value}</span>
                  ) : (
                    <img
                      src={`${API}/images/${card.folder}/${card.value}.png`}
                      alt=""
                      onError={(e) => {
                        e.target.src = `${API}/images/default.png`;
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}