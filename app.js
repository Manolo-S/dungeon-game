'use strict';
var express = require('express');
var path = require('path');
var app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res){
	res.sendFile(__dirname + '/public/dungeon.html');
})

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + server.address().port);
});
