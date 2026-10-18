const express = require('express');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/api/tasks', (req, res) => {
    const tasks = db.prepare(
        'SELECT * FROM tasks ORDER BY id DESC'
    ).all();

    res.json(tasks);
});


app.post('/api/tasks', (req, res) => {
    const { title, description = '' } = req.body;

    if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({
            error: 'Назва завдання обов’язкова'
        });
    }

    if (typeof description !== 'string') {
        return res.status(400).json({
            error: 'Опис повинен бути текстом'
        });
    }

    const result = db.prepare(`
        INSERT INTO tasks (title, description)
        VALUES (?, ?)
    `).run(title.trim(), description.trim());

    const task = db.prepare(
        'SELECT * FROM tasks WHERE id = ?'
    ).get(result.lastInsertRowid);

    res.status(201).json(task);
});

app.put('/api/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const { title, description = '', completed = 0 } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'Некоректний ID завдання'
        });
    }

    if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({
            error: 'Назва завдання обов’язкова'
        });
    }

    if (
        typeof description !== 'string' ||
        ![0, 1, true, false].includes(completed)
    ) {
        return res.status(400).json({
            error: 'Некоректні дані завдання'
        });
    }

    const result = db.prepare(`
        UPDATE tasks
        SET title = ?, description = ?, completed = ?
        WHERE id = ?
    `).run(
        title.trim(),
        description.trim(),
        Number(completed),
        id
    );

    if (result.changes === 0) {
        return res.status(404).json({
            error: 'Завдання не знайдено'
        });
    }

    const task = db.prepare(
        'SELECT * FROM tasks WHERE id = ?'
    ).get(id);

    res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'Некоректний ID завдання'
        });
    }

    const result = db.prepare(
        'DELETE FROM tasks WHERE id = ?'
    ).run(id);

    if (result.changes === 0) {
        return res.status(404).json({
            error: 'Завдання не знайдено'
        });
    }

    res.json({ message: 'Завдання успішно видалено' });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});