import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const newTask = { title, description, dueDate };
      await axios.post('http://localhost:5000/tasks', newTask);
      setTitle('');
      setDescription('');
      setDueDate('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const editTask = (task) => {
    setEditing(true);
    setCurrentTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate);
  };

  const updateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/tasks/${currentTask._id}`, {
        title,
        description,
        dueDate,
      });
      setEditing(false);
      setCurrentTask(null);
      setTitle('');
      setDescription('');
      setDueDate('');
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Task Management Application</h1>
      </header>
      <main>
        <section id="task-list">
          {tasks.map((task) => (
            <div key={task._id} className="task">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Due: {task.dueDate}</p>
              <button onClick={() => editTask(task)}>Edit</button>
              <button onClick={() => deleteTask(task._id)}>Delete</button>
            </div>
          ))}
        </section>
        <section id="task-form">
          <form onSubmit={editing ? updateTask : addTask}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              required
            ></textarea>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <button type="submit">{editing ? 'Update Task' : 'Add Task'}</button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default App;
