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
}
];

app.get('/', function(req, resp) {
	resp.send('TODO.API root')
});


app.get('/todos', function(req, resp) {
	resp.json(todos);
});

app.get('/todos/:id', function(req, resp) {
	var matchedTodo = _.findWhere(todos, {id: parseInt(req.params.id)});

	console.log(req.params.id);

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