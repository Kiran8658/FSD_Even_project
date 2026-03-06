package com.fedf.controller;

import com.fedf.dto.ApiResponse;
import com.fedf.dto.NoteDTO;
import com.fedf.dto.NoteUpsertRequest;
import com.fedf.service.NoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NoteDTO>>> list(@AuthenticationPrincipal UserDetails userDetails) {
        List<NoteDTO> notes = noteService.listNotesForEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(notes));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NoteDTO>> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody NoteUpsertRequest request) {
        NoteDTO created = noteService.createNoteForEmail(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Note created", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NoteDTO>> update(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody NoteUpsertRequest request) {
        NoteDTO updated = noteService.updateNoteForEmail(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Note updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        noteService.deleteNoteForEmail(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Note deleted", null));
    }
}
