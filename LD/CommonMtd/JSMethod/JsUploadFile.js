/**
 * upload ajax file 
 * @version 1.0
 * @time 2017/4/25
 */

;(function($){
	
	function showPic(){
		var pic = $("#pic").get(0).files[0];
		$('img').prop("src",window.url.createObjectURL(pic));
	}

	function uploadFile(){
		var pic = $("#pic").get(0).files[0];
		var formDate = new FormDate();
		formDate.append("pic",pic);
		/**
		 * 必须false 才会避开Jquery 对 formdate 的处理
		 * XmlHttpRquest 会对 formdata 进行正确处理
		 */
		$.ajax({
			type:"post",
			url:"upload",
			data:formData,
			processData:false,
			contentType:false,
			xhr:function(){
				var xhr = $.ajaxSettings.xhr();
				if(onporcess && xhr.upload){
					xhr.upload.addEventListener("progress" , onprogress ,false);
					return xhr;
				}
			}
		})
	}
	/**
	 * 侦查附件上传情况 ，这个方法大概0.05-0.1秒执行一次
	 */
	
	function onprogress(evt){
		var loaded = evt.loaded; //已经上传大小情况
		var tot = evt.total;	 //附件总大小 
		var per = Math.floor(100*loaded/tot); //已经上传的百分比  
		$("#son").html( per +"%" );
        $("#son").css("width" , per +"%");
	}


})(jQuery);