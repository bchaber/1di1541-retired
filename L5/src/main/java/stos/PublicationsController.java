package stos;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import stos.dto.FileReferenceDTO;
import stos.dto.BibliographyDTO;
import stos.dto.PublicationDTO;
import stos.entities.Attachment;
import stos.entities.Publication;
import stos.repositories.AttachmentRepositoryMock;
import stos.repositories.PublicationRepository;
import stos.repositories.PublicationRepositoryMock;
import stos.StosExceptions.*;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

@RestController
public class PublicationsController {
    Logger logger = LoggerFactory.getLogger(PublicationsController.class);
    PublicationRepository publicationRepository = new PublicationRepositoryMock();
    AttachmentRepositoryMock attachmentRepository = new AttachmentRepositoryMock();

    @GetMapping("/")
    public ResponseEntity<String> index() {
        return ResponseEntity
                .ok().body("");
    }
    
    @GetMapping("/publications")
    public ResponseEntity<BibliographyDTO> all(@RequestParam(name="show", defaultValue="10") Integer show,
                                               @RequestParam(name="skip", defaultValue="0") Integer skip,
                                               WebRequest request) {
        List<PublicationDTO> publications = new LinkedList<>();
        for (Publication p : publicationRepository.findAll()) {
            if (skip-- > 0)
                continue;
            if (publications.size() >= show)
                break;

            PublicationDTO dto = Translator.newPublicationDTO(p);
            publications.add(dto);
        }

        BibliographyDTO bibliography = new BibliographyDTO();
        bibliography.setPublications(publications);

        return ResponseEntity
                .ok()
                .body(bibliography);
    }

    @GetMapping(path = "/publications/{uid}")
    public ResponseEntity<PublicationDTO> one(@PathVariable String uid) {
        Publication p = publicationRepository.getOne(uid);
        if (p == null)
            throw new PublicationNotFoundException(uid);

        PublicationDTO dto = Translator.newPublicationDTO(p);

        return ResponseEntity
                .ok()
                .body(dto);
    }

    @PostMapping(path = "/publications")
    public ResponseEntity<PublicationDTO> post(@RequestBody PublicationDTO dto) {
        Publication p = Translator.newPublication(dto);

        if (publicationRepository.getOne(p.getUid()) != null)
            throw new PublicationConflictException(p.getUid());

        p.setDateModified(new Date());
        publicationRepository.save(p);

        return ResponseEntity
                .ok()
                .body(dto);
    }

    @DeleteMapping("/publications/{uid}")
    public ResponseEntity<?> delete(@PathVariable String uid) {
        publicationRepository.deleteByUid(uid);

        return ResponseEntity
                .noContent()
                .build();
    }

    @PutMapping("/publications/{uid}")
    public ResponseEntity<PublicationDTO> put(@PathVariable String uid, @RequestBody PublicationDTO dto) {
        Publication p = publicationRepository.getOne(uid);
        if (dto.getUid() != uid)
            throw new PublicationMalformedException();

        if (p == null)
            p = new Publication();

        Translator.fromPublicationDTO(dto, p);
        p.setDateModified(new Date());

        return ResponseEntity
                .ok()
                .body(dto);
    }

    @PostMapping("/publications/{uid}/attachments")
    public ResponseEntity<FileReferenceDTO> attach(@PathVariable String uid, @RequestBody FileReferenceDTO dto) {
        Publication p = publicationRepository.getOne(uid);
        if (p == null)
            throw new PublicationNotFoundException(uid);

        Attachment a = attachmentRepository.getOne(dto.getUid());
        if (a == null)
            throw new AttachmentNotFoundException(dto.getUid());

        p.getAttachments().add(dto.getUid());
        p.setDateModified(new Date());

        publicationRepository.save(p);

        return ResponseEntity
                .ok()
                .body(dto);
    }
}