package stos.repositories;

import stos.entities.Publication;

import java.util.LinkedList;
import java.util.List;

public class PublicationRepositoryMock implements PublicationRepository {
    private static List<Publication> items = new LinkedList<>();

    @Override
    public long count() {
        return items.size();
    }

    @Override
    public List<Publication> findAll() {
        return items;
    }

    @Override
    public Publication getOne(String uid) {
        for (Publication i : items)
            if (uid.equals(i.getUid()))
                return i;
        return null;
    }

    @Override
    public Publication save(Publication s) {
        Publication one = getOne(s.getUid());
        if (one == null)
            items.add(s);
        return s;
    }

    @Override
    public void deleteByUid(String uid) {
        Publication one = getOne(uid);
        if (one != null)
            items.remove(one);
    }
}
