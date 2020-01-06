(function($){
	//冻结表头
	var headHtml=function(obj){
		var tableHtml=obj.children("table").prop("outerHTML");
		var oldHead=obj.children("table").find("thead")
		var h=oldHead.height();
		var newHtml="<div class='ui-table-freezehead'>"+tableHtml+"</div>";
		var newObj=$(newHtml);
		obj.append(newObj);
		newObj.css({"position":"absolute","z-index":"1","top":"0","left":0,"height":h+"px","overflow":"hidden"});
		var headBjColor=oldHead.css("background-color");
		headBjColor=="rgba(0, 0, 0, 0)"?newObj.css("background-color","white"):newObj.css("background-color",headBjColor);
	};
	//冻结列
	var frezeColumnHtml=function(obj,targetIndex){
		var tableHtml=obj.children("table").prop("outerHTML");
		var lastTrForThInHead=obj.children("table").children("thead").children("tr").find("th");
		var targetColumn=lastTrForThInHead.eq(targetIndex);
		var w=targetColumn.outerWidth()+1;
		var offsetLeft=0;
		lastTrForThInHead.each(function(index){
			if(index<targetIndex){
				offsetLeft+=$(this).outerWidth(true);
			}else{
				return false;
			}
		});
		var positionLeft=offsetLeft;
		var freezeCloumnId="freezeColumn"+new Date().getTime();
		var newHtml="<div id='c_"+freezeCloumnId+"' class='ui-table-freezeColumn' style='position:absolute;z-index:2;top:0;width:"+w+"px;overflow:hidden;left:"+positionLeft+"px;background-color:white;box-shadow:-1px 0 8px rgba(0,0,0,0.3);'>"+tableHtml+"</div>";
		var newObj=$(newHtml);
		newObj.children("table").css("margin-left","-"+offsetLeft+"px");//.find("thead").css("visibility","hidden");
		obj.append(newObj);
		newObj.data("rlativeLeft",positionLeft-obj.scrollLeft());
		
		var h=targetColumn.outerHeight();
		//冻结列表头
		var newHeadHtml="<div id='h_"+freezeCloumnId+"' class='ui-table-freezeColumn-head' style='position:absolute;z-index:3;top:"+obj.scrollTop()+"px;height:"+h+"px;width:"+w+"px;overflow:hidden;left:"+offsetLeft+"px;background-color:white;'>";
		newHeadHtml+="<span id='close_btn_"+freezeCloumnId+"' v='"+freezeCloumnId+"' targetIndex='"+targetIndex+"' class='ui-table-freezeCloumn-head-close'>x</span>";
		 newHeadHtml+=tableHtml;
		 newHeadHtml+="</div>";
		var newHeadObj=$(newHeadHtml);
		newHeadObj.children("table").css("margin-left","-"+offsetLeft+"px");
		//$("tbody",newHeadObj).remove();
		obj.append(newHeadObj);
		newHeadObj.data("rlativeLeft",positionLeft-obj.scrollLeft());
		
		
		$("#close_btn_"+freezeCloumnId).click(function(){
			var v=$(this).attr("v");
			var targetIndex=$(this).attr("targetIndex");
			$("#h_"+v).remove();
			$("#c_"+v).remove();
			$("thead",obj).each(function(){
                $("th",this).eq(targetIndex).removeAttr("freeze");
            });
		});
	};
	//表头是否允许冻结
	var isHeadFreeze=function(obj){
		if(obj.height()>obj.children("table").height()){
			return false;
		}
		return true;
	};
	var isColumnFreeze=function(obj){
		if(obj.width()>obj.children("table").width()){
			return false;
		}
		return true;
	};
	var checkFreeze=function(obj){
		var res=true;
		$("th,td",obj).each(function(){
			if($(this).attr("rowspan")||$(this).attr("colspan")){
				res=false;
				return false;
			}
		});
		return res;
	};
	
	$.fn.ui_table=function(opts){
		var defaults={
			
		};
		
		this.each(function(){
			var obj=$(this);
			obj.children("table").css("width","100%").find("th").css({"white-space":"nowrap","overflow":"hidden"});
			obj.css({"position":"relative","overflow":"auto"});
			//满足表头冻结的条件
			if(isHeadFreeze(obj)){
				headHtml(obj);				
			}
            //无法执行冻结操作
            if(!checkFreeze(obj)){
                return;
            }
			//满足列冻结的条件
			if(!isColumnFreeze(obj)){
				return;
			}
            var timer=null;
            $("th",obj).bind("contextmenu", function(){
                return false;
            }).mousedown(function(e) {
                if (e.which!=3) {
                    return;
                }
                var targetIndex=$(this).index();
                if($(this).attr("freeze")=="1"){
                    return;
                }
                $(".ui-table-rightclick-box").remove();
                var html='';
                html+="<div class='ui-table-rightclick-box' style='left:"+(e.pageX-35)+"px;top:"+e.pageY+"px'>";
                html+="<div class='ui-table-rightclick-top'></div>";
                html+="<div class='ui-table-rightclick-box-div'>";
                html+="<p class='ui-table-rightclick-box-item'>冻结列</p>";
                /*html+="<p class='ui-table-rightclick-box-item'>升序</p>";
                html+="<p class='ui-table-rightclick-box-item'>降序</p>";*/
                html+="</div>";
                html+="</div>";

                setTimeout(function(){
                    $("body").append(html);
                    $(".ui-table-rightclick-box").mouseover(function(){
                        clearTimeout(timer);
                    }).mouseleave(function(){
                        var self=$(this);
                        timer=setTimeout(function(){
                            self.remove();
                        },200)
                    });
                    $(".ui-table-rightclick-box-item").click(function(){
                        $(".ui-table-rightclick-box").remove();
                        frezeColumnHtml(obj,targetIndex);
                        $("thead",obj).each(function(index){
                            $("th",this).eq(targetIndex).attr("freeze","1");
                        });
                    });
                },200);
            }).mouseleave(function(){
                timer=setTimeout(function(){
                    $(".ui-table-rightclick-box").remove();
                },200);
            }).mouseover(function(){
                clearTimeout(timer);
            });


			obj.scroll(function(){
				var top=obj.scrollTop();
				var left=0;
				//冻结表头
				$(".ui-table-freezehead",obj).css("top",top+"px");
				//冻结列表头
				var columnHead=$(".ui-table-freezeColumn-head",obj);
				columnHead.css("top",top+"px");
				$(".ui-table-freezeColumn",obj).each(function(){
					left=obj.scrollLeft()+$(this).data("rlativeLeft");	
					$(this).css("left",left+"px");
				});
				$(".ui-table-freezeColumn-head",obj).each(function(){
					left=obj.scrollLeft()+$(this).data("rlativeLeft");	
					$(this).css("left",left+"px");
					$(this).css("top",top+"px");
				});
			});
		});
	}
})(jQuery);