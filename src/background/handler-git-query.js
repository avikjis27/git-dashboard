import PouchDB from 'pouchdb';

export async function addNamedQuery(name, query) {
	const db = new PouchDB('queries', { auto_compaction: true });
	let existingDoc;
	try {
		existingDoc = await db.get(name);
		if (!existingDoc) {
			await db.put({
				_id: name,
				query: query
			});
		}else {
			await db.put({
				_id: existingDoc._id,
				_rev: existingDoc._rev,
				query: query
			})
		}
	} catch (err) {
		console.log(err);
	}
}

export async function deleteNamedQuery(name) {
	const db = new PouchDB('queries', { auto_compaction: true });
	let existingDoc;
	try {
		existingDoc = await db.get(name);
		if (existingDoc) {
			await db.remove(existingDoc._id, existingDoc._rev);
		}
	} catch (err) {
		console.log(err);
	}
}
