package stos;

import stos.dto.AttachmentDTO;
import stos.dto.PublicationDTO;
import stos.entities.Attachment;
import stos.entities.Publication;

public class Translator {
    public static PublicationDTO newPublicationDTO(Publication p) {
        PublicationDTO dto = new PublicationDTO();
        return fromPublication(p, dto);
    }

    public static Publication newPublication(PublicationDTO dto) {
        Publication p = new Publication();
        return fromPublicationDTO(dto, p);
    }

    public static PublicationDTO fromPublication(Publication p, PublicationDTO dto) {
        dto.setUid(p.getUid());
        dto.setYear(p.getYear());
        dto.setTitle(p.getTitle());
        dto.setSynopsis(p.getSynopsis());
        dto.setAuthors(String.join(", ", p.getAuthors()));
        return dto;
    }

    public static Publication fromPublicationDTO(PublicationDTO dto, Publication p) {
        if (dto.getUid() == null)
            throw new StosExceptions.PublicationMalformedException();
        p.setUid(dto.getUid());
        if (dto.getTitle() == null)
            throw new StosExceptions.PublicationMalformedException();
        p.setTitle(dto.getTitle());
        if (dto.getYear() == null)
            throw new StosExceptions.PublicationMalformedException();
        p.setYear(dto.getYear());

        p.setSynopsis(dto.getSynopsis());

        if (dto.getAuthors().length() == 0)
            throw new StosExceptions.PublicationMalformedException();

        for (String name : dto.getAuthors().split(", "))
            p.getAuthors().add(name.trim());
        return p;
    }

    public static AttachmentDTO newAttachmentDTO(Attachment a) {
        AttachmentDTO dto = new AttachmentDTO();
        dto.setUid(a.getUid());
        dto.setFilename(a.getFilename());
        dto.setHash(a.getHash());
        return dto;
    }

    public static Attachment newAttachment(AttachmentDTO dto) {
        Attachment a = new Attachment();
        a.setUid(dto.getUid());
        a.setFilename(dto.getFilename());
        a.setHash(dto.getHash());
        return a;
    }
}
