import PouchDB from 'pouchdb';
var hash = require('object-hash');

function getDB(){
	return new PouchDB('repositories', { auto_compaction: true });
}


export async function followRepo(repo) {
	const db = getDB();
	let obj_hash = hash(repo);
	repo['favourite']=false;
	let existingDoc;
	try {
		existingDoc = await fetchRepo(repo);
		if (!existingDoc) {
			await db.put({
				_id: obj_hash,
				details: repo
			});
		}
	} catch (err) {
		console.error(err);
	}
}

export async function unfollowRepo(repo) {
	const db = getDB();
	let existingDoc;
	try {
		existingDoc = await fetchRepo(repo);
		if (existingDoc) {
			await db.remove(existingDoc._id, existingDoc._rev);
		}
	} catch (err) {
		console.error(err);
	}
}

export async function fetchRepo(repo) {
	const db = getDB();
	let obj_hash = hash(repo);
	let existingDoc;
	try {
		existingDoc = await db.get(obj_hash);
		return existingDoc;
	} catch (err) {
		console.error(err);
	}
	return null;
}

export async function fetchRepos() {
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
