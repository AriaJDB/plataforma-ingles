import { useState } from "react";

// Importación de componentes de Negocio
import BookForm from "../components/BookWords/BookForm";
import BookTable from "../components/BookWords/BookTable";

import SpellingForm from "../components/Spelling/SpellingForm";
import SpellingTable from "../components/Spelling/SpellingTable";

import VerbForm from "../components/Verbs/VerbForm";
import VerbTable from "../components/Verbs/VerbTable";

import NounForm from "../components/Nouns/NounForm";
import NounTable from "../components/Nouns/NounTable";

import AdjectiveForm from "../components/Adjectives/AdjectiveForm";
import AdjectiveTable from "../components/Adjectives/AdjectiveTable";

// Importación de estilos unificados
import "../styles/pages/AdminStyles.css";

export default function WordAdmin() {
  const [active, setActive] = useState("book");
  const [refreshSignal, setRefreshSignal] = useState(0);

  // Función para disparar la recarga de las tablas tras un POST exitoso
  const handleUpdate = () => {
    setRefreshSignal(prev => prev + 1);
  };

  // Helper para manejar la clase activa de los botones
  const getTabClass = (tabName) => {
    return active === tabName ? "tab-btn active" : "tab-btn";
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Panel de Administración de Palabras</h1>
      </header>

      <nav className="word-views">
        <button 
          className={getTabClass("book")} 
          onClick={() => setActive("book")}
        >
          Book Words
        </button>
        <button 
          className={getTabClass("spelling")} 
          onClick={() => setActive("spelling")}
        >
          Spelling Bee
        </button>
        <button 
          className={getTabClass("verbs")} 
          onClick={() => setActive("verbs")}
        >
          Verbs
        </button>
        <button 
          className={getTabClass("nouns")} 
          onClick={() => setActive("nouns")}
        >
          Nouns
        </button>
        <button 
          className={getTabClass("adjectives")} 
          onClick={() => setActive("adjectives")}
        >
          Adjectives
        </button>
      </nav>

      <div className="admin-content">
        {active === "book" && (
          <section className="view-section">
            <BookForm onUpdate={handleUpdate} />
            <BookTable refreshTrigger={refreshSignal} />
          </section>
        )}

        {active === "spelling" && (
          <section className="view-section">
            <SpellingForm onUpdate={handleUpdate} />
            <SpellingTable refreshTrigger={refreshSignal} />
          </section>
        )}

        {active === "verbs" && (
          <section className="view-section">
            <VerbForm onUpdate={handleUpdate} />
            <VerbTable refreshTrigger={refreshSignal} />
          </section>
        )}

        {active === "nouns" && (
          <section className="view-section">
            <NounForm onUpdate={handleUpdate} />
            <NounTable refreshTrigger={refreshSignal} />
          </section>
        )}

        {active === "adjectives" && (
          <section className="view-section">
            <AdjectiveForm onUpdate={handleUpdate} />
            <AdjectiveTable refreshTrigger={refreshSignal} />
          </section>
        )}
      </div>
    </div>
  );
}