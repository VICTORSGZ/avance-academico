(() => {
  const STORAGE_KEY = 'avanceAcademico.mallas.v1';
  const SELECTED_KEY = 'avanceAcademico.selectedMalla.v1';
  const THEME_KEY = 'avanceAcademico.theme.v1';
  const WINDOW_STATE_KEY = 'avanceAcademicoState';
  const STATE_HASH_KEY = 'mallas';
  const THEME_HASH_KEY = 'theme';

  const state = {
    mallas: loadMallas(),
    currentMallaId: null,
    courses: [],
    selectedCode: null,
    hoveredCode: null,
    editingCode: null,
    filters: {
      text: '',
      status: 'todos',
      semester: 'todos'
    }
  };

  const grid = document.getElementById('mallaGrid');
  const selectedInfo = document.getElementById('selectedInfo');
  const filterText = document.getElementById('filterText');
  const filterStatus = document.getElementById('filterStatus');
  const filterSemester = document.getElementById('filterSemester');
  const btnClearFilters = document.getElementById('btnClearFilters');
  const mallaSelect = document.getElementById('mallaSelect');
  const currentMallaName = document.getElementById('currentMallaName');
  const currentMallaMeta = document.getElementById('currentMallaMeta');
  const saveStatus = document.getElementById('saveStatus');
  const themeSelect = document.getElementById('themeSelect');
  const btnNewMalla = document.getElementById('btnNewMalla');
  const btnDuplicateMalla = document.getElementById('btnDuplicateMalla');
  const btnDeleteMalla = document.getElementById('btnDeleteMalla');
  const btnExportBackup = document.getElementById('btnExportBackup');
  const btnImportBackup = document.getElementById('btnImportBackup');
  const backupFileInput = document.getElementById('backupFileInput');
  const mallaForm = document.getElementById('mallaForm');
  const courseForm = document.getElementById('courseForm');
  const courseList = document.getElementById('courseList');
  const prereqPicker = document.getElementById('coursePrereqs');
  const btnCancelCourse = document.getElementById('btnCancelCourse');
  const courseSubmitText = document.getElementById('courseSubmitText');

  document.addEventListener('DOMContentLoaded', () => {
    state.currentMallaId = pickInitialMalla();
    setCurrentMalla(state.currentMallaId);
    bindMenu();
    bindFilters();
    bindMallaControls();
    bindMaintainer();
    bindStorageSync();
    bindTheme();
    bindBackupControls();
    renderAll();
  });

  function loadMallas() {
    const hashMallas = importHashState();
    const fileMallas = getFileMallas();
    const storedMallas = hashMallas || readStoredMallas();

    if (storedMallas) {
      const merged = mergeMallas(fileMallas, storedMallas);
      writeStoredState(merged, getStoredSelectedId());
      return merged;
    }

    return fileMallas;
  }

  function getFileMallas() {
    if (Array.isArray(window.MALLAS) && window.MALLAS.length) {
      return window.MALLAS.map(normalizeMalla).filter(malla => malla.id && malla.nombre);
    }

    return [{
      id: 'informatica',
      nombre: 'Informática',
      descripcion: '',
      courses: []
    }];
  }

  function mergeMallas(fileMallas, storedMallas) {
    const merged = [...fileMallas];

    storedMallas.forEach(stored => {
      const fileMalla = findMatchingFileMalla(fileMallas, stored);

      if (fileMalla) {
        upsertMalla(merged, {
          ...stored,
          id: fileMalla.id,
          nombre: fileMalla.nombre
        });
        return;
      }

      upsertMalla(merged, stored);
    });

    return merged;
  }

  function findMatchingFileMalla(fileMallas, malla) {
    return fileMallas.find(fileMalla => {
      const fileKey = normalizeKey(fileMalla.nombre);
      const mallaKey = normalizeKey(malla.nombre);
      return fileMalla.id === malla.id
        || malla.id === `${fileMalla.id}-avance`
        || malla.id === `${fileMalla.id}-guardada`
        || fileKey === mallaKey
        || mallaKey === normalizeKey(`${fileMalla.nombre} con avance`)
        || mallaKey === normalizeKey(`${fileMalla.nombre} guardada`)
        || mallaKey.replace(/\s+guardada/g, '') === fileKey;
    });
  }

  function upsertMalla(mallas, nextMalla) {
    const index = mallas.findIndex(malla =>
      malla.id === nextMalla.id || normalizeKey(malla.nombre) === normalizeKey(nextMalla.nombre)
    );

    if (index >= 0) mallas[index] = nextMalla;
    else mallas.push(nextMalla);
  }

  function readStoredMallas() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!Array.isArray(parsed) || !parsed.length) return readWindowState()?.mallas || null;

      const mallas = parsed.map(normalizeMalla).filter(malla => malla.id && malla.nombre);
      return mallas.length ? mallas : (readWindowState()?.mallas || null);
    } catch (error) {
      console.warn('No se pudo leer localStorage del administrador de mallas.', error);
      return readWindowState()?.mallas || null;
    }
  }

  function normalizeMalla(item) {
    return {
      id: String(item.id || makeId()),
      nombre: String(item.nombre || 'Malla sin nombre').trim(),
      descripcion: normalizeDescription(item.descripcion),
      courses: normalizeCourses(item.courses || item.ramos || [])
    };
  }

  function normalizeCourses(items) {
    return items.map(item => ({
      codigo: String(item.codigo || '').trim(),
      nombre: String(item.nombre || '').trim(),
      semestre: Math.max(1, Number(item.semestre || 1)),
      creditos: Math.max(0, Number(item.creditos || 0)),
      area: String(item.area || 'General').trim(),
      periodicidad: String(item.periodicidad || 'Ambos').trim(),
      prerequisitos: Array.isArray(item.prerequisitos)
        ? item.prerequisitos.map(x => String(x).trim()).filter(Boolean)
        : String(item.prerequisitos || '').split(',').map(x => x.trim()).filter(Boolean),
      estadoInicial: normalizeBaseStatus(item.estadoInicial || item.estado || 'pendiente')
    })).filter(item => item.codigo && item.nombre);
  }

  function normalizeBaseStatus(value) {
    const text = String(value || '').trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (['aprobado', 'aprobada', 'completado', 'completada', 'finalizado', 'finalizada'].includes(text)) return 'aprobado';
    if (['inscrito', 'inscrita', 'cursando', 'en curso', 'curso'].includes(text)) return 'inscrito';
    return 'pendiente';
  }

  function pickInitialMalla() {
    const savedId = getStoredSelectedId();
    return state.mallas.some(malla => malla.id === savedId)
      ? savedId
      : state.mallas[0]?.id;
  }

  function setCurrentMalla(id) {
    const malla = state.mallas.find(item => item.id === id) || state.mallas[0];
    state.currentMallaId = malla.id;
    state.courses = malla.courses;
    state.selectedCode = null;
    state.hoveredCode = null;
    state.editingCode = null;
    saveSelectedMalla(malla.id);
  }

  function currentMalla() {
    return state.mallas.find(malla => malla.id === state.currentMallaId);
  }

  function saveMallas() {
    updateSaveStatus('Guardando...');
    state.mallas = mergeMallas(getFileMallas(), state.mallas);
    writeStoredState(state.mallas, state.currentMallaId);
    updateSaveStatus('Guardado');
  }

  function writeStoredState(mallas, selectedId) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mallas));
      if (selectedId) localStorage.setItem(SELECTED_KEY, selectedId);
    } catch (error) {
      console.warn('No se pudo guardar localStorage del administrador de mallas.', error);
    }

    writeWindowState(mallas, selectedId);
  }

  function updateSaveStatus(message) {
    if (!saveStatus) return;
    saveStatus.textContent = message;
    saveStatus.classList.toggle('is-saved', message === 'Guardado' || message === 'Respaldo importado');

    if (message === 'Guardado' || message === 'Respaldo importado') {
      window.clearTimeout(updateSaveStatus.timer);
      updateSaveStatus.timer = window.setTimeout(() => {
        saveStatus.textContent = 'Guardado automático en este navegador';
        saveStatus.classList.remove('is-saved');
      }, 1800);
    }
  }

  function bindMenu() {
    document.querySelectorAll('.menu-btn[data-target]').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.menu-btn[data-target]').forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        const target = document.getElementById(button.dataset.target);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target?.classList.add('pulse');
        setTimeout(() => target?.classList.remove('pulse'), 750);
      });
    });

    document.getElementById('btnReset')?.addEventListener('click', () => {
      const confirmed = confirm('Limpiar el avance de la malla actual? Los ramos volverán a pendiente.');
      if (!confirmed) return;
      state.courses.forEach(c => c.estadoInicial = 'pendiente');
      state.selectedCode = null;
      state.hoveredCode = null;
      saveMallas();
      renderMalla();
      renderCourseList();
      updateSummary();
      if (selectedInfo) selectedInfo.textContent = 'Selecciona un ramo para ver sus relaciones.';
    });
  }

  function bindFilters() {
    filterText?.addEventListener('input', () => {
      state.filters.text = filterText.value.trim().toLowerCase();
      renderMalla();
    });

    filterStatus?.addEventListener('change', () => {
      state.filters.status = filterStatus.value;
      renderMalla();
    });

    filterSemester?.addEventListener('change', () => {
      state.filters.semester = filterSemester.value;
      renderMalla();
    });

    btnClearFilters?.addEventListener('click', () => {
      state.filters = { text: '', status: 'todos', semester: 'todos' };
      if (filterText) filterText.value = '';
      if (filterStatus) filterStatus.value = 'todos';
      if (filterSemester) filterSemester.value = 'todos';
      renderMalla();
    });
  }

  function bindMallaControls() {
    mallaSelect?.addEventListener('change', () => {
      setCurrentMalla(mallaSelect.value);
      renderAll();
    });

    btnNewMalla?.addEventListener('click', () => {
      const malla = { id: makeId(), nombre: 'Nueva malla', descripcion: '', courses: [] };
      state.mallas.push(malla);
      setCurrentMalla(malla.id);
      saveMallas();
      renderAll();
      document.getElementById('mallaName')?.focus();
    });

    btnDuplicateMalla?.addEventListener('click', () => {
      const source = currentMalla();
      if (!source) return;
      const copy = {
        id: makeId(),
        nombre: `${source.nombre} copia`,
        descripcion: source.descripcion,
        courses: normalizeCourses(JSON.parse(JSON.stringify(source.courses)))
      };
      state.mallas.push(copy);
      setCurrentMalla(copy.id);
      saveMallas();
      renderAll();
    });

    btnDeleteMalla?.addEventListener('click', () => {
      const malla = currentMalla();
      if (!malla || state.mallas.length === 1) return;
      const confirmed = confirm(`Eliminar "${malla.nombre}" y todos sus ramos?`);
      if (!confirmed) return;
      state.mallas = state.mallas.filter(item => item.id !== malla.id);
      setCurrentMalla(state.mallas[0].id);
      saveMallas();
      renderAll();
    });

  }

  function bindMaintainer() {
    mallaForm?.addEventListener('submit', event => {
      event.preventDefault();
      const malla = currentMalla();
      if (!malla) return;
      malla.nombre = getFieldValue('mallaName') || 'Malla sin nombre';
      malla.descripcion = '';
      saveMallas();
      renderMallaSelector();
      renderMallaHeader();
    });

    courseForm?.addEventListener('submit', event => {
      event.preventDefault();
      saveCourseFromForm();
    });

    btnCancelCourse?.addEventListener('click', resetCourseForm);

    courseList?.addEventListener('click', event => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      const code = button.dataset.code;
      if (button.dataset.action === 'edit') editCourse(code);
      if (button.dataset.action === 'delete') deleteCourse(code);
    });
  }

  function bindStorageSync() {
    document.querySelectorAll('a[href]').forEach(link => {
      link.addEventListener('click', () => {
        writeStoredState(state.mallas, state.currentMallaId);
        attachStateToLink(link);
      });
    });

    window.addEventListener('pageshow', refreshStoredMallas);
    window.addEventListener('focus', refreshStoredMallas);
    window.addEventListener('storage', event => {
      if (!event.key || event.key === STORAGE_KEY || event.key === SELECTED_KEY) {
        refreshStoredMallas();
      }
    });
  }

  function bindTheme() {
    const savedTheme = getStoredTheme();
    applyTheme(savedTheme);
    if (themeSelect) themeSelect.value = savedTheme;

    themeSelect?.addEventListener('change', () => {
      applyTheme(themeSelect.value);
      saveThemePreference(themeSelect.value);
    });
  }

  function getStoredTheme() {
    try {
      const hashTheme = new URLSearchParams(window.location.hash.slice(1)).get(THEME_HASH_KEY);
      const stored = hashTheme || localStorage.getItem(THEME_KEY) || sessionStorage.getItem(THEME_KEY) || readWindowState()?.theme;
      return stored === 'dark' ? 'dark' : 'light';
    } catch (error) {
      return readWindowState()?.theme === 'dark' ? 'dark' : 'light';
    }
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light';
  }

  function saveThemePreference(theme) {
    const normalizedTheme = theme === 'dark' ? 'dark' : 'light';
    try {
      localStorage.setItem(THEME_KEY, normalizedTheme);
      sessionStorage.setItem(THEME_KEY, normalizedTheme);
    } catch (error) {
      console.warn('No se pudo guardar el tema.', error);
    }

    writeWindowState(state.mallas, state.currentMallaId, normalizedTheme);
  }

  function bindBackupControls() {
    btnExportBackup?.addEventListener('click', exportBackup);
    btnImportBackup?.addEventListener('click', () => backupFileInput?.click());
    backupFileInput?.addEventListener('change', importBackup);
  }

  function exportBackup() {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      selectedId: state.currentMallaId,
      theme: getCurrentTheme(),
      mallas: state.mallas
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `avance-academico-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function importBackup(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result || ''));
        const importedItems = Array.isArray(payload) ? payload : payload.mallas;
        if (!Array.isArray(importedItems) || !importedItems.length) {
          alert('El archivo no contiene mallas válidas.');
          return;
        }

        const importedMallas = importedItems.map(normalizeMalla).filter(malla => malla.id && malla.nombre);
        if (!importedMallas.length) {
          alert('El archivo no contiene mallas válidas.');
          return;
        }

        state.mallas = mergeMallas(getFileMallas(), importedMallas);
        const selectedId = state.mallas.some(malla => malla.id === payload.selectedId)
          ? payload.selectedId
          : state.mallas[0].id;

        if (payload.theme) {
          applyTheme(payload.theme);
          if (themeSelect) themeSelect.value = getCurrentTheme();
          saveThemePreference(getCurrentTheme());
        }

        setCurrentMalla(selectedId);
        saveMallas();
        renderAll();
        updateSaveStatus('Respaldo importado');
      } catch (error) {
        alert('No se pudo importar el respaldo. Revisa que sea un archivo JSON válido.');
      } finally {
        backupFileInput.value = '';
      }
    };
    reader.readAsText(file);
  }

  function refreshStoredMallas() {
    const storedMallas = readStoredMallas() || readWindowState()?.mallas || [];
    const latestMallas = mergeMallas(getFileMallas(), storedMallas);
    if (!latestMallas.length) return;

    const currentSnapshot = JSON.stringify(state.mallas);
    const latestSnapshot = JSON.stringify(latestMallas);
    if (currentSnapshot === latestSnapshot) return;

    const selectedId = getStoredSelectedId();
    const targetId = latestMallas.some(malla => malla.id === selectedId)
      ? selectedId
      : (latestMallas.some(malla => malla.id === state.currentMallaId) ? state.currentMallaId : latestMallas[0].id);

    state.mallas = latestMallas;
    setCurrentMalla(targetId);
    renderAll();
  }

  function saveCourseFromForm() {
    const codigo = getFieldValue('courseCode').toUpperCase();
    const nombre = getFieldValue('courseName');
    if (!codigo || !nombre) return;

    const existing = state.courses.find(course => course.codigo === codigo);
    if (existing && existing.codigo !== state.editingCode) {
      alert('Ya existe un ramo con ese codigo en esta malla.');
      return;
    }

    const course = {
      codigo,
      nombre,
      semestre: Math.max(1, Number(getFieldValue('courseSemester') || 1)),
      creditos: Math.max(0, Number(getFieldValue('courseCredits') || 0)),
      area: getFieldValue('courseArea') || 'General',
      periodicidad: getFieldValue('coursePeriod') || 'Ambos',
      prerequisitos: getSelectedPrereqs(),
      estadoInicial: getFieldValue('courseStatus') || 'pendiente'
    };

    if (course.prerequisitos.includes(course.codigo)) {
      alert('Un ramo no puede ser prerrequisito de sí mismo.');
      return;
    }

    const validationCourses = buildCoursesForValidation(course);
    const cycle = findPrereqCycle(validationCourses);
    if (cycle.length) {
      alert(`No se puede guardar porque se genera un prerrequisito circular: ${cycle.join(' → ')}`);
      return;
    }

    if (state.editingCode) {
      state.courses.forEach(item => {
        item.prerequisitos = item.prerequisitos.map(code => code === state.editingCode ? course.codigo : code);
      });
      const index = state.courses.findIndex(item => item.codigo === state.editingCode);
      if (index >= 0) state.courses[index] = course;
    } else {
      state.courses.push(course);
    }

    state.courses.sort((a, b) => a.semestre - b.semestre || a.codigo.localeCompare(b.codigo));
    saveMallas();
    resetCourseForm();
    renderAll();
  }

  function buildCoursesForValidation(course) {
    const nextCourses = state.courses.map(item => {
      const clone = {
        ...item,
        prerequisitos: item.prerequisitos.map(code => code === state.editingCode ? course.codigo : code)
      };

      return clone.codigo === state.editingCode ? course : clone;
    });

    if (!state.editingCode) nextCourses.push(course);
    return nextCourses;
  }

  function findPrereqCycle(courses) {
    const courseMap = new Map(courses.map(course => [course.codigo, course]));
    const visited = new Set();
    const visiting = new Set();
    const stack = [];

    function visit(code) {
      if (visiting.has(code)) {
        const cycleStart = stack.indexOf(code);
        return [...stack.slice(cycleStart), code];
      }
      if (visited.has(code)) return [];

      visiting.add(code);
      stack.push(code);

      const course = courseMap.get(code);
      const prereqs = course?.prerequisitos || [];
      for (const prereq of prereqs) {
        if (!courseMap.has(prereq)) continue;
        const cycle = visit(prereq);
        if (cycle.length) return cycle;
      }

      stack.pop();
      visiting.delete(code);
      visited.add(code);
      return [];
    }

    for (const course of courses) {
      const cycle = visit(course.codigo);
      if (cycle.length) return cycle;
    }

    return [];
  }

  function editCourse(code) {
    const course = courseByCode(code);
    if (!course) return;
    state.editingCode = course.codigo;
    setFieldValue('courseCode', course.codigo);
    setFieldValue('courseName', course.nombre);
    setFieldValue('courseSemester', course.semestre);
    setFieldValue('courseCredits', course.creditos);
    setFieldValue('courseArea', course.area);
    setFieldValue('coursePeriod', course.periodicidad);
    setFieldValue('courseStatus', course.estadoInicial);
    if (courseSubmitText) courseSubmitText.textContent = 'Guardar cambios';
    btnCancelCourse?.removeAttribute('hidden');
    renderPrereqOptions();
    setSelectedPrereqs(course.prerequisitos);
    document.getElementById('courseCode')?.focus();
  }

  function deleteCourse(code) {
    const course = courseByCode(code);
    if (!course) return;
    const confirmed = confirm(`Eliminar el ramo ${course.codigo}?`);
    if (!confirmed) return;
    state.courses = state.courses.filter(item => item.codigo !== code);
    currentMalla().courses = state.courses;
    state.courses.forEach(item => {
      item.prerequisitos = item.prerequisitos.filter(prereq => prereq !== code);
    });
    if (state.selectedCode === code) state.selectedCode = null;
    saveMallas();
    resetCourseForm();
    renderAll();
  }

  function resetCourseForm() {
    state.editingCode = null;
    courseForm?.reset();
    setFieldValue('courseSemester', 1);
    setFieldValue('courseCredits', 0);
    setFieldValue('coursePeriod', 'Ambos');
    setFieldValue('courseStatus', 'pendiente');
    if (courseSubmitText) courseSubmitText.textContent = 'Agregar ramo';
    btnCancelCourse?.setAttribute('hidden', '');
    renderPrereqOptions();
  }

  function renderAll() {
    renderMallaSelector();
    renderMallaHeader();
    renderMallaForm();
    renderPrereqOptions();

    if (!state.courses.length) {
      populateSemesterFilter();
      if (grid) grid.innerHTML = '<div class="empty">Esta malla no tiene ramos. Agrega el primero desde Administrar mallas.</div>';
      renderCourseList();
      updateSummary();
      return;
    }

    populateSemesterFilter();
    renderMalla();
    renderCourseList();
    updateSummary();
  }

  function renderMallaSelector() {
    if (!mallaSelect) return;
    mallaSelect.innerHTML = '';
    state.mallas.forEach(malla => {
      const option = document.createElement('option');
      option.value = malla.id;
      option.textContent = malla.nombre;
      mallaSelect.appendChild(option);
    });
    mallaSelect.value = state.currentMallaId;
  }

  function renderMallaHeader() {
    const malla = currentMalla();
    if (!malla) return;
    const credits = state.courses.reduce((sum, course) => sum + course.creditos, 0);
    const description = normalizeDescription(malla.descripcion);
    if (currentMallaName) currentMallaName.textContent = malla.nombre;
    if (currentMallaMeta) {
      currentMallaMeta.textContent = `${state.courses.length} ramos · ${credits} creditos${description ? ` · ${description}` : ''}`;
    }
    if (btnDeleteMalla) btnDeleteMalla.disabled = state.mallas.length === 1;
  }

  function renderMallaForm() {
    const malla = currentMalla();
    if (!malla) return;
    setFieldValue('mallaName', malla.nombre);
  }

  function renderPrereqOptions() {
    if (!prereqPicker) return;
    const selected = new Set(getSelectedPrereqs());
    const availableCourses = state.courses.filter(course => course.codigo !== state.editingCode);

    if (!availableCourses.length) {
      prereqPicker.innerHTML = '<span class="empty-inline">Sin ramos disponibles</span>';
      return;
    }

    const semesters = [...new Set(availableCourses.map(course => course.semestre))]
      .sort((a, b) => a - b);

    prereqPicker.innerHTML = semesters.map(semester => {
      const courses = availableCourses.filter(course => course.semestre === semester);

      return `
        <section class="prereq-group">
          <h5>Semestre ${semester}</h5>
          <div class="prereq-group-list">
            ${courses.map(course => `
              <label class="prereq-option">
                <input type="checkbox" value="${escapeHtml(course.codigo)}" ${selected.has(course.codigo) ? 'checked' : ''}>
                <span>
                  <strong>${escapeHtml(course.codigo)}</strong>
                  ${escapeHtml(course.nombre)}
                </span>
              </label>
            `).join('')}
          </div>
        </section>
      `;
    }).join('');
  }

  function renderCourseList() {
    if (!courseList) return;
    if (!state.courses.length) {
      courseList.innerHTML = '<div class="empty compact">Sin ramos creados.</div>';
      return;
    }

    const semesters = [...new Set(state.courses.map(course => course.semestre))]
      .sort((a, b) => a - b);

    courseList.innerHTML = semesters.map(semester => {
      const courses = state.courses.filter(course => course.semestre === semester);

      return `
        <section class="course-semester-group">
          <h4>Semestre ${semester}</h4>
          <div class="course-semester-list">
            ${courses.map(course => `
              <article class="course-row">
                <div>
                  <strong>${escapeHtml(course.codigo)}</strong>
                  <span>${escapeHtml(course.nombre)}</span>
                  <small>${course.creditos} cr. · ${escapeHtml(course.area)}</small>
                  <small>${course.prerequisitos.length ? `Prerrequisitos: ${escapeHtml(course.prerequisitos.join(', '))}` : 'Sin prerrequisitos'}</small>
                </div>
                <div class="row-actions">
                  <button type="button" data-action="edit" data-code="${escapeHtml(course.codigo)}">Editar</button>
                  <button type="button" class="danger" data-action="delete" data-code="${escapeHtml(course.codigo)}">Eliminar</button>
                </div>
              </article>
            `).join('')}
          </div>
        </section>
      `;
    }).join('');
  }

  function populateSemesterFilter() {
    if (!filterSemester) return;
    const maxSemester = Math.max(1, ...state.courses.map(c => c.semestre));
    const current = filterSemester.value || 'todos';
    filterSemester.innerHTML = '<option value="todos">Todos</option>';

    for (let semester = 1; semester <= maxSemester; semester++) {
      const option = document.createElement('option');
      option.value = String(semester);
      option.textContent = `Semestre ${semester}`;
      filterSemester.appendChild(option);
    }

    filterSemester.value = [...filterSemester.options].some(option => option.value === current) ? current : 'todos';
    state.filters.semester = filterSemester.value;
  }

  function courseByCode(code) {
    return state.courses.find(c => c.codigo === code);
  }

  function approvedCodes() {
    return new Set(state.courses.filter(c => c.estadoInicial === 'aprobado').map(c => c.codigo));
  }

  function isAvailable(course) {
    if (course.estadoInicial === 'aprobado' || course.estadoInicial === 'inscrito') return false;
    const approved = approvedCodes();
    return course.prerequisitos.every(code => approved.has(code));
  }

  function visualStatus(course) {
    if (course.estadoInicial === 'aprobado') return 'approved';
    if (course.estadoInicial === 'inscrito') return 'enrolled';
    return isAvailable(course) ? 'available' : 'blocked';
  }

  function statusText(course) {
    const status = visualStatus(course);
    return {
      approved: 'Aprobado',
      enrolled: 'Inscrito',
      available: 'Disponible para tomar',
      blocked: 'Bloqueado por prerrequisitos'
    }[status] || 'Sin estado';
  }

  function renderMalla() {
    if (!grid) return;
    const maxSemester = Math.max(1, ...state.courses.map(c => c.semestre));
    grid.innerHTML = '';

    for (let semester = 1; semester <= maxSemester; semester++) {
      if (state.filters.semester !== 'todos' && Number(state.filters.semester) !== semester) continue;

      const courses = state.courses
        .filter(c => c.semestre === semester)
        .filter(matchesFilters);

      if (!courses.length && hasActiveFilters()) continue;

      const column = document.createElement('div');
      column.className = 'semester';
      column.innerHTML = `<h3>Semestre ${semester}</h3>`;

      courses.forEach(course => column.appendChild(createCourseCard(course)));
      grid.appendChild(column);
    }

    if (!grid.children.length) {
      grid.innerHTML = '<div class="empty">No hay ramos que coincidan con los filtros seleccionados.</div>';
    }

    applyHighlights();
  }

  function hasActiveFilters() {
    return state.filters.text || state.filters.status !== 'todos' || state.filters.semester !== 'todos';
  }

  function matchesFilters(course) {
    const text = `${course.codigo} ${course.nombre} ${course.area} ${course.periodicidad}`.toLowerCase();
    const status = visualStatus(course);

    if (state.filters.text && !text.includes(state.filters.text)) return false;
    if (state.filters.status !== 'todos' && status !== state.filters.status) return false;
    return true;
  }

  function createCourseCard(course) {
    const card = document.createElement('article');
    card.className = `course ${visualStatus(course)}`;
    card.dataset.code = course.codigo;
    card.title = tooltip(course);

    card.innerHTML = `
      <span class="course-code">${escapeHtml(course.codigo)}</span>
      <span class="course-name">${escapeHtml(course.nombre)}</span>
      <div class="course-meta">
        <span class="badge status-badge">${escapeHtml(statusText(course))}</span>
        <span class="badge">${course.creditos} cr.</span>
        <span class="badge">${escapeHtml(shortPeriod(course.periodicidad))}</span>
      </div>
    `;

    card.addEventListener('click', () => handleCourseClick(course));
    card.addEventListener('mouseenter', () => {
      state.hoveredCode = course.codigo;
      applyHighlights();
    });
    card.addEventListener('mouseleave', () => {
      state.hoveredCode = null;
      applyHighlights();
    });

    return card;
  }

  function handleCourseClick(course) {
    state.selectedCode = course.codigo;

    if (course.estadoInicial === 'aprobado') {
      course.estadoInicial = 'pendiente';
    } else if (course.estadoInicial === 'inscrito' || isAvailable(course)) {
      course.estadoInicial = 'aprobado';
    }

    saveMallas();
    renderMalla();
    renderCourseList();
    updateSummary();
    updateSelectedInfo(course);
  }

  function updateSelectedInfo(course) {
    if (!selectedInfo) return;
    const dependents = state.courses.filter(c => c.prerequisitos.includes(course.codigo)).map(c => c.codigo);
    const prereqs = course.prerequisitos.length ? course.prerequisitos.join(', ') : 'sin prerrequisitos';
    const deps = dependents.length ? dependents.join(', ') : 'sin dependientes directos';
    selectedInfo.textContent = `${course.codigo}: ${statusText(course)}. Prerrequisitos: ${prereqs}. Habilita: ${deps}.`;
  }

  function applyHighlights() {
    const cards = [...document.querySelectorAll('.course')];
    cards.forEach(card => card.classList.remove('selected', 'highlight-prereq', 'highlight-dependent', 'dimmed'));

    if (state.selectedCode) {
      const selected = document.querySelector(`.course[data-code="${cssEscape(state.selectedCode)}"]`);
      selected?.classList.add('selected');
    }

    const focusCode = state.hoveredCode || state.selectedCode;
    if (!focusCode) return;

    const focused = courseByCode(focusCode);
    if (!focused) return;

    const prereqSet = new Set(focused.prerequisitos);
    const dependentSet = new Set(state.courses.filter(c => c.prerequisitos.includes(focusCode)).map(c => c.codigo));

    cards.forEach(card => {
      const code = card.dataset.code;
      if (code === focusCode) card.classList.add('selected');
      else if (prereqSet.has(code)) card.classList.add('highlight-prereq');
      else if (dependentSet.has(code)) card.classList.add('highlight-dependent');
      else if (state.hoveredCode) card.classList.add('dimmed');
    });
  }

  function updateSummary() {
    const progressCircle = document.getElementById('progressCircle');
    const progressText = document.getElementById('progressText');
    const completedText = document.getElementById('completedText');
    const creditsText = document.getElementById('creditsText');
    const countApproved = document.getElementById('countApproved');
    const countAvailable = document.getElementById('countAvailable');
    const countEnrolled = document.getElementById('countEnrolled');
    const countBlocked = document.getElementById('countBlocked');
    const approved = state.courses.filter(c => visualStatus(c) === 'approved');
    const enrolled = state.courses.filter(c => visualStatus(c) === 'enrolled');
    const available = state.courses.filter(c => visualStatus(c) === 'available');
    const blocked = state.courses.filter(c => visualStatus(c) === 'blocked');
    const totalCredits = state.courses.reduce((sum, c) => sum + c.creditos, 0);
    const approvedCredits = approved.reduce((sum, c) => sum + c.creditos, 0);
    const progress = totalCredits ? Math.round((approvedCredits / totalCredits) * 100) : 0;

    progressCircle?.style.setProperty('--progress', progress);
    if (progressText) progressText.textContent = `${progress}%`;
    if (completedText) completedText.textContent = `${approved.length} / ${state.courses.length}`;
    if (creditsText) creditsText.textContent = `${approvedCredits} / ${totalCredits}`;
    if (countApproved) countApproved.textContent = approved.length;
    if (countAvailable) countAvailable.textContent = available.length;
    if (countEnrolled) countEnrolled.textContent = enrolled.length;
    if (countBlocked) countBlocked.textContent = blocked.length;
  }

  function tooltip(course) {
    const prereqs = course.prerequisitos.length ? course.prerequisitos.join(', ') : 'Sin prerrequisitos';
    const dependents = state.courses.filter(c => c.prerequisitos.includes(course.codigo)).map(c => c.codigo);
    return `${course.codigo} - ${course.nombre}\nEstado: ${statusText(course)}\nPrerrequisitos: ${prereqs}\nHabilita: ${dependents.length ? dependents.join(', ') : 'Sin dependientes directos'}`;
  }

  function shortPeriod(value) {
    const text = String(value || '').toLowerCase();
    if (text.includes('primer')) return '1er sem.';
    if (text.includes('segundo')) return '2do sem.';
    return 'Ambos sem.';
  }

  function getFieldValue(id) {
    return String(document.getElementById(id)?.value || '').trim();
  }

  function normalizeDescription(value) {
    const description = String(value || '').trim();
    return /^Plan cargado desde data\/.+\.js$/i.test(description) ? '' : description;
  }

  function getSelectedPrereqs() {
    if (!prereqPicker) return [];
    return [...prereqPicker.querySelectorAll('input[type="checkbox"]:checked')]
      .map(input => input.value.trim().toUpperCase())
      .filter(Boolean);
  }

  function setSelectedPrereqs(values) {
    if (!prereqPicker) return;
    const selected = new Set(values.map(value => String(value).trim().toUpperCase()));
    prereqPicker.querySelectorAll('input[type="checkbox"]').forEach(input => {
      input.checked = selected.has(input.value);
    });
  }

  function getStoredSelectedId() {
    try {
      return localStorage.getItem(SELECTED_KEY) || readWindowState()?.selectedId || null;
    } catch (error) {
      return readWindowState()?.selectedId || null;
    }
  }

  function importHashState() {
    try {
      const params = new URLSearchParams(window.location.hash.slice(1));
      const encoded = params.get(STATE_HASH_KEY);
      if (!encoded) return null;

      const payload = JSON.parse(decodeURIComponent(escape(atob(encoded))));
      if (!payload || !Array.isArray(payload.mallas)) return null;

      const mallas = payload.mallas.map(normalizeMalla).filter(malla => malla.id && malla.nombre);
      if (!mallas.length) return null;

      const theme = params.get(THEME_HASH_KEY) || payload.theme;
      if (theme) {
        applyTheme(theme);
        try {
          localStorage.setItem(THEME_KEY, theme === 'dark' ? 'dark' : 'light');
          sessionStorage.setItem(THEME_KEY, theme === 'dark' ? 'dark' : 'light');
        } catch (error) {
          console.warn('No se pudo guardar el tema importado.', error);
        }
      }
      writeStoredState(mallas, payload.selectedId || mallas[0].id);
      history.replaceState(null, '', window.location.pathname + window.location.search);
      return mallas;
    } catch (error) {
      console.warn('No se pudo importar el estado de mallas desde la URL.', error);
      return null;
    }
  }

  function attachStateToLink(link) {
    const href = link.getAttribute('href') || '';
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) return;

    const payload = {
      selectedId: state.currentMallaId,
      mallas: state.mallas,
      theme: getCurrentTheme()
    };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const cleanHref = href.split('#')[0];
    const params = new URLSearchParams();
    params.set(STATE_HASH_KEY, encoded);
    params.set(THEME_HASH_KEY, getCurrentTheme());
    link.href = `${cleanHref}#${params.toString()}`;
  }

  function saveSelectedMalla(id) {
    try {
      localStorage.setItem(SELECTED_KEY, id);
    } catch (error) {
      console.warn('No se pudo guardar la malla seleccionada.', error);
    }

    writeWindowState(state.mallas, id);
  }

  function readWindowState() {
    try {
      if (!window.name) return null;
      const parsed = JSON.parse(window.name);
      const payload = parsed && parsed[WINDOW_STATE_KEY];
      if (!payload || !Array.isArray(payload.mallas)) return null;

      return {
        selectedId: payload.selectedId || null,
        theme: payload.theme === 'dark' ? 'dark' : 'light',
        mallas: payload.mallas.map(normalizeMalla).filter(malla => malla.id && malla.nombre)
      };
    } catch (error) {
      return null;
    }
  }

  function writeWindowState(mallas, selectedId, theme = getCurrentTheme()) {
    try {
      const parsed = window.name ? JSON.parse(window.name) : {};
      parsed[WINDOW_STATE_KEY] = { mallas, selectedId, theme };
      window.name = JSON.stringify(parsed);
    } catch (error) {
      window.name = JSON.stringify({ [WINDOW_STATE_KEY]: { mallas, selectedId, theme } });
    }
  }

  function getCurrentTheme() {
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  }

  function normalizeKey(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function setFieldValue(id, value) {
    const field = document.getElementById(id);
    if (field) field.value = value ?? '';
  }

  function makeId() {
    return `malla-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
    }[char]));
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === 'function') return window.CSS.escape(value);
    return String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  }
})();
