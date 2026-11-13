var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next){
  try {
    req.db.query('SELECT * FROM todos;', (err, results) => {
      if (err) {
        console.error('Error fetching todos:', err);
        return res.status(500).send('Error fetching todos');
      }
      res.render('index', { title: 'My Simple TODO', todos: results });
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
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

// Edit Task Description Functionality
router.post('/edit', function (req, res, next) {
    const { id, task } = req.body;

    try {
        req.db.query(
            'UPDATE todos SET task = ? WHERE id = ?;',
            [task, id],
            (err, results) => {
                if (err) {
                    console.error('Error editing todo:', err);
                    return res.status(500).send('Error editing todo');
                }

                console.log('Todo updated successfully:', results);
                res.redirect('/');
            }
        );
    } catch (error) {
        console.error('Error editing todo:', error);
        res.status(500).send('Error editing todo');
    }
});

// Complete Task Functionality
router.post('/toggle', function (req, res, next) {
    const { id } = req.body;

    try {
        req.db.query(
            'UPDATE todos SET completed = NOT completed WHERE id = ?;',
            [id],
            (err, results) => {
                if (err) {
                    console.error('Error updating completion:', err);
                    return res.status(500).send('Error updating completion');
                }

                console.log('Todo completion updated:', results);
                res.redirect('/');
            }
        );
    } catch (error) {
        console.error('Error updating completion:', error);
        res.status(500).send('Error updating completion');
    }
});

module.exports = router;