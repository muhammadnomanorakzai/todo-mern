const asyncHandler = require("express-async-handler");
const Todo = require("../models/Todo");

// @desc    Get user's todos
// @route   GET /api/todos
// @access  Private
const getTodos = asyncHandler(async (req, res) => {
  const { status, priority } = req.query;
  let query = { user: req.user.id };

  // Apply filters
  if (status === "completed") {
    query.completed = true;
  } else if (status === "pending") {
    query.completed = false;
  }

  if (priority) {
    query.priority = priority;
  }

  const todos = await Todo.find(query).sort({
    priority: -1,
    createdAt: -1,
  });

  res.json({
    success: true,
    count: todos.length,
    data: todos,
  });
});

// @desc    Create a todo
// @route   POST /api/todos
// @access  Private
const createTodo = asyncHandler(async (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  const todo = await Todo.create({
    title,
    description,
    priority,
    dueDate,
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: todo,
  });
});

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = asyncHandler(async (req, res) => {
  let todo = await Todo.findById(req.params.id);

  if (!todo) {
    res.status(404);
    throw new Error("Todo not found");
  }

  // Make sure user owns the todo
  if (todo.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    data: todo,
  });
});

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    res.status(404);
    throw new Error("Todo not found");
  }

  // Make sure user owns the todo
  if (todo.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await todo.deleteOne();

  res.json({
    success: true,
    data: {},
  });
});

// @desc    Toggle todo completion
// @route   PATCH /api/todos/:id/toggle
// @access  Private
const toggleTodo = asyncHandler(async (req, res) => {
  let todo = await Todo.findById(req.params.id);

  if (!todo) {
    res.status(404);
    throw new Error("Todo not found");
  }

  // Make sure user owns the todo
  if (todo.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  todo.completed = !todo.completed;
  await todo.save();

  res.json({
    success: true,
    data: todo,
  });
});

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
};
