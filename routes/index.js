var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    req.db.query('SELECT * FROM todos;', (err, results) => {
        if (err) {
            console.error('Error fetching todos:', err);
            return res.status(500).send('Error fetching todos');
        }

        const completedTodos = req.session.completedTodos || [];

        const todos = results.map(todo => ({
            ...todo,
            completed: completedTodos.includes(String(todo.id))
        }));

        res.render('index', {
            title: 'Your TODO',
            todos: todos
        });
    });
});

router.post('/create', function (req, res, next) {
    const { task } = req.body;
    try {
      req.db.query('INSERT INTO todos (task) VALUES (?);', [task], (err, results) => {
        if (err) {
          console.error('Error adding todo:', err);
          return res.status(500).send('Error adding todo');
        }
        console.log('Todo added successfully:', results);
        // Redirect to the home page after adding
        res.redirect('/');
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      res.status(500).send('Error adding todo');
    }
});

router.post('/delete', function (req, res, next) {
    const { id } = req.body;
    try {
      req.db.query('DELETE FROM todos WHERE id = ?;', [id], (err, results) => {
        if (err) {
          console.error('Error deleting todo:', err);
          return res.status(500).send('Error deleting todo');
        }
        console.log('Todo deleted successfully:', results);
        // Redirect to the home page after deletion
        res.redirect('/');
    });
    }catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).send('Error deleting todo:');
    }
});

// Functionality for editing task description
router.post('/edit', function (req, res, next) {
    const { id, task } = req.body;

    if (!id || !task || !task.trim()) {
        return res.status(400).send('Invalid task information');
    }

    req.db.query(
        'UPDATE todos SET task = ? WHERE id = ?;',
        [task.trim(), id],
        (err, results) => {
            if (err) {
                console.error('Error editing todo:', err);
                return res.status(500).send('Error editing todo');
            }

            res.redirect('/');
        }
    );
});

// Functionality for completing / not completing a task
router.post('/complete', function (req, res, next) {
    const { id } = req.body;

    if (!req.session.completedTodos) {
        req.session.completedTodos = [];
    }

    const taskId = String(id);

    if (!req.session.completedTodos.includes(taskId)) {
        req.session.completedTodos.push(taskId);
    }

    res.redirect('/');
});

module.exports = router;