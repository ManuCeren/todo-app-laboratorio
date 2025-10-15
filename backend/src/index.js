
const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la base de datos desde variables de entorno
const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'todoapp',
  port: process.env.DB_PORT || 5432,
});

// Conectar a la base de datos
client.connect()
  .then(() => console.log('Conectado a PostgreSQL'))
  .catch(err => {
    console.error('Error al conectar a PostgreSQL:', err.stack);
    process.exit(1);
  });

// Crear tabla si no existe
client.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
  );
`).catch(err => console.error('Error al crear tabla:', err));

// GET /tasks
app.get('/tasks', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM tasks ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /tasks error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /tasks
app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'El campo "title" es requerido y debe ser una cadena no vacía' });
  }
  try {
    const result = await client.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
      [title.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /tasks error:', err);
    res.status(500).json({ error: 'Error al crear tarea' });
  }
});

// PUT /tasks/:id
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  if (typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'El campo "completed" debe ser booleano' });
  }

  try {
    const result = await client.query(
      'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *',
      [completed, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /tasks/:id error:', err);
    res.status(500).json({ error: 'Error al actualizar tarea' });
  }
});

// DELETE /tasks/:id
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query('DELETE FROM tasks WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('DELETE /tasks/:id error:', err);
    res.status(500).json({ error: 'Error al eliminar tarea' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend corriendo en puerto ${PORT}`);
});
