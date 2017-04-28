(function(){
	/** 
	 * 获取本周、本季度、本月、上月的开端日期、停止日期
	 * 2017.4.20
	 * version 1.0 
	 */ 
	
	var now = new Date(); // 获取当前日期
	var nowDayOfWeek = now.getDay(); // 今天本周的第几天
	var nowDay = now.getDate(); //当前日
	var nowMonth = now.getMonth(); // 当前月
	var nowYear = now.getYear(); //当前年
	nowYear += (nowYear < 2000) ? 1900 : 0; //

	var lastMonthData = new Date(); // 上月日期
	lastMonthData.setDate(1);
	lastMonthData.setMonth(lastMonthData.getMonth() - 1);
	var lastYear = lastMonthData.getYear();
	var lastMonth = lastMonthDate.getMonth();

	//  格式化日期 yyyy-mm-dd
	function formatDate(date){
		var myYear = date.getFullYear();
		var myMonth = date.getMonth()+1; 
		var myWeekDay = date.getDate(); 

		if(myMonth < 10){
			myMonth = "0" + myMonth;
		}
		if(myWeekDay < 10 ){
			myWeekDay = "0" + myWeekDay;	
		}
		return (myYear + "-" + myMonth + "-" +myWeekDay+  )
	};

	// 获得某月的天数 

	function getMonthDays(myMonth){
		var monthStartDate = new Date(nowYear, myMonth, 1);
		var monthEndDate = new Date(nowYear,myMonth+1, 1);
		var days = (monthEndDate - monthStartDate)/(1000*60*60*24)
		return days;
	};

	// 获得本季度 开端月份

	function getQuarterStartMonth(){
		var quarterStartMonth = 0; 
		if(nowMonth<3){ 
		quarterStartMonth = 0; 
		} 
		if(2<nowMonth && nowMonth<6){ 
		quarterStartMonth = 3; 
		} 
		if(5<nowMonth && nowMonth<9){ 
		quarterStartMonth = 6; 
		} 
		if(nowMonth>8){ 
		quarterStartMonth = 9; 
		} 
		return quarterStartMonth; 
	};

	//  获得本周的开端日期 

	function getWeekStartData(){
		var weekStartData = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
		return formatDate(weekStartDate); 
	};

	//  获得本周停止日期日期 
	function getWeekStartData(){
		var weekEndData = new Date(nowYear, nowMonth, nowDay+ (6 - nowDayOfWeek));
		return formatDate(weekEndData); 
	};

	// 获得本月的开端日期 
	
	function getMonthStartData(){
		var monthStartDate = new Date(nowYear, myMonth, 1);
		return formatDate(monthStartDate); 
	};

	//获得本月的停止日期 
	function getMonthEndDate(){ 
		var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth)); 
		return formatDate(monthEndDate); 
	};

	//获得上月开端日期 
	function getLastMonthStartDate(){ 
		var lastMonthStartDate = new Date(nowYear, lastMonth, 1); 
		return formatDate(lastMonthStartDate); 
	}

	//获得上月停止日期  
	function getLastMonthEndDate(){ 
		var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth)); 
		return formatDate(lastMonthEndDate); 
	}

	//获得本季度的开端日期 
	function getQuarterStartDate(){
		var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1); 
		return formatDate(quarterStartDate); 
	}

	//获得本季度的停止日期 
	function getQuarterEndDate(){ 
		var quarterEndMonth = getQuarterStartMonth() + 2; 
		var quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth)); 
		return formatDate(quarterStartDate); 
	} 

})(window);
