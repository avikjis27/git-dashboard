import PouchDB from 'pouchdb';

function getDB(){
	return new PouchDB('apiep', { auto_compaction: true });
}

export async function addOrUpdateAPIEndPoint(domain, endPoint) {
	const db = getDB();
	let existingDoc;
	try {
		existingDoc = await fetchAPIEndPoint(domain);
		if (!existingDoc) {
			await db.put({
				_id: domain,
				endPoint: endPoint
			});
		} else {
			await db.put({
				_id: existingDoc._id,
				_rev: existingDoc._rev,
				endPoint: endPoint
			})
		}
	} catch (err) {
		console.error(err);
	}
}

export async function deleteAPIEndPoint(domain) {
	const db = getDB();
	let existingDoc;
	try {
		existingDoc = await fetchAPIEndPoint(domain);
		if (existingDoc) {
			await db.remove({
				_id: existingDoc._id,
				_rev: existingDoc._rev
			})
		}
	} catch (err) {
		console.error(err);
	}
}

export async function fetchAPIEndPoint(domain) {
	const db = getDB();
	let existingDoc;
	try {
		existingDoc = await db.get(domain);
		return existingDoc;
	} catch (err) {
		console.error(err);
	}
	return null;
}

export async function fetchAPIEndPoints() {
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


