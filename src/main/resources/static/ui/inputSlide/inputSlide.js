(function($) {
	$.fn.ui_inputSlide = function(opt) {
		return this.each(function() {
			var obj = $(this);
			var timer = null;
			obj.hover(function() {
				var v = $(this).val();
				if(!v) {
					return;
				}
				var arr = v.split(",");
				var len = arr.length;
				var html = "<ul id='ui-inputslide-box' class='ui-inputslide-pos-box'>";
				for(var i = 0; i < len; i++) {
					html += "<li class='ui-inputslide-pos-box-item'>" + arr[i] + "</li>";
				}
				html += "</ul>";
				$("body").append(html);
				clearTimeout(timer);
				$("#ui-inputslide-box").hover(function() {
					clearTimeout(timer);
				}, function() {
					timer = setTimeout(function() {
						$("#ui-inputslide-box").remove();
					}, 300);
				});
				var offset = $(this).offset();
				var left = offset.left;
				var top = offset.top;
				var h = $(this).outerHeight() + 2;
				var w=$(this).outerWidth();
				$("#ui-inputslide-box").css({
					left: left + "px",
					top: (top + h) + "px",
					width:w+"px"
				}).show();
			}, function() {
				timer = setTimeout(function() {
					$("#ui-inputslide-box").remove();
				}, 300);
			})
		});
	}
})(jQuery);