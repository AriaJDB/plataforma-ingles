import { useState } from "react";

const API = "http://localhost:3001";

export default function StudentForm({ onUpdate }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentData = {
      firstName: firstName.trim(),
      lastName: lastName.trim()
    };

    try {
      const response = await fetch(`${API}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(studentData)
      });

      if (response.ok) {
        setFirstName("");
        setLastName("");

        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Agregar Estudiante</h3>

      

      <div>
        <label>Apellido</label>
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value.toUpperCase())}
          required
        />
      </div>

      <div>
        <label>Nombre</label>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value.toUpperCase())}
          required
        />
      </div>

      <button type="submit">Agregar Estudiante</button>
    </form>
  );
}