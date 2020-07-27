import PouchDB from 'pouchdb';
var hash = require('object-hash');

export async function followRepo(repo) {
	const db = new PouchDB('repositories', { auto_compaction: true });
	let obj_hash = hash(repo);
	let existingDoc;
	try {
		existingDoc = await db.get(obj_hash);
		if (!existingDoc) {
			await db.put({
				_id: obj_hash,
				details: repo
			});
		}
	} catch (err) {
		console.log(err);
	}
}

export async function unfollowRepo(repo) {
	const db = new PouchDB('repositories', { auto_compaction: true });
	let obj_hash = hash(repo);
	let existingDoc;
	try {
		existingDoc = await db.get(obj_hash);
		if (existingDoc) {
			await db.remove(existingDoc._id, existingDoc._rev);
		}
	} catch (err) {
		console.log(err);
	}
}
