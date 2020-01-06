package com.gys.item.ex;

public class MyViewNoSessionException extends RuntimeException {

    private String href;



    public MyViewNoSessionException() {
        super();
    }

    public MyViewNoSessionException(String message) {
        super(message);
    }

    public MyViewNoSessionException(String message, String href) {
        super(message);
        this.href=href;
    }

    public String getHref() {
        return href;
    }

    public void setHref(String href) {
        this.href = href;
    }
}
