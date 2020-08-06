import PouchDB from 'pouchdb';
var hash = require('object-hash');

function getDB(){
	return new PouchDB('repositories', { auto_compaction: true });
}

function createHash(repo){
	let obj_hash = hash(repo, { excludeKeys: function(key) {
    if ( key === 'favourite') {
      return true;
		}
    return false;
	}},{respectType: false});
	return obj_hash;
}


export async function toggleFavouriteRepo(repo) {
	const db = getDB();
	try {
		let existingDoc = await fetchRepo(repo);
		repo['favourite'] = !existingDoc.details.favourite
		if (!existingDoc) {
			console.error("Repository not present",repo)
		} else {
			await db.put({
				_id: existingDoc._id,
				_rev: existingDoc._rev,
				details: repo
			})
		}
	} catch (err) {
		console.error(err);
	}
}

export async function followRepo(repo) {
	const db = getDB();
	let obj_hash = createHash(repo);
	let existingDoc;
	repo['favourite']=false;
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
	let obj_hash = createHash(repo);
	try {
		let existingDoc = await db.get(obj_hash);
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
