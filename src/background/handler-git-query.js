import PouchDB from 'pouchdb';

function getDB(){
	return new PouchDB('queries', { auto_compaction: true });
}

export async function addNamedQuery(name, query) {
	const db = getDB();
	let existingDoc;
	try {
		existingDoc = await fetchQuery(name);
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
	const db = getDB();
	let existingDoc;
	try {
		existingDoc = await fetchQuery(name);
		if (existingDoc) {
			await db.remove(existingDoc._id, existingDoc._rev);
		}
	} catch (err) {
		console.log(err);
	}
}

export async function fetchQuery(name) {
	const db = getDB();
	let existingDoc;
	try {
		existingDoc = await db.get(name);
		return existingDoc;
	} catch (err) {
		console.log(err);
	}
	return null;
}


export async function fetchQueries() {
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