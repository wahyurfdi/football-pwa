const dbPromised = idb.open("premier-league", 2, (upgradeDb) => {
	const jadwalObjectStore = upgradeDb.createObjectStore("jadwal", {
		keyPath: "id",
	});

	jadwalObjectStore.createIndex("id", "id", { unique: false });
});

const saveJadwal = (jadwal) => {
	return new Promise((resolve, reject) => {
		getJadwalSavedById(jadwal.id)
		  .then((res) => {
		    if (res != undefined) {
		      reject({
		        	status: "FAIL",
		      });
		    }

		    dbPromised
		      .then((db) => {
		        const tx = db.transaction("jadwal", "readwrite");
		        const store = tx.objectStore("jadwal");

		        store.add(jadwal);

		        return tx.complete;
		      })
		      .then(() => {
		        resolve({
		          	status: "OK",
		        });
		      })
		      .catch(() => {
		        reject({
		          	status: "FAIL",
		        });
		      });
		  })
		  .catch((err) => console.log(err));
	});
};

const getJadwalSavedAll = () => {
	return new Promise((resolve, reject) => {
		dbPromised
		  .then((db) => {
		    const tx = db.transaction("jadwal", "readonly");
		    const store = tx.objectStore("jadwal");

		    return store.getAll();
		  })
		  .then((jadwal) => {
		    resolve(jadwal);
		  })
		  .catch(() => {
		    reject({
		      	status: "FAIL",
		    });
		  });
	});
};

const getJadwalSavedById = (idClub) => {
	return new Promise((resolve, reject) => {
		dbPromised
		  .then((db) => {
		    const tx = db.transaction("jadwal", "readonly");
		    const store = tx.objectStore("jadwal");

		    return store.get(idClub);
		  })
		  .then((jadwal) => {
		    resolve(jadwal);
		  })
		  .catch(() => {
		    reject({
		      	status: "FAIL",
		    });
		  });
	});
};

const deleteJadwalSaved = (idClub) => {
	return new Promise((resolve, reject) => {
		dbPromised
		  .then((db) => {
		    const tx = db.transaction("jadwal", "readwrite");
		    const store = tx.objectStore("jadwal");

		    return store.delete(idClub);
		  })
		  .then(() => {
		    resolve({
		      	status: "OK",
		    });
		  })
		  .catch((err) => {
		    reject({
		      	status: "FAIL",
		    });
		  });
	});
};
