// Photo upload with multer. The file is kept in memory (req.file.buffer) and is later
// sent to Supabase Storage by the controller. Nothing is written to disk
// (the Render free tier forgets disk files on restart).
//
// Rules: only jpg / png / webp, max 2 MB. The form field must be named "photo".
// Use it BEFORE validate(): router.post('/', uploadPhoto, validate(schema), controller)

import multer from 'multer';
import { AppError } from '../utils/AppError.js';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_BYTES }, // too big -> MulterError, handled in errorHandler.js
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true);
    const message = 'Photo must be a JPG, PNG or WebP image';
    cb(AppError.validation(message, { photo: message }));
  },
});

// The photo is optional: if the request has no file, req.file is just undefined.
export const uploadPhoto = upload.single('photo');
