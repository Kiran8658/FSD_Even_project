package com.fedf.service;

import com.fedf.dto.DashboardStatsDTO;
import com.fedf.entity.User;
import com.fedf.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardRealtimeService {

    private final DashboardService dashboardService;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Scheduled(fixedRate = 5000)
    public void broadcastDashboardStats() {
        try {
            List<User> users = userRepository.findAll(Sort.by(Sort.Direction.DESC, "lastActivity"));
            if (users.isEmpty()) {
                return;
            }

            // Broadcast the most recently active user's stats (demo-friendly default).
            User mostRecentlyActive = users.get(0);
            DashboardStatsDTO stats = dashboardService.getDashboardStats(mostRecentlyActive.getEmail());
            messagingTemplate.convertAndSend("/topic/dashboard", stats);
        } catch (Exception ex) {
            // Keep scheduler alive even if DB/user state has issues.
            log.debug("Failed to broadcast dashboard stats", ex);
        }
    }
}
