import PouchDB from 'pouchdb';
import PouchdbFind from 'pouchdb-find';

function getDB(){
	PouchDB.plugin(PouchdbFind);
	return new PouchDB('notifications', { auto_compaction: true });
}

export async function addNotifications(message, severity) {
	const db = getDB();
	db.createIndex({
		index: {
			fields: ['timeStamp', 'severity', 'seen'],
			name: 'index-notification'
		}
	});
	
	try {
		await db.post({
			message: message,
			severity: severity,
			seen: false,
			timeStamp: Date.now()
		});
	} catch (err) {
		console.error(err);
	}
}

// export async function updateNotifications(name) {
// 	const db = getDB();
// 	let existingDoc;
// 	try {
// 		existingDoc = await fetchQuery(name);
// 		if (existingDoc) {
// 			await db.remove(existingDoc._id, existingDoc._rev);
// 		}
// 	} catch (err) {
// 		console.error(err);
// 	}
// }

export async function deleteNotifications(id) {
	const db = getDB();
	let existingDoc;
	try {
		existingDoc = await fetchNotification(id);
		if (existingDoc) {
			await db.remove(existingDoc._id, existingDoc._rev);
		}
	} catch (err) {
		console.error(err);
	}
}

export async function fetchIndexedNotifications() {
	const db = getDB();
	let resp = await db.find({
		selector: {
			seen: {
				$eq: false
			}
		}
	});
	return resp;
}

export async function fetchNotification(id) {
	const db = getDB();
	let existingDoc;
	try {
		existingDoc = await db.get(id);
		return existingDoc;
	} catch (err) {
		console.error(err);
	}
	return null;
}

