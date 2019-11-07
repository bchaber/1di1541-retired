package stos;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.ResourceSupport;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import stos.StosExceptions.AttachmentNotFoundException;
import stos.StosExceptions.PublicationConflictException;
import stos.StosExceptions.PublicationMalformedException;
import stos.StosExceptions.PublicationNotFoundException;
import stos.dto.AttachmentReferenceDTO;
import stos.dto.BibliographyDTO;
import stos.dto.PublicationDTO;
import stos.entities.Attachment;
import stos.entities.Publication;
import stos.repositories.AttachmentRepository;
import stos.repositories.PublicationRepository;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

@RestController
public class PublicationsController {
    private Logger logger = LoggerFactory.getLogger(PublicationsController.class);
    private PublicationRepository publicationRepository = new PublicationRepository();
    private AttachmentRepository attachmentRepository = new AttachmentRepository();

    @GetMapping("/")
    public ResponseEntity<ResourceSupport> index() {
        ResourceSupport rs = new ResourceSupport();
        rs.add(new Link("/publications", "publication.create"));
        rs.add(new Link("/attachments", "attachment.create"));
        return ResponseEntity
                .ok().body(rs);
    }

    @GetMapping("/publications")
    public ResponseEntity<BibliographyDTO> all(@RequestParam(name="show", defaultValue="10") Integer show,
                                               @RequestParam(name="skip", defaultValue="0") Integer skip,
                                               WebRequest request) {
        List<PublicationDTO> publications = new LinkedList<>();
        Date newest = null;
        for (Publication p : publicationRepository.findAll()) {
            if (skip-- > 0)
                continue;
            if (publications.size() >= show)
                break;
            if (newest == null)
                newest = p.getModified();
            if (newest.before(p.getModified()))
                newest = p.getModified();

            PublicationDTO dto = Translator.newPublicationDTO(p);
            publications.add(dto);
        }
        if (newest == null)
            newest = new Date();

        BibliographyDTO bibliography = new BibliographyDTO();
        bibliography.setPublications(publications);

        long lastModified = newest.toInstant().toEpochMilli();

        if (request.checkNotModified(lastModified))
            return null;

        return ResponseEntity
                .ok().lastModified(lastModified)
                .body(bibliography);
    }

    @GetMapping(path = "/publications/{uid}")
    public ResponseEntity<PublicationDTO> one(@PathVariable String uid) {
        Publication p = publicationRepository.getOne(uid);
        if (p == null)
            throw new PublicationNotFoundException(uid);

        PublicationDTO dto = Translator.newPublicationDTO(p);
        dto.add(new Link("/publication/" + uid, "publication.delete"));
        dto.add(new Link("/publication/" + uid + "/attachments", "publication.attachment.create"));

        for (String fuid : p.getAttachments())
            dto.add(new Link("/attachments/" + fuid, "publication.attachment"));

        return ResponseEntity
                .ok()
                .body(dto);
    }

    @PostMapping(path = "/publications")
    public ResponseEntity<PublicationDTO> post(@RequestBody PublicationDTO dto) {
        Publication p = Translator.newPublication(dto);

        if (publicationRepository.getOne(p.getUid()) != null)
            throw new PublicationConflictException(p.getUid());

        p.setModified(new Date());
        publicationRepository.save(p);

        dto.add(new Link("/publications/" + dto.getUid(), "publication.self"));
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
        p.setModified(new Date());

        return ResponseEntity
                .ok()
                .body(dto);
    }

    @PostMapping("/publications/{uid}/attachments")
    public ResponseEntity<AttachmentReferenceDTO> attach(@PathVariable String uid, @RequestBody AttachmentReferenceDTO dto) {
        Publication p = publicationRepository.getOne(uid);
        if (p == null)
            throw new PublicationNotFoundException(uid);

        Attachment a = attachmentRepository.getOne(dto.getUid());
        if (a == null)
            throw new AttachmentNotFoundException(dto.getUid());

        p.getAttachments().add(dto.getUid());
        p.setModified(new Date());

        publicationRepository.save(p);

        return ResponseEntity
                .ok()
                .body(dto);
    }
}