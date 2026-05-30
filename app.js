// Import required modules
const express = require('express');

// Create an Express application
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));

// ---------- IN-MEMORY DATA ----------
let tasks = [];
let nextId = 1;

// Sample tasks (so you have something to see immediately)
tasks.push({ id: nextId++, title: 'Finish C237 assignment', module: 'C237', dueDate: '2025-06-01' });
tasks.push({ id: nextId++, title: 'Review Express routes', module: 'C237', dueDate: '2025-05-30' });

// ---------- ROUTES ----------

// Home page – show all tasks
app.get('/', (req, res) => {
    res.render('index', { tasks });
});

// Show Add Task form
app.get('/tasks/new', (req, res) => {
    res.render('new');
});

// Save new task
app.post('/tasks', (req, res) => {
    const { title, module, dueDate } = req.body;
    const newTask = {
        id: nextId++,
        title,
        module,
        dueDate
    };
    tasks.push(newTask);
    res.redirect('/');
});

// Show Edit form (pre‑filled)
app.get('/tasks/:id/edit', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (!task) return res.status(404).send('Task not found');
    res.render('edit', { task });
});

// Update task
app.post('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, module, dueDate } = req.body;
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        tasks[index] = { id, title, module, dueDate };
    }
    res.redirect('/');
});

// Delete task (POST, not GET)
app.post('/tasks/:id/delete', (req, res) => {
    const id = parseInt(req.params.id);
    tasks = tasks.filter(t => t.id !== id);
    res.redirect('/');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});