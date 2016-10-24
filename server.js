var express = require('express');

var app = express();
var PORT = process.env.PORT || 3000;

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
	description: 'Do something.',
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
	todoid = req.params.id;

	for (var i=0; i<todos.length; i++) {
		if(todos[i].id.toString() === req.params.id) {
			resp.json(todos[i]);
			return;
		}
	}

	resp.status(404).send('Did not find todo with id of '+req.params.id+'.');
});


app.listen(PORT, function() {
	console.log('Server started on port '+PORT+'.');
});