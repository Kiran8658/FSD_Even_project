package com.fedf.service;

import com.fedf.dto.LeaderboardEntryDTO;
import com.fedf.dto.PageResponse;
import com.fedf.entity.User;
import com.fedf.entity.UserScore;
import com.fedf.repository.UserScoreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LeaderboardService {

    private final UserScoreRepository userScoreRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public PageResponse<LeaderboardEntryDTO> getLeaderboard(int page, int size) {
        int safePage = Math.max(0, page);
        int safeSize = Math.min(100, Math.max(1, size));

        Pageable pageable = PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "totalScore"));
        Page<UserScore> result = userScoreRepository.findAllByOrderByTotalScoreDesc(pageable);

        List<LeaderboardEntryDTO> items = result.getContent().stream()
                .map(this::toDto)
                .toList();

        return PageResponse.<LeaderboardEntryDTO>builder()
                .items(items)
                .page(result.getNumber())
                .size(result.getSize())
                .totalItems(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .hasNext(result.hasNext())
                .hasPrevious(result.hasPrevious())
                .build();
    }

    @Scheduled(fixedRate = 5000)
    public void broadcastTopLeaderboard() {
        try {
            PageResponse<LeaderboardEntryDTO> top = getLeaderboard(0, 20);
            messagingTemplate.convertAndSend("/topic/leaderboard", top.getItems());
        } catch (Exception ex) {
            log.debug("Failed to broadcast leaderboard", ex);
        }
    }

    private LeaderboardEntryDTO toDto(UserScore score) {
        User user = score.getUser();
        return LeaderboardEntryDTO.builder()
                .userId(user != null ? user.getId() : null)
                .username(user != null ? user.getUsername() : null)
                .name(user != null ? user.getName() : null)
                .avatar(user != null ? user.getAvatar() : null)
                .totalSolved(score.getTotalSolved())
                .githubScore(score.getGithubScore())
                .quizScore(score.getQuizScore())
                .totalScore(score.getTotalScore())
                .build();
    }
}
