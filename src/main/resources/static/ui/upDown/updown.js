/**
 * css
 * #window{
		background-color: red;
		overflow: auto;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}
*******html
 * <div id="window">
	</div>
	js调用
 * var i=0;
	$("#window").ui_reload({
		down:function(){
			i--;
			$("#window").prepend('<p style="height: 30px; widows: 100%; margin-bottom: 10px; background-color: darkgray;">'+i+'</p>');
		},
		up:function(callback){
			$("#window").append('<p style="height: 30px; widows: 100%; margin-bottom: 10px; background-color: darkgray;"></p>');
			$("p").each(function(index){
				$(this).html(index+1);
			});
			callback();
		}
	});
 *
 */
(function($) {
	$.fn.ui_reload = function(opt) {
		var upCodition = function(scrollTop) {
			var totalHeight = 0;
			obj.children().each(function() {
				totalHeight += $(this).outerHeight(true);
			});
			var winH = obj.height();
			var maxScrolltop = totalHeight - winH;
			//getCurrent();
			var step = maxScrolltop - scrollTop;
			if(step <= 5) {
				return true;
			} else {
				return false;
			}
		};
		var shade=function(box){
			box.append("<div class='ui_reload_shade' style='position:absolute;top:0;bottom:0;width:100%'></div>");
			$("ui_reload_shade",box).on("touchmove",function(event){
				event.preventDefault();
			});
		};
		var shadeClose=function(box){
			$(".ui_reload_shade",box).remove();
		};
		var stopAnimation=function(){
			$("#"+idname).find(".ui-reload-load1").animate({"height":0},"fast",function(){
				shadeClose();
			});
			$("#"+idname).find(".ui-reload-load2").animate({"height":0},"fast",function(){
				shadeClose();
			});
		};
		var getIdGuid=function(name){
			if($("#"+name).length>0){
				name+="-";
				getIdGuid(name);
			}else{
				return name;
			}
		};
		var defaults={
			left:0,
			right:0,
			top:0,
			bottom:0/*,
			up:function(callback){
				callback();
			},
			down:function(callabck){
				callback();
			}*/
		};
		opt=$.extend({},defaults,opt);
		var idname="ui_reload"+(new Date()).getTime();
		idname=getIdGuid(idname);
		/**
		 * "-webkit-overflow-scrolling":"touch"
		 * 为了解决苹果手机在有滚动条的情况下,滑动不顺畅的原因
		 */
		var obj = $(this).css({"overflow":"auto","height":"100%","-webkit-overflow-scrolling":"touch"});
		obj.wrap("<div id='"+idname+"' style='position:absolute;z-index:10;top:"+opt.top+"px;bottom:"+opt.bottom+"px;left:"+opt.left+"px;right:"+opt.right+"px'></div>");//.append("<div class='ui-reload-load ui-reload-load1'></div><div class='ui-reload-load ui-reload-load2'></div>");
		$("#"+idname).prepend("<div class='ui-reload-load ui-reload-load1'><span class='ui-relaod-load-icon'></span></div>").append("<div class='ui-reload-load ui-reload-load2'><span class='ui-relaod-load-icon'></span></div>");
		shade($("#"+idname));
		opt.up(function() {
			stopAnimation();
		});
		var pointStartY;
		var pointEndY;
		var uiloadH=0;
		obj.on("touchstart", function(event) {
			pointStartY = event.originalEvent.targetTouches[0].pageY;
			obj.data("move", false);
			obj.data("action",0);
			uiloadH=0;
			//微信浏览器下拉顶部会有浏览器空区域,导致页面的touc事件失效
		}).on("touchmove", function(event) {
			obj.data("move", true);
			pointEndY = event.originalEvent.targetTouches[0].pageY;
			uiloadH=(pointEndY-pointStartY)/3;
			//$("#gys").html("拖行距离:"+uiloadH+">>起始位置:"+pointStartY+">>结束位置:"+pointEndY);
			var st = obj.scrollTop();
			if(uiloadH>0&&opt.down){//下滑
				if(uiloadH>=50){
					uiloadH=50;
				}
				if(st==0){
					//obj.css("padding-top",uiloadH+"px");
					$("#"+idname).find(".ui-reload-load1").height(uiloadH);
					//微信浏览器下拉顶部会有浏览器空区域,导致页面的touc事件失效
					event.preventDefault();
					if(uiloadH==50){
						obj.data("action",1);
					}else{
						obj.data("action",0);
					}
					
				}
			}else if(uiloadH<0&&opt.up){//上滑
				if(uiloadH<=-50){
					uiloadH=-50;
				}
				console.log(st+";"+upCodition(st));
				if(st == 0||upCodition(st)) {
					$("#"+idname).find(".ui-reload-load2").height(Math.abs(uiloadH));
					if(uiloadH==-50){
						obj.data("action",2);
					}else{
						obj.data("action",0);
					}
				}
			}
		}).on("touchend", function(event) {
			//$("#gys").append("Action:"+obj.data("action"))
			if(obj.data("action")==1){
				shade($("#"+idname));
				opt.down(function(){
					stopAnimation();
				});
			}else if(obj.data("action")==2){
				shade($("#"+idname));
				opt.up(function() {
					obj.animate({scrollTop: obj.scrollTop() + 80},100);
					stopAnimation();
				});
			}else{
				stopAnimation();
			}
		});
	}
})(jQuery);