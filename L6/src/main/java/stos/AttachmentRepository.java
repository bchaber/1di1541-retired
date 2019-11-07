package stos;

import io.stos.Attachment;

import java.util.LinkedList;
import java.util.List;

public class AttachmentRepository {
	private static List<Attachment> items = new LinkedList<>();

	public AttachmentRepository() {
		Attachment att1 = new Attachment();
		att1.setUid("1");
		att1.setHash("deadbeef");
		att1.setFilename("paper.pdf");

		items.add(att1);
	}

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
