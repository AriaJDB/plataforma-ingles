import { useState } from "react";

const API = "http://localhost:3001";

export default function AdjectiveForm({ onUpdate }) {
  const [spanish, setSpanish] = useState("");
  const [english, setEnglish] = useState("");
  const [comparative, setComparative] = useState("");
  const [superlative, setSuperlative] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    // Texto primero para asegurar que req.body se llene en el servidor
    formData.append("spanish", spanish.toUpperCase());
    formData.append("english", english.toUpperCase());
    formData.append("comparative", comparative.toUpperCase()); // Nuevo
    formData.append("superlative", superlative.toUpperCase()); // Nuevo
    formData.append("phonetic", phonetic.toUpperCase());
    formData.append("is_active", 1);

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(`${API}/adjectives`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSpanish("");
        setEnglish("");
        setComparative("");
        setSuperlative("");
        setPhonetic("");
        setImage(null);
        if (onUpdate) onUpdate();
      } else {
        alert("Error al guardar el adjetivo");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Agregar Adjective</h3>

      <input
        type="text"
        placeholder="Spanish"
        value={spanish}
        onChange={(e) => setSpanish(e.target.value.toUpperCase())}
        required
      />

      <input
        type="text"
        placeholder="English"
        value={english}
        onChange={(e) => setEnglish(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Comparative"
        value={comparative}
        onChange={(e) => setComparative(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Superlative"
        value={superlative}
        onChange={(e) => setSuperlative(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Phonetic"
        value={phonetic}
        onChange={(e) => setPhonetic(e.target.value)}
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button type="submit">Agregar</button>
    </form>
  );
}