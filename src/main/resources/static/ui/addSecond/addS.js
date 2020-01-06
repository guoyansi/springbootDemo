(function($) {
	var doubleNum = function(num) {
		if(num < 10) {
			return "0" + num;
		}
		return num;
	};

	var htmlTime = function(obj, time) {
		var str = time.getFullYear() + "-" + doubleNum((time.getMonth() + 1)) + "-" + doubleNum(time.getDate()) + " " + doubleNum(time.getHours()) + ":" + doubleNum(time.getMinutes()) + ":" + doubleNum(time.getSeconds());

		obj.html(str);
	};

	$.fn.ui_addS = function(time) {
		time = new Date(time);
		var obj = $(this);
		htmlTime(obj, time);
		setInterval(function() {
			time.setSeconds(time.getSeconds() + 1);
			htmlTime(obj, time);
		}, 1000);
	}
})(jQuery);