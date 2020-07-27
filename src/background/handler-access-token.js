import PouchDB from 'pouchdb';


export async function addOrUpdateAccessToken(domain, token) {
	const db = new PouchDB('access', { auto_compaction: true });
	let existingDoc;
	try {
		existingDoc = await db.get(domain);
		if (!existingDoc) {
			await db.put({
				_id: domain,
				token: token
			});
		} else {
			await db.put({
				_id: existingDoc._id,
				_rev: existingDoc._rev,
				token: token
			})
		}
	} catch (err) {
		console.log(err);
	}
}

export async function deleteAccessToken(domain) {
	const db = new PouchDB('access', { auto_compaction: true });
	let existingDoc;
	try {
		existingDoc = await db.get(domain);
		if (existingDoc) {
			await db.put({
				_id: domain,
				token: token
			});
		} else {
			await db.remove({
				_id: existingDoc._id,
				_rev: existingDoc._rev
			})
		}
	} catch (err) {
		console.log(err);
	}
}
