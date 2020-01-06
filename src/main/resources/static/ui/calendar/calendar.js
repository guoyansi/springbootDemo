(function($){
	var getPosition=function(obj){
		var offset=obj.offset();
		var left=offset.left;
		var top=offset.top;
		var height=obj.outerHeight();
		top+=height+9;//9是尖角的高度
		return {left:left,top:top};
	}
	var getDate=function(obj,y,m,d){
		y=y?y:Number($(".ui-calendar-y",obj).html());
		m=m?m:Number($(".ui-calendar-m",obj).html());
		d=d?d:Number($(".ui-calendar-day-current",obj).html());
		return new Date(y+"/"+m+"/"+d);
	}
	var getDateHtml=function(date){
		//本月
		var year=date.getFullYear();//当前年
		var month=date.getMonth()+1;//当前月
		var day=date.getDate();//当前天
		var current=new Date(year,month,0);
		var maxDay=current.getDate();//获取本月最大天数
		
		//上月
		var prevMonth=month-1;
		var prevYear=year;
		if(prevMonth<1){
			prevMonth=12;
			prevYear-=1;
		}
		prevDate=new Date(prevYear,prevMonth,0);//上个月
		var prevMaxDay=prevDate.getDate();//获取上个月最大天数
		var prevLastWeek=prevDate.getDay();
		var nextMonth=month+1;
		var nextYear=year;
		if(nextMonth>12){
			nextMonth=1;
			nextYear+=1;
		}
		//临时变量
		var i=0;
		var n=0;
		var j=0;
		var html="";
		if(prevLastWeek<6){
			for(i=prevMaxDay-prevLastWeek;i<=prevMaxDay;i++){//上月
				++n;
				html+="<span class='ui-calendar-day ui-calendar-day-gray' y="+prevYear+" m="+prevMonth+" d="+i+">"+i+"</span>";
			}
		}
		for(i=1;i<=maxDay;i++){//本月
			if(i==day){//当前天
				currentClass="ui-calendar-day-current";
			}else{
				currentClass="";
			}
			++n;
			html+="<span class='ui-calendar-day ui-calendar-day-blue "+currentClass+"' y="+year+" m="+month+" d="+i+">"+i+"</span>";
		}
		for(i=(n+1);i<=42;i++){//下月
			++j;
			html+="<span class='ui-calendar-day ui-calendar-day-gray' y="+nextYear+" m="+nextMonth+" d="+j+">"+j+"</span>";
		}
		return html;
	}
	var getYearOption=function(year){
		var html="";
		var maxYear=year+50;//下拉最大年份
		for(i=year-50;i<=maxYear;i++){
			if(i==year){
				currentClass="ui-calendar-select-current";
			}else{
				currentClass="";
			}
			html+="<span class='ui-calendar-select-option-y "+currentClass+"' value="+i+">"+i+"</span>";
		}
		return html;
	};
	var getHtml=function(obj){
		var date=new Date();
		var year=date.getFullYear();//当前年
		var month=date.getMonth()+1;//当前月
		
		var week=date.getDay();//当前周
		//临时变量
		var i=0;
		
		var weekArr=["日","一","二","三","四","五","六"];//星期
		var currentClass="";//当前下拉样式
		var pos=getPosition(obj);//定位
		var objBox=$("<div class='ui-calendar-box' style='left:"+pos.left+"px;top:"+pos.top+"px'></div>");
		var html="";
		//html+="<div class='ui-calendar-box' style='left:"+pos.left+"px;top:"+pos.top+"px'>";
		html+="<span class='ui-calendar-jiao'></span>";
		html+="<div class='ui-calendar-y-select'>";
		html+=getYearOption(year);
		html+="</div>";
		html+="<div class='ui-calendar-m-select'>";
		for(i=1;i<=12;i++){
			if(i==month){
				currentClass="ui-calendar-select-current";
			}else{
				currentClass="";
			}
			html+="<span class='ui-calendar-select-option-m "+currentClass+"' value="+i+">"+i+"</span>";
		}
		html+="</div>";
		html+="<div class='ui-calendar-ym-box'>";
		html+="<span class='ui-calendar-y'>"+year+"</span>";
		html+="<span class='ui-calendar-select-dowm ui-calendar-y-select-dowm'></span>";
		html+="<span class='ui-calendar-ym-text'>年</span>";
		html+="<span class='ui-calendar-m'>"+month+"</span>";
		html+="<span class='ui-calendar-select-dowm ui-calendar-m-select-dowm'></span>";
		html+="<span class='ui-calendar-ym-text'>月</span>";
		html+="</div>";
		html+="<div class='ui-calendar-week-box'>";
		for(i=0;i<weekArr.length;i++){
			html+="<span class='ui-calendar-week'>"+weekArr[i]+"</span>";
		}
		html+="</div>";
		html+="<div class='ui-calendar-date-box'>";
		html+=getDateHtml(date);
		html+="</div>";
		//html+="</div>";
		objBox.append(html);
		objBox.appendTo("body");
		return objBox;
	};
	var appendTime=function(objInput,objDay,opts){
		var format=opts.format;
		var y=objDay.attr("y");
		var m=objDay.attr("m");
		var d=objDay.attr("d");
		var dm=m>=10?m:"0"+m;
		var dd=d>=10?d:"0"+d;
		var value="";
		if(format==1){//2015-05-06
			value=y+"-"+dm+"-"+dd;
		}else if(format==2){//2015/05/06
			value=y+"/"+dm+"/"+dd;
		}else if(format==3){//2015年05月06日
			value=y+"年"+dm+"月"+dd+"日";
		}else if(format==4){
			value=y+"-"+m+"-"+d;
		}else if(format==5){//20150506
			value=y+dm+dd;
		}
		value=opts.defindDate(value);
		objInput.val(value);
	}
	var defaults={
		format:1,
		inputClass:"",
		defindDate:function(date){
			return date;
		}
	};
	$.fn.ui_calendar=function(opts){
		opts=$.extend({},defaults,opts);
		var prev=null;
		return this.each(function(){
			var obj=$(this);
			var timer=null;
			var timer1=null;
			var isRemove=true;
			obj.addClass("ui-calendar-input ui-calendar-input-icon");
			if(opts.inputClass){
				obj.addClass(opts.inputClass);
			}
			obj.keyup(function(){
				$(".ui-calendar-box").fadeOut("500",function(){
					$(this).remove();
				});
			}).mouseleave(function(){
				isRemove=true;
			}).blur(function(){
				if(isRemove){
					$(".ui-calendar-box").remove();
				}
			}).click(function(){
				isRemove=false;
				$(".ui-calendar-box").remove();
				var objBox=getHtml(obj,getDate(null,new Date().getFullYear(),new Date().getMonth()+1,new Date().getDate()));
				objBox.mouseleave(function(){
					$(".ui-calendar-box").remove();
				});

				objBox.on("mouseenter",function(){
					isRemove=false;
				}).on("click",".ui-calendar-select-dowm",function(){//单击年,月下拉按钮
					var _this=$(this);
					var pos=_this.position();
					var left=pos.left;
					var top=pos.top;
					top+=_this.outerHeight();
					var objSelect=null;
					if(_this.is(".ui-calendar-y-select-dowm")){//年
						objSelect=$(".ui-calendar-y-select",objBox);
						objSelect.css({left:left+"px",top:top+"px"}).show();
						objSelect.scrollTop(1000000000);//将滚动条拉最大值
						var scrollTop=objSelect.scrollTop();
						objSelect.scrollTop(scrollTop/2);
					}else{//月
						objSelect=$(".ui-calendar-m-select",objBox);
						objSelect.css({left:left+"px",top:top+"px"}).show();
					}
				}).on("mouseleave",".ui-calendar-select-dowm",function(){//鼠标离开下拉框按钮
					if(timer){
						clearTimeout(timer);
					}
					var objSelect=$(".ui-calendar-y-select,.ui-calendar-m-select");
					timer=setTimeout(function(){
						objSelect.hide();
					},50);
				}).on("mouseleave",".ui-calendar-y-select,.ui-calendar-m-select",function(){//离开下拉框
					if(timer){
						clearTimeout(timer);
					}
					var _this=$(this);
					timer=setTimeout(function(){
						_this.hide();
					},50);
				}).on("mouseenter",".ui-calendar-y-select,.ui-calendar-m-select",function(){//进入下拉框和下拉按钮
					if(timer){
						clearTimeout(timer);
					}
				}).on("mouseenter",".ui-calendar-y-select-dowm",function(){//进入下拉按钮,另一个下拉框立马消失
					$(".ui-calendar-m-select",objBox).hide();
				}).on("mouseenter",".ui-calendar-m-select-dowm",function(){//进入下拉按钮,另一个下拉框立马消失
					$(".ui-calendar-y-select",objBox).hide();
				}).on("click",".ui-calendar-select-option-y",function(){//单击年option
					var _this=$(this);
					if(_this.is(".ui-calendar-select-current")){
						return;
					}
					var y=Number(_this.html());
					$(".ui-calendar-date-box",objBox).html(getDateHtml(getDate(objBox,y)));
					$(".ui-calendar-y",objBox).html(y);
					$(".ui-calendar-y-select",objBox).hide().html(getYearOption(y));
					$(".ui-calendar-select-option-y.ui-calendar-select-current").removeClass("ui-calendar-select-current");
					$(".ui-calendar-select-option-y[value="+y+"]",objBox).addClass("ui-calendar-select-current");
					appendTime(obj,$(".ui-calendar-day-current",objBox),opts);
				}).on("click",".ui-calendar-select-option-m",function(){//单击月option
					var _this=$(this);
					if(_this.is(".ui-calendar-select-current")){
						return;
					}
					var m=Number(_this.html());
					$(".ui-calendar-date-box",objBox).html(getDateHtml(getDate(objBox,"",m)));
					$(".ui-calendar-m",objBox).html(m);
					$(".ui-calendar-m-select",objBox).hide();
					$(".ui-calendar-select-option-m.ui-calendar-select-current").removeClass("ui-calendar-select-current");
					$(".ui-calendar-select-option-m[value="+m+"]",objBox).addClass("ui-calendar-select-current");
					appendTime(obj,$(".ui-calendar-day-current",objBox),opts);
				}).on("click",".ui-calendar-day",function(){//单机日期
					$(".ui-calendar-day-current",objBox).removeClass("ui-calendar-day-current");
					var _this=$(this);
					_this.addClass("ui-calendar-day-current");
					appendTime(obj,_this,opts);
					$(".ui-calendar-box").remove();
				});
			});
			
		});
	}
})(jQuery);