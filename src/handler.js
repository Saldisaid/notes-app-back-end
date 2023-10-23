const { nanoid } = require('nanoid');
const notes = require('./notes');



let addNoteHandler =  (request, h) => {

    let  { title, tags, body } = request.payload;

    const id = nanoid(16);
    const createAt = new Date().toISOString();
    const updateAt = createAt;

    const newNote = {
        title, tags, body, id, createAt, updateAt,
    };

    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if(isSuccess) {
        let response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id,
            },
            
        });
        response.code(201);
        return response;
    }

    let response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
    })

    response.code(500);

    // const response = h.response({error: false, message: 'Catatan berhasil ditambahkan'});

    response.header('Access-Control-Allow-Origin', 'http://notesapp-v1.dicodingacademy.com');

    return response;

};

let getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

let getNoteByIdHandler = (request, h) => {
    let { id } = request.params;

    let note = notes.filter((n) => n.id === id)[0];

    if( note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }

    let response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditemukan',
    });
    response.code(404);
    return response;
}

let editNoteByHandler = (request, h) => {
    let { id } = request.params;

    let { title, tags, body } = request.payload;
    let updateAt = new Date().toISOString();

    let index = notes.findIndex((note) => note.id === id);

    if( index !== -1 ) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updateAt,
        };

        let response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbaharui',
        });
        response.code(200);
        return response;
    }

    let response = h.response({
        status: 'fail',
        message: 'Gagal memperbaharui catatan. Id tidak ditemukan',
    });

    response.code(404);
    return response;
} 

let deleteNoteByIdHandler = (request, h) => {
    let { id } = request.params;

    let index = notes.findIndex((note) => note.id === id);

    if(index !== -1) {
        notes.splice(index, 1);
        let response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        });

        response.code(200);
        return response;
    }

    let response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus',
    });
    response.code(404);
    return response;
}


module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByHandler, deleteNoteByIdHandler };