package stos.dto;

import org.springframework.hateoas.ResourceSupport;

public class PublicationDTO extends ResourceSupport {
    private String uid;
    private String title;
    private Integer year;
    private String synopsis;
    private String authors;

    public void setUid(String uid) { this.uid = uid; }
    public void setYear(Integer year) { this.year = year; }
    public void setTitle(String title) { this.title = title; }
    public void setAuthors(String authors) { this.authors = authors; }
    public void setSynopsis(String synopsis) { this.synopsis = synopsis;  }

    public String getUid() { return uid; }
    public Integer getYear() { return year; }
    public String getTitle() { return title; }
    public String getAuthors() { return authors; }
    public String getSynopsis() { return synopsis; }
}
