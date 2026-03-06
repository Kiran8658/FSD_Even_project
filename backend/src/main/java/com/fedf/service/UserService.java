package com.fedf.service;

import com.fedf.dto.UserDTO;
import com.fedf.entity.User;
import com.fedf.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserDTO(user);
    }

    public UserDTO getUserById(String id) {
        User user = userRepository.findById(Objects.requireNonNull(id, "id"))
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserDTO(user);
    }

    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserDTO(user);
    }

    public UserDTO updateUser(String principalIdentifier, UserDTO updateRequest) {
        User user = findByPrincipalIdentifier(principalIdentifier);
        
        if (updateRequest.getName() != null) user.setName(updateRequest.getName());
        if (updateRequest.getBio() != null) user.setBio(updateRequest.getBio());
        if (updateRequest.getAvatar() != null) user.setAvatar(updateRequest.getAvatar());
        if (updateRequest.getCollege() != null) user.setCollege(updateRequest.getCollege());

        if (updateRequest.getLinks() != null) {
            UserDTO.Links l = updateRequest.getLinks();
            if (l.getLinkedIn() != null) user.setLinkLinkedIn(l.getLinkedIn());
            if (l.getGithub() != null) user.setLinkGithub(l.getGithub());
            if (l.getTwitter() != null) user.setLinkTwitter(l.getTwitter());
            if (l.getWebsite() != null) user.setLinkWebsite(l.getWebsite());
            if (l.getResume() != null) user.setLinkResume(l.getResume());
            if (l.getTelegram() != null) user.setLinkTelegram(l.getTelegram());
            if (l.getLeetCode() != null) user.setLinkLeetCode(l.getLeetCode());
            if (l.getCodeChef() != null) user.setLinkCodeChef(l.getCodeChef());
            if (l.getCodeForces() != null) user.setLinkCodeForces(l.getCodeForces());
            if (l.getHackerRank() != null) user.setLinkHackerRank(l.getHackerRank());
            if (l.getAtCoder() != null) user.setLinkAtCoder(l.getAtCoder());
        }
        
        User updatedUser = userRepository.save(Objects.requireNonNull(user, "user"));
        return mapToUserDTO(updatedUser);
    }

    private UserDTO mapToUserDTO(User user) {
        UserDTO.Links links = UserDTO.Links.builder()
                .linkedIn(user.getLinkLinkedIn())
                .github(user.getLinkGithub())
                .twitter(user.getLinkTwitter())
                .website(user.getLinkWebsite())
                .resume(user.getLinkResume())
                .telegram(user.getLinkTelegram())
                .leetCode(user.getLinkLeetCode())
            .codeChef(user.getLinkCodeChef())
            .codeForces(user.getLinkCodeForces())
            .hackerRank(user.getLinkHackerRank())
            .atCoder(user.getLinkAtCoder())
                .build();

        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .name(user.getName())
                .avatar(user.getAvatar())
                .bio(user.getBio())
                .college(user.getCollege())
                .joinDate(user.getJoinDate() != null 
                        ? user.getJoinDate().format(DateTimeFormatter.ISO_LOCAL_DATE) 
                        : null)
                .links(links)
                .build();
    }

    public void changePassword(String principalIdentifier, String currentPassword, String newPassword) {
        User user = findByPrincipalIdentifier(principalIdentifier);

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public void deleteAccount(String principalIdentifier) {
        User user = findByPrincipalIdentifier(principalIdentifier);
        userRepository.delete(Objects.requireNonNull(user, "user"));
    }

    private User findByPrincipalIdentifier(String principalIdentifier) {
        if (principalIdentifier == null || principalIdentifier.isBlank()) {
            throw new RuntimeException("User not found");
        }

        // In this app, Spring Security principal is typically the email.
        return userRepository.findByEmail(principalIdentifier)
                .or(() -> userRepository.findByUsername(principalIdentifier))
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
