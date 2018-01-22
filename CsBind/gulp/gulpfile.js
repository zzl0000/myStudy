var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var livereload = require('gulp-livereload');

// 处理css
gulp.task('css',function(){
	gulp.src('./src/less/*.less')
			.pipe(plugins.less())
			.pipe(plugins.autoprefixer())
 			//.pipe(plugins.minifyCss())
			.pipe(gulp.dest('./build/css'))
			.pipe(livereload());
})

//处理图片

// 处理js
gulp.task('js',function(){
	gulp.src('src/**/*.js')
       .pipe(gulp.dest('./build'));
       .pipe(livereload());
})

//配置预览服务器
gulp.task('connect',function(){
	plugins.connect.server({
		root:'./build/',
		livereload:true,
		port:8888,
	})
});
gulp.task('html', function () {
  gulp.src('./build/*.html')
    .pipe(plugins.connect.reload());
});

//监听文件
gulp.task('watch', function () {
  livereload.listen();
  gulp.watch('./src/**/*.js',['js']);
  gulp.watch('./src/less/*.less',['css']);
  gulp.watch('./build/**/*',['html']);
});

//设置默认任务
gulp.task('default',['watch','js','css','connect']);