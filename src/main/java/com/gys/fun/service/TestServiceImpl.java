package com.gys.fun.service;

import com.gys.fun.bean.test.TestBean;
import com.gys.fun.bean.test.TestForm;
import com.gys.fun.dao.ITestDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestServiceImpl {

    @Autowired
    private ITestDao idao;

    public List<TestBean> getTestList(TestForm form) throws Exception{
        return idao.getTestList(form);
    }
}
