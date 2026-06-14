package com.codecollab.controller;

import com.codecollab.model.AuthResponse;
import com.codecollab.model.LoginRequest;
import com.codecollab.model.User;
import com.codecollab.service.JwtService;
import com.codecollab.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "https://codecollab-frontend.vercel.app"})
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtService jwtService;
    
    @PostMapping("/signup")
    public AuthResponse signup(@Valid @RequestBody User user) {
        User registeredUser = userService.register(
            user.getUsername(), 
            user.getEmail(), 
            user.getPassword()
        );
        String token = jwtService.generateToken(registeredUser.getEmail());
        return new AuthResponse(token, "Signup successful!");
    }
    
    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        User user = userService.login(request.getEmail(), request.getPassword());
        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, "Login successful!");
    }
    
    @GetMapping("/test")
    public String test() {
        return "Server is running!";
    }
}