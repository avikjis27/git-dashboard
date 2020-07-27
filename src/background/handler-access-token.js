import PouchDB from 'pouchdb';

function getDB(){
	return new PouchDB('access', { auto_compaction: true });
}

export async function addOrUpdateAccessToken(domain, token) {
	const db = getDB();
	let existingDoc;
	try {
		existingDoc = await fetchAccessToken(domain);
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
	const db = getDB();
	let existingDoc;
	try {
		existingDoc = await fetchAccessToken(domain);
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

export async function fetchAccessToken(domain) {
	const db = getDB();
	let existingDoc;
	try {
		existingDoc = await db.get(domain);
		return existingDoc;
	} catch (err) {
		console.log(err);
	}
	return null;
}

export async function fetchAccessTokens() {
	const db = getDB();
	let existingDocs;
	try {
		existingDocs = await db.allDocs();
		return existingDocs;
	} catch (err) {
		console.log(err);
	}
	return null;
}


