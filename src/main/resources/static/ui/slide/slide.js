; (function ($) {
            var defaults = {
            	isFullBox:false,//不满一屏幕，是否滚动
                dir: "left", //none:不动,up:上,right:右,down:下,left:左
                delay: 30,//执行时间
            };
            $.fn.ui_slide = function (opt) {
                opt = $.extend({}, defaults, opt);

                //全局变量区域
                var obj = $(this); //当前对象
                var dirs={left:"left",right:"right",up:"up",down:"down",none:"none"};
                obj.css({ "overflow": "hidden" }); //初始化元素
                if (opt.dir === dirs.none) return;
                var objLis = obj.children(); //对象中的子元素
                objLis.css({ "overflow": "hidden" });
                var objSize = 0; //外框尺寸
                var scrollEvent = "scrollLeft"; //滚动条的滚动方向
                var liTotalSize = 0, liTotalSizeOther = 0; //每个li元素的尺寸(宽或者高),克隆之后的总尺寸
                var scrollSize = 0, //滚动条的实际距离
                    scrollSizeMax = 0, //滚动条的最大距离
                    scrollSizeMin = 0; //滚动条的最小距离
                var interval = undefined; //记录setInterval
                var isScroll=true;

                if (opt.dir ===dirs.up || opt.dir ===dirs.down) {//上下
                    objSize = obj.innerHeight();
                    scrollEvent = "scrollTop";
                    obj.css({ "paddingTop": 0, "paddingBottom": 0 }).height(objSize);
                }
                else if (opt.dir === dirs.left || opt.dir === dirs.right) {//左右
                    objSize = obj.innerWidth();
                    scrollEvent = "scrollLeft";
                    obj.css({ "paddingLeft": 0, "paddingRight": 0 }).width(objSize);
                }                
                else {
                    alert("你的dir参数有误");
                    return;
                }

                var getChildTotalSize = function (dir,dirs,objLis) {// 定义获取li总尺寸的方法     
                    if (dir === dirs.left || dir ===dirs.right) {
                        objLis.css("float", "left");
                        return function () {
                            objLis.each(function () {
                                liTotalSize += $(this).outerWidth(true);
                            });
                        }
                    }
                    else if (dir === dirs.up || dir ===dirs.down) {
                        objLis.css("float", "none");
                        return function () {
                            objLis.each(function () {
                                liTotalSize += $(this).outerHeight(true);
                            });
                        }
                    }
                } (opt.dir,dirs,objLis);
                getChildTotalSize(); //获得所有的li的总尺寸,在方法中赋值

                (function (obj) {
                	if(objSize>liTotalSize){
                		isScroll=false;
                		return;
                	}
                    var cloneCount = Math.ceil(objSize * 2 / liTotalSize); //赋值子元素多少遍
                    var cloneHtmlNow = "", cloneHtmlStart = obj.html(); //原始的子元素字符串

                    for (var i = 0; i < cloneCount; i++) {
                        cloneHtmlNow += cloneHtmlStart;
                    }
                    obj.append(cloneHtmlNow);
                    liTotalSizeOther = (cloneCount + 1) * liTotalSize; //获取添加了子元素之后的长度
                })(obj);


                if (opt.dir === dirs.left || opt.dir === dirs.right) {
                    obj.css({ "position": "relative", "z-index": 0 });
                    obj.children().css({ "position": "absolute", "z-index": 1 });
                    var left = 0;
                    obj.children().each(function () {
                        $(this).css({ "left": left + "px", "top": 0 });
                        left += $(this).outerWidth(true);
                    });
                }


                //滚动条的滚动方法
                function scrollChange(dir) {
                    if (dir ===dirs.left || dir === dirs.up) {
                        obj[scrollEvent](0);
                        scrollChange = function () {
                            scrollSize++;
                            if (scrollSize >= liTotalSize) scrollSize = 0;
                            obj[scrollEvent](scrollSize);
                        }
                    }
                    else if (dir === dirs.right|| dir ===dirs.down) {
                        scrollSizeMax = liTotalSizeOther - objSize;
                        obj[scrollEvent](scrollSizeMax);
                        scrollSize = scrollSizeMax;
                        scrollSizeMin = scrollSizeMax - liTotalSize;
                        scrollChange = function () {
                            scrollSize--;
                            if (scrollSize <= scrollSizeMin) scrollSize = scrollSizeMax;
                            obj[scrollEvent](scrollSize);
                        }
                    }
                };
                if(isScroll||opt.isFullBox){
                	scrollChange(opt.dir);
	                interval = setInterval(scrollChange, opt.delay);
	                obj.children().on("mouseover", function () {
	                    clearInterval(interval);
	                }).on("mouseleave", function () {
	                    interval = setInterval(scrollChange, opt.delay);
	                });
                }
            }
        })(jQuery);