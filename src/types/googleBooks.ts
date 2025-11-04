export type ImageLinks = {
  smallThumbnail?: string;
  thumbnail?: string;
  small?: string;
  medium?: string;
};

export type VolumeInfo = {
  title: string;
  authors?: string[];
  description: string;
  imageLinks: ImageLinks;
  maturityRating?: string;
  infoLink?: string;
};

export type Volume = {
  id: string;
  volumeInfo: VolumeInfo;
};