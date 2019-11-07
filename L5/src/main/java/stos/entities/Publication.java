package stos.entities;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

public class Publication {
    private String uid;
    private Integer year;
    private String title;
    private String synopsis;
    private List<String> authors = new LinkedList<>();
    private List<String> attachments = new LinkedList<>();
    private Date modified;

    public Publication() {}

    public Publication(String uid, String title, Integer year) {
        this(uid, title, year, "");
    }

    public Publication(String uid, String title, Integer year, String synopsis) {
        this.uid = uid;
        this.year = year;
        this.title = title;
        this.synopsis = synopsis;
        this.modified = new Date(); // now
    }

    public String getUid() {
        return uid;
    }
    public Integer getYear() { return year; }
    public String getTitle() {
        return title;
    }
    public String getSynopsis() {
        return synopsis;
    }
    public List<String> getAuthors() { return authors; }
    public Date getModified() { return modified; }
    public List<String> getAttachments() { return attachments; }

    public void setUid(String uid) { this.uid = uid; }
    public void setYear(Integer year) { this.year = year; }
    public void setTitle(String title) { this.title = title; }
    public void setSynopsis(String synopsis) { this.synopsis = synopsis; }
    public void setModified(Date modified) { this.modified = modified; }

}
