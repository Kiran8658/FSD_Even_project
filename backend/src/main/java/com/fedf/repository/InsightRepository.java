package com.fedf.repository;

import com.fedf.entity.Insight;
import com.fedf.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InsightRepository extends JpaRepository<Insight, String> {
    
    List<Insight> findByUserOrderByTimestampDesc(User user);
    
    List<Insight> findByUserAndIsReadFalseOrderByTimestampDesc(User user);
    
    List<Insight> findTop10ByUserOrderByTimestampDesc(User user);
}
