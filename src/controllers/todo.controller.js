import { Todo } from "../models/todo.model.js";

/**
 * TODO: Create a new todo
 * - Extract data from req.body
 * - Create todo in database
 * - Return 201 with created todo
 */
export async function createTodo(req, res, next) {
  try {
    // Your code here
    const todo = await Todo.create(req.body);
    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: List todos with pagination and filters
 * - Support query params: page, limit, completed, priority, search
 * - Default: page=1, limit=10
 * - Return: { data: [...], meta: { total, page, limit, pages } }
 */
export async function listTodos(req, res, next) {
  try {
    // Your code here
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const filter = {};

    if (req.query.completed === "true" ) {
      filter.completed = true;
    } else if (req.query.completed === "false") {
      filter.completed = false;
    }

    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: "i" };
    }

    const total = await Todo.countDocuments(filter);
    const data = await Todo.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

    const pages = total === 0 ? 0 : Math.ceil(total / limit);

    res.status(200).json({
      data,
      meta: {
        total,
        page,
        limit,
        pages,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Get single todo by ID
 * - Return 404 if not found
 */
export async function getTodo(req, res, next) {
  try {
    // Your code here
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: { message: "Todo not found" } });
    }

    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Update todo by ID
 * - Use findByIdAndUpdate with { new: true, runValidators: true }
 * - Return 404 if not found
 */
export async function updateTodo(req, res, next) {
  try {
    // Your code here
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!todo) {
      return res.status(404).json({ error: { message: "Todo not found" } });
    }
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Toggle completed status
 * - Find todo, flip completed, save
 * - Return 404 if not found
 */
export async function toggleTodo(req, res, next) {
  try {
    // Your code here
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: { message: "Todo not found" } });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.status(200).json(todo);

  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Delete todo by ID
 * - Return 204 (no content) on success
 * - Return 404 if not found
 */
export async function deleteTodo(req, res, next) {
  try {
    // Your code here
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: { message: "Todo not found" } });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
