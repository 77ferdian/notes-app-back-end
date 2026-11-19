# Notes App Back-End

REST API untuk aplikasi Notes yang dibangun dengan **Node.js** dan **Express.js**.

## Fitur
- CRUD catatan (Create, Read, Update, Delete)
- Middleware penanganan error terpusat
- Validasi data request menggunakan **Joi**
- Validasi query params
- Struktur proyek modular dan terorganisir

## Struktur Proyek
```
src/
├── server.js              # Entry point server
├── server/
│   └── index.js           # Konfigurasi Express
├── routes/
│   └── index.js           # Registrasi semua route
├── middlewares/
│   ├── error.js           # Error handling middleware
│   └── validate.js        # Validasi body & query params
├── exceptions/
│   ├── client-error.js    # Base class custom error
│   ├── invariant-error.js # Error validasi bisnis logic
│   ├── not-found-error.js # Error resource tidak ditemukan
│   └── index.js
├── services/
│   └── notes/
│       ├── controller/
│       │   └── note-controller.js
│       ├── routes/
│       │   └── index.js
│       ├── validator/
│       │   └── schema.js  # Joi schema
│       └── notes.js       # In-memory data store
└── utils/
    └── response.js        # Helper format response API
```

## Endpoints

| Method | Endpoint        | Deskripsi                   |
|--------|-----------------|-----------------------------|
| POST   | /notes          | Tambah catatan baru         |
| GET    | /notes          | Ambil semua catatan         |
| GET    | /notes?title=X  | Filter catatan berdasarkan title |
| GET    | /notes/:id      | Ambil catatan berdasarkan ID |
| PUT    | /notes/:id      | Perbarui catatan            |
| DELETE | /notes/:id      | Hapus catatan               |

## Format Response

```json
{
  "code": 200,
  "status": "success",
  "message": "pesan response",
  "data": {}
}
```

## Cara Menjalankan

```bash
# Install dependencies
npm install

# Mode development (dengan nodemon)
npm run start:dev

# Mode production
npm run start:prod
```

## Teknologi
- Node.js
- Express.js v5
- Joi (validasi data)
- Nanoid (generate ID unik)
- Nodemon (development)
- ESLint (linting)
