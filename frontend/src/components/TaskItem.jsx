function TaskItem({ task, onToggle, onDelete }) {
    return (
        <article className={`task-item ${task.completed ? 'completed' : ''}`}>
            <div className="task-content">
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
                <span>{task.completed ? 'Виконано' : 'У процесі'}</span>
            </div>

            <div className="task-actions">
                <button onClick={() => onToggle(task)}>
                    {task.completed ? 'Повернути' : 'Виконати'}
                </button>
                <button className="delete-button" onClick={() => onDelete(task.id)}>
                    Видалити
                </button>
            </div>
        </article>
    );
}

export default TaskItem;