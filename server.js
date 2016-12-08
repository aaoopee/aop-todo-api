
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todoNextId = 4;

app.use(bodyParser.json());

var todos = [{
	id: 1,
	description: 'Meet mom for lunch.',
	completed: false
},
{
	id: 2,
	description: 'Go to markent.',
	completed: false
},
{
	id: 3,
	description: 'Do something locally.',
	completed: true
},
{
	id: 4,
	description: 'Do something new.',
	completed: false
}
];

app.get('/', function(req, resp) {
	resp.send('TODO.API root')
});


app.get('/todos', function(req, resp) {
	var queryParams = req.query;
	var filteredTodos = todos;

	if (queryParams.hasOwnProperty('completed')) {
		var value = queryParams.completed == 'true';

		filteredTodos = _.filter(todos, function(obj) {
			if (value) {
				return obj.completed;
 			} else {
 				return !obj.completed;
 			}
		});
	}

	if (queryParams.hasOwnProperty('q') &&
		queryParams.q.length >0 ) {

		filteredTodos = _.filter(filteredTodos, function(obj) {
			return obj.description.indexOf(queryParams.q) > -1;
		});
	}
	resp.json(filteredTodos);
});


app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function(todo) {
		if(!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).send();

	});
});

app.delete('/todos/:id', function(req, resp) {
	var matchedTodo = _.findWhere(todos, {id: parseInt(req.params.id)})

	if (!matchedTodo) {
		resp.status(404).send('Did not find todo with id of '+req.params.id+'.');
	} else {
		todos = _.without(todos, matchedTodo);
		resp.json(matchedTodo);
	}
});

app.put('/todos/:id', function(req, resp) {
	var matchedTodo = _.findWhere(todos, {id: parseInt(req.params.id)})

	if (!matchedTodo) {
		return resp.status(404).send('Did not find todo with id of '+req.params.id+'.');
	}

	var body = _.pick(req.body, 'description', 'completed');

	var validAttributes = {};
	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	}
	if (body.hasOwnProperty('description') && _.isString(body.description.trim())) {
		validAttributes.description = body.description;
	}

	_.extend(matchedTodo, validAttributes);
	resp.json(matchedTodo);
});


// POST /todos
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}, function (e) {
		res.status(400).json(e);

	});

	//call create on db.todo
	// respond with 200 and todo
	// if fails, return error
	// res.status(400).json(400).send();

	// body.description = body.description.trim();
	//
	// if (!_.isBoolean(body.completed) || !_.isString(body.description)) {
	// 	return resp.status(400).send();
	// }
	//
	// body.id = todoNextId++;
	// todos.push(body);
	//
	// resp.json(body);
});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Server started on port '+PORT+'.');
	});
});
