import admin from '../lib/firebase.js';
import { db } from '../lib/firebase.js';
import { success, error, notFound } from '../utils/response.js';
import { v4 as uuidv4 } from 'uuid';

const bucket = admin.storage().bucket();

/**
 * POST /api/upload — Upload file to Firebase Storage
 * Expects multipart form data with a 'file' field.
 */
export async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      return error(res, 'No file uploaded', 400);
    }

    const { uid } = req.user;
    const ext = req.file.originalname.split('.').pop();
    const fileName = `uploads/${uid}/${uuidv4()}.${ext}`;
    const file = bucket.file(fileName);

    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          uploadedBy: uid,
          originalName: req.file.originalname,
        },
      },
    });

    // Make publicly accessible (or use signed URLs)
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    const now = new Date().toISOString();
    const fileRecord = {
      id: fileName,
      name: req.file.originalname,
      url: publicUrl,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedBy: uid,
      uploadedAt: now,
    };

    return success(res, fileRecord, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/upload/:fileId — Delete uploaded file
 */
export async function deleteFile(req, res, next) {
  try {
    const fileId = decodeURIComponent(req.params.fileId);
    const file = bucket.file(fileId);

    const [exists] = await file.exists();
    if (!exists) {
      return notFound(res, 'File');
    }

    await file.delete();
    return success(res, { message: 'File deleted' });
  } catch (err) {
    next(err);
  }
}
