package stos.dto;

import org.springframework.hateoas.ResourceSupport;

import java.util.List;

public class BibliographyDTO extends ResourceSupport {
    private List<PublicationDTO> publications;

    public List<PublicationDTO> getPublications() { return publications; }
    public void setPublications(List<PublicationDTO> publications) { this.publications = publications; }
}
