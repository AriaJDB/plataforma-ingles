import { useState } from "react";

const API = "http://localhost:3001";

export default function StudentForm({ onUpdate }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enviamos como objeto JSON plano
    const studentData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    };

    try {
      const response = await fetch(`${API}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Crucial para que el backend lo entienda
        },
        body: JSON.stringify(studentData),
      });

      if (response.ok) {
        setFirstName("");
        setLastName("");
        if (onUpdate) onUpdate();
      } else {
        alert("Error al guardar el estudiante");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Agregar Estudiante</h3>

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

      <button type="submit">Agregar Estudiante</button>
    </form>
  );
}