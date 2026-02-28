package com.fedf.repository;

import com.fedf.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, String> {
    
    Optional<Skill> findByName(String name);
    
    List<Skill> findByCategory(String category);
    
    boolean existsByName(String name);
}
