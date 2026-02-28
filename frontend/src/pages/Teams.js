import { useEffect, useState } from "react";
import api from "../services/api";

function Teams() {
  const [students, setStudents] = useState([]);
  const [size, setSize] = useState(2);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    cargarAlumnos();
  }, []);

  const cargarAlumnos = async () => {
    const res = await api.get("/students");
    setStudents(res.data);
  };

  const generarEquipos = () => {
    if (!size || size <= 0) return;
    const shuffled = [...students]
      .sort(() => Math.random() - 0.5);

    const cantidadEquipos = Math.ceil(
      shuffled.length / parseInt(size)
    );

    const grupos = Array.from(
      { length: cantidadEquipos },
      () => []
    );

    shuffled.forEach((student, index) => {
      grupos[index % cantidadEquipos].push(student);
    });

    setTeams(grupos);
  };


  return (
    <div>
      <h2>Generar Equipos</h2>

      <div>
        <label>Integrantes por equipo:</label>
        <input
          type="number"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />

        <button onClick={generarEquipos}>
          Generar equipos
        </button>
      </div>

      <hr />

      {teams.map((team, i) => (
        <div key={i}>
          <h3>Equipo {i + 1}</h3>
          <ul>
            {team.map(student => (
              <li key={student.id}>
                {student.id} {student.firstName} {student.lastName}
              </li>

            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Teams;
