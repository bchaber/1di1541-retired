package stos;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import stos.dto.AttachmentDTO;
import stos.entities.Attachment;
import stos.repositories.AttachmentRepositoryMock;
import stos.StosExceptions.*;

@RestController
public class AttachmentController {
    Logger logger = LoggerFactory.getLogger(AttachmentController.class);
    AttachmentRepositoryMock attachmentRepository = new AttachmentRepositoryMock();

    @GetMapping("/attachments/{uid}")
    public ResponseEntity<AttachmentDTO> one(@PathVariable String uid, WebRequest request) {
        Attachment a = attachmentRepository.getOne(uid);
        if (a == null)
            throw new AttachmentNotFoundException(uid);

        AttachmentDTO dto = Translator.newAttachmentDTO(a);

        return ResponseEntity
                .ok()
                .body(dto);
    }

    @PostMapping("/attachments")
    public ResponseEntity<AttachmentDTO> post(@RequestBody AttachmentDTO dto) {
        Attachment a = Translator.newAttachment(dto);

        if (attachmentRepository.getOne(dto.getUid()) != null)
            throw new AttachmentConflictException(a.getUid());

        attachmentRepository.save(a);

        return ResponseEntity
                .ok()
                .body(dto);
    }

}
