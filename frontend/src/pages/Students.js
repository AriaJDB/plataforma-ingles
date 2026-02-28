import { useEffect, useState } from "react";
import api from "../services/api";

function Students() {
  const [students, setStudents] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");


  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const res = await api.get("/students");
    setStudents(res.data);
  };

  const guardar = async e => {
    e.preventDefault();

    await api.post("/students", {
      firstName,
      lastName
    });

    setFirstName("");
    setLastName("");
    cargar();
  };


  return (
    <div>
      <h2>Alumnos</h2>

      <form onSubmit={guardar}>
        <input
          placeholder="Nombre"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />

        <input
          placeholder="Apellido"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />

        <button>Agregar alumno</button>
      </form>


      <hr />

      <ul>
        {students.map(s => (
          <li key={s.id}>
            {s.firstName} {s.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Students;
