var express = require('express');

var app = express();
var PORT = process.env.PORT || 3000;

app.get('/', function(req, resp) {
	resp.send('TODO.API root')
});

app.listen(PORT, function() {
	console.log('Server started on port '+PORT+'.');
});