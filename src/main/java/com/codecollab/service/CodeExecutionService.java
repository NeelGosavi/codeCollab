package com.codecollab.service;

import com.codecollab.model.CodeExecutionResponse;
import org.springframework.stereotype.Service;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class CodeExecutionService {
    
    private static final String TEMP_DIR = System.getProperty("java.io.tmpdir") + "/codecollab/";
    
    public CodeExecutionResponse executeCode(String code, String language) {
        long startTime = System.nanoTime();
        
        try {
            // Create temp directory if not exists
            Files.createDirectories(Paths.get(TEMP_DIR));
            
            switch (language.toLowerCase()) {
                case "java":
                    return executeJava(code);
                case "python":
                    return executePython(code);
                case "javascript":
                    return executeJavaScript(code);
                default:
                    return new CodeExecutionResponse("", "Unsupported language: " + language, language, 0, false);
            }
        } catch (Exception e) {
            long executionTime = System.nanoTime() - startTime;
            return new CodeExecutionResponse("", "Execution error: " + e.getMessage(), language, executionTime / 1000000, false);
        }
    }
    
    private CodeExecutionResponse executeJava(String code) throws Exception {
        String sessionId = UUID.randomUUID().toString();
        String fileName = "Main";
        Path sourceFile = Paths.get(TEMP_DIR + sessionId + "/" + fileName + ".java");
        Path classFile = Paths.get(TEMP_DIR + sessionId);
        
        try {
            // Create directory
            Files.createDirectories(classFile);
            
            // Write code to file
            Files.write(sourceFile, code.getBytes());
            
            // Compile Java code
            Process compileProcess = new ProcessBuilder("javac", sourceFile.toString())
                    .redirectErrorStream(true)
                    .directory(classFile.toFile())
                    .start();
            
            boolean compiled = compileProcess.waitFor(10, TimeUnit.SECONDS);
            if (!compiled || compileProcess.exitValue() != 0) {
                String error = readStream(compileProcess.getInputStream());
                return new CodeExecutionResponse("", "Compilation error:\n" + error, "java", 0, false);
            }
            
            // Run Java code
            Process runProcess = new ProcessBuilder("java", "-cp", classFile.toString(), fileName)
                    .redirectErrorStream(true)
                    .directory(classFile.toFile())
                    .start();
            
            boolean completed = runProcess.waitFor(10, TimeUnit.SECONDS);
            String output = readStream(runProcess.getInputStream());
            
            if (!completed) {
                runProcess.destroyForcibly();
                return new CodeExecutionResponse("", "Execution timeout (10 seconds)", "java", 0, false);
            }
            
            return new CodeExecutionResponse(output, "", "java", 0, true);
            
        } finally {
            // Cleanup
            deleteDirectory(classFile.toFile());
        }
    }
    
    private CodeExecutionResponse executePython(String code) throws Exception {
        String sessionId = UUID.randomUUID().toString();
        Path scriptFile = Paths.get(TEMP_DIR + sessionId + "/script.py");
        
        try {
            Files.createDirectories(scriptFile.getParent());
            Files.write(scriptFile, code.getBytes());
            
            Process process = new ProcessBuilder("python", scriptFile.toString())
                    .redirectErrorStream(true)
                    .start();
            
            boolean completed = process.waitFor(10, TimeUnit.SECONDS);
            String output = readStream(process.getInputStream());
            
            if (!completed) {
                process.destroyForcibly();
                return new CodeExecutionResponse("", "Execution timeout (10 seconds)", "python", 0, false);
            }
            
            return new CodeExecutionResponse(output, "", "python", 0, true);
            
        } finally {
            deleteDirectory(scriptFile.getParent().toFile());
        }
    }
    
    private CodeExecutionResponse executeJavaScript(String code) throws Exception {
        String sessionId = UUID.randomUUID().toString();
        Path scriptFile = Paths.get(TEMP_DIR + sessionId + "/script.js");
        
        try {
            Files.createDirectories(scriptFile.getParent());
            Files.write(scriptFile, code.getBytes());
            
            Process process = new ProcessBuilder("node", scriptFile.toString())
                    .redirectErrorStream(true)
                    .start();
            
            boolean completed = process.waitFor(10, TimeUnit.SECONDS);
            String output = readStream(process.getInputStream());
            
            if (!completed) {
                process.destroyForcibly();
                return new CodeExecutionResponse("", "Execution timeout (10 seconds)", "javascript", 0, false);
            }
            
            return new CodeExecutionResponse(output, "", "javascript", 0, true);
            
        } finally {
            deleteDirectory(scriptFile.getParent().toFile());
        }
    }
    
    private String readStream(InputStream inputStream) throws IOException {
        StringBuilder result = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            while ((line = reader.readLine()) != null) {
                result.append(line).append("\n");
            }
        }
        return result.toString();
    }
    
    private void deleteDirectory(File directory) {
        if (directory.exists()) {
            File[] files = directory.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file.isDirectory()) {
                        deleteDirectory(file);
                    } else {
                        file.delete();
                    }
                }
            }
            directory.delete();
        }
    }
}