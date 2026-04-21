// utils/formatImage.js
function formatImage(cloudinaryRes) {
  return {
    public_id: cloudinaryRes.public_id,
    url: cloudinaryRes.secure_url,
    format: cloudinaryRes.format,
    height: cloudinaryRes.height,
    width: cloudinaryRes.width,
  };
}

export function formatMultipleImages(responses = []) {
  return responses.map(formatImage);
}
