// Random photo utilities for user avatars

export const PHOTO_URLS = [
  "https://i.pinimg.com/736x/fd/a0/0c/fda00c8a00cf2f0b7de05ce9b0f6f63d.jpg",
  "https://i.pinimg.com/736x/14/9d/40/149d405dcf049c02e13fc420ee8fb9ce.jpg",
  "https://i.pinimg.com/736x/78/b4/2a/78b42afd46b06a2566385cb95c7e4949.jpg",
  "https://i.pinimg.com/736x/5d/df/1c/5ddf1c220894e95d2b87ec64c6db9ef1.jpg",
  "https://i.pinimg.com/736x/6c/ce/00/6cce00fb2be2d708d21b8cb3815d5e77.jpg",
  "https://i.pinimg.com/736x/63/a1/72/63a172849e272d600c6884352386a3dc.jpg",
  "https://i.pinimg.com/736x/e8/59/1c/e8591cfd29e65bbccbf14deff6eab825.jpg",
  "https://i.pinimg.com/736x/6f/01/54/6f0154f83e57d13d15c302fc250787f4.jpg",
  "https://i.pinimg.com/736x/13/32/9e/13329e72f7b8e5b08ea7f167476b4b21.jpg",
  "https://i.pinimg.com/736x/a9/bb/11/a9bb113e3b92da605001cdafaa607937.jpg",
  "https://i.pinimg.com/736x/fc/58/1b/fc581ba1d1f8eb034fa9318f6dfa49cc.jpg"

  
];

/**
 * Get a random photo URL from the collection
 */
export const getRandomPhoto = (): string => {
  const randomIndex = Math.floor(Math.random() * PHOTO_URLS.length);
  return PHOTO_URLS[randomIndex];
};

/**
 * Get multiple random unique photos
 * @param count - Number of photos to return (default: 3)
 */
export const getRandomPhotos = (count: number = 3): string[] => {
  const shuffled = [...PHOTO_URLS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, PHOTO_URLS.length));
};

/**
 * Get a specific photo by index (useful for consistent seeding)
 * @param index - Index of photo (will wrap around if > array length)
 */
export const getPhotoByIndex = (index: number): string => {
  return PHOTO_URLS[index % PHOTO_URLS.length];
};

/**
 * Get photos for a user based on their ID (deterministic)
 * This ensures the same user always gets the same photos
 * @param userId - User ID for seeding
 * @param count - Number of photos to return (default: 3)
 */
export const getPhotosForUser = (userId: string, count: number = 3): string[] => {
  // Simple hash function for user ID
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  
  const startIndex = Math.abs(hash) % PHOTO_URLS.length;
  const photos: string[] = [];
  
  for (let i = 0; i < count; i++) {
    photos.push(PHOTO_URLS[(startIndex + i) % PHOTO_URLS.length]);
  }
  
  return photos;
};
