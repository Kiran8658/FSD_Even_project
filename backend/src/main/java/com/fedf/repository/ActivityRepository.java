package com.fedf.repository;

import com.fedf.entity.Activity;
import com.fedf.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, String> {
    
    List<Activity> findByUserOrderByDateDesc(User user);
    
    List<Activity> findByUserAndDateBetweenOrderByDateAsc(User user, LocalDate startDate, LocalDate endDate);
    
    Optional<Activity> findByUserAndDate(User user, LocalDate date);
    
    @Query("SELECT a FROM Activity a WHERE a.user = :user AND a.date >= :startDate ORDER BY a.date ASC")
    List<Activity> findRecentActivities(@Param("user") User user, @Param("startDate") LocalDate startDate);
    
    @Query("SELECT SUM(a.count) FROM Activity a WHERE a.user = :user")
    Integer getTotalActivityCount(@Param("user") User user);
    
    @Query("SELECT COUNT(DISTINCT a.date) FROM Activity a WHERE a.user = :user AND a.date >= :startDate")
    Integer getActiveDaysCount(@Param("user") User user, @Param("startDate") LocalDate startDate);
}
