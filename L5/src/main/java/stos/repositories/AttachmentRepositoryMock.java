package stos.repositories;

import stos.entities.Attachment;

import java.util.LinkedList;
import java.util.List;

public class AttachmentRepositoryMock implements AttachmentRepository {
    private static List<Attachment> items = new LinkedList<>();

    @Override
    public long count() {
        return items.size();
    }

    @Override
    public List<Attachment> findAll() {
        return items;
    }

    @Override
    public Attachment getOne(String uid) {
        for (Attachment i : items)
            if (uid.equals(i.getUid()))
                return i;
        return null;
    }

    @Override
    public Attachment save(Attachment s) {
        Attachment one = getOne(s.getUid());
        if (one == null)
            items.add(s);
        return s;
    }

    @Override
    public void deleteByUid(String uid) {
        Attachment one = getOne(uid);
        if (one != null)
            items.remove(one);
    }
}
