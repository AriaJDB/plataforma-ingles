import { useState } from "react";

const API = "http://localhost:3001";

export default function NounForm({ onUpdate }) {
  const [spanish, setSpanish] = useState("");
  const [english, setEnglish] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    // Campos de texto primero
    formData.append("spanish", spanish.toUpperCase());
    formData.append("english", english.toUpperCase());
    formData.append("is_active", 1);

    // Imagen al final
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(`${API}/nouns`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSpanish("");
        setEnglish("");
        setImage(null);
        if (onUpdate) onUpdate();
      } else {
        alert("Error al guardar el sustantivo");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Agregar Noun</h3>

      <input
        type="text"
        placeholder="Spanish"
        value={spanish}
        onChange={(e) => setSpanish(e.target.value)}
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
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button type="submit">Agregar</button>
    </form>
  );
}