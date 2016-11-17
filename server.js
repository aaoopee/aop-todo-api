var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

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

app.get('/todos/:id', function(req, resp) {
	var matchedTodo = _.findWhere(todos, {id: parseInt(req.params.id)});

	if (matchedTodo) {
		resp.json(matchedTodo);
	} else {
		resp.status(404).send('Did not find todo with id of '+req.params.id+'.');
	}
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
app.post('/todos', function(req, resp) {
	var body = _.pick(req.body, 'description', 'completed');
	body.description = body.description.trim();

	if (!_.isBoolean(body.completed) || !_.isString(body.description)) {
		return resp.status(400).send();
	}

	body.id = todoNextId++;
	todos.push(body);

	resp.json(body);
});


app.listen(PORT, function() {
	console.log('Server started on port '+PORT+'.');
});
