const dbName = 'soulshare';
const dbVersion = 1;
const dbStore = 'soulshareStore ';
let db;

// open the database and create object store if needed
const openDatabase = async () => {
    try {
        const request = indexedDB.open(dbName, dbVersion);

        request.onerror = (event) => {
            throw new Error('Indexed DB error: ' + event.target.error);
        }

        const dbOpenPromise = new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                db = event.target.result;
                resolve(db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                db.createObjectStore(dbStore, { keyPath: 'id' });
            };
        });

        return await dbOpenPromise;
    }
    catch (error) {
        console.error(error);
    }
}

// Add data to the database
const addData = async (data) => {
    try {
        const transaction = db.transaction([dbStore], 'readwrite');
        const objectStore = transaction.objectStore(dbStore);
        const request = objectStore.add(data);

        request.onsuccess = () => {
            console.log('Data added successfully:', JSON.stringify(data));
        };

        request.onerror = (event) => {
            throw new Error('Error adding data: ' + event.target.error);
        };

        await new Promise((resolve, reject) => {
            request.onsuccess = resolve;
            request.onerror = reject;
        });
    } catch (error) {
        console.error(error);
    }
};

// Fetch data by ID
const fetchData = async (id) => {
    try {
        const transaction = db.transaction([dbStore], 'readonly');
        const objectStore = transaction.objectStore(dbStore);
        const request = objectStore.get(id);

        request.onsuccess = (event) => {
            console.log(event.target.result ? event.target.result : 'No data found for ID: ' + id);
        };

        request.onerror = (event) => {
            throw new Error('Error fetching data: ' + event.target.error);
        };

        await new Promise((resolve, reject) => {
            request.onsuccess = resolve;
            request.onerror = reject;
        });
    } catch (error) {
        console.error(error);
    }
};

// Update data
const updateData = (data) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([dbStore], 'readwrite');
        const objectStore = transaction.objectStore(dbStore);
        const request = objectStore.put(data);

        request.onsuccess = () => {
            resolve('Data updated successfully: ' + JSON.stringify(data));
        };

        request.onerror = (event) => {
            reject('Error updating data: ' + event.target.error);
        };
    });
};

// Delete data by ID
const deleteData = (id) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([dbStore], 'readwrite');
        const objectStore = transaction.objectStore(dbStore);
        const request = objectStore.delete(id);

        request.onsuccess = () => {
            resolve('Data deleted successfully for ID: ' + id);
        };

        request.onerror = (event) => {
            reject('Error deleting data: ' + event.target.error);
        };
    });
};


// Export the functions
export { openDatabase, addData, fetchData, updateData, deleteData };