package stos.dto;

import org.springframework.hateoas.ResourceSupport;

public class FileReferenceDTO extends ResourceSupport {
    private String uid;

    public String getUid() { return uid; }
    public void setUid(String uid) { this.uid = uid; }
}
