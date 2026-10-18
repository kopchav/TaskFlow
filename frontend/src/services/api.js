async function request(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Сталася помилка запиту');
    }

    return data;
}

export function getTasks() {
    return request('/api/tasks');
}

export function createTask(task) {
    return request('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(task)
    });
}

export function updateTask(id, task) {
    return request(`/api/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(task)
    });
}

export function deleteTask(id) {
    return request(`/api/tasks/${id}`, {
        method: 'DELETE'
    });
}