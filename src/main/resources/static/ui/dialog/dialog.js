(function($) {
	//关闭弹出框
	$.ui_dgc=$.ui_dialogClose = function(who) {
		var close = function(who) {
			if (!who)
				who = "s";
			if (who == "s") {
				closeDialog($(".ui-dialog:last"));
			} else if (who == "a") {
				closeDialog($(".ui-dialog"));
			} else {
				who = "s";
				close(who)
			}
		}
		close(who);
	};
	//提示框
	$.ui_dg=$.ui_dialog = function(opts) {
		var defaults = {
			title: "提示",
			width: 0,
			//height: 0,
			con: '提示内容',
			type: "d",
			client:1,
			btn: [{name:"确定",action:function(){$.ui_dialogClose();}}],
			closeBtn:false,
			draggle: true,
			opacity: 0.3,
			draggleCallback:function(){
				
			},
			closeCallback:function(){
				
			}
		};

		opts = $.extend({}, defaults, opts);

		var len = opts.btn.length,
			objls = null,
			zIndex = getLastDialogZindex();
		var typs={
			"d":"default",
			"s":"success",
			"e":"error",
			"w":"warning"
		};
		var html = '';
		html += '<div class="ui-dialog ui-dialog-center" type="notice" style="z-index:' + (zIndex + 2) + '">';
		html += getHtmlHead(opts.title,opts.draggle,opts.closeBtn);
		html += '<div class="ui-dialog-body">';
		html += focusInput();
		var currentType=typs[opts.type]?typs[opts.type]:typs["d"];
		var styles="";
		if(opts.width){
			styles='width:'+getSize(opts.width)+";";
		}else{
			styles='min-width:200px;max-width:550px;';
		}
		html += '<div class="ui-dialog-' + currentType + '" style="'+styles+'"><div class="ui-dialog-text">' + opts.con + '</div></div>';
		html += '</div>';
		html += getHtmlFooter(opts.btn);
		html += '</div>';
		html += setHtmlShade(zIndex, opts.opacity);
		$("body").append(html);
		objls = $(".ui-dialog:last");
		btnClickEvent(objls, opts.btn,opts.closeCallback);
		//setPosition(objls);
		if (opts.draggle){
			draggle(objls,opts.draggleCallback);
		}
		objls.show();
		if(opts.client==1){
			$("#ui-dialog-Focus").focus();
		}
	};
	
	function getSize(value){
		if(!value){
			return "auto";
		}
		if(isNaN(value)&&value.indexOf("%")>-1){
			return value;
		}
		if(!isNaN(value)){
			return value+"px";
		}
		return "auto";
	}
	
	//编辑框
	$.fn.ui_dg=$.fn.ui_dialog = function(opts) {
		$("#testFocus").focus();
			var defaults = {
				title: "编辑框标题",
				btn: [],
				draggle: true,
				closeBtn:true,
				opacity:0.3,
				width:300,
				client:1,
				height:500,
				draggleCallback:function(){
					
				},
				closeCallback:function(){
					
				}
			}
			this.each(function() {
				opts = $.extend({}, defaults, opts);
				var zIndex = getLastDialogZindex();
				var obj = $(this).addClass("ui-dialog ui-dialog-center").css("z-index", zIndex + 2).attr("type", "edit");
				var type = obj.attr("type");
				var objHeight =getSize(obj.attr("height"));//.height();
				if(objHeight.indexOf("%")>-1){
					obj.css("height",objHeight);
				}
				var objWidth=getSize(obj.attr("width"));
				if(objWidth.indexOf("%")>-1){
					obj.css("width",objWidth);
				}
				var maxHeight=getSize(obj.attr("max-height"));
				var minHeight=getSize(obj.attr("min-height"));
				var objBody = null;
				if ($(".ui-dialog-body", obj).length > 0) { //已经包装好的弹出框,再次打开

				} else { //没有包装好的弹出框							
					//obj.children().wrapAll('<div class="ui-dialog-body" style="height:100px"></div>');
					if(obj.children().length>0){
						obj.children().wrapAll('<div class="ui-dialog-edit-scroll"></div>');
					}else{
						obj.html('<div class="ui-dialog-edit-scroll"></div>');
					}
					$(".ui-dialog-edit-scroll",obj).wrapAll('<div class="ui-dialog-body"></div>');
				}
				obj.prepend(getHtmlHead(opts.title,opts.draggle,opts.closeBtn)+focusInput());
				obj.append(getHtmlFooter(opts.btn));
				$(".ui-dialog-edit-scroll", obj).css({height:objHeight,width:objWidth,"max-height":maxHeight,"min-height":minHeight});  //.height(objHeight).width(objWidth);//.width(opts.width);
				btnClickEvent(obj, opts.btn,opts.closeCallback);
				$("body").append(setHtmlShade(zIndex,opts.opacity));
				if (opts.draggle){
					draggle(obj,opts.draggleCallback);
				}
				obj.show();
				if(opts.client==1){
					$("#ui-dialog-Focus").focus();
				}
			});
		}
	function focusInput(){
		return '<input id="ui-dialog-Focus" type="text" style="opacity: 0; position:absolute;top:-1000000px" value="出现弹框后,让焦点在这个地方,防止单机空格键出现单机效果"/>';
	}
	//拖拽
	function draggle(dialog,callback) {
		var pointW = 0,
			pointH = 0,
			nowLeft = 0,
			nowTop = 0;
			var dialogW=0;
			var dialogH=0;
		$(".ui-dialog-header", dialog).mousedown(function(e) {
			var offset = $(this).offset(),
				objLeft = offset.left,
				objTop = offset.top;
			pointW = e.clientX - objLeft;
			pointH = e.clientY - objTop;
			$(this).data("action", "move");
			dialogW=dialog.outerWidth();
			dialogH=dialog.outerHeight();
		}).mousemove(function(e) {
			if ($(this).data("action") !== "move")
				return;
			var objWin = $(window);
			var winW=objWin.width();
			var winH=objWin.height();
			console.log(winH);
			var scrollTop=$(document).scrollTop();
			var scrollLeft=$(document).scrollLeft();
			nowLeft = e.clientX-scrollLeft - pointW;
			nowTop = e.clientY-scrollTop - pointH;
			var maxL=winW-dialogW-1;
			var maxT=winH-dialogH-1;
			var minL=1;
			var minT=1;
			if(nowLeft<=minL){
				nowLeft=minL;
			}else if(nowLeft>=maxL){
				nowLeft=maxL
			}
			if(nowTop<=minT){
				nowTop=minT;
			}else if(nowTop>=maxT){
				nowTop=maxT;
			}
			dialog.removeClass("ui-dialog-center").css({
				left: nowLeft + "px",
				top: nowTop + "px"
			});
			callback();
		}).mouseup(function() {
			$(this).removeData("action");
		}).mouseleave(function() {
			$(this).removeData("action");
		});
	}

	//关闭弹出框调用方法
	function closeDialog(objDialog) {
		var len = objDialog.length,
			type = "";
		if (len == 0) { //没找到
			alert("没找到删除项");
		} else if (len == 1) { //单个删除
			type = objDialog.attr("type");
			if (type == "notice")
				objDialog.remove();
			else if (type == "edit") {
				objDialog.remove();
			}
			if ($(".ui-dialog").length == 0) {
				$(".ui-dialog-shade").remove();
			} else {
				var zIndex = Number($(".ui-dialog:last").css("z-index")) - 1;
				$(".ui-dialog-shade").css("z-index", zIndex);
			}
		} else { //全部删除
			$(".ui-dialog[type=notice]").remove();
			objDialog.remove();
			$(".ui-dialog-shade").remove();
		}
	}

	//按钮以及右上角关闭按钮的事件绑定
	function btnClickEvent(obj, btn,callback) {
		$(".ui-dialog-footer input[type=button]", obj).each(function() {
			var obj = $(this);
			var index = Number(obj.attr("index"));
			var len = btn.length;
			obj.click(function() {
				if (!btn[index].par)
					btn[index].par = {};
				btn[index].action(btn[index].par);
			});
		});
		$(".ui-dialog-close", obj).click(function() {
			closeDialog(obj);
			callback();
		});
	}

	//返回头部html
	function getHtmlHead(title,draggle,closeBtn) {
		var cursor="default";
		if(draggle){
			cursor="move";
		}
		var html = "";
		html += '<div class="ui-dialog-header" style="cursor:'+cursor+'">';
		html += '<span class="ui-dialog-title">' + title + '</span>';
		if(closeBtn){
			html += '<a class="ui-dialog-close" href="javascript:void(0)"></a>';
		}
		html += '</div>';
		return html;
	}

	//返回底部html
	function getHtmlFooter(btn) {
		var html = "",
			len = btn.length;
		if (len == 0){
			return html;			
		}
		var btnColor=["ui-input-blue-button","ui-input-gray-button","ui-input-yellow-button"];
		var btnClass="";
		html += '<div class="ui-dialog-footer">';
		for (var i = 0; i < len; i++) {
			btnClass="ui-input-button ";
			if(btn[i].btnClass){
				btnClass+=btn[i].btnClass;
			}else{
				btnClass+=btnColor[i];
			}
			html += '<input type="button" value="' + btn[i].name + '" class="'+btnClass+'" index=' + i + ' />';
		}
		html += '</div>';
		return html;
	}

	//设置遮罩
	function setHtmlShade(zIndex, opacity) {
		var html = "";
		if ($(".ui-dialog-shade").length == 0)
			html += '<div class="ui-dialog-shade" style="z-index:' + (zIndex + 1) + ';opacity:'+opacity+'"></div>';
		//filter:alpha(opacity='+(opacity*100)+');opacity:'+opacity+';
		else
			$(".ui-dialog-shade").css({
				"z-index": zIndex + 1,
				"opacity":opacity
			});
		//,opacity:opacity,"filter":"alpha(opacity="+(opacity*100)+")"
		return html
	}

	//获取最后一个弹出框的zindex
	function getLastDialogZindex() {
		var objls = $(".ui-dialog:last"),
			zIndex = 0;
		if (objls.length == 0)
			zIndex = 1500;
		else
			zIndex = Number(objls.css("z-index"));
		return zIndex;
	}
})(jQuery);