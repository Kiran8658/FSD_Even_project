package com.fedf.service;

import com.fedf.dto.UserDTO;
import com.fedf.entity.User;
import com.fedf.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserDTO(user);
    }

    public UserDTO getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserDTO(user);
    }

    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserDTO(user);
    }

    public UserDTO updateUser(String email, UserDTO updateRequest) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
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
        }
        
        User updatedUser = userRepository.save(user);
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
}
