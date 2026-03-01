import { useState } from "react";

const API = "http://localhost:3001";

export default function VerbForm({ onUpdate }) {
  const [spanish, setSpanish] = useState("");
  const [present, setPresent] = useState("");
  const [past, setPast] = useState("");
  const [pastParticiple, setPastParticiple] = useState("");
  const [gerund, setGerund] = useState("");
  const [thirdPerson, setThirdPerson] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [type, setType] = useState("regular");
  const [image, setImage] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("spanish", spanish);
    formData.append("present", present);
    formData.append("past", past);
    formData.append("pastParticiple", pastParticiple);
    formData.append("gerund", gerund);
    formData.append("thirdPerson", thirdPerson);
    formData.append("phonetic", phonetic);
    formData.append("type", type);

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(`${API}/verbs`, {
        method: "POST",
        body: formData,
        // ¡NO PONGAS HEADERS AQUÍ! El navegador pondrá el Content-Type con el boundary correcto.
      });

      if (response.ok) {
        // 1. Limpiamos los campos del formulario
        setSpanish("");
        setPresent("");
        setPast("");
        setPastParticiple("");
        setGerund("");
        setThirdPerson("");
        setPhonetic("");
        setType("regular");
        setImage(null);

        // 2. Avisamos al padre que algo cambió sin recargar
        if (onUpdate) onUpdate();
      }
      else {
        const errorData = await response.json();
        console.error("Error del servidor:", errorData);
      }
    } catch (err) {
      console.error("Error de red:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Agregar Verb</h3>
      <input
        placeholder="Spanish"
        value={spanish}
        onChange={e => setSpanish(e.target.value)}
        required />

      <input placeholder="Present"
        value={present}
        onChange={e => setPresent(e.target.value)}
        required />

      <input placeholder="Past"
        value={past}
        onChange={e => setPast(e.target.value)}
        required />

      <input placeholder="Past Participle"
        value={pastParticiple}
        onChange={e => setPastParticiple(e.target.value)}
        required />

      <input placeholder="Gerund"
        value={gerund}
        onChange={e => setGerund(e.target.value)}
        required />

      <input placeholder="Third Person"
        value={thirdPerson}
        onChange={e => setThirdPerson(e.target.value)}
        required />

      <input placeholder="Phonetic"
        value={phonetic}
        onChange={e => setPhonetic(e.target.value)}
        required />

      <select value={type} onChange={e => setType(e.target.value)}>
        <option value="REGULAR">REGULAR</option>
        <option value="IRREGULAR">IRREGULAR</option>
      </select>
      <input type="file" accept="image/*"
        onChange={e => setImage(e.target.files[0])} />
      <button type="submit">Agregar</button>
    </form>
  );
}