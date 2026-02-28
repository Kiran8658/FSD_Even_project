package com.fedf.repository;

import com.fedf.entity.User;
import com.fedf.entity.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, String> {
    
    List<UserSkill> findByUser(User user);
    
    @Query("SELECT us FROM UserSkill us JOIN FETCH us.skill WHERE us.user = :user ORDER BY us.level DESC")
    List<UserSkill> findByUserWithSkill(@Param("user") User user);
    
    @Query("SELECT COUNT(us) FROM UserSkill us WHERE us.user = :user AND us.level > 0")
    Integer countLearnedSkills(@Param("user") User user);
}
