// Lista de cursos de ejemplo
const CURSOS = [
  { id: "anat", nombre: "Anatomía Humana", semestre: 1, prereqs: [] },
  { id: "quim", nombre: "Química Orgánica", semestre: 1, prereqs: [] },
  { id: "cei", nombre: "Cuidados de enfermería I", semestre: 3, prereqs: ["anat", "quim"] },
  { id: "cef", nombre: "Cuidado de la persona y la familia", semestre: 3, prereqs: ["cei"] }
];

// Recuperar estado guardado
let aprobados = JSON.parse(localStorage.getItem("aprobados")) || [];

// Renderizar
function render() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  for (let semestre = 1; semestre <= 3; semestre++) {
    const divSem = document.createElement("div");
    divSem.className = "semestre";
    divSem.innerHTML = `<h2>${semestre}° Semestre</h2>`;

    CURSOS.filter(c => c.semestre === semestre).forEach(curso => {
      const divRamo = document.createElement("div");
      divRamo.className = "ramo";
      divRamo.textContent = curso.nombre;

      const faltan = curso.prereqs.some(pr => !aprobados.includes(pr));
      if (aprobados.includes(curso.id)) {
        divRamo.classList.add("aprobado");
      } else if (faltan) {
        divRamo.classList.add("bloqueado");
      }

      divRamo.addEventListener("click", () => toggleCurso(curso, faltan));
      divSem.appendChild(divRamo);
    });

    app.appendChild(divSem);
  }
}

// Marcar/desmarcar curso
function toggleCurso(curso, bloqueado) {
  if (bloqueado) return;

  if (aprobados.includes(curso.id)) {
    aprobados = aprobados.filter(id => id !== curso.id);
  } else {
    aprobados.push(curso.id);
  }

  localStorage.setItem("aprobados", JSON.stringify(aprobados));
  render();
}

render();
