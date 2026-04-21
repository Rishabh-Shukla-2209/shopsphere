import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
}

export async function uploadImages(files = [], folder = 'products') {
  if (!files.length) return [];

  const uploadPromises = files.map(file =>
    uploadToCloudinary(file.buffer, folder)
  );

  const results = await Promise.all(uploadPromises);
  return results;
}
