package stos.dto;

public class AttachmentDTO {
    private String uid;
    private String hash; //SHA256
    private String filename;

    public String getUid() { return uid; }
    public String getHash() { return hash; }
    public String getFilename() { return filename; }

    public void setUid(String uid) { this.uid = uid; }
    public void setHash(String hash) { this.hash = hash; }
    public void setFilename(String filename) { this.filename = filename; }
}
