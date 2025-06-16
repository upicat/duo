package com.example.common;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "统一返回结果")
public class Result<T> {

    @Schema(description = "状态码")
    private int code;

    @Schema(description = "返回消息")
    private String message;

    @Schema(description = "返回数据")
    private T data;

    @Schema(description = "是否成功")
    private boolean success = false;

    public Result() {
    }

    public Result(int code, String message, T data, boolean success) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.success = success;
    }

    public static <T> Result<T> success(T data) {
        return new Result<>(200, "操作成功", data, true);
    }

    public static <T> Result<T> success(String message, T data) {
        return new Result<>(200, message, data, true);
    }

    public static <T> Result<T> error(String message) {
        return new Result<>(500, message, null, false);
    }

    public static <T> Result<T> error(int code, String message) {
        return new Result<>(code, message, null, false);
    }

    // Getters and Setters
    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
