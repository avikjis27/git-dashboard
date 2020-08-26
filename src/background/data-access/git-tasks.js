import PouchDB from 'pouchdb';

function getDB() {
	return new PouchDB('tasks', { auto_compaction: true });
}

export async function cacheTasks(tasks) {
	const db = getDB();
	let existingDoc = await fetchTasks();
	try {
		if (existingDoc) {
			await db.put({
				_id: existingDoc._id,
				_rev: existingDoc._rev,
				tasks: tasks
			});
		} else {
			await db.put({
				_id: "1",
				tasks: tasks
			});
		}
	} catch (err) {
		console.error(err);
	}
}

export async function fetchTasks() {
	const db = getDB();
	try {
		let existingDoc = await db.get("1");
		return existingDoc;
	} catch (err) {
		console.error(err);
	}
	return null;
}
