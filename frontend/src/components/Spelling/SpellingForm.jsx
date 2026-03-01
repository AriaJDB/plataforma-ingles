import { useState } from "react";

const API = "http://localhost:3001";

export default function SpellingForm({ onUpdate }) {
  const [english, setEnglish] = useState("");
  const [spanish, setSpanish] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();

    const formData = new FormData();
    // Los campos de texto siempre antes que la imagen
    formData.append("english", english.toUpperCase());
    formData.append("spanish", spanish.toUpperCase());
    formData.append("phonetic", phonetic.toUpperCase());
    formData.append("is_active", 1);

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(`${API}/spelling-words`, {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        setSpanish("");
        setEnglish("");
        setPhonetic("");
        setImage(null);
        if (onUpdate) onUpdate();
      } else {
        const error = await response.json();
        console.error("Error del servidor:", error);
        alert("Hubo un error al guardar.");
      }
    } catch (err) {
      console.error("Error de conexión:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Agregar Spelling Word</h3>

      <input
      type="text"
        placeholder="English"
        value={english}
        onChange={e => setEnglish(e.target.value)}
        required
      />

      <input
      type="text"
        placeholder="Spanish"
        value={spanish}
        onChange={e => setSpanish(e.target.value)}
        required
      />

        <input
          type="text"
          placeholder="Phonetic"
          value={phonetic}
          onChange={e => setPhonetic(e.target.value)}
        />

      <input
        type="file"
        accept="image/*"
        onChange={e => setImage(e.target.files[0])}
      />

      <button type="submit">Agregar</button>
    </form>
  );
}