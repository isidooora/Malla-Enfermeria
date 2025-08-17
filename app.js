 // 1º SEMESTRE (ejemplos)
  { id: "anat", nombre: "Anatomía Humana", semestre: 1, creditos: 10, prereqs: [] },
  { id: "quim", nombre: "Química", semestre: 1, creditos: 10, prereqs: [] },
  { id: "natEnf", nombre: "Naturaleza de la Enfermería", semestre: 1, creditos: 10, prereqs: [] },

  // 2º SEMESTRE (ejemplos)
  { id: "bioq", nombre: "Bioquímica", semestre: 2, creditos: 10, prereqs: ["quim"] },
  { id: "bioest", nombre: "Bioestadística", semestre: 2, creditos: 10, prereqs: [] },
  { id: "saludpub", nombre: "Salud Pública", semestre: 2, creditos: 10, prereqs: [] },

  // 3º SEMESTRE (ejemplos)
  { id: "cei", nombre: "Cuidados de enfermería I", semestre: 3, creditos: 15, prereqs: ["anat", "bioq"] },
  { id: "micro", nombre: "Microbiología e Infectología", semestre: 3, creditos: 10, prereqs: ["bioq"] },
  { id: "fisio", nombre: "Fisiología", semestre: 3, creditos: 10, prereqs: ["bioq"] },

  // 4º SEMESTRE (ejemplos)
  { id: "cef", nombre: "Cuidados de la Persona y la Familia", semestre: 4, creditos: 15, prereqs: ["cei"] },
  { id: "fisiop", nombre: "Fisiopatología", semestre: 4, creditos: 10, prereqs: ["fisio"] },
  { id: "farma", nombre: "Farmacología Clínica", semestre: 4, creditos: 10, prereqs: ["fisio"] },
];

// Estado guardado
let aprobados = JSON.parse(localStorage.getItem("aprobados")) || [];

function groupByYear(cursos) {
  // Año = ceil(semestre / 2)
  const map = new Map();
  cursos.forEach(c => {
    const anio = Math.ceil(c.semestre / 2);
    if (!map.has(anio)) map.set(anio, []);
    map.get(anio).push(c);
  });
  return [...map.entries()].sort((a,b) => a[0] - b[0]);
}

function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const grupos = groupByYear(CURSOS);

  grupos.forEach(([anio, cursosDelAnio]) => {
    // Crear contenedor por año
    const wrap = document.createElement('section');
    wrap.className = 'anio';

    const header = document.createElement('div');
    header.className = 'anio-header';
    header.innerHTML = `<div class="anio-title">${anio === 1 ? 'Primer' : anio === 2 ? 'Segundo' : anio === 3 ? 'Tercer' : anio === 4 ? 'Cuarto' : 'Quinto'} año</div>`;
    wrap.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'semestres';

    // Semestres de ese año (2n-1 y 2n)
    const sem1 = anio * 2 - 1;
    const sem2 = anio * 2;

    [sem1, sem2].forEach(sem => {
      const semBox = document.createElement('div');
      semBox.className = 'semestre';
      semBox.innerHTML = `
        <div class="semestre-head">
          <div class="semestre-num">${sem}</div>
          <div class="semestre-title">Semestre</div>
        </div>
        <div class="cursos"></div>
      `;

      const contCursos = semBox.querySelector('.cursos');
      cursosDelAnio.filter(c => c.semestre === sem).forEach(curso => {
        const card = document.createElement('div');
        card.className = 'ramo';

        const faltan = (curso.prereqs || []).some(pr => !aprobados.includes(pr));
        if (aprobados.includes(curso.id)) {
          card.classList.add('aprobado');
        } else if (faltan) {
          card.classList.add('bloqueado');
        }

        card.innerHTML = `
          <div>
            <h4>${curso.nombre}</h4>
            ${curso.prereqs?.length ? `<div class="sub">Req: ${curso.prereqs.map(id=>id.toUpperCase()).join(', ')}</div>` : ''}
          </div>
          <div class="creditos">${curso.creditos ?? ''}</div>
        `;

        card.addEventListener('click', () => toggleCurso(curso, faltan));
        contCursos.appendChild(card);
      });

      grid.appendChild(semBox);
    });

    wrap.appendChild(grid);
    app.appendChild(wrap);
  });
}

function toggleCurso(curso, bloqueado) {
  if (bloqueado) return;
  if (aprobados.includes(curso.id)) {
    aprobados = aprobados.filter(id => id !== curso.id);
  } else {
    aprobados.push(curso.id);
  }
  localStorage.setItem('aprobados', JSON.stringify(aprobados));
  render();
}

// Botón reset
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-reset').addEventListener('click', () => {
    if (confirm('¿Borrar el estado de ramos aprobados?')) {
      aprobados = [];
      localStorage.removeItem('aprobados');
      render();
    }
  });
  render();
});
