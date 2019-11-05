package stos;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

public class StosExceptions {
    @ResponseStatus(value= HttpStatus.CONFLICT, reason="Conflict with existing Publication")
    public static class PublicationConflictException extends RuntimeException {
        PublicationConflictException(String uid) {
            super("Conflicting Publication with uid: " + uid);
        }
    }
    @ResponseStatus(value= HttpStatus.NOT_FOUND, reason="No such Publication")
    public static class PublicationNotFoundException extends RuntimeException {
        PublicationNotFoundException(String uid) {
            super("Could not find Publication with uid: " + uid);
        }
    }
    @ResponseStatus(value= HttpStatus.BAD_REQUEST, reason="Malformed Publication")
    public static class PublicationMalformedException extends RuntimeException {
        PublicationMalformedException() { }
    }
    @ResponseStatus(value= HttpStatus.CONFLICT, reason="Conflict with existing Attachment")
    public static class AttachmentConflictException extends RuntimeException {
        AttachmentConflictException(String uid) {
            super("Conflicting Attachment with uid: " + uid);
        }
    }
    @ResponseStatus(value= HttpStatus.NOT_FOUND, reason="No such Attachment")
    public static class AttachmentNotFoundException extends RuntimeException {
        AttachmentNotFoundException(String uid) {
            super("Could not find Attachment with uid: " + uid);
        }
    }
}
