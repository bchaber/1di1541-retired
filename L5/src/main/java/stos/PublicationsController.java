package stos;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.Link;
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

    @GetMapping("/publications")
    public ResponseEntity<BibliographyDTO> all(@RequestParam(name="show", defaultValue="10") Integer show,
                                               @RequestParam(name="skip", defaultValue="0") Integer skip,
                                               WebRequest request) {
        List<PublicationDTO> publications = new LinkedList<>();
        Date newest = null;
        long count = publicationRepository.count();
        long low  = Math.max(skip-show, 0);
        long high = Math.min(skip+show, count);
        String prev = String.format("/publications?skip=%d&show=%d", low,  Math.min(show, skip-low));
        String next = String.format("/publications?skip=%d&show=%d", high, Math.min(show, high-skip));
        for (Publication p : publicationRepository.findAll()) {
            if (skip-- > 0)
                continue;
            if (publications.size() >= show)
                break;

            PublicationDTO dto = Translator.newPublicationDTO(p);
            dto.add(new Link("/publications/" + p.getUid(), "publication.self"));
            publications.add(dto);

            if (newest == null)
                newest = p.getDateModified();
            if (newest.before(p.getDateModified()))
                newest = p.getDateModified();
        }

        if (newest == null)
            newest = new Date();

        long lastModified = newest.toInstant().toEpochMilli();
        if (request.checkNotModified(lastModified))
            return null;

        BibliographyDTO bibliography = new BibliographyDTO();
        bibliography.setPublications(publications);
        bibliography.add(new Link("/publications", "publication.new"));
        bibliography.add(new Link(prev, "page.prev"));
        bibliography.add(new Link(next, "page.next"));

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
        dto.add(new Link("/publications/" + uid + "/attachments", "attachment.new"));
        for (String f : p.getAttachments())
            dto.add(new Link("/attachments/" + f, "attachment.get"));

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

        dto.add(new Link("/publications/" + p.getUid(), "publication.self"));
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

        dto.add(new Link("/publications/" + uid, "publication.parent"));
        dto.add(new Link("/publications/" + uid + "/attachments/" + a.getUid(), "attachment.self"));
        return ResponseEntity
                .ok()
                .body(dto);
    }
}