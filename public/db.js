let db;

// IndexedDB to allow adding income and purchases offline
const request = indexedDB.open('purchaseDB', 1);

/** Sets up the database schema when an upgrade is needed. */
request.onupgradeneeded = function (event) {
	const db = event.target.result;
	db.createObjectStore('purchases', { autoIncrement: true });
};

/** Triggered when the request is successful. */
request.onsuccess = function (event) {
	db = event.target.result;
	if (navigator.onLine) {
		checkDatabase();
	}
};

/** Handles the error event for the request. */
request.onerror = function (event) {
	console.error("Database request failed: ", event.target.error);
}

/** Saves a record to the database. */
function saveRecord(record) {
	const transaction = db.transaction(['purchases'], 'readwrite');
	const store = transaction.objectStore('purchases');
	store.add(record);

	transaction.onerror = function (event) {
		console.error("Transaction failed:", event.target.error);
	}
}

/** Synchronizes the given data with the server by sending a bulk transaction request. */
function syncWithServer(data) {
	fetch('/api/transaction/bulk', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'application/json',
		},
	})
	.then((response) => response.json())
	.then(() => {
		const transaction = db.transaction(['purchases'], 'readwrite')
		const store = transaction.objectStore('purchases')
		/** Clears store after all previous transactions are complete. */
		transaction.oncomplete = function () {
			store.clear()
		}
	})
	.catch((err) => {
		console.error("Failed to sync with server:", err);
	})
}

/** Checks the database for any purchases and sends them to the server for processing. */
function checkDatabase() {
	const transaction = db.transaction(['purchases'], 'readwrite');
	const store = transaction.objectStore('purchases');
	const getAll = store.getAll();

	/** Executes when the 'getAll' transaction is successful and the result is not empty. */
	getAll.onsuccess = function () {
		if (getAll.result.length > 0) {
			syncWithServer(getAll.result);
		}
	};
}

window.addEventListener('online', checkDatabase);

export { saveRecord };
