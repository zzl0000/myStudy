/*
 * @Author: your name
 * @Date: 2020-12-25 10:18:59
 * @LastEditTime: 2020-12-25 16:38:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \register-managef:\mine\gulp-test\gulpfile.js
 * 
 */

const { src, dest, watch, parallel, series } = require('gulp');
const del = require('del')

const broserSync = require('browser-sync')
const bs = broserSync.create() // 创建一个服务器

const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins() // 新建一个插件

const cwd = process.cwd() // 工作目录

const config = {
  build: {
    source: 'src', // 源文件夹
    dist: 'release', // 最终编译后存放的文件夹
    temp: '.temp', // 作为中间文件夹
    public: 'public',
    paths: {
      h5Styles: 'h5/css/*.scss',
      pcStyles: 'pc/css/*.sass',
      h5Images: 'h5/images/**',
      pcImages: 'pc/images/**',
      scripts: 'assets/scripts/*.js',
      pages: '*.html',

    }
  }
}

const { build: configBuild } = config

const { dist, temp, source, public, paths: { h5Styles, pcStyles, h5Images, pcImages, pages } } = configBuild


const clean = () => {
  return del([temp, dist])
}

// 获取读取流的公共部分
const getBase = (src) => {
  return { base: src, cmd: src }
}

// 编译 h5下面的sass 文件
const H5SCSS = () => {
  return src(`${source}/${h5Styles}`, getBase(source)) //读取文件流
    .pipe(plugins.sass({ outputStyle: 'expanded' })) // 压缩CSS
    .pipe(dest(dist)) // 写入流中， 写入到temp(半成品)目录下
    .pipe(bs.reload({ stream: true })) // 写入流变化， 重新加载资源
}

// 编译 PC下面的sass 文件
const PCSCSS = () => {
  return src(`${source}/${pcStyles}`, getBase(source)) //读取文件流
    .pipe(plugins.sass({ outputStyle: 'expanded' })) // 压缩CSS
    .pipe(dest(dist)) // 写入流中， 写入到temp(半成品)目录下
    .pipe(bs.reload({ stream: true })) // 写入流变化， 重新加载资源
}

// // 注册转换sass任务
// gulp.task('sass', function () {
//   return gulp.src('*.scss')
//     .pipe($.sass())
//     .pipe(gulp.dest('src/css/'))
//     .pipe($.livereload())
//     .pipe($.connect.reload())
// });

// // 注册合并压缩css文件
// gulp.task('css', function () {
//   return gulp.src('src/css/*.css')
//     .pipe($.concat('build.css'))
//     .pipe($.rename({ suffix: '.min' }))
//     .pipe($.cleanCss({ compatbility: 'ie8' }))
//     .pipe(gulp.dest('dist/css'))
//     .pipe($.livereload())
//     .pipe($.connect.reload())
// });




// h5图片压缩


const H5Image = () => {
  return src(`${source}/${h5Images}`, getBase(source))
    .pipe(plugins.imagemin()) // 图片压缩
    .pipe(dest(dist)) // 只有最终生产编译时, 直接保存到dist， 开发阶段不需要编译
}

// pc图片压缩

const PCImage = () => {
  return src(`${source}/${pcImages}`, getBase(source))
    .pipe(plugins.imagemin()) // 图片压缩
    .pipe(dest(dist)) // 只有最终生产编译时, 直接保存到dist， 开发阶段不需要编译
}



const extraH5 = () => { // 拷贝H5所有文件
  return src(source + '/h5/**')
    .pipe(dest(dist + '/h5'))
}


const extraPC = () => { // 拷贝pc所有文件
  return src(source + '/pc/**')
    .pipe(dest(dist + '/pc'))
}


//开发服务器任务
const serve = () => {
  // watch(`${source}/${styles}`, { cmd: src }, style) // 监听styles目录下文件改变， 改变就执行style任务
  // watch(`${source}/${scripts}`, { cmd: src }, script) // 监听scripts目录下文件改变， 改变就执行style任务
  // watch(`${source}/${pages}`, { cmd: src }, page) // 监听pages目录下文件改变， 改变就执行style任务
  // watch([`${source}/${images}`, `${source}/${fonts}`], { cmd: src }, bs.reload) // 监听， 重新加载
  // watch('**', { cmd: public }, bs.reload)
  bs.init({
    notify: false,
    port: 2080, // 端口
    open: false, // 启动服务器就打开浏览器
    server: {
      baseDir: [temp, dist], // 依次按照目录顺序查找文件
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}



// 编译任务 parallel 是并行执行顺序
const compile = (type) => {
  if (type === 'h5') {
    return parallel(H5SCSS)
  }
  if (type === 'pc') {
    return parallel(PCSCSS)
  }

}

// 创建 H5 开发任务

const developH5 = series(compile('h5'), serve)


// 创建 pc 开发任务

const developPC = series(compile('pc'), serve)


// 创建 pc 开发任务

const buildH5 = series(
  extraH5,
  H5Image,
  series(compile('h5')) // 先编译好文件， 才能合并对应的资源
)


const buildPC = series(
  extraPC,
  PCImage,
  series(compile('pc')) // 先编译好文件， 才能合并对应的资源
)

const build = async () => {
  // 清理文件夹
  await buildH5()
  await buildPC()
}


module.exports = {
  developH5,
  developPC,
  buildH5,
  buildPC,
  clean,
  build
}