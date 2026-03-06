package com.fedf.repository;

import com.fedf.entity.User;
import com.fedf.entity.UserScore;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserScoreRepository extends JpaRepository<UserScore, String> {
    Optional<UserScore> findByUser(User user);

    @EntityGraph(attributePaths = {"user"})
    Page<UserScore> findAllByOrderByTotalScoreDesc(Pageable pageable);
}
