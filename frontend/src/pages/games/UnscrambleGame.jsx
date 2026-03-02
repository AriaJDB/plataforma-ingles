import { useState, useEffect } from "react";
import confetti from "canvas-confetti"; 
import "../../styles/pages/games/UnscrambleGame.css";

const API = "http://localhost:3001";

export default function UnscrambleGame() {
  // --- Estados del Sistema ---
  const [gameState, setGameState] = useState("menu"); 
  const [showSettings, setShowSettings] = useState(false);
  const [wordsToPlay, setWordsToPlay] = useState(5); 

  // --- Estados del Juego ---
  const [gameQueue, setGameQueue] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [targetWord, setTargetWord] = useState("");
  const [targetImage, setTargetImage] = useState(null); 
  
  const [scrambledLetters, setScrambledLetters] = useState([]); 
  const [placedLetters, setPlacedLetters] = useState([]); 
  
  // --- Estados de Puntuación y Error ---
  const [errorLetterId, setErrorLetterId] = useState(null);
  const [mistakes, setMistakes] = useState(0); 
  const [results, setResults] = useState([]); 

  // --- Cargar palabras ---
  const loadGameData = async () => {
    try {
      const res = await fetch(`${API}/game-manager/active-words`);
      const data = await res.json();

      const allWords = [
        ...(data.book || []).map(w => ({ word: w.word || w.english, folder: 'book' })),
        ...(data.verbs || []).map(w => ({ word: w.present || w.english, folder: 'verbs' })),
        ...(data.spelling || []).map(w => ({ word: w.word || w.english, folder: 'spelling' })),
        ...(data.nouns || []).map(w => ({ word: w.word || w.english, folder: 'nouns' })),
        ...(data.adjectives || []).map(w => ({ word: w.word || w.english, folder: 'adjectives' }))
      ].filter(w => w.word && w.word.length > 2);

      if (allWords.length > 0) {
        const shuffled = allWords.sort(() => 0.5 - Math.random()).slice(0, wordsToPlay);
        setGameQueue(shuffled);
        setResults([]); 
        startRound(0, shuffled);
        setGameState("playing");
      } else {
        alert("Not enough words available.");
      }
    } catch (error) {
      console.error("Error loading words:", error);
    }
  };

  const startRound = (index, queue) => {
    setCurrentIndex(index);
    const wordObj = queue[index];
    const word = wordObj.word.toUpperCase();
    
    setTargetWord(word);
    setTargetImage({ folder: wordObj.folder, value: wordObj.word });
    setMistakes(0); 

    const lettersObj = word.split("").map((char, index) => ({
      id: `${index}-${char}-${Math.random()}`,
      char: char
    }));

    setScrambledLetters([...lettersObj].sort(() => 0.5 - Math.random()));
    setPlacedLetters([]);
    setErrorLetterId(null);
  };

  const handleLetterClick = (letterObj) => {
    const nextIndexNeeded = placedLetters.length;
    const correctCharNeeded = targetWord[nextIndexNeeded];

    if (letterObj.char === correctCharNeeded) {
      // --- CORRECTO ---
      const newScrambled = scrambledLetters.filter(l => l.id !== letterObj.id);
      setScrambledLetters(newScrambled);
      
      const newPlaced = [...placedLetters, letterObj];
      setPlacedLetters(newPlaced);

      if (newPlaced.length === targetWord.length) {
        handleWordComplete();
      }

    } else {
      // --- INCORRECTO ---
      setMistakes(prev => prev + 1);
      setErrorLetterId(letterObj.id);
      
      setTimeout(() => {
        setErrorLetterId(null);
      }, 500); 
    }
  };

  const handleWordComplete = () => {
    let stars = 3;
    if (mistakes > 0 && mistakes <= 2) stars = 2;
    if (mistakes > 2) stars = 1;

    setResults(prev => [...prev, { word: targetWord, stars: stars }]);

    // ✨ Confeti pequeño
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2e8b57', '#4facfe', '#ffcc00']
    });

    setTimeout(() => {
      const nextIdx = currentIndex + 1;
      if (nextIdx < gameQueue.length) {
        startRound(nextIdx, gameQueue);
      } else {
        finishGame();
      }
    }, 1500);
  };

  const finishGame = () => {
    setGameState("finished");
    
    // 🎆 Confeti final
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const random = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const adjustWords = (amount) => {
    setWordsToPlay(prev => {
      const newVal = prev + amount;
      return newVal < 1 ? 1 : newVal; 
    });
  };

  return (
    <div 
      className="unscramble-container"
      style={{ 
        // 🖼️ AQUÍ SE CARGA EL FONDO DESDE TU BACKEND 🖼️
        // Asegúrate que tu imagen se llame 'fondo.png' o cambia el nombre aquí abajo:
        backgroundImage: `url(${API}/images/games/Unscramble/park.png)`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      
      {gameState === "menu" && (
        <div className="start-screen fade-in">
          <h1 className="main-title">UNSCRAMBLE</h1>
          
          <div className="menu-buttons-row">
            <button className="btn-menu settings" onClick={() => setShowSettings(true)}>
              ⚙ SETTINGS
            </button>
            <button className="btn-menu play" onClick={loadGameData}>
              ▶ PLAY
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="modal-overlay">
          <div className="modal-content bounce-in">
            <h2>Word Count</h2>
            <div className="stepper-control">
              <button className="stepper-btn" onClick={() => adjustWords(-1)}>▼</button>
              <span className="stepper-value">{wordsToPlay}</span>
              <button className="stepper-btn" onClick={() => adjustWords(1)}>▲</button>
            </div>
            <button className="btn-save" onClick={() => setShowSettings(false)}>SAVE</button>
          </div>
        </div>
      )}

      {gameState === "playing" && targetImage && (
        <div className="game-layout fade-in">
          <div className="left-panel">
            <div className="image-frame">
              <img 
                src={`${API}/images/${targetImage.folder}/${targetImage.value}.png`} 
                alt="Guess"
                onError={(e) => e.target.src = `${API}/images/default.png`}
              />
            </div>
          </div>

          <div className="right-panel">
            <div className="game-header">
              <span className="progress-badge">Word {currentIndex + 1} / {gameQueue.length}</span>
              <span className="mistake-badge">Mistakes: {mistakes}</span>
            </div>

            <div className="scrambled-area">
              {scrambledLetters.map((item) => (
                <div
                  key={item.id}
                  className={`tile source ${errorLetterId === item.id ? 'error-shake' : ''}`}
                  onClick={() => handleLetterClick(item)}
                >
                  {item.char}
                </div>
              ))}
            </div>

            <div className="answer-area">
              {placedLetters.map((item) => (
                <div key={item.id} className="tile placed pop-in">
                  {item.char}
                </div>
              ))}
              {Array.from({ length: targetWord.length - placedLetters.length }).map((_, i) => (
                <div key={`empty-${i}`} className="slot-empty"></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {gameState === "finished" && (
        <div className="finish-screen fade-in">
          <h1>🎉 GOOD JOB! 🎉</h1>
          <div className="results-list">
            {results.map((res, idx) => (
              <div key={idx} className="result-item">
                <span className="res-word">{res.word}</span>
                <span className="res-stars">
                  {res.stars === 3 ? "⭐⭐⭐" : res.stars === 2 ? "⭐⭐" : "⭐"}
                </span>
              </div>
            ))}
          </div>
          <button className="btn-menu play" onClick={() => setGameState("menu")}>
            HOME
          </button>
        </div>
      )}
    </div>
  );
}