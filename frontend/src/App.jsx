import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // ✅ FIX: API URL updated
  const API_URL = "willowy-clafoutis-f7f9e9.netlify.app";

  // ✅ Fetch todos
  const fetchTodos = () => {
    axios
      .get(API_URL)
      .then((res) => setTodos(res.data))
      .catch((err) => console.error("Error fetching todos:", err));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ✅ Add todo
  const addTodo = () => {
    if (!newTodo.trim()) return;

    axios
      .post(API_URL, { title: newTodo })
      .then((res) => {
        setTodos([...todos, res.data]);
        setNewTodo("");
      })
      .catch((err) => console.error("Error adding todo:", err));
  };

  // ✅ Delete todo
  const deleteTodo = (id) => {
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => {
        setTodos(todos.filter((t) => t._id !== id));
      })
      .catch((err) => console.error("Error deleting todo:", err));
  };

  // ✅ Start editing
  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  // ✅ Update todo (title)
  const updateTodo = (id) => {
    axios
      .put(`${API_URL}/${id}`, { title: editingText })
      .then((res) => {
        setTodos(todos.map((t) => (t._id === id ? res.data : t)));
        setEditingId(null);
        setEditingText("");
      })
      .catch((err) => console.error("Error updating todo:", err));
  };

  // ✅ Toggle completed
  const toggleCompleted = (id, completed) => {
    axios
      .put(`${API_URL}/${id}`, { completed: !completed })
      .then((res) => {
        setTodos(todos.map((t) => (t._id === id ? res.data : t)));
      })
      .catch((err) => console.error("Error toggling todo:", err));
  };

  return (
    <div className="app">
      <h1 className="title">📝 My Todo App</h1>

      {/* Input */}
      <div className="todo-input">
        <input
          type="text"
          placeholder="Enter a task..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {/* Todo List */}
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className={`todo-item ${todo.completed ? "done" : ""}`}>
            {editingId === todo._id ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button onClick={() => updateTodo(todo._id)}>💾 Save</button>
                <button onClick={() => setEditingId(null)}>❌ Cancel</button>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleCompleted(todo._id, todo.completed)}
                />
                <span>{todo.title}</span>
                <div className="actions">
                  <button onClick={() => startEditing(todo._id, todo.title)}>
                    ✏ Edit
                  </button>
                  <button className="delete" onClick={() => deleteTodo(todo._id)}>
                    ✖ Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
