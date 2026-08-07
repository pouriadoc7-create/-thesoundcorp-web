import type { GalleryCategory, GalleryImage } from "@/lib/types/gallery";

import manifest from "./gallery-manifest.json";

/** Display order of the six gallery categories. */
export const GALLERY_CATEGORIES: GalleryCategory[] = [
  "listening-rooms",
  "loudspeakers",
  "amplifiers",
  "sources",
  "events",
  "behind-the-scenes",
];

/** Bilingual sample captions, keyed by image id. Replace with real copy later. */
const CAPTIONS: Record<string, { en: string; fa: string }> = {
  "room-01": { en: "Reference listening room, evening session", fa: "اتاق شنیدن مرجع، جلسه‌ی عصرگاهی" },
  "room-02": { en: "Dedicated audition suite", fa: "سوئیت اختصاصی شنیداری" },
  "room-03": { en: "Main showroom listening space", fa: "فضای شنیداری شوروم اصلی" },
  "speaker-01": { en: "Flagship floorstanding loudspeakers", fa: "بلندگوهای ایستاده‌ی پرچم‌دار" },
  "speaker-02": { en: "Stand-mount monitor detail", fa: "جزئیات مانیتور رومیزی" },
  "speaker-03": { en: "Ribbon tweeter close-up", fa: "نمای نزدیک توییتر ریبونی" },
  "amp-01": { en: "Class-A tube amplifier", fa: "آمپلی‌فایر لامپی کلاس A" },
  "amp-02": { en: "Integrated amplifier faceplate", fa: "پنل جلویی آمپلی‌فایر یکپارچه" },
  "amp-03": { en: "Monoblock power amplifiers", fa: "پاور آمپلی‌فایرهای مونوبلاک" },
  "source-01": { en: "Reference network DAC", fa: "دک شبکه‌ی مرجع" },
  "source-02": { en: "Turntable and tonearm", fa: "تورن‌تیبل و تون‌آرم" },
  "source-03": { en: "CD transport detail", fa: "جزئیات ترنسپورت سی‌دی" },
  "event-01": { en: "Brand launch evening", fa: "شب معرفی برند" },
  "event-02": { en: "Private audition event", fa: "رویداد شنیداری خصوصی" },
  "event-03": { en: "Hi-Fi show exhibit", fa: "غرفه‌ی نمایشگاه های‌فای" },
  "bts-01": { en: "System setup and calibration", fa: "نصب و کالیبراسیون سیستم" },
  "bts-02": { en: "Cable dressing in progress", fa: "مرتب‌سازی کابل‌ها" },
  "bts-03": { en: "Unboxing a new arrival", fa: "باز کردن یک محصول تازه‌رسیده" },
};

export const GALLERY_IMAGES: GalleryImage[] = manifest.map((m) => ({
  ...m,
  category: m.category as GalleryCategory,
  caption: CAPTIONS[m.id] ?? { en: "", fa: "" },
}));
