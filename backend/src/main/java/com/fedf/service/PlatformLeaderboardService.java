package com.fedf.service;

import com.fedf.dto.PlatformLeaderboardEntryDTO;
import com.fedf.dto.PlatformStatDTO;
import com.fedf.dto.PlatformStatsDTO;
import com.fedf.entity.User;
import com.fedf.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PlatformLeaderboardService {

    private final UserRepository userRepository;
    private final PlatformStatsService platformStatsService;

    public List<PlatformLeaderboardEntryDTO> getLeaderboard(String metricRaw, int limit, String includeUser) {
        Metric metric = Metric.from(metricRaw);
        int safeLimit = Math.min(100, Math.max(1, limit));

        List<User> users = userRepository.findAll();
        List<Computed> computed = new ArrayList<>(users.size());

        for (User user : users) {
            PlatformStatsDTO stats = platformStatsService.getStatsForUser(user);
            int value = metric.compute(stats);
            computed.add(new Computed(user, value, metric.platform(stats)));
        }

        computed.sort(Comparator
                .comparingInt(Computed::value).reversed()
                .thenComparing(c -> Optional.ofNullable(c.user().getUsername()).orElse(""), String.CASE_INSENSITIVE_ORDER));

        List<PlatformLeaderboardEntryDTO> allRanked = new ArrayList<>(computed.size());
        for (int i = 0; i < computed.size(); i++) {
            Computed c = computed.get(i);
            User user = c.user();
            allRanked.add(PlatformLeaderboardEntryDTO.builder()
                    .rank(i + 1)
                    .userId(user.getId())
                    .username(user.getUsername())
                    .name(user.getName())
                    .avatar(user.getAvatar())
                    .value(c.value())
                    .platform(c.platform())
                    .build());
        }

        List<PlatformLeaderboardEntryDTO> top = new ArrayList<>(Math.min(safeLimit, allRanked.size()) + 1);
        for (int i = 0; i < allRanked.size() && top.size() < safeLimit; i++) {
            top.add(allRanked.get(i));
        }

        if (includeUser != null && !includeUser.isBlank()) {
            String target = includeUser.trim();
            boolean alreadyIncluded = top.stream().anyMatch(e -> target.equalsIgnoreCase(e.getUsername()));
            if (!alreadyIncluded) {
                allRanked.stream()
                        .filter(e -> target.equalsIgnoreCase(e.getUsername()))
                        .findFirst()
                        .ifPresent(top::add);
            }
        }

        return top;
    }

    private record Computed(User user, int value, PlatformStatDTO platform) {
    }

    enum Metric {
        TOTAL_SOLVED,
        LEETCODE_SOLVED,
        CODEFORCES_SOLVED,
        CODECHEF_SOLVED,
        CSCORE;

        static Metric from(String raw) {
            if (raw == null) return TOTAL_SOLVED;
            String v = raw.trim().toLowerCase(Locale.ROOT);
            return switch (v) {
                case "leetcode", "leetcode_solved", "leetcode-solved", "leetcodesolved" -> LEETCODE_SOLVED;
                case "codeforces", "codeforces_solved", "codeforces-solved", "codeforcessolved" -> CODEFORCES_SOLVED;
                case "codechef", "codechef_solved", "codechef-solved", "codechefsolved" -> CODECHEF_SOLVED;
                case "cscore", "c-score", "c_score" -> CSCORE;
                case "total", "total_solved", "total-solved", "totalsolved", "totalquestions", "total_questions", "total-questions" -> TOTAL_SOLVED;
                default -> TOTAL_SOLVED;
            };
        }

        int compute(PlatformStatsDTO stats) {
            if (stats == null) return 0;

            return switch (this) {
                case TOTAL_SOLVED -> Math.max(0, stats.getTotalSolved());
                case LEETCODE_SOLVED -> solved(stats.getPlatforms(), "leetcode");
                case CODEFORCES_SOLVED -> solved(stats.getPlatforms(), "codeforces");
                case CODECHEF_SOLVED -> solved(stats.getPlatforms(), "codechef");
                case CSCORE -> computeCScore(stats.getPlatforms());
            };
        }

        PlatformStatDTO platform(PlatformStatsDTO stats) {
            if (stats == null || stats.getPlatforms() == null) return null;

            return switch (this) {
                case LEETCODE_SOLVED -> stats.getPlatforms().get("leetcode");
                case CODEFORCES_SOLVED -> stats.getPlatforms().get("codeforces");
                case CODECHEF_SOLVED -> stats.getPlatforms().get("codechef");
                default -> null;
            };
        }

        private static int solved(Map<String, PlatformStatDTO> platforms, String key) {
            if (platforms == null) return 0;
            PlatformStatDTO p = platforms.get(key);
            if (p == null || p.getSolved() == null) return 0;
            return Math.max(0, p.getSolved());
        }

        private static int computeCScore(Map<String, PlatformStatDTO> platforms) {
            if (platforms == null) return 0;

            PlatformStatDTO lc = platforms.get("leetcode");
            int lcScore;
            if (lc != null && (lc.getEasy() != null || lc.getMedium() != null || lc.getHard() != null)) {
                int easy = lc.getEasy() != null ? Math.max(0, lc.getEasy()) : 0;
                int medium = lc.getMedium() != null ? Math.max(0, lc.getMedium()) : 0;
                int hard = lc.getHard() != null ? Math.max(0, lc.getHard()) : 0;
                lcScore = easy + (2 * medium) + (3 * hard);
            } else {
                lcScore = solved(platforms, "leetcode");
            }

            int cf = solved(platforms, "codeforces");
            int cc = solved(platforms, "codechef");

            return lcScore + cf + cc;
        }
    }
}
