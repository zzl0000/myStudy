/**
 * 移动端兼容性处理合计
 * time 2017.4.20
 * version 1.0
 */

/**
 * 1.触摸事件的响应顺序为 touchstart --> touchmove --> touchend --> click,也可以通过绑定ontouchstart事件，加快对事件的响应，解决300ms延迟问题
 * 2.一些情况下对非可点击元素如(label,span)监听click事件，ios下不会触发，css增加cursor:pointer就搞定了。
 * 3.三星手机遮罩层下的input、select、a等元素可以被点击和focus(点击穿透)
 */


/**
 * 4.h5底部输入框 被键盘遮挡的问题
 */

function(){
	var oHeight = $(document).height(); // 浏览器当前高度
	$(window).resize(function(){
		if($(document).height() < oHeight){
			$("#footer").css("position","static");
		}
		else{
			$("#footer").css("position","absolute");
		}
	});
}

//5.不让 Android 手机识别邮箱
<meta content="email=no" name="format-detection">

//6 .禁止 iOS 识别长串数字为电话
<meta content="telephone=no" name="format-detection" />

//7.禁止 iOS 弹出各种操作窗口
-webkit-touch-callout:none

//8.消除 transition 闪屏
-webkit-transform-style: preserve-3d;     /*设置内嵌的元素在 3D 空间如何呈现：保留 3D*/
-webkit-backface-visibility: hidden;      /*(设置进行转换的元素的背面在面对用户时是否可见：隐藏)*/

//9.iOS 系统中文输入法输入英文时，字母之间可能会出现一个六分之一空格可以通过正则去掉      
this.value = this.value.replace(/\u2006/g, '');

//10.禁止ios和android用户选中文字
-webkit-user-select:none

//11.在ios和andriod中,audio元素和video元素在无法自动播放应对方案：触屏即播

$('html').one('touchstart',function(){
    audio.play()
})

//12.ios下取消input在输入的时候英文首字母的默认大写

<input autocapitalize="off" autocorrect="off" />

//13.android下取消输入语音按钮
input::-webkit-input-speech-button {display: none}

/*16.fixed定位缺陷
ios下fixed元素容易定位出错，软键盘弹出时，影响fixed元素定位
android下fixed表现要比iOS更好，软键盘弹出时，不会影响fixed元素定位
ios4下不支持position:fixed
解决方案：可用iScroll插件解决这个问题*/

//17.阻止旋转屏幕时自动调整字体大小
html, body, form, fieldset, p, div, h1, h2, h3, h4, h5, h6 {-webkit-text-size-adjust:none;}

/*19 往返缓存问题
点击浏览器的回退，有时候不会自动执行js，特别是在mobilesafari中。这与往返缓存(bfcache)有关系。

解决方法 ：window.onunload = function(){};*/

//22 在移动端修改难看的点击的高亮效果，iOS和安卓下都有效：
* {-webkit-tap-highlight-color:rgba(0,0,0,0);pointer-events: none;}

/*document.documentElement.style.height = window.innerHeight + 'px'; */
