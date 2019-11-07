package stos;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.Link;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import stos.StosExceptions.AttachmentConflictException;
import stos.StosExceptions.AttachmentNotFoundException;
import stos.dto.AttachmentDTO;
import stos.entities.Attachment;
import stos.repositories.AttachmentRepository;

@RestController
public class AttachmentController {
    private Logger logger = LoggerFactory.getLogger(AttachmentController.class);
    private AttachmentRepository attachmentRepository = new AttachmentRepository();

    @GetMapping("/attachments/{uid}")
    public ResponseEntity<AttachmentDTO> one(@PathVariable String uid, WebRequest request) {
        Attachment a = attachmentRepository.getOne(uid);
        if (a == null)
            throw new AttachmentNotFoundException(uid);

        AttachmentDTO dto = Translator.newAttachmentDTO(a);
        String hash = a.getHash();

        if (request.checkNotModified(hash))
            return null;

        return ResponseEntity
                .ok().eTag(hash)
                .body(dto);
    }

    @PostMapping("/attachments")
    public ResponseEntity<AttachmentDTO> post(@RequestBody AttachmentDTO dto) {
        Attachment a = Translator.newAttachment(dto);

        if (attachmentRepository.getOne(dto.getUid()) != null)
            throw new AttachmentConflictException(a.getUid());

        attachmentRepository.save(a);

        dto.add(new Link("/attachments/" + dto.getUid(), "attachment.self"));
        return ResponseEntity
                .ok()
                .body(dto);
    }

}
