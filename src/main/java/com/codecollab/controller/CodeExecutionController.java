package com.codecollab.controller;

import com.codecollab.model.CodeExecutionRequest;
import com.codecollab.model.CodeExecutionResponse;
import com.codecollab.service.CodeExecutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/execute")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class CodeExecutionController {
    
    @Autowired
    private CodeExecutionService codeExecutionService;
    
    @PostMapping
    public CodeExecutionResponse executeCode(@RequestBody CodeExecutionRequest request) {
        System.out.println("📝 Executing " + request.getLanguage() + " code for room: " + request.getRoomId());
        return codeExecutionService.executeCode(request.getCode(), request.getLanguage());
    }
}