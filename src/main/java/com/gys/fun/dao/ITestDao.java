package com.gys.fun.dao;

import com.gys.fun.bean.test.TestBean;
import com.gys.fun.bean.test.TestForm;

import java.util.List;

public interface ITestDao {
    List<TestBean> getTestList(TestForm form) throws Exception;
}
