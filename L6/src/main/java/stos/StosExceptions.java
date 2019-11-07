package stos;

public class StosExceptions {
    public static class PublicationConflictException extends RuntimeException {
        PublicationConflictException(String uid) {
            super("Conflicting Publication with uid: " + uid);
        }
    }

    public static class PublicationNotFoundException extends RuntimeException {
        PublicationNotFoundException(String uid) {
            super("Could not find Publication with uid: " + uid);
        }
    }

    public static class PublicationMalformedException extends RuntimeException {
        PublicationMalformedException() { }
    }

    public static class AttachmentConflictException extends RuntimeException {
        AttachmentConflictException(String uid) {
            super("Conflicting Attachment with uid: " + uid);
        }
    }

    public static class AttachmentNotFoundException extends RuntimeException {
        AttachmentNotFoundException(String uid) {
            super("Could not find Attachment with uid: " + uid);
        }
    }
}
