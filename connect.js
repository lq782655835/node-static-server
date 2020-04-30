var http = require('http');
var connect = require('connect');
var app = connect();
app.use(require('serve-static')(__dirname + '/static'), { 'index': ['index.html', 'index.htm'] })

http.createServer(app).listen(8000, () => console.log('open the browers and enter http://localhost:8000'));