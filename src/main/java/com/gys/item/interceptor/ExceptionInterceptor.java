package com.gys.item.interceptor;

import com.gys.item.ex.MyAjaxException;
import com.gys.item.ex.MyAjaxNoSessionException;
import com.gys.item.ex.MyViewException;
import com.gys.item.ex.MyViewNoSessionException;
import com.gys.item.util.HttpResult;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;

@ControllerAdvice
public class ExceptionInterceptor {

    @ResponseBody
    @ExceptionHandler({Exception.class})
    public HttpResult exceptionHandler(Exception e){
        e.printStackTrace();
        return HttpResult.errorEx();
    }

    @ResponseBody
    @ExceptionHandler({MyAjaxException.class})
    public HttpResult myExceptionHandler(MyAjaxException e){
        return HttpResult.error(e.getMessage());
    }
    @ResponseBody
    @ExceptionHandler({MyAjaxNoSessionException.class})
    public HttpResult myNoSessionExceptionHandler(MyAjaxNoSessionException e){
        return HttpResult.noSessionEx();
    }

    @ExceptionHandler({MyViewException.class})
    public ModelAndView myViewException(MyViewException e){
        ModelAndView view=new ModelAndView();
        view.addObject("msg",e.getMessage());
        if(e.getHref()==null){
            view.setViewName("/public/exPage");
        }else{
            view.setViewName(e.getHref());
        }
        return view;
    }
    @ExceptionHandler({MyViewNoSessionException.class})
    public ModelAndView myViewNoSessionException(MyViewNoSessionException e){
        ModelAndView view=new ModelAndView();
        view.addObject("msg",e.getMessage());
        view.setViewName(e.getHref()==null?"/public/noSession":e.getHref());
        return view;
    }

    /**
     * 每个页面都能访问到这里的属性
     * @param model
     */
    @ModelAttribute
    public void addAttribute(Model model, HttpSession session){
        Object objName=session.getAttribute("username");
        String username=null;
        if(objName!=null){
            username=objName.toString();
        }
        model.addAttribute("test",username);
    }
}
