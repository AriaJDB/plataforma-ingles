import { useState } from "react";
const API = "http://localhost:3001";

export default function VerbForm({ onUpdate }) {
  const [spanish, setSpanish] = useState("");
  const [present, setPresent] = useState("");
  const [pastSimple, setPastSimple] = useState("");
  const [pastParticiple, setPastParticiple] = useState("");
  const [gerund, setGerund] = useState("");
  const [thirdPerson, setThirdPerson] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [type, setType] = useState("REGULAR");
  const [image, setImage] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("spanish", spanish);
    formData.append("present", present);
    formData.append("past_simple", pastSimple);
    formData.append("past_participle", pastParticiple);
    formData.append("gerund", gerund);
    formData.append("third_person", thirdPerson);
    formData.append("phonetic", phonetic);
    formData.append("type", type);
    if (image) formData.append("image", image);

    try {
      const response = await fetch(`${API}/verbs`, { method: "POST", body: formData });
      if (response.ok) {
        setSpanish(""); setPresent(""); setPastSimple(""); setPastParticiple("");
        setGerund(""); setThirdPerson(""); setPhonetic(""); setType("REGULAR");
        setImage(null);
        if (onUpdate) onUpdate();
      }
    } catch (err) { console.error("Error de red:", err); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Agregar Verb</h3>
      <input
        type="text"
        placeholder="Spanish"
        value={spanish}
        onChange={e => setSpanish(e.target.value)}
        required />

      <input
        type="text"
        placeholder="Present"
        value={present}
        onChange={e => setPresent(e.target.value)}
        required />

      <input
        type="text"
        placeholder="Past Simple"
        value={pastSimple}
        onChange={e => setPastSimple(e.target.value)} required />

      <input
        type="text"
        placeholder="Past Participle"
        value={pastParticiple}
        onChange={e => setPastParticiple(e.target.value)} required />

      <input
        type="text"
        placeholder="Gerund"
        value={gerund}
        onChange={e => setGerund(e.target.value)}
        required />

      <input
        type="text"
        placeholder="Third Person"
        value={thirdPerson}
        onChange={e => setThirdPerson(e.target.value)}
        required />

      <input
        type="text"
        placeholder="Phonetic"
        value={phonetic}
        onChange={e => setPhonetic(e.target.value)}
        required />

      <select value={type} onChange={e => setType(e.target.value)}>
        <option value="REGULAR">REGULAR</option>
        <option value="IRREGULAR">IRREGULAR</option>
      </select>
      <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
      <button type="submit">Agregar</button>
    </form>
  );
}