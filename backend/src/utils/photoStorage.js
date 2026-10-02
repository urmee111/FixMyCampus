// Issue photos live in a PUBLIC Supabase Storage bucket; the database only keeps the photo URL.
// Files are named  <userId>/<timestamp>-<random>.<ext>  so two uploads never overwrite each other.

import crypto from 'node:crypto';
import { supabase, photoBucket } from '../config/supabase.js';
import { AppError } from './AppError.js';

// upload.js already allows only these three types
const EXTENSIONS = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

// Upload a multer file (req.file) and return its public URL.
export async function uploadPhoto(file, userId) {
  if (!supabase) {
    throw new AppError(500, 'SERVER_ERROR', 'Photo upload is not configured on the server');
  }

  const path = `${userId}/${Date.now()}-${crypto.randomUUID()}.${EXTENSIONS[file.mimetype]}`;
  const failMessage = 'Could not upload the photo. Please try again';

  try {
    const { error } = await supabase.storage
      .from(photoBucket)
      .upload(path, file.buffer, { contentType: file.mimetype });
    if (error) throw error;
  } catch (err) {
    console.error('Photo upload failed:', err.message); // details stay in our log, not in the response
    throw new AppError(500, 'SERVER_ERROR', failMessage);
  }

  return supabase.storage.from(photoBucket).getPublicUrl(path).data.publicUrl;
}

// Delete a photo given its public URL. Best effort: a storage problem must never break the request,
// so errors are only logged (the worst case is one unused file left in the bucket).
export async function deletePhoto(photoUrl) {
  if (!supabase || !photoUrl) return;

  // public URL looks like  <SUPABASE_URL>/storage/v1/object/public/<bucket>/<path>
  const marker = `/object/public/${photoBucket}/`;
  const index = photoUrl.indexOf(marker);
  if (index === -1) return;
  const path = decodeURIComponent(photoUrl.slice(index + marker.length));

  try {
    const { error } = await supabase.storage.from(photoBucket).remove([path]);
    if (error) throw error;
  } catch (err) {
    console.error('Could not delete photo:', err.message);
  }
}
