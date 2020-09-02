import PouchDB from 'pouchdb';

function getDB(){
	return new PouchDB('ignored-pr', { auto_compaction: true });
}

export async function addOrUpdateIgnorePR(pr) {
	const db = getDB();
	let existingDoc;
	try {
		existingDoc = await fetchIgnoredPR(pr);
		if (!existingDoc) {
			await db.put({
				_id: pr,
				status: 'ignored'
			});
		} else {
			await db.put({
				_id: existingDoc._id,
				_rev: existingDoc._rev,
				status: 'ignored'
			})
		}
	} catch (err) {
		console.error(err);
	}
}

export async function fetchIgnoredPR(domain) {
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

export async function fetchIgnoredPRs() {
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


