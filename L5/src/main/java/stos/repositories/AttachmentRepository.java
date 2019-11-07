package stos.repositories;

import stos.entities.Attachment;

import java.util.LinkedList;
import java.util.List;

public class AttachmentRepository {
    private static List<Attachment> items = new LinkedList<>();

    public long count() {
        return items.size();
    }

    public List<Attachment> findAll() {
        return items;
    }

    public Attachment getOne(String uid) {
        for (Attachment i : items)
            if (uid.equals(i.getUid()))
                return i;
        return null;
    }

    public Attachment save(Attachment s) {
        Attachment one = getOne(s.getUid());
        if (one == null)
            items.add(s);
        return s;
    }

    public void deleteByUid(String uid) {
        Attachment one = getOne(uid);
        if (one != null)
            items.remove(one);
    }
}
