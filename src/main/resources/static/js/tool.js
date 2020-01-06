const bg=bg?bg:{};
/***************************ajax拦截********************************/
bg.ajax=function(opts){
    var d={
        load:true,//加载动画
        loadText:"数据处理中...",
        done:true,//是否需要执行成功拦截步骤
        fail:true,//是否需要执行失败统一提示
        always:true,//不管成功和失败,是否都执行always(比如未true:ajax效果在ajax结束后不关闭)
        //contentType:"application/json",
        data:{},
        success:function(data,textStatus,jqXHR){},
        error:function(jqXHR,textStatus,errorThrown){},
        type:"post",
        dataType:"json",
        async:true
    };
    //opts.url=bg.appendAccessToken(opts.url);
    opts = $.extend({}, d, opts);
    //opts.data=JSON.stringify(opts.data);
    if(opts.load){
        $.ui_load({
            icon:1,
            msg:opts.loadText
        });
    }
    var success=opts.success;
    opts.success=function(){};
    $.ajax(opts).done(function(data,textStatus,jqXHR){
        if(!opts.done){
            success(data);
            return;
        }
        //ajax请求时 session失效
        if(data.status==3){
            $.ui_dialog({
                type:"e",
                con:data.msg,
                btn:[{name:"确定",action:function(){
                        window.location.href=data.href;
                    }}]
            });
        }else{
            success(data);
        }
    }).fail(function(jqXHR, textStatus, errorThrown){
        if(!opts.fail){
            opts.error(jqXHR,textStatus,errorThrown);
            return;
        }
        alert("连接服务器失败！");
        /*$.ui_dialog({
            type:"e",
            con:"连接服务器失败！",
        });*/
    }).always(function(){
        if(!opts.always){
            return;
        }
        if(opts.load){
            $.ui_load_close();
        }
    });
};

/**
 * var dom=$("#dialogForm")[0];
 var fd=new FormData(dom);
 bg.ajaxForm({
        url: "",
        type: "POST",
        data: fd,
        success:function (data) {
            bg.checkAjaxRes(data,function () {
                window.location.href=baseUrl+"/project/yangchenpage?projectId="+data.res;
            });
        }
    });
 */
bg.ajaxForm=function(opts){
    var origin={processData: false,contentType: false};
    opts=$.extend(origin,opts);
    bg.ajax(opts);
};

/**
 * var dom=$("#dialogForm")[0];
 var fd=new FormData(dom);
 bg.ajaxForm({
        url: "",
        type: "POST",
        data: fd,
        success:function (data) {
            bg.checkAjaxRes(data,function () {
                window.location.href=baseUrl+"/project/yangchenpage?projectId="+data.res;
            });
        }
    });
 */
bg.checkAjaxRes=function (data,successCallback,errorCallback) {
    if(data.status==1){
        if(successCallback){
            successCallback();
        }else{
            window.location.reload(true);
        }
        /*$.ui_dg({
            type:"s",
            con:data.msg,
            btn:[{name:"确定",action:function () {
                    if(successCallback){
                        successCallback();
                    }else{
                        window.location.reload(true);
                    }
                }}]
        });*/
    }else{
       /* $.ui_dg({
            type:"e",
            con:data.msg
        });*/
       alert(data.msg);
    }
};
/***************************ajax拦截********************************/
