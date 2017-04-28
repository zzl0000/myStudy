//
 var express = require('express');
 var path= require('path');
 var api = require('./routes/api');
 var hbs = require('hbs');
 var app = express();
// 设定port变量，意为访问端口
app.set('port', process.env.PORT || 3000);
// 设定view engine变量，意为网页模板引擎
app.set('view engine', 'html');

// 配置路由 指定路径
app.get('/api',api.index);

// 简单输出
	/*app.get('/', function(req, res) {
		res.send(' hello world');
	});
	app.get('/api', function(req, res) {
		res.send({name:"张三",age:40});
	});*/

	/*app.get('/', function(req, res){
	  var body = 'Hello World';
	  res.setHeader('Content-Type', 'text/plain');
	  res.setHeader('Content-Length', body.length);
	  res.end(body);
	});*/

// >>静态网页模版 
	/*app.get('/',function(req, res){
		res.sendfile('./views/index.html');
	});

	app.get('/about', function(req, res) {
	   res.sendfile('./views/about.html');
	});
	 
	app.get('/article', function(req, res) {
	   res.sendfile('./views/article.html');
	});
*/

// >>动态网页模版
	app.engine('html',hbs.__express);
	app.get('/', function(req, res){
		res.render('index');
	});
	app.get('/about', function(req, res){
		res.render('about');
	});
	app.get('/article', function(req, res){
		res.render('article');
	});



app.use(express.static('public'));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// 设定静态文件目录，比如本地文件
// 目录为demo/public/images，访问
// 网址则显示为http://localhost:3000/images
// 设定views变量，意为视图存放的目录
app.set('views', path.join( __dirname, 'views'));

app.listen(app.get('port'));

