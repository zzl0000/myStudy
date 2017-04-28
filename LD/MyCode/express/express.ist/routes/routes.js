// express 4.0 router基本用法 

var router = express.Router();

router.get('/', function (req, res) {
	res.send('首页')；
})

router.get('/about', function (req, res) {
	res.send('关于')；
})

app.use('', router);

// router 实例对象

var router =express.Router();
router.route('/api')
			.post(function(req, res){
				//
			})
			.get(function(req, res){
					Bear.find(function(err, bears){
						if(err) res.sed(err);
						res.json(bears);
					});
			});
app.use('/', router)	

// router 挂载中间件 

router.ues(function(req, res, next){
	console.log(req.method, req.url);
	next();
});


//  router param方法 用于路径处理参数

router.param('name', function(req, res, next, name){
	//对name 进行验证 或处理
	console.log(name);
	req.name = name ;
	next();
});

router.get('/hello/:name', function(req, res){
	res.send('hello' + req.name + '!');
})


// app router 

app.route('/login')
	.get(function(req, res) {
		res.send('this is the login form');
	})
	.post(function(req, res) {
		console.log('processing');
		res.send('processing the login form!');
	});




