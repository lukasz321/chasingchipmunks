const isProd = window.location.hostname.includes("chasingchipmunks");
const baseUrl = isProd
  ? "https://api.chasingchipmunks.com"
  : "http://0.0.0.0:7070";

export interface Photo {
  src: string;
  thumb: string;
}

export const fetchPhotos = async (): Promise<Photo[]> => {
  const res = await fetch(`${baseUrl}/photos`);
  if (!res.ok) throw new Error(`Failed to fetch photos: ${res.status}`);
  const data = await res.json();
  return data.photos.map((p: Photo) => ({
    src: `${baseUrl}${p.src}`,
    thumb: `${baseUrl}${p.thumb}`,
  }));
};
