import express from "express";
import Todo from "../models/Todo.js";

const router = express.Router();

// ✅ Get all todos
router.get("/", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// ✅ Add a new todo
router.post("/", async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const newTodo = new Todo({ title });
  await newTodo.save();
  res.json(newTodo);
});

// ✅ Update todo (title or completed)
router.put("/:id", async (req, res) => {
  const { title, completed } = req.body;
  const todo = await Todo.findById(req.params.id);

  if (!todo) return res.status(404).json({ message: "Todo not found" });

  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;

  await todo.save();
  res.json(todo);
});

// ✅ Delete todo
router.delete("/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Todo deleted" });
});

export default router;
