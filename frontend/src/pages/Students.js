import { useState } from "react";

// Importación de componentes de Negocio
import StudentForm from "../components/Students/StudentForm";
import StudentTable from "../components/Students/StudentTable";

// Importación de estilos unificados
import "../styles/pages/AdminStyles.css";

export default function Students() {


  return (
    <div className="student-container">
      <header className="student-header">
        <h1>Panel de Administración de Estudiantes</h1>
      </header>

      <div className="student-content">

        <section className="view-section">
          <StudentForm />
          <StudentTable />
        </section>



      </div>
    </div>
  );
}