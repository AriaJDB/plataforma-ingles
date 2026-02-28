import { useState } from "react";

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

export default function WordAdmin() {
  const [active, setActive] = useState("book");

  const [refreshSignal, setRefreshSignal] = useState(0);

  const handleUpdate = () => {
    setRefreshSignal(prev => prev + 1);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Panel de Palabras</h1>

      <div>
        <button onClick={() => setActive("book")}>Book</button>
        <button onClick={() => setActive("spelling")}>Spelling</button>
        <button onClick={() => setActive("verbs")}>Verbs</button>
        <button onClick={() => setActive("nouns")}>Nouns</button>
        <button onClick={() => setActive("adjectives")}>Adjectives</button>
      </div>

      <hr />

      {active === "book" && (
        <>
          <BookForm onUpdate={handleUpdate}/>
          <BookTable refreshTrigger={refreshSignal}/>
        </>
      )}

      {active === "spelling" && (
        <>
          <SpellingForm onUpdate={handleUpdate}/>
          <SpellingTable refreshTrigger={refreshSignal}/>
        </>
      )}

      {active === "verbs" && (
        <>
          <VerbForm onUpdate={handleUpdate} />
          <VerbTable refreshTrigger={refreshSignal} />
        </>
      )}

      {active === "nouns" && (
        <>
          <NounForm onUpdate={handleUpdate}/>
          <NounTable refreshTrigger={refreshSignal}/>
        </>
      )}

      {active === "adjectives" && (
        <>
          <AdjectiveForm onUpdate={handleUpdate}/>
          <AdjectiveTable refreshTrigger={refreshSignal}/>
        </>
      )}
    </div>
  );
}