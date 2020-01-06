(function($){
	var defaults={
		fn:function(){
			
		}
	};
	$.fn.ui_enter=function(opts){
		var op={};
		if(typeof opts=="function"){
			op.fn=opts;
		}else{
			op=$.extend({},defaults,opts);
		}
		this.each(function(){
			var obj=$(this);
			obj.keyup(function(e){
				if(e.which==13){
					op.fn();
				}
			});
		});
	}
})(jQuery);