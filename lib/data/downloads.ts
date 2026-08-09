import type { DownloadBrand } from "@/lib/types/download";

/**
 * Single source of truth for the Download Center.
 *
 * Files are NEVER downloaded or stored in this repo — each document keeps the
 * manufacturer's own official URL and streams on demand via the same-origin
 * proxy in `app/api/download`. Every link below was validated live (HTTP 200/206,
 * official domain, real file content-type).
 *
 * Primare intentionally exposes ONLY the NP5. Other brands are generated from
 * the official-documentation index; to add/adjust, edit this array.
 *
 * Generated from brand-document-index + live validation.
 */
export const DOWNLOAD_BRANDS: DownloadBrand[] = [
  {
    "slug": "aavik",
    "name": "Aavik",
    "officialDomain": "audiogroupdenmark.com",
    "blurb": "Danish electronics from Audio Group Denmark — amplifiers, DACs and streamers engineered with extensive active and passive noise-reduction technology.",
    "products": []
  },
  {
    "slug": "acoustic-arts",
    "name": "Accustic Arts",
    "officialDomain": "accusticarts.de",
    "blurb": "German high-end electronics — CD players, DACs and amplifiers, handbuilt in Lauffen am Neckar.",
    "products": []
  },
  {
    "slug": "audes",
    "name": "Audes",
    "officialDomain": "audes.ee",
    "blurb": "Estonian manufacturer of loudspeakers and audio electronics.",
    "products": []
  },
  {
    "slug": "audiovector",
    "name": "Audiovector",
    "officialDomain": "audiovector.com",
    "blurb": "Danish loudspeakers, designed and built in Copenhagen.",
    "products": [
      {
        "slug": "qr-series",
        "name": "QR-Series",
        "category": "Speakers",
        "imageUrl": "/downloads/audiovector/qr-series/cover.jpg",
        "imageBlurDataURL": "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAAVAA4DASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAUGBP/EACAQAAICAgMAAwEAAAAAAAAAAAECAwQAEQUhMRITQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKaeeClD9tlxHHvXyIOaFVXUMpBBGwf7khzdtUs8mkjEBWi12T6p11lTx9mOSNYEbckcaFhrzYwFV2hXuQssydM6sSvRJHneMq8ccZLIgBIAJ/TrzDDIP//Z",
        "documents": [
          {
            "id": "qr-se-manual-2023",
            "type": "user-manual",
            "title": "2023_audiovector_qr_se_manual.pdf",
            "format": "PDF",
            "fileSize": 453344,
            "localPath": "/downloads/audiovector/qr-series/2023_audiovector_qr_se_manual.pdf"
          },
          {
            "id": "qr-sub-se-manual-2023",
            "type": "user-manual",
            "title": "2023_audiovector_qr_sub_se_manual.pdf",
            "format": "PDF",
            "fileSize": 886498,
            "localPath": "/downloads/audiovector/qr-series/2023_audiovector_qr_sub_se_manual.pdf"
          },
          {
            "id": "qrse-brochure",
            "type": "brochure",
            "title": "Audiovector_QRSE_Brochure.pdf",
            "format": "PDF",
            "fileSize": 5454666,
            "localPath": "/downloads/audiovector/qr-series/Audiovector_QRSE_Brochure.pdf"
          }
        ]
      },
      {
        "slug": "r-5",
        "name": "R-5",
        "category": "Speakers",
        "documents": [
          {
            "id": "r-5-brochure",
            "type": "brochure",
            "title": "Audiovector-R-5-Brochure.pdf",
            "format": "PDF",
            "fileSize": 5865024,
            "localPath": "/downloads/audiovector/r-5/Audiovector-R-5-Brochure.pdf"
          }
        ],
        "imageUrl": "/downloads/audiovector/r-5/cover.jpg",
        "imageBlurDataURL": "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAAVAA4DASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAMEBQb/xAAlEAABBAECBQUAAAAAAAAAAAABAgMEEQAFEgYTFEFRITVhc7H/xAAWAQEBAQAAAAAAAAAAAAAAAAABAAL/xAAWEQEBAQAAAAAAAAAAAAAAAAAAESH/2gAMAwEAAhEDEQA/ANRqExMGKp5YBANAE1ZxkZ7qIzTwG0OICq8WMr+JlBOkqs1a0jv8+Ml6V7VE+lH5hdamUyXFZmM8qQjeiwauvXGNNoZaS22nahApIHYYYZB//9k="
      },
      {
        "slug": "r-series",
        "name": "R-Series",
        "category": "Speakers",
        "documents": [
          {
            "id": "r-series-manual",
            "type": "user-manual",
            "title": "01_r_series_manual_audiovector.pdf",
            "format": "PDF",
            "fileSize": 239362,
            "localPath": "/downloads/audiovector/r-series/01_r_series_manual_audiovector.pdf"
          },
          {
            "id": "r-series-brochure",
            "type": "brochure",
            "title": "audiovector_r_series_brochure (1).pdf",
            "format": "PDF",
            "fileSize": 27929084,
            "localPath": "/downloads/audiovector/r-series/audiovector_r_series_brochure (1).pdf"
          }
        ],
        "imageUrl": "/downloads/audiovector/r-series/cover.jpg",
        "imageBlurDataURL": "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAARAA4DASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAUCBAb/xAAgEAACAgIBBQEAAAAAAAAAAAABAgADBBESBQYTMXEh/8QAFAEBAAAAAAAAAAAAAAAAAAAAAf/EABURAQEAAAAAAAAAAAAAAAAAAABB/9oADAMBAAIRAxEAPwDV9XzHwcPy1gFuQUbG/ct1MXqRj7IBizuRXfpmqqmsYWKdKvI/Yyx9+CvYIPEfh+QpicIQiH//2Q=="
      },
      {
        "slug": "trapeze",
        "name": "TRAPEZE",
        "category": "Speakers",
        "documents": [
          {
            "id": "trapeze-manual-2024",
            "type": "user-manual",
            "title": "2024_audiovector_trapeze_manual.pdf",
            "format": "PDF",
            "fileSize": 673536,
            "localPath": "/downloads/audiovector/trapeze/2024_audiovector_trapeze_manual.pdf"
          },
          {
            "id": "trapeze-brochure",
            "type": "brochure",
            "title": "Brochure 8s A4_online.pdf",
            "format": "PDF",
            "fileSize": 10709339,
            "localPath": "/downloads/audiovector/trapeze/Brochure 8s A4_online.pdf"
          },
          {
            "id": "trapeze-whitepaper-2024",
            "type": "technical",
            "title": "Whitepaper_AV_Trapeze_2024 Online.pdf",
            "format": "PDF",
            "fileSize": 2019233,
            "localPath": "/downloads/audiovector/trapeze/Whitepaper_AV_Trapeze_2024 Online.pdf"
          }
        ],
        "imageUrl": "/downloads/audiovector/trapeze/cover.jpg",
        "imageBlurDataURL": "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAAOAA4DASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQME/8QAIhAAAgICAQMFAAAAAAAAAAAAAQIDBAAFEQYSUSEiMTJx/8QAFAEBAAAAAAAAAAAAAAAAAAAAAv/EABYRAQEBAAAAAAAAAAAAAAAAABEAAf/aAAwDAQACEQMRAD8Ab6mtWqwhNWYxHhix5AHHk/mIaWxLa1Faadg0rIO5gQQx8+mT2use/LCwZAqBgysD7geM0a6oKNRK6BQifUL8AYcWWhf/2Q=="
      }
    ]
  },
  {
    "slug": "borresen",
    "name": "Børresen",
    "officialDomain": "audiogroupdenmark.com",
    "blurb": "Danish loudspeakers from Audio Group Denmark, built around iron-free ribbon and driver technology.",
    "products": []
  },
  {
    "slug": "cayin",
    "name": "Cayin",
    "officialDomain": "cayin.com",
    "blurb": "Chinese manufacturer of valve (tube) amplifiers, CD players and headphone electronics.",
    "products": []
  },
  {
    "slug": "chord",
    "name": "Chord Electronics",
    "officialDomain": "chordelectronics.co.uk",
    "blurb": "British designer of DACs, amplifiers and streamers, known for its proprietary FPGA digital audio.",
    "products": []
  },
  {
    "slug": "davis",
    "name": "Davis Acoustics",
    "officialDomain": "davis-acoustics.com",
    "blurb": "French loudspeaker manufacturer, building its own drive units in Troyes.",
    "products": []
  },
  {
    "slug": "esoteric",
    "name": "Esoteric",
    "officialDomain": "esoteric.jp",
    "blurb": "Japanese high-end from TEAC — reference disc players, DACs, clocks and amplifiers.",
    "products": []
  },
  {
    "slug": "eat",
    "name": "European Audio Team",
    "officialDomain": "europeanaudioteam.com",
    "blurb": "Turntables, tonearms and premium valves, handcrafted in Europe.",
    "products": []
  },
  {
    "slug": "merason",
    "name": "Merason",
    "officialDomain": "merason.com",
    "altDomains": [
      "squarespace.com"
    ],
    "blurb": "Swiss R-2R digital-to-analogue converters and electronics.",
    "products": []
  },
  {
    "slug": "primare",
    "name": "Primare",
    "officialDomain": "primare.net",
    "blurb": "Swedish high-fidelity electronics built on the Prisma streaming and control platform — restrained, precise, and quietly engineered.",
    "products": []
  },
  {
    "slug": "qln",
    "name": "QLN",
    "officialDomain": "qln.se",
    "blurb": "Swedish loudspeakers, handmade in Vetlanda.",
    "products": []
  },
  {
    "slug": "qualiton",
    "name": "Qualiton",
    "officialDomain": "qualiton.eu",
    "blurb": "Hungarian valve amplifiers and phono stages, handbuilt in Budapest.",
    "products": []
  },
  {
    "slug": "soulnote",
    "name": "SOULNOTE",
    "officialDomain": "soulnote.co.jp",
    "altDomains": [
      "soulnote.link"
    ],
    "blurb": "Japanese electronics built on a no-feedback, non-oversampling design philosophy.",
    "products": []
  },
  {
    "slug": "van-den-hul",
    "name": "Van den Hul",
    "officialDomain": "vandenhul.com",
    "blurb": "Dutch maker of cables, phono cartridges and interconnects.",
    "products": []
  },
  {
    "slug": "vienna-acoustics",
    "name": "Vienna Acoustics",
    "officialDomain": "vienna-acoustics.com",
    "blurb": "Austrian loudspeakers, handcrafted in Vienna.",
    "products": []
  },
  {
    "slug": "aai",
    "name": "AAI",
    "officialDomain": "aai.sk",
    "products": []
  },
  {
    "slug": "audioflight",
    "name": "AudioFlight",
    "products": []
  },
  {
    "slug": "graham",
    "name": "Graham Audio",
    "officialDomain": "grahamaudio.co.uk",
    "products": []
  },
  {
    "slug": "jadis",
    "name": "Jadis",
    "officialDomain": "jadis-electronics.com",
    "products": []
  },
  {
    "slug": "jorma",
    "name": "Jorma Design",
    "officialDomain": "jormaaudio.com",
    "products": []
  },
  {
    "slug": "marten",
    "name": "Marten",
    "officialDomain": "marten.se",
    "products": []
  },
  {
    "slug": "mastersound",
    "name": "Mastersound",
    "products": []
  },
  {
    "slug": "roksan",
    "name": "Roksan",
    "officialDomain": "roksan.com",
    "products": []
  },
  {
    "slug": "teac",
    "name": "TEAC",
    "officialDomain": "eu.teac-audio.com",
    "products": []
  }
];
