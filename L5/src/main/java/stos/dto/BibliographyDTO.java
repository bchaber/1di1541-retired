package stos.dto;

import java.util.List;

public class BibliographyDTO {
    private List<PublicationDTO> publications;

    public List<PublicationDTO> getPublications() { return publications; }
    public void setPublications(List<PublicationDTO> publications) { this.publications = publications; }
}
