/*
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
app.listen(8080);*/


/*
var express = require('express');
var app = express();

app.get('/', function(req, res) {
	res.send('hello wrold');
});
app.listen(3000)*/
/*
var express = require('express');
var app = express();

app.get('/', function(req, res){
	res.send('hello world')
});

app.get('/customer',function(req ,res){
	res.send('customer page');
});

app.get('/admin', function(req, res){
  res.send('admin page');
});

app.listen(3000);*/

// routes 路由

/*
var express = require('express');
var app = express();

var routes = require('./routes/routes')(app);
app.listen(3000);*/



/* express use 方法 */

var express = require('express');
var http = require('http');
var app = express();

app.use(function(request, response, next){
	console.log(" I comes a" + request.method + "to" + request.url);
	next();
});

app.use(function(request, response) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello world!\n");
});

http.createServer(app).listen(1337);



