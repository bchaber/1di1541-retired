package stos.repositories;

import stos.entities.Publication;

import java.util.LinkedList;
import java.util.List;

public class PublicationRepository {
    private static List<Publication> items = new LinkedList<>();

    public long count() {
        return items.size();
    }

    public List<Publication> findAll() {
        return items;
    }

    public Publication getOne(String uid) {
        for (Publication i : items)
            if (uid.equals(i.getUid()))
                return i;
        return null;
    }

    public Publication save(Publication s) {
        Publication one = getOne(s.getUid());
        if (one == null)
            items.add(s);
        return s;
    }

    public void deleteByUid(String uid) {
        Publication one = getOne(uid);
        if (one != null)
            items.remove(one);
    }
}
