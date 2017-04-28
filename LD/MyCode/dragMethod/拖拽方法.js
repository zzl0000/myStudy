// PC端拖拽 function
$(".suspend-cart").on({
	    mousedown: function(e){
	                var el=$(this);
	                var os = el.offset();
	                	dx = e.pageX-os.left, 
	                	dy = e.pageY-os.top;
	                $(document).on('.suspend-cart', function(e){ 
	                	el.offset({
	                		top: e.pageY-dy,
	     					left: e.pageX-dx
	                	});
	                });
	            },
	   	mouseup: function(e){ 
	   		$(document).off('.suspend-cart'); 
	   	}
 })

var drag = function(obj,parentNode){
	var isdrag=false; 
	var obj = document.getElementById(obj);
    if(arguments.length == 1){
        var parentNode = window.self;
        var pWidth = parentNode.innerWidth,pHeight = parentNode.innerHeight;
    }else{
        var parentNode = document.getElementById(parentNode);
        var pWidth = parentNode.clientWidth,pHeight = parentNode.clientHeight;
    } 

    obj.addEventListener('touchstart',function(event){
        //当只有一个手指时              .
        var touch = event.targetTouches[0]; 
        var disX = touch.clientX - obj.offsetLeft,disY = touch.clientY - obj.offsetTop;           
        var oWidth = obj.offsetWidth,oHeight = obj.offsetHeight;
        obj.addEventListener('touchmove',function(event){
        	if(event.touches.length == 1){
                event.preventDefault();        
        	};          	
            var touch = event.targetTouches[0];
            obj.style.left = touch.clientX - disX  + 'px';
            obj.style.top = touch.clientY - disY + 'px';
            //左侧
            if(obj.offsetLeft <=0){
                obj.style.left = 0;
            };
            //右侧
            if(obj.offsetLeft >= pWidth -oWidth){
                obj.style.left =  pWidth - oWidth + 'px';
            };
            //上面
            if(obj.offsetTop <= 0){
                obj.style.top = 0;
            };
            //下面
            if(obj.offsetTop >= pHeight - oHeight){
                obj.style.top =  pHeight - oHeight + 'px';
            };
        });
        obj.addEventListener('touchend',function(event){
            //obj.removeEventListener('touchmove');
            //obj.removeEventListener('touchend');
        })
    });
	
}



