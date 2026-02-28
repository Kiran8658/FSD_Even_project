package com.fedf.service;

import com.fedf.dto.*;
import com.fedf.entity.*;
import com.fedf.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;
    private final UserSkillRepository userSkillRepository;
    private final InsightRepository insightRepository;

    public DashboardStatsDTO getDashboardStats(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Calculate total activities
        Integer totalActivities = activityRepository.getTotalActivityCount(user);
        if (totalActivities == null) totalActivities = 0;
        
        // Calculate consistency rate (active days / total days in last 30 days)
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        Integer activeDays = activityRepository.getActiveDaysCount(user, thirtyDaysAgo);
        if (activeDays == null) activeDays = 0;
        int consistencyRate = Math.min(100, (activeDays * 100) / 30);
        
        // Get skills count
        Integer skillsLearned = userSkillRepository.countLearnedSkills(user);
        if (skillsLearned == null) skillsLearned = 0;
        
        return DashboardStatsDTO.builder()
                .totalActivities(totalActivities)
                .currentStreak(user.getCurrentStreak() != null ? user.getCurrentStreak() : 0)
                .longestStreak(user.getLongestStreak() != null ? user.getLongestStreak() : 0)
                .consistencyRate(consistencyRate)
                .skillsLearned(skillsLearned)
                .build();
    }

    public List<ActivityDataDTO> getActivityData(String email, Integer days) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        int numDays = days != null ? days : 7;
        LocalDate startDate = LocalDate.now().minusDays(numDays - 1);
        LocalDate endDate = LocalDate.now();
        
        List<Activity> activities = activityRepository.findByUserAndDateBetweenOrderByDateAsc(user, startDate, endDate);
        
        // Create a map for quick lookup
        Map<LocalDate, Integer> activityMap = activities.stream()
                .collect(Collectors.toMap(Activity::getDate, Activity::getCount, Integer::sum));
        
        // Generate data for each day
        List<ActivityDataDTO> result = new ArrayList<>();
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            result.add(ActivityDataDTO.builder()
                    .date(date.format(DateTimeFormatter.ISO_LOCAL_DATE))
                    .count(activityMap.getOrDefault(date, 0))
                    .build());
        }
        
        return result;
    }

    public List<SkillDTO> getSkills(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<UserSkill> userSkills = userSkillRepository.findByUserWithSkill(user);
        
        // If user has no skills, return default skills with 0 level
        if (userSkills.isEmpty()) {
            return getDefaultSkills();
        }
        
        return userSkills.stream()
                .map(us -> SkillDTO.builder()
                        .name(us.getSkill().getName())
                        .level(us.getLevel())
                        .category(us.getSkill().getCategory())
                        .build())
                .collect(Collectors.toList());
    }

    private List<SkillDTO> getDefaultSkills() {
        return Arrays.asList(
                SkillDTO.builder().name("React").level(0).category("Frontend").build(),
                SkillDTO.builder().name("TypeScript").level(0).category("Language").build(),
                SkillDTO.builder().name("Node.js").level(0).category("Backend").build(),
                SkillDTO.builder().name("CSS").level(0).category("Frontend").build(),
                SkillDTO.builder().name("Database Design").level(0).category("Backend").build(),
                SkillDTO.builder().name("DevOps").level(0).category("Tools").build()
        );
    }

    public List<InsightDTO> getInsights(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Insight> insights = insightRepository.findTop10ByUserOrderByTimestampDesc(user);
        
        // If no insights, generate some default ones
        if (insights.isEmpty()) {
            return getDefaultInsights(user);
        }
        
        return insights.stream()
                .map(this::mapToInsightDTO)
                .collect(Collectors.toList());
    }

    private List<InsightDTO> getDefaultInsights(User user) {
        List<InsightDTO> defaultInsights = new ArrayList<>();
        
        if (user.getCurrentStreak() != null && user.getCurrentStreak() > 0) {
            defaultInsights.add(InsightDTO.builder()
                    .id(UUID.randomUUID().toString())
                    .title("Amazing Streak!")
                    .description("You've maintained a " + user.getCurrentStreak() + "-day learning streak. Keep it up!")
                    .type("achievement")
                    .icon("🔥")
                    .timestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE))
                    .build());
        }
        
        defaultInsights.add(InsightDTO.builder()
                .id(UUID.randomUUID().toString())
                .title("Welcome to FEDF!")
                .description("Start your learning journey by exploring different topics.")
                .type("tip")
                .icon("💡")
                .timestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE))
                .build());
        
        defaultInsights.add(InsightDTO.builder()
                .id(UUID.randomUUID().toString())
                .title("Set Your Goals")
                .description("Define learning goals to track your progress effectively.")
                .type("tip")
                .icon("🎯")
                .timestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE))
                .build());
        
        return defaultInsights;
    }

    @Transactional
    public void logActivity(String email, LogActivityRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        LocalDate today = LocalDate.now();
        int activityCount = request.getCount() != null ? request.getCount() : 1;
        
        // Find or create activity for today
        Optional<Activity> existingActivity = activityRepository.findByUserAndDate(user, today);
        
        if (existingActivity.isPresent()) {
            Activity activity = existingActivity.get();
            activity.setCount(activity.getCount() + activityCount);
            activityRepository.save(activity);
        } else {
            Activity newActivity = Activity.builder()
                    .user(user)
                    .date(today)
                    .count(activityCount)
                    .type(request.getType())
                    .description(request.getDescription())
                    .build();
            activityRepository.save(newActivity);
        }
        
        // Update user stats
        user.setTotalActivities(user.getTotalActivities() + activityCount);
        user.setLastActivity(LocalDateTime.now());
        
        // Update streak
        updateStreak(user);
        
        userRepository.save(user);
    }

    private void updateStreak(User user) {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        
        // Check if there was activity yesterday
        Optional<Activity> yesterdayActivity = activityRepository.findByUserAndDate(user, yesterday);
        
        if (yesterdayActivity.isPresent() || user.getCurrentStreak() == 0) {
            // Continue or start streak
            user.setCurrentStreak(user.getCurrentStreak() + 1);
            
            if (user.getCurrentStreak() > user.getLongestStreak()) {
                user.setLongestStreak(user.getCurrentStreak());
            }
        } else {
            // Check if already logged today (don't reset)
            Optional<Activity> todayActivity = activityRepository.findByUserAndDate(user, today);
            if (todayActivity.isEmpty()) {
                // Reset streak
                user.setCurrentStreak(1);
            }
        }
    }

    private InsightDTO mapToInsightDTO(Insight insight) {
        return InsightDTO.builder()
                .id(insight.getId())
                .title(insight.getTitle())
                .description(insight.getDescription())
                .type(insight.getType().name().toLowerCase())
                .icon(insight.getIcon())
                .timestamp(insight.getTimestamp() != null 
                        ? insight.getTimestamp().format(DateTimeFormatter.ISO_LOCAL_DATE) 
                        : null)
                .build();
    }
}
