(function($){ 
	var defaults={
		num:10,	//页码个数
		count:102, //总数
		size:10, //每页展示条数
		//sizes:[10,20,30],
		sizes:[],
		pos:"c",//l,r,c
		//hiddenPosition:7,
		page:1,	//当前页
		clickEvent:function(page,size){
	 		
		}
	};
	//重置html
	function resetHtml(opts,obj){
		var pageCount=Math.ceil(opts.count/opts.size);
		var middlePage=Math.ceil(pageCount/2);//中间页
		//var currentPos=0;//当前位置()
		var i=1,j=0;
		var n=0; //另一端的页码数
		var z=0;//当前页的前一页或后一页
		var maxPage=0;
		var getPageHtml=function(type,page){
			var currentPage="";
			if(type==1){//省略号
				return "<span class='ui-pagination-Hidden'>...</span>";
			}else if(type==2){
				if(page==opts.page){
					currentPage="ui-pagination-Current";
				}
				return "<a class='ui-pagination-Num "+currentPage+"'>" + page + "</a>";
			}
		};
		var html="";
		if(opts.pos=="l"){
			html+="<div class='ui-pagination ui-pagination-position-left'>";
		}else if(opts.pos=="r"){
			html+="<div class='ui-pagination ui-pagination-position-right'>";
		}else{
			html+="<div class='ui-pagination ui-pagination-position-center'>";
		}
		if(opts.sizes.length!=0){
			html+="<select class='ui-pageSizes'>";
			for(var k=0;k<opts.sizes.length;k++){
				if(opts.size==opts.sizes[k]){
					html+="<option value="+opts.sizes[k]+" selected='selected'>"+opts.sizes[k]+"</option>";
				}else{
					html+="<option value="+opts.sizes[k]+">"+opts.sizes[k]+"</option>";				
				}
			}
			html+="</select>";
		}
		
		//html+="<span class='ui-pagination-text'>共"+opts.count+"条记录 ,"+pageCount+"页</span>";
		html+="<a class='ui-pagination-FirstPage'><label>首页</label></a>";
			html+="<a class='ui-pagination-PrevPage'>上页</a>";
		if(pageCount<=opts.num){//没有省略号
			for(;i<=pageCount;i++){
				html+=getPageHtml(2,i);
			}
		}else{//有省略号
			n=opts.num-4;//剩余页码的坑
			if(opts.page<=middlePage){// x+1+3  1是省略号 3是后面几个页码
				z=opts.page+1;//当前页的后一页,省略号的前一格
				if(z<=n){//
					for(i=1;i<=n;i++){
						html+=getPageHtml(2,i);
					}
				}else{
					for(i=(z-n+1);i<=z;i++){
						html+=getPageHtml(2,i);
					}
				}
				html += getPageHtml(1);
				
				for(i=pageCount-2;i<=pageCount;i++){
					html+=getPageHtml(2,i);
				}
				
			}else{// 3+1+x 1是省略号 3是前面几个页码
				for(i=1;i<=3;i++){
					html+=getPageHtml(2,i);
				}
				html += getPageHtml(1);
				//debugger
				z=opts.page-1;//当前页的前一页,省略号的后一格
				maxPage=z+n-1;
				//maxPage=maxPage>pageCount?pageCount:maxPage;
				if(maxPage>pageCount){
					maxPage=pageCount;
					z=pageCount-n+1;
				}
				for(i=z;i<=maxPage;i++){
					html += getPageHtml(2,i);
				}
			}
		}
		html+="<a class='ui-pagination-NextPage'>下页</a>";
		html+="<a class='ui-pagination-LastPage'>末页</a>";
		html+="<input class='ui-jumpNum' type='text' value='' />";
		html+="<a class='ui-jumpText' href='javascript:void(0)'>跳转</a>";
		html+="</div>";
		obj.html(html);
		var pageWidth=0;
		$(".ui-pagination",obj).children().each(function(){
			pageWidth+=$(this).outerWidth(true);
		});
		$(".ui-pagination",obj).width(pageWidth+opts.num+6);
	}
	$.fn.ui_pn=$.fn.ui_pagination=function(opts){
		opts=$.extend({},defaults,opts);
		this.each(function(){
			var obj=$(this).addClass("ui-pagination-box");
			var  page=obj.attr("page");
			var count=obj.attr("count");
			if(page){
				opts.page=page;
			}
			if(count){
				opts.count=count;
			}
			opts.page=parseInt(opts.page);
			opts.count=parseInt(opts.count);
			opts.num=parseInt(opts.num);
			opts.size=parseInt(opts.size);
			
			if(opts.count==0){
				opts.count=1;
			}
			
			
			var pageCount=Math.ceil(opts.count/opts.size);//总页数
			resetHtml(opts,obj);
			//单击页码
			$("a.ui-pagination-Num",obj).click(function(){
				var page=parseInt($(this).html());
				if(page==opts.page){
					return;
				}
				opts.page=page;
				opts.clickEvent(page,$(".ui-pageSizes",obj).val());
			});
			//下拉框size变动
			$(".ui-pageSizes",obj).change(function(){
				opts.page=1;
				opts.clickEvent(opts.page,$(this).val());
			});
			//首页
			$(".ui-pagination-FirstPage",obj).click(function(){
				var page=parseInt($(".ui-pagination-Current",obj).html());
				if(page==1){
					return;
				}
				opts.page=1;
				opts.clickEvent(opts.page,$(".ui-pageSizes",obj).val());
			});
			//上页
			$(".ui-pagination-PrevPage",obj).click(function(){
				var page=parseInt($(".ui-pagination-Current",obj).html())-1;
				if(page<=0){
					return;
				}
				opts.page=page;
				opts.clickEvent(opts.page,$(".ui-pageSizes",obj).val());
			});
			//下一页
			$(".ui-pagination-NextPage",obj).click(function(){
				var page=parseInt($(".ui-pagination-Current",obj).html())+1;
				if(page>pageCount){
					return;
				}
				opts.page=page;
				opts.clickEvent(opts.page,$(".ui-pageSizes",obj).val());
			});
			//末页
			$(".ui-pagination-LastPage",obj).click(function(){
				var page=parseInt($(".ui-pagination-Current",obj).html());
				if(page==pageCount){
					return;
				}
				opts.page=pageCount;
				opts.clickEvent(opts.page,$(".ui-pageSizes",obj).val());
			});
			//文本框enter
			$(".ui-jumpNum",obj).keyup(function(e){
				if(e.which!=13){
					return;
				}
				var textPage=$.trim($(this).val());
				if(!textPage||isNaN(textPage)){
					textPage=1;
				}
				textPage=parseInt(textPage);
				var page=parseInt($(".ui-pagination-Current",obj).html());
				if(textPage>pageCount||textPage<=0){
					/*alert("您输入的页码超出范围");
					return;*/
					textPage=1;
				}
				if(page==textPage){
					return;
				}
				opts.page=textPage;
				opts.clickEvent(opts.page,$(".ui-pageSizes",obj).val());
				$(".ui-jumpNum",obj).focus();
			});
			//单击跳转
			$(".ui-jumpText",obj).click(function(){
				var textPage=$.trim($(".ui-jumpNum",obj).val());
				if(!textPage||isNaN(textPage)){
					textPage=1;
				}
				textPage=parseInt(textPage);
				var page=parseInt($(".ui-pagination-Current",obj).html());
				if(textPage>pageCount||textPage<=0){
					textPage=1;
				}
				if(page==textPage){
					return;
				}
				opts.page=textPage;
				opts.clickEvent(opts.page,$(".ui-pageSizes",obj).val());
				$(".ui-jumpNum",obj).focus();
			});
		});
	}
})(jQuery);
