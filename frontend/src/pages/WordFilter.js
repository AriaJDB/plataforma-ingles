import { useState } from "react";
import axios from "axios";

const MESES = [
    "TODOS",
    "JANUARY", "FEBRU", "MARZO", "ABRIL", "MAYO", "JUNIO",
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE",
    "NOVIEMBRE", "DICIEMBRE"
];

export default function WordFilter() {

    const [filters, setFilters] = useState({
        monthStart: "TODOS",
        monthEnd: "TODOS",

        weekStart: 1,
        weekEnd: 1,
        allWeeks: true,

        pageStart: 1,
        pageEnd: 1,
        allPages: true,

        category: "TODOS",
        topic: "TODOS"
    });

    const [words, setWords] = useState([]);

    const change = e => {
        const { name, value, type, checked } = e.target;

        setFilters({
            ...filters,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const aplicarFiltros = async () => {

        const res = await axios.get(
            "http://localhost:3001/words/filter",
            { params: filters }
        );


        setWords(res.data);
    };

    return (
        <div>

            <h2>Seleccionar palabras</h2>

            {/* MESES */}
            Mes inicio:
            <select name="monthStart" onChange={change}>
                {MESES.map(m => <option key={m}>{m}</option>)}
            </select>

            Mes fin:
            <select name="monthEnd" onChange={change}>
                {MESES.map(m => <option key={m}>{m}</option>)}
            </select>

            <br /><br />

            {/* SEMANAS */}
            Semana inicio:
            <input
                type="number"
                name="weekStart"
                min="1"
                disabled={filters.allWeeks}
                onChange={change}
            />

            Semana fin:
            <input
                type="number"
                name="weekEnd"
                min="1"
                disabled={filters.allWeeks}
                onChange={change}
            />

            Todas semanas:
            <input
                type="checkbox"
                name="allWeeks"
                checked={filters.allWeeks}
                onChange={change}
            />

            <br /><br />

            {/* PAGINAS */}
            Página inicio:
            <input
                type="number"
                name="pageStart"
                min="1"
                disabled={filters.allPages}
                onChange={change}
            />

            Página fin:
            <input
                type="number"
                name="pageEnd"
                min="1"
                disabled={filters.allPages}
                onChange={change}
            />

            Todas páginas:
            <input
                type="checkbox"
                name="allPages"
                checked={filters.allPages}
                onChange={change}
            />

            <br /><br />

            Categoría:
            <select name="category" onChange={change}>
                <option>TODOS</option>
                <option>VERB</option>
                <option>NOUN</option>
                <option>ADJECTIVE</option>
            </select>

            Tema:
            <select name="topic" onChange={change}>
                <option>TODOS</option>
                <option>KEY WORDS</option>
                <option>ACADEMIC WORDS</option>
                <option>LEARNING STRATEGIES</option>
            </select>

            <br /><br />

            <button onClick={aplicarFiltros}>
                Aplicar filtros
            </button>

            <ul>
                {words.map(w => (
                    <li key={w.id}>
                        {w.english} - {w.spanish}
                    </li>
                ))}
            </ul>

        </div>
    );
}
