package stos.repositories;

import org.springframework.stereotype.Repository;
import stos.entities.Publication;

import java.util.List;

@Repository
public interface PublicationRepository { //extends JpaRepository<Publication, String> {
    long count();
    List<Publication> findAll();
    Publication getOne(String uid);
    Publication save(Publication s);
    void deleteByUid(String uid);
}
