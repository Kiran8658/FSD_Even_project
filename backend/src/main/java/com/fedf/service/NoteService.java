package com.fedf.service;

import com.fedf.dto.NoteDTO;
import com.fedf.dto.NoteUpsertRequest;
import com.fedf.entity.Note;
import com.fedf.entity.User;
import com.fedf.repository.NoteRepository;
import com.fedf.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    public List<NoteDTO> listNotesForEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return noteRepository.findByUserIdOrderByUpdatedAtDesc(user.getId())
                .stream()
                .map(this::toDto)
                .toList();
    }

    public NoteDTO createNoteForEmail(String email, NoteUpsertRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Note note = Note.builder()
                .user(user)
                .title(request.getTitle())
                .content(request.getContent())
                .color(request.getColor())
                .build();

        return toDto(noteRepository.save(note));
    }

    public NoteDTO updateNoteForEmail(String email, Long id, NoteUpsertRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Note note = noteRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Note not found"));

        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        note.setColor(request.getColor());

        return toDto(noteRepository.save(note));
    }

    public void deleteNoteForEmail(String email, Long id) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Note note = noteRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Note not found"));

        noteRepository.delete(note);
    }

    private NoteDTO toDto(Note note) {
        DateTimeFormatter fmt = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        return NoteDTO.builder()
                .id(note.getId())
                .title(note.getTitle())
                .content(note.getContent())
                .color(note.getColor())
                .createdAt(note.getCreatedAt() != null ? note.getCreatedAt().format(fmt) : null)
                .updatedAt(note.getUpdatedAt() != null ? note.getUpdatedAt().format(fmt) : null)
                .build();
    }
}
