/**
 * js常用方法合集
 * 时间2017/3/24
 */

/* &数组及对象深拷贝& */

var arr = [1, '2' ,{ a:1, b:[1, 2] }];
 
function deepCopy(p,c) {
	var c =  c || {};
	for(var i in p){
		if(typeof p[i] === 'object' && p[i] !== null){
			c[i] = (p[i].constructor === Array) ? [] :{};
			deepCopy(p[i],c[i]);
		}
		else{
			c[i] = p[i] ;
		}
	}
	return c ;
}
var cArr = deepCopy(arr);
console.log(cArr);


/* &获取地址栏参数& */

function getUrlParam() {
	var _arr = location.search.substr(1).split('&');
	var _obj = {};
	for (var i = 0; i < _arr.length; i++) {
		_obj[_arr[i].split('=')[0]] = _arr[i].split('=')[1]
	}
	return _obj;
}
console.log(getUrlParam);

/* &修改微信title 兼容ios& */
function changeWxTitle(text){
	var $body = $('body');
	document.title = text;
	var $iframe = $('<iframe src="/favicon.ico"></iframe>');
	$iframe.on('load',function() {
		setTimeout(function() {
			$iframe.off('load').remove();
		}, 0);
	}).appendTo($body);
}

/* &移动端响应式样式& 
 *  方法使用后会在 head标签添加一个style标签 并且有.my-resize 和 .no-resize的样式，需要适配屏幕的元素加上.my-resize类名即可，.no-resize是还原已适配的元素
 *  window.onload = window.onresize = function(){
 *      pageResize({
 *          width : '320',     //默认宽320px 
 *          height : '504',     //默认高504px
 *      })
 *   }
 */

(function pageResize(opt) {
    var ua = navigator.userAgent,
        wp = ua.match(/Windows Phone ([\d.]+)/),
        android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),

        // 设备宽高初始比例
        dw = document.documentElement.clientWidth,
        dh = document.documentElement.clientHeight,
        ds = dw / dh,
        // 页面宽高初始比例
        opt = opt || {},
        pw = opt.width || 320,
        ph = opt.height || 512,
        ps = pw / ph;

        // 核心代码：页面缩放比例
        
        var sx = dw/pw,
            sy = dh/ph;  

        var css = '.no-resize { -webkit-transform: scaleY('+sx/sy+');transform: scaleY('+sx/sy+'); }.my-resize { width:'+pw+'px !important;height:'+ph+'px !important;-webkit-transform: scale('+sx+','+sy+');transform: scale('+sx+','+sy+'); -webkit-transform-origin:left top;transform-origin:left top;}',

        head = document.getElementsByTagName('head')[0],

        style = document.createElement('style');

        style.type = 'text/css';

        if(style.styleSheet){

            style.styleSheet.cssText = css;

        }else{
            style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);  
})()

/* &检测是否移动设备& */ 

function isAppleMobileDevice(){
	return (/iphone|ipod|ipad|Macintosh/i.test(navigator.userAgent.toLowerCase()));
}
console.log(isAppleMobileDevice())

/* &操作Cookie方法& */

var Cookie = {
	set: function (name, value, days) {
	    var d = new Date;
	    d.setTime(d.getTime() + 24*60*60*1000*days);
	    window.document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
	},
	get: function (name) {
	    var v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	    return v ? v[2] : null;
	},
	delete: function (name) {
	    this.set(name, '', -1);
	}
}


/**
 * js常用算法合集
 * 时间2017/3/24
 */

/* & 冒泡排序 & */
var tempArr = [5,4,3,2,7,8,6,1,9,10];
function bubble(arr) {
	var l = arr.length;
	var obj = {time:0}; //遍历个数
	for (var i = 0; i < l-1; i++) {
	 	for (var j = i+1; j < l; j++) {
	 		if(arr[i]>arr[j]){
	 			var temp = arr[j];
	 			arr[j] = arr[i];
	 			arr[i] = temp; 
	 		}
	 		obj.time++;
	 	}
	}
	obj.arr = arr;
	return obj;
}
console.log(bubble(tempArr));


/** & 快速排序 & 
 * [tempArr description]
 * @type {Array}
 * 首先在数组中找到一个基准值（一般为数组中间的值），然后遍历数组中的元素，
 * 小于基准值的放到左边数组，大于基准值的放到数组右边，递归以上过程，直到最后数组的长度为1。
 * 效率：比冒泡排序快，不太稳定。
 */
var tempArr = [5,4,3,2,7,8,6,1,9,10];
var time=0;
function quickSort(arr){
    if(arr.length <= 1) return arr;
    var la = [];
    var ra = [];
    var cIndex = Math.floor(arr.length/2); //基准值索引
    var cValue = arr.splice(cIndex,1);//基准值
    
    for (var i = 0,l=arr.length; i < l; i++) {
        if(arr[i] > cValue){
            ra.push(arr[i])
        }else{
            la.push(arr[i]) 
        }
        time++;
    }
    return quickSort(la).concat(cValue,quickSort(ra))
}
console.log(quickSort(tempArr))
console.log(time)

/**
 *  & 判断字符串出现最多的字符并统计次数 & 
 * [tempStr description]
 * @type {String}
 */
var tempStr = 'asdfsdfkjkwernnsfasdfsfsafsff'
function countStr(str){
    var obj = {};
    for (var i = 0,l = str.length; i < l; i++) {
        if(obj.hasOwnProperty(str[i])){
            obj[str[i]]++;
        }else{
            obj[str[i]] = 1;
        }
    }
    return obj;
}
console.log(countStr(tempStr))

/**
 * & 数组去重 & 
 * [tempArr description]
 * @type {Array}
 */
var tempArr = [1,2,4,3,2,4,1,5,'ss','ab','ss','1','2','33','2'];
function uniq(arr){
	for (var i = 0,l = arr.length; i < l-1; i++) {
	   for (var j = i+1; j < l; j++) {
	       	if(arr[i] === arr[j]){
	       		arr.splice(j,1);
	       	}
	   };
	}
	return arr;
}
console.log(uniq(tempArr))

/**
 *  & 统计字符出现的位置 & 
 * @param  {[type]} str        [description]
 * @param  {[type]} str_target [description]
 * @return {[type]}            [description]
 */

function appear(str,str_target){
	var n = 0;
	var result = [];
	while(str.indexOf(str_target,n) > -1){
		result.push(str.indexOf(str_target,n));
		n = str.indexOf(str_target,n) + str_target.length;
	}
	return result;
}
console.log(appear('abascbascbabasbascbascascbab','ab'));

/**
 * & 移动端横竖屏  & 
 * @return {[type]} [description]
 */

function detectOrient() {
    var storage = localStorage;
    var data = storage.getItem('J-recordOrientX');
    var w = document.documentElement.clientWidth,
        h = document.documentElement.clientHeight;
    var _Width = 0,
        _Height = 0;
    if(!data) {
        _Width = window.screen.width;
        _Height = window.screen.height;
        storage.setItem('J-recordOrientX',_Width + ',' + _Height);
    }else {
        var str = data.split(',');
        _Width = str[0];
        _Height = str[1];
    }
    if(w == _Width) {
        // 竖屏
        return;
    }
    if(w == _Height){
        // 横屏
        return;
    }
}
detectOrient();
window.addEventListener('resize',detectOrient);





