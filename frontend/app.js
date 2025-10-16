const tasksListEl = document.getElementById('tasks-list');
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const statusEl = document.getElementById('status');

const API_HOST = (() => {
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  return 'http://backend:3000';
})();

const API = `${API_HOST}`;

function setStatus(text, isError = false) {
  statusEl.textContent = text || '';
  statusEl.style.color = isError ? 'crimson' : '';
}

export async function loadTasks() {
  try {
    setStatus('Cargando tareas...');
    const res = await fetch(`${API}/tasks`);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const tasks = await res.json();
    renderTasks(tasks);
    setStatus(`Cargadas ${tasks.length} tareas.`);
  } catch (err) {
    console.error(err);
    setStatus('No se pudieron cargar las tareas. Ver consola.', true);
  }
}

function renderTasks(tasks) {
  tasksListEl.innerHTML = '';
  if (!Array.isArray(tasks) || tasks.length === 0) {
    tasksListEl.innerHTML = '<li class="task-item">No hay tareas aún.</li>';
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';

    const title = document.createElement('div');
    title.className = 'task-title' + (task.completed ? ' completed' : '');
    title.textContent = task.title;

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'btn btn-toggle';
    toggleBtn.textContent = task.completed ? 'Marcar no hecha' : 'Marcar hecha';
    toggleBtn.addEventListener('click', () => toggleTask(task.id, !task.completed));

    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-delete';
    delBtn.textContent = 'Eliminar';
    delBtn.addEventListener('click', () => {
      if (confirm('¿Eliminar esta tarea?')) deleteTask(task.id);
    });

    li.appendChild(title);
    li.appendChild(toggleBtn);
    li.appendChild(delBtn);

    tasksListEl.appendChild(li);
  });
}

export async function addTask(title) {
  try {
    setStatus('Guardando...');
    const res = await fetch(`${API}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    if (res.status !== 201) throw new Error(`Error ${res.status}`);
    const newTask = await res.json();
    await loadTasks();
    setStatus(`Tarea creada (id ${newTask.id})`);
  } catch (err) {
    console.error(err);
    setStatus('No se pudo crear la tarea.', true);
  }
}

export async function toggleTask(id, completed) {
  try {
    setStatus('Actualizando...');
    const res = await fetch(`${API}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    await loadTasks();
    setStatus('Actualizado.');
  } catch (err) {
    console.error(err);
    setStatus('No se pudo actualizar la tarea.', true);
  }
}

export async function deleteTask(id) {
  try {
    setStatus('Eliminando...');
    const res = await fetch(`${API}/tasks/${id}`, { method: 'DELETE' });
    if (res.status !== 204 && !res.ok) throw new Error(`Error ${res.status}`);
    await loadTasks();
    setStatus('Eliminado.');
  } catch (err) {
    console.error(err);
    setStatus('No se pudo eliminar la tarea.', true);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  await addTask(value);
  input.value = '';
  input.focus();
});

window.addEventListener('DOMContentLoaded', () => {
  loadTasks();
});
//archivo actualizado
