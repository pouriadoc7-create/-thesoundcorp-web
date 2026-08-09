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
        "slug": "r-series-general",
        "name": "R-Series (general)",
        "category": "Speakers",
        "status": "current",
        "documents": [
          {
            "id": "audiovector-r-series-brochure-pdf",
            "type": "brochure",
            "title": "audiovector_r_series_brochure.pdf",
            "format": "PDF",
            "officialUrl": "https://audiovector.com/wp-admin/admin-ajax.php?action=useyourdrive-download&dl=1&&id=1l4f_4saInC11YaJqXlK_aMvCShUQaHLR&account_id=114613767597958525337&listtoken=3e95f9f5b67bb4d4bf09ca9ca9ce66a4",
            "language": "EN",
            "fileSize": 27929084
          }
        ]
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
