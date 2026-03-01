import { useState } from "react";

const API = "http://localhost:3001";

export default function BookForm({ onUpdate }) {
  const [english, setEnglish] = useState("");
  const [spanish, setSpanish] = useState("");
  const [month, setMonth] = useState("JANUARY");
  const [week, setWeek] = useState(1);
  const [category, setCategory] = useState("VOCABULARY");
  const [topic, setTopic] = useState("GENERAL");
  const [page, setPage] = useState(1);
  const [phonetic, setPhonetic] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();

    const formData = new FormData();
    // Texto primero
    formData.append("english", english.toUpperCase());
    formData.append("spanish", spanish.toUpperCase());
    formData.append("month", month);
    formData.append("week", week);
    formData.append("category", category);
    formData.append("topic", topic);
    formData.append("page", page);
    formData.append("phonetic", phonetic.toUpperCase());
    formData.append("is_active", 1);

    // Imagen al final
    if (image) formData.append("image", image);

    try {
      const response = await fetch(`${API}/book-words`, {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        setSpanish("");
        setEnglish("");
        setPhonetic("");
        if (onUpdate) onUpdate();
      } else {
        alert("Error al guardar la palabra");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Agregar Book Word</h3>

      <input
      type="text"
        placeholder="English"
        value={english}
        onChange={e => setEnglish(e.target.value.toUpperCase())}
        required
      />

      <input
      type="text"
        placeholder="Spanish"
        value={spanish}
        onChange={e => setSpanish(e.target.value.toUpperCase())}
        required
      />

      <label>Month:</label>
      <select value={month} onChange={e => setMonth(e.target.value)}>
        {["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"].map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <label>Week:</label>
      <select value={week} onChange={e => setWeek(e.target.value)}>
        {[1,2,3,4].map(w => (
          <option key={w} value={w}>{w}</option>
        ))}
      </select>

      <label>Category:</label>
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="VOCABULARY">VOCABULARY</option>
        <option value="VERB">VERB</option>
        <option value="NOUN">NOUN</option>
        <option value="ADJECTIVE">ADJECTIVE</option>
      </select>

      <label>Topic:</label>
      <select value={topic} onChange={e => setTopic(e.target.value)}>
        <option value="GENERAL">GENERAL</option>
        <option value="KEY WORDS">KEY WORDS</option>
        <option value="ACADEMIC WORDS">ACADEMIC WORDS</option>
        <option value="LEARNING STRATEGIES">LEARNING STRATEGIES</option>
      </select>

      <label>Page:</label>
      <input
        type="number"
        value={page}
        min="1"
        onChange={e => setPage(e.target.value)}
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