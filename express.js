var http = require('http');
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/static'));

http.createServer(app).listen('8000', () => console.log('open the browers and enter http://localhost:8000'))