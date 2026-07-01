// Mallas editables en JavaScript.
// El administrador de mallas carga estos datos y guarda cambios locales en el navegador.
window.MALLAS = [
  {
    id: 'informatica',
    nombre: 'Informática',
    descripcion: '',
    courses: [
    {
        "codigo":  "GEN101",
        "nombre":  "Habilidades de Aprendizaje",
        "semestre":  1,
        "creditos":  4,
        "area":  "Formación general",
        "periodicidad":  "Ambos",
        "prerequisitos":  [

                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "TEC101",
        "nombre":  "Fundamentos de Programación",
        "semestre":  1,
        "creditos":  6,
        "area":  "Tecnología",
        "periodicidad":  "Ambos",
        "prerequisitos":  [

                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "MAT101",
        "nombre":  "Matemática Aplicada I",
        "semestre":  1,
        "creditos":  6,
        "area":  "Matemática",
        "periodicidad":  "Ambos",
        "prerequisitos":  [

                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "SIS101",
        "nombre":  "Sistemas Computacionales",
        "semestre":  1,
        "creditos":  5,
        "area":  "Sistemas",
        "periodicidad":  "Ambos",
        "prerequisitos":  [

                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "GES101",
        "nombre":  "Fundamentos de Gestión",
        "semestre":  1,
        "creditos":  5,
        "area":  "Gestión",
        "periodicidad":  "Ambos",
        "prerequisitos":  [

                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "GEN201",
        "nombre":  "Comunicación Profesional",
        "semestre":  2,
        "creditos":  4,
        "area":  "Formación general",
        "periodicidad":  "Ambos",
        "prerequisitos":  [
                              "GEN101"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "TEC201",
        "nombre":  "Programación y Datos",
        "semestre":  2,
        "creditos":  6,
        "area":  "Tecnología",
        "periodicidad":  "Ambos",
        "prerequisitos":  [
                              "TEC101"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "MAT201",
        "nombre":  "Cálculo Aplicado",
        "semestre":  2,
        "creditos":  6,
        "area":  "Matemática",
        "periodicidad":  "Primer semestre",
        "prerequisitos":  [
                              "MAT101"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "SIS201",
        "nombre":  "Arquitectura de Sistemas",
        "semestre":  2,
        "creditos":  5,
        "area":  "Sistemas",
        "periodicidad":  "Segundo semestre",
        "prerequisitos":  [
                              "SIS101"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "GES201",
        "nombre":  "Gestión Estratégica",
        "semestre":  2,
        "creditos":  5,
        "area":  "Gestión",
        "periodicidad":  "Ambos",
        "prerequisitos":  [
                              "GES101"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "GEN301",
        "nombre":  "Pensamiento Estratégico",
        "semestre":  3,
        "creditos":  4,
        "area":  "Formación general",
        "periodicidad":  "Ambos",
        "prerequisitos":  [
                              "GEN201"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "TEC301",
        "nombre":  "Desarrollo de Aplicaciones",
        "semestre":  3,
        "creditos":  6,
        "area":  "Tecnología",
        "periodicidad":  "Ambos",
        "prerequisitos":  [
                              "TEC201"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "DAT301",
        "nombre":  "Bases de Datos I",
        "semestre":  3,
        "creditos":  6,
        "area":  "Datos",
        "periodicidad":  "Ambos",
        "prerequisitos":  [
                              "TEC201"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "RED301",
        "nombre":  "Redes y Seguridad",
        "semestre":  3,
        "creditos":  5,
        "area":  "Infraestructura",
        "periodicidad":  "Segundo semestre",
        "prerequisitos":  [
                              "SIS201"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "GES301",
        "nombre":  "Costos y Evaluación de Proyectos",
        "semestre":  3,
        "creditos":  5,
        "area":  "Gestión",
        "periodicidad":  "Primer semestre",
        "prerequisitos":  [
                              "GES201"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "TEC401",
        "nombre":  "Aplicaciones Móviles",
        "semestre":  4,
        "creditos":  6,
        "area":  "Tecnología",
        "periodicidad":  "Primer semestre",
        "prerequisitos":  [
                              "TEC301"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "DAT401",
        "nombre":  "Bases de Datos II",
        "semestre":  4,
        "creditos":  6,
        "area":  "Datos",
        "periodicidad":  "Segundo semestre",
        "prerequisitos":  [
                              "DAT301"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "SW401",
        "nombre":  "Ingeniería de Software",
        "semestre":  4,
        "creditos":  6,
        "area":  "Software",
        "periodicidad":  "Ambos",
        "prerequisitos":  [
                              "TEC301",
                              "DAT301"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "ANA401",
        "nombre":  "Análisis de Datos",
        "semestre":  4,
        "creditos":  6,
        "area":  "Datos",
        "periodicidad":  "Ambos",
        "prerequisitos":  [
                              "DAT301",
                              "MAT201"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "INT401",
        "nombre":  "Proyecto Integrador Técnico",
        "semestre":  4,
        "creditos":  8,
        "area":  "Proyecto",
        "periodicidad":  "Segundo semestre",
        "prerequisitos":  [
                              "TEC301",
                              "DAT301",
                              "GES301"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "GEN501",
        "nombre":  "Liderazgo y Trabajo en Equipo",
        "semestre":  5,
        "creditos":  4,
        "area":  "Formación general",
        "periodicidad":  "Ambos",
        "prerequisitos":  [
                              "GEN301"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "IA501",
        "nombre":  "Inteligencia Artificial Aplicada",
        "semestre":  5,
        "creditos":  6,
        "area":  "Datos",
        "periodicidad":  "Primer semestre",
        "prerequisitos":  [
                              "ANA401"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "SW501",
        "nombre":  "Arquitectura de Software",
        "semestre":  5,
        "creditos":  6,
        "area":  "Software",
        "periodicidad":  "Segundo semestre",
        "prerequisitos":  [
                              "SW401"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "SEG501",
        "nombre":  "Seguridad de la Información",
        "semestre":  5,
        "creditos":  6,
        "area":  "Seguridad",
        "periodicidad":  "Ambos",
        "prerequisitos":  [
                              "RED301"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "AGI501",
        "nombre":  "Metodologías Ágiles",
        "semestre":  5,
        "creditos":  5,
        "area":  "Proyecto",
        "periodicidad":  "Ambos",
        "prerequisitos":  [
                              "SW401"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "DAT601",
        "nombre":  "Inteligencia de Negocios",
        "semestre":  6,
        "creditos":  6,
        "area":  "Datos",
        "periodicidad":  "Ambos",
        "prerequisitos":  [
                              "ANA401",
                              "DAT401"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "SIM601",
        "nombre":  "Simulación para Decisiones",
        "semestre":  6,
        "creditos":  6,
        "area":  "Datos",
        "periodicidad":  "Segundo semestre",
        "prerequisitos":  [
                              "ANA401",
                              "MAT201"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "PRO601",
        "nombre":  "Gestión de Proyectos Tecnológicos",
        "semestre":  6,
        "creditos":  6,
        "area":  "Proyecto",
        "periodicidad":  "Ambos",
        "prerequisitos":  [
                              "AGI501",
                              "GES301"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "EMP601",
        "nombre":  "Innovación y Emprendimiento",
        "semestre":  6,
        "creditos":  5,
        "area":  "Gestión",
        "periodicidad":  "Primer semestre",
        "prerequisitos":  [
                              "GES301"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "INT601",
        "nombre":  "Proyecto Integrador Profesional",
        "semestre":  6,
        "creditos":  8,
        "area":  "Proyecto",
        "periodicidad":  "Segundo semestre",
        "prerequisitos":  [
                              "SW501",
                              "DAT601",
                              "PRO601"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "ELE701",
        "nombre":  "Electivo Disciplinar I",
        "semestre":  7,
        "creditos":  5,
        "area":  "Electivo",
        "periodicidad":  "Ambos",
        "prerequisitos":  [
                              "INT401"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "ELE702",
        "nombre":  "Electivo Disciplinar II",
        "semestre":  7,
        "creditos":  5,
        "area":  "Electivo",
        "periodicidad":  "Ambos",
        "prerequisitos":  [
                              "INT401"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "DIR701",
        "nombre":  "Habilidades Directivas",
        "semestre":  7,
        "creditos":  5,
        "area":  "Gestión",
        "periodicidad":  "Ambos",
        "prerequisitos":  [
                              "GEN501"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "TIC701",
        "nombre":  "Soluciones Tecnológicas Empresariales",
        "semestre":  7,
        "creditos":  6,
        "area":  "Tecnología",
        "periodicidad":  "Primer semestre",
        "prerequisitos":  [
                              "PRO601",
                              "DAT601"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "PRA701",
        "nombre":  "Práctica Profesional",
        "semestre":  7,
        "creditos":  8,
        "area":  "Práctica",
        "periodicidad":  "Ambos",
        "prerequisitos":  [
                              "INT601"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "TIT801",
        "nombre":  "Proyecto de Título",
        "semestre":  8,
        "creditos":  10,
        "area":  "Proyecto",
        "periodicidad":  "Ambos",
        "prerequisitos":  [
                              "INT601",
                              "TIC701"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "ELE801",
        "nombre":  "Electivo Disciplinar III",
        "semestre":  8,
        "creditos":  5,
        "area":  "Electivo",
        "periodicidad":  "Ambos",
        "prerequisitos":  [
                              "ELE701"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "EST801",
        "nombre":  "Planificación Estratégica Digital",
        "semestre":  8,
        "creditos":  5,
        "area":  "Gestión",
        "periodicidad":  "Segundo semestre",
        "prerequisitos":  [
                              "DIR701",
                              "TIC701"
                          ],
        "estadoInicial":  "pendiente"
    },
    {
        "codigo":  "GRC801",
        "nombre":  "Gestión de Recursos Tecnológicos",
        "semestre":  8,
        "creditos":  5,
        "area":  "Gestión",
        "periodicidad":  "Ambos",
        "prerequisitos":  [
                              "DIR701",
                              "PRO601"
                          ],
        "estadoInicial":  "pendiente"
    }
    ]
  }
];
