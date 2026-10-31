import { nanoid } from 'nanoid';
import notes from './notes.js';

const addNoteHandler = (request, h) => {
  try {
    const { title, tags, body } = request.payload;
    const generatedId = nanoid(16);
    const id = `notes-${generatedId}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const note = {
      id,
      title,
      tags,
      body,
      createdAt,
      updatedAt,
    };

    notes.push(note);

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: generatedId,
      },
    });
    response.code(201);
    return response;
  } catch {
    const response = h.response({
      status: 'error',
      message: 'Catatan gagal untuk ditambahkan',
    });
    response.code(500);
    return response;
  }
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const note = notes.find((item) => item.id === id);

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    const updatedAt = new Date().toISOString();
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    return {
      status: 'success',
      message: 'Catatan berhasil diperbaharui',
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);

    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

export {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
