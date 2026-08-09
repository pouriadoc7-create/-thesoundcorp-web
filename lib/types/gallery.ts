export type GalleryCategory =
  | "listening-rooms"
  | "loudspeakers"
  | "amplifiers"
  | "sources"
  | "events"
  | "behind-the-scenes";

export interface GalleryImage {
  id: string;
  category: GalleryCategory;
  src: string;
  width: number;
  height: number;
  /** Tiny base64 JPEG for next/image blur-up. */
  blurDataURL: string;
  /** Bilingual sample caption until final photography is supplied. */
  caption: { en: string; fa: string };
}
