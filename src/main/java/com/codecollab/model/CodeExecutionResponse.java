package com.codecollab.model;

public class CodeExecutionResponse {
    private String output;
    private String error;
    private String language;
    private long executionTime;
    private boolean success;
    
    public CodeExecutionResponse() {}
    
    public CodeExecutionResponse(String output, String error, String language, long executionTime, boolean success) {
        this.output = output;
        this.error = error;
        this.language = language;
        this.executionTime = executionTime;
        this.success = success;
    }
    
    // Getters and Setters
    public String getOutput() { return output; }
    public void setOutput(String output) { this.output = output; }
    
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
    
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    
    public long getExecutionTime() { return executionTime; }
    public void setExecutionTime(long executionTime) { this.executionTime = executionTime; }
    
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
}