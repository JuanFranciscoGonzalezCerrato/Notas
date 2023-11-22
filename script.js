const addButton = document.getElementById('boton');
const mainElement = document.querySelector('main');
const deleteAllButton = document.getElementById('deleteAllButton');

const dbName = 'notasDB';
const request = indexedDB.open(dbName, 1);

request.onupgradeneeded = function (event) {
	const db = event.target.result;
	const objectStore = db.createObjectStore('notas', { keyPath: 'id', autoIncrement: true });
	objectStore.createIndex('contenido', 'contenido', { unique: false });
}

request.onerror = function (event) {
	console.error('Error abriendo la base de datos:', event.target.errorCode);
}

request.onsuccess = function (event) {
	const db = event.target.result;
	loadNotesFromDB(db);

	addButton.addEventListener('click', createNote.bind(null, db));
}


function createNote(db) {
	const noteDiv = document.createElement('div');
	noteDiv.classList.add('note');

	const noteText = document.createElement('p');
	noteText.setAttribute('contenteditable', 'true');
	noteText.textContent = 'Escribe aquí tu nota...';

	const deleteButton = document.createElement('button');
	deleteButton.textContent = 'Eliminar';
	deleteButton.addEventListener('click', () => {
		const noteId = parseInt(noteDiv.dataset.id);
		noteDiv.remove();
		deleteNoteFromDB(db, noteId); 
	});


	noteDiv.appendChild(deleteButton);
	noteDiv.appendChild(noteText);

	mainElement.appendChild(noteDiv);

	saveNoteToDB(db, { contenido: noteText.textContent }, noteDiv);

	noteText.addEventListener('input', () => {
		const noteContent = noteText.textContent;
		const noteId = parseInt(noteDiv.dataset.id);

		if (noteId) {
			updateNoteInDB(db, { id: noteId, contenido: noteContent });
		} else {
			saveNoteToDB(db, { contenido: noteContent }, noteDiv);
		}
	});
}

function deleteNoteFromDB(db, noteId) {
	const transaction = db.transaction(['notas'], 'readwrite');
	const objectStore = transaction.objectStore('notas');

	const request = objectStore.delete(noteId);
}


function saveNoteToDB(db, note, noteDiv) {
	const transaction = db.transaction('notas', 'readwrite');
	const objectStore = transaction.objectStore('notas');
	const request = objectStore.add(note);

	request.onsuccess = function (event) {
		noteDiv.dataset.id = event.target.result;
	}


}

function updateNoteInDB(db, note) {
	const transaction = db.transaction('notas', 'readwrite');
	const objectStore = transaction.objectStore('notas');
	const request = objectStore.put(note);


}




function eliminarContacto(key) {
	var transaccion = bd.transaction(["Contactos"], "readwrite");
	var almacen = transaccion.objectStore("Contactos");

	var solicitud = almacen.delete(key);

}

function loadNotesFromDB(db) {
	const transaction = db.transaction('notas', 'readonly');
	const objectStore = transaction.objectStore('notas');
	const request = objectStore.openCursor();

	request.onsuccess = function (event) {
		const cursor = event.target.result;
		if (cursor) {
			const note = cursor.value;
			createNoteFromDB(note, cursor.key); 
			cursor.continue();
		}
	}
}

function createNoteFromDB(note, noteId) {
	const noteDiv = document.createElement('div');
	noteDiv.classList.add('note');
	noteDiv.dataset.id = noteId; 

	const noteText = document.createElement('p');
	noteText.setAttribute('contenteditable', 'true');
	noteText.textContent = note.contenido;

	const deleteButton = document.createElement('button');
	deleteButton.textContent = 'Eliminar';
	deleteButton.addEventListener('click', () => {
		const noteId = parseInt(noteDiv.dataset.id);
		noteDiv.remove();
		deleteNoteFromDB(db, noteId);
	});


	noteDiv.appendChild(deleteButton);
	noteDiv.appendChild(noteText);

	mainElement.appendChild(noteDiv);

	noteText.addEventListener('input', () => {
		updateNoteInDB({ id: noteId, contenido: noteText.textContent });
	});
}


deleteAllButton.addEventListener('click', function() {
    const request = indexedDB.open(dbName, 1);

    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(['notas'], 'readwrite');
        const objectStore = transaction.objectStore('notas');
        
        const clearRequest = objectStore.clear(); 
        
        clearRequest.onsuccess = function(event) {
            
            const notesContainer = document.querySelector('main');
            notesContainer.innerHTML = ''; 
        }
        
    }
});
