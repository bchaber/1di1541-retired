package stos.repositories;

import org.springframework.stereotype.Repository;
import stos.entities.Attachment;

import java.util.List;

@Repository
public interface AttachmentRepository { //extends JpaRepository<Attachment, String> {
    long count();
    List<Attachment> findAll();
    Attachment getOne(String uid);
    Attachment save(Attachment s);
    void deleteByUid(String uid);
}
