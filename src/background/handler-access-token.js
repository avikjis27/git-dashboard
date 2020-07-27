import { PouchDB } from PouchDB;


async function storeAccessToken(key, token){
	var db = new PouchDB('access');
	const resp = await db.put({
		_id: key,
		token: token
	});
	return resp;
}

async function fetchAccessToken(key, token){
	var db = new PouchDB('access');
	const resp = await db.get(key);
	return resp;
}
