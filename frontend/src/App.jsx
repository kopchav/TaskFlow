import { useEffect, useState } from 'react';
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask
} from './services/api';
import TaskItem from './components/TaskItem';
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    async function loadTasks() {
        try {
            setError('');
            const data = await getTasks();
            setTasks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTasks();
    }, []);

    async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
        setError('Введи назву завдання');
        return;
    }

    try {
        setError('');

        if (editingId !== null) {
            const updated = await updateTask(editingId, {
                title: title.trim(),
                description: description.trim(),
                completed: tasks.find(task => task.id === editingId).completed
            });

            setTasks(current =>
                current.map(task => task.id === updated.id ? updated : task)
            );
        } else {
            const task = await createTask({
                title: title.trim(),
                description: description.trim()
            });

            setTasks(current => [task, ...current]);
        }

        setTitle('');
        setDescription('');
        setEditingId(null);
    } catch (err) {
        setError(err.message);
    }
}

function handleEdit(task) {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description || '');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setError('');
}

    async function handleToggle(task) {
        try {
            setError('');

            const updated = await updateTask(task.id, {
                title: task.title,
                description: task.description,
                completed: task.completed ? 0 : 1
            });

            setTasks(current =>
                current.map(item => item.id === updated.id ? updated : item)
            );
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleDelete(id) {
        try {
            setError('');
            await deleteTask(id);
            setTasks(current => current.filter(task => task.id !== id));
        } catch (err) {
            setError(err.message);
        }
    }

    const filteredTasks = tasks.filter(task => {
        if (filter === 'active') return !task.completed;
        if (filter === 'completed') return Boolean(task.completed);
        return true;
    });

    const completedCount = tasks.filter(task => task.completed).length;

    return (
        <main className="app">
            <header className="app-header">
                <div>
                    <p className="eyebrow">PERSONAL PRODUCTIVITY</p>
                    <h1>TaskFlow</h1>
                    <p className="subtitle">Організуй справи. Досягай більшого.</p>
                </div>

                <div className="task-summary">
                    <strong>{completedCount}/{tasks.length}</strong>
                    <span>виконано</span>
                </div>
            </header>

            <section className="panel">
                <h2>{editingId !== null ? 'Редагувати завдання' : 'Нове завдання'}</h2>

                <form onSubmit={handleSubmit} className="task-form">
                    <input
                        type="text"
                        placeholder="Що потрібно зробити?"
                        value={title}
                        onChange={event => setTitle(event.target.value)}
                    />

                    <textarea
                        placeholder="Опис завдання (необов'язково)"
                        value={description}
                        onChange={event => setDescription(event.target.value)}
                        rows="3"
                    />

                <div className="form-actions">
            <button type="submit">
                {editingId !== null ? 'Зберегти зміни' : '+ Додати завдання'}
            </button>

            {editingId !== null && (
                <button type="button" className="cancel-button" onClick={cancelEdit}>
                    Скасувати
                </button>
            )}
        </div>
                </form>
            </section>

            <section className="tasks-section">
                <div className="tasks-heading">
                    <h2>Мої завдання</h2>

                    <select
                        value={filter}
                        onChange={event => setFilter(event.target.value)}
                    >
                        <option value="all">Усі</option>
                        <option value="active">Активні</option>
                        <option value="completed">Виконані</option>
                    </select>
                </div>

                {error && <p className="error-message">{error}</p>}

                {loading ? (
                    <p className="empty-message">Завантаження...</p>
                ) : filteredTasks.length === 0 ? (
                    <p className="empty-message">Завдань поки немає. Додай перше!</p>
                ) : (
                    <div className="task-list">
                        {filteredTasks.map(task => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggle={handleToggle}
                                onDelete={handleDelete}
                                onEdit={handleEdit}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default App;