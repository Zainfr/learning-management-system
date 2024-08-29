import React, { useState } from 'react';

const ToDoListPage = () => {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState('');

    const addTask = () => {
        setTasks([...tasks, { id: Date.now(), text: task }]);
        setTask('');
    };

    return (
        <div>
            <h1>To-Do List</h1>
            <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Add a new task"
            />
            <button onClick={addTask}>Add</button>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>{task.text}</li>
                ))}
            </ul>
        </div>
    );
};

export default ToDoListPage;
