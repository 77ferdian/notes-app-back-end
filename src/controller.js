import { nanoid } from 'nanoid';
import notes from './notes.js';

const createNote = (request, response) => {
  const {
    title = 'untitled',
    tags,
    body,
  } = request.body;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    id,
    title,
    createdAt,
    updatedAt,
    tags,
    body,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    return response.status(201).json({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: { noteId: id },
    });
  }

  return response.status(500).json({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
};

const getNotes = (request, response) => {
  response.status(200).json({
    status: 'success',
    data: { notes },
  });
};

const getNoteById = (request, response) => {
  const { id } = request.params;
  const note = notes.find((item) => item.id === id);

  if (!note) {
    return response.status(404).json({
      status: 'fail',
      message: 'Catatan tidak ditemukan',
    });
  }

  return response.status(200).json({
    status: 'success',
    data: { note },
  });
};

const editNoteById = (request, response) => {
  const { id } = request.params;
  const { title, tags, body } = request.body;
  const updatedAt = new Date().toISOString();
  const index = notes.findIndex((item) => item.id === id);

  if (index === -1) {
    return response.status(404).json({
      status: 'fail',
      message: 'Gagal memperbarui catatan. Id catatan tidak ditemukan',
    });
  }

  notes[index] = {
    ...notes[index],
    title,
    tags,
    body,
    updatedAt,
  };

  return response.status(200).json({
    status: 'success',
    message: 'Catatan berhasil diperbaharui',
  });
};

const deleteNoteById = (request, response) => {
  const { id } = request.params;
  const index = notes.findIndex((item) => item.id === id);

  if (index === -1) {
    return response.status(404).json({
      status: 'fail',
      message: 'Catatan gagal dihapus. Id catatan tidak ditemukan',
    });
  }

  notes.splice(index, 1);

  return response.status(200).json({
    status: 'success',
    message: 'Catatan berhasil dihapus',
  });
};

export {
  createNote,
  getNotes,
  getNoteById,
  editNoteById,
  deleteNoteById,
};
