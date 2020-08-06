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
		console.error(err);
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
		console.error(err);
	}
}

export async function fetchQuery(reportKey) {
	const db = getDB();
	let existingDoc;
	try {
		existingDoc = await db.get(reportKey);
		return existingDoc;
	} catch (err) {
		console.error(err);
	}
	return null;
}


export async function fetchQueries() {
	const db = getDB();
	let existingDocs;
	try {
		existingDocs = await db.allDocs({include_docs: true});
		return existingDocs;
	} catch (err) {
		console.error(err);
	}
	return null;
}