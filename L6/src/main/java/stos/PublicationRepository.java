package stos;

import io.stos.Publication;

import java.util.LinkedList;
import java.util.List;

public class PublicationRepository {
	private static List<Publication> items = new LinkedList<>();

	public PublicationRepository() {
		Publication kol2012 = new Publication();
		kol2012.setUid("kol2012");
		kol2012.setYear(2012);
		kol2012.setTitle("Something");
		kol2012.getAuthors().add("Thomas K. Kol");

		items.add(kol2012);
	}

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
