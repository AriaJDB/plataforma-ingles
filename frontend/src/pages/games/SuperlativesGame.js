import { useState } from "react";
import "../../styles/pages/games/SuperlativesGame.css";

const questionsData = [
  {
    sentence: "The Amazon River is the ______ river in the world.",
    correct: "longest",
    options: ["long", "longer", "longest", "most long"]
  },
  {
    sentence: "This math problem is the ______ of all.",
    correct: "hardest",
    options: ["hard", "harder", "hardest", "most hard"]
  },
  {
    sentence: "She bought the ______ dress in the store.",
    correct: "most beautiful",
    options: ["beautifulest", "more beautiful", "most beautiful", "beautiful"]
  },
  {
    sentence: "My brother is the ______ person I know.",
    correct: "funniest",
    options: ["funny", "funniest", "funnier", "most funny"]
  },
  {
    sentence: "That was the ______ storm this year.",
    correct: "strongest",
    options: ["strong", "stronger", "strongest", "most strong"]
  },
  {
    sentence: "It is the ______ book on the shelf.",
    correct: "thickest",
    options: ["thicker", "thickest", "thick", "most thick"]
  },
  {
    sentence: "This exercise is the ______ in today's class.",
    correct: "most difficult",
    options: ["difficulter", "most difficult", "more difficult", "difficult"]
  },
  {
    sentence: "He is the ______ player on the team.",
    correct: "worst",
    options: ["bad", "worse", "worst", "most bad"]
  },
  {
    sentence: "This path is the ______ to the lake.",
    correct: "safest",
    options: ["safe", "safer", "safest", "most safe"]
  },
  {
    sentence: "That was the ______ performance tonight.",
    correct: "best",
    options: ["good", "better", "best", "most good"]
  },
  {
    sentence: "This laptop is the ______ one here.",
    correct: "lightest",
    options: ["light", "lighter", "lightest", "most light"]
  },
  {
    sentence: "It was the ______ experience of my trip.",
    correct: "most memorable",
    options: ["memorabler", "more memorable", "most memorable", "memorable"]
  }

  ,
  {
    sentence: "The blue whale is the ______ animal in the world.",
    options: ["biggest", "bigger", "fastest", "most big"],
    correct: "biggest"
  },
  {
    sentence: "Mount Everest is the ______ mountain on Earth.",
    correct: "highest",
    options: ["highest", "higher", "most high", "tallest"]
  },
  {
    sentence: "This puzzle is the ______ one in the book.",
    correct: "easiest",
    options: ["easiest", "easier", "most easy", "easy"]
  },
  {
    sentence: "That was the ______ movie I have ever seen.",
    correct: "most interesting",
    options: ["interestinger", "most interesting", "interesting", "more interesting"]
  },
  {
    sentence: "Cheetahs are the ______ animals on land.",
    correct: "fastest",
    options: ["faster", "fastest", "most fast", "fast"]
  },
  {
    sentence: "This is the ______ day of my life.",
    correct: "best",
    options: ["good", "better", "best", "most good"]
  },
  {
    sentence: "Winter is usually the ______ season here.",
    correct: "coldest",
    options: ["colder", "coldest", "most cold", "cold"]
  },
  {
    sentence: "She is the ______ student in the class.",
    correct: "most intelligent",
    options: ["intelligenter", "most intelligent", "intelligent", "more intelligent"]
  },
  {
    sentence: "That was the ______ test of the year.",
    correct: "worst",
    options: ["bad", "worse", "worst", "most bad"]
  },
  {
    sentence: "This road is the ______ way to the city.",
    correct: "shortest",
    options: ["short", "shorter", "shortest", "most short"]
  },
  {
    sentence: "It was the ______ party we ever had.",
    correct: "most exciting",
    options: ["exciting", "more exciting", "most exciting", "excitingest"]
  }

];

function SuperlativesGame() {
  const [current, setCurrent] = useState(0);
  const [droppedWord, setDroppedWord] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [hovered, setHovered] = useState(false);

  const question = questionsData[current];

  const handleDragStart = (e, word) => {
    e.dataTransfer.setData("word", word);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const word = e.dataTransfer.getData("word");
    setDroppedWord(word);

    if (word === question.correct) {
      setScore(prev => prev + 1);
      setFeedback("Correct!");
      setShowConfetti(true);
    } else {
      setFeedback("Incorrect");
    }

    setTimeout(() => {
      setShowConfetti(false);
      setFeedback("");
      setDroppedWord("");

      if (current + 1 < questionsData.length) {
        setCurrent(prev => prev + 1);
      } else {
        setFinished(true);
      }
    }, 1400);
  };

  const allowDrop = e => e.preventDefault();

  const finalMessage = () => {
    if (score === questionsData.length) return "Perfect!";
    if (score > questionsData.length / 2) return "Well done!";
    return "Try it again!";
  };

  if (finished) {
    return (
      <div className="game-container">
        <div className="final-screen">
          <h2>{finalMessage()}</h2>
          <p>Your score: {score} / {questionsData.length}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">

      <h1 className="game-title">Superlatives</h1>

      <h2 className="sentence">
        {question.sentence.split("______")[0]}

        <span
          className={`drop-zone ${hovered ? "hovered" : ""}`}
          onDrop={handleDrop}
          onDragOver={allowDrop}
          onDragEnter={() => setHovered(true)}
          onDragLeave={() => setHovered(false)}
        >
          {droppedWord || "_______"}
        </span>

        {question.sentence.split("______")[1]}
      </h2>


      {feedback && (
        <div className={`feedback ${feedback === "Correct!" ? "correct" : "incorrect"}`}>
          {feedback}
        </div>
      )}

      {showConfetti && <div className="confetti">🎉✨🎊</div>}

      <div className="options">
        {question.options.map((opt, index) => (
          <div
            key={index}
            className="option"
            draggable
            onDragStart={e => handleDragStart(e, opt)}
          >
            {opt}
          </div>
        ))}
      </div>

    </div>
  );
}

export default SuperlativesGame;
