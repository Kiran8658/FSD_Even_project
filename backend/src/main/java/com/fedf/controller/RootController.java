package com.fedf.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public Map<String, Object> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("application", "FEDF Backend API");
        response.put("version", "1.0.0");
        response.put("status", "running");
        response.put("message", "Welcome to FEDF Educational Dashboard Backend");
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("auth", "/api/auth/signup, /api/auth/signin");
        endpoints.put("dashboard", "/api/dashboard/stats, /api/dashboard/activities");
        endpoints.put("h2-console", "/h2-console");
        response.put("endpoints", endpoints);
        
        return response;
    }
}
