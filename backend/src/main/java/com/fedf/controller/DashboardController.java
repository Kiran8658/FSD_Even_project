package com.fedf.controller;

import com.fedf.dto.*;
import com.fedf.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboardStats(
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            DashboardStatsDTO stats = dashboardService.getDashboardStats(userDetails.getUsername());
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/activities")
    public ResponseEntity<ApiResponse<List<ActivityDataDTO>>> getActivityData(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false, defaultValue = "7") Integer days) {
        try {
            List<ActivityDataDTO> activities = dashboardService.getActivityData(userDetails.getUsername(), days);
            return ResponseEntity.ok(ApiResponse.success(activities));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/skills")
    public ResponseEntity<ApiResponse<List<SkillDTO>>> getSkills(
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            List<SkillDTO> skills = dashboardService.getSkills(userDetails.getUsername());
            return ResponseEntity.ok(ApiResponse.success(skills));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/insights")
    public ResponseEntity<ApiResponse<List<InsightDTO>>> getInsights(
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            List<InsightDTO> insights = dashboardService.getInsights(userDetails.getUsername());
            return ResponseEntity.ok(ApiResponse.success(insights));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/activities/log")
    public ResponseEntity<ApiResponse<String>> logActivity(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody LogActivityRequest request) {
        try {
            dashboardService.logActivity(userDetails.getUsername(), request);
            return ResponseEntity.ok(ApiResponse.success("Activity logged successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
