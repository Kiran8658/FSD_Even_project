package com.fedf.config;

import com.fedf.entity.*;
import com.fedf.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final ActivityRepository activityRepository;
    private final UserSkillRepository userSkillRepository;
    private final InsightRepository insightRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initializeSkills();
        initializeDemoUser();
        log.info("Data initialization completed!");
    }

    private void initializeSkills() {
        if (skillRepository.count() > 0) {
            return;
        }

        List<Skill> skills = Arrays.asList(
                Skill.builder().name("React").category("Frontend").build(),
                Skill.builder().name("TypeScript").category("Language").build(),
                Skill.builder().name("Node.js").category("Backend").build(),
                Skill.builder().name("CSS").category("Frontend").build(),
                Skill.builder().name("Database Design").category("Backend").build(),
                Skill.builder().name("DevOps").category("Tools").build(),
                Skill.builder().name("Java").category("Language").build(),
                Skill.builder().name("Spring Boot").category("Backend").build(),
                Skill.builder().name("Python").category("Language").build(),
                Skill.builder().name("Docker").category("Tools").build()
        );

        skillRepository.saveAll(skills);
        log.info("Initialized {} skills", skills.size());
    }

    private void initializeDemoUser() {
        if (userRepository.existsByEmail("demo@ghostwrite.io")) {
            return;
        }

        // Create demo user
        User demoUser = User.builder()
                .name("Demo User")
                .email("demo@ghostwrite.io")
                .username("demo_user")
                .password(passwordEncoder.encode("demo123"))
                .avatar("https://api.dicebear.com/7.x/avataaars/svg?seed=demo")
                .bio("Passionate developer & lifelong learner")
                .college("KLH")
                .currentStreak(12)
                .longestStreak(34)
                .totalActivities(156)
                .joinDate(LocalDateTime.now().minusMonths(2))
                .lastActivity(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(demoUser);
        log.info("Created demo user: {}", savedUser.getEmail());

        // Add activities for the last 30 days
        Random random = new Random();
        for (int i = 0; i < 30; i++) {
            LocalDate date = LocalDate.now().minusDays(i);
            int count = random.nextInt(10) + 1; // 1-10 activities per day
            
            Activity activity = Activity.builder()
                    .user(savedUser)
                    .date(date)
                    .count(count)
                    .type("learning")
                    .description("Daily learning activity")
                    .build();
            activityRepository.save(activity);
        }
        log.info("Created activity data for demo user");

        // Add user skills
        List<Skill> allSkills = skillRepository.findAll();
        int[] levels = {90, 85, 80, 88, 75, 70};
        
        for (int i = 0; i < Math.min(6, allSkills.size()); i++) {
            UserSkill userSkill = UserSkill.builder()
                    .user(savedUser)
                    .skill(allSkills.get(i))
                    .level(levels[i])
                    .build();
            userSkillRepository.save(userSkill);
        }
        log.info("Created skills for demo user");

        // Add insights
        List<Insight> insights = Arrays.asList(
                Insight.builder()
                        .user(savedUser)
                        .title("Amazing Streak!")
                        .description("You've maintained a 12-day learning streak. Keep it up!")
                        .type(Insight.InsightType.ACHIEVEMENT)
                        .icon("🔥")
                        .timestamp(LocalDateTime.now())
                        .build(),
                Insight.builder()
                        .user(savedUser)
                        .title("Focus on Weak Areas")
                        .description("Consider spending more time on DevOps concepts this week.")
                        .type(Insight.InsightType.TIP)
                        .icon("💡")
                        .timestamp(LocalDateTime.now())
                        .build(),
                Insight.builder()
                        .user(savedUser)
                        .title("Milestone Reached!")
                        .description("You've completed 150+ learning activities. You're on fire! 🚀")
                        .type(Insight.InsightType.MILESTONE)
                        .icon("🎯")
                        .timestamp(LocalDateTime.now().minusDays(1))
                        .build()
        );
        insightRepository.saveAll(insights);
        log.info("Created insights for demo user");
    }
}
