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
    "products": [
      {
        "slug": "aavik-crossover",
        "name": "Aavik Crossover",
        "category": "Accessories",
        "status": "current",
        "documents": [
          {
            "id": "aavik-crossover-manual-eng",
            "type": "user-manual",
            "title": "Aavik Crossover manual (ENG)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2025/10/Aavik-Crossover-manual_ENG_web.pdf",
            "language": "EN",
            "fileSize": 572716
          }
        ]
      },
      {
        "slug": "c-280",
        "name": "C-280",
        "category": "Preamplifiers (Control Amplifiers)",
        "status": "current",
        "documents": [
          {
            "id": "aavik-c-280-english",
            "type": "user-manual",
            "title": "Aavik C-280 (English)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2023/01/Aavik-C-280-English.pdf",
            "language": "EN",
            "fileSize": 1521443
          }
        ]
      },
      {
        "slug": "c-300",
        "name": "C-300",
        "category": "Preamplifiers (Control Amplifiers)",
        "status": "legacy",
        "documents": [
          {
            "id": "aavik-c300-user-guide-01-2016",
            "type": "user-manual",
            "title": "Aavik C300 User Guide (01-2016)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2022/03/Aavik-C300-UserGuide-01-2016_2026edit.pdf",
            "language": "EN",
            "fileSize": 471010
          }
        ]
      },
      {
        "slug": "c-580",
        "name": "C-580",
        "category": "Preamplifiers (Control Amplifiers)",
        "status": "current",
        "documents": [
          {
            "id": "aavik-c580-user-manual-vers01-2021",
            "type": "user-manual",
            "title": "Aavik C580 user manual (vers01 2021)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2022/02/Aavik_C580_usermanual_vers01_2021_WEB.pdf",
            "language": "EN",
            "fileSize": 648450
          }
        ]
      },
      {
        "slug": "c-880",
        "name": "C-880",
        "category": "Preamplifiers (Control Amplifiers)",
        "status": "current",
        "documents": [
          {
            "id": "aavik-c-880-manual-eng",
            "type": "user-manual",
            "title": "Aavik C-880 manual (ENG)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2024/06/Aavik-C-880-manual_ENG_web.pdf",
            "language": "EN",
            "fileSize": 1643835
          }
        ]
      },
      {
        "slug": "d-180-d-280-d-580",
        "name": "D-180 / D-280 / D-580",
        "category": "DACs",
        "status": "current",
        "documents": [
          {
            "id": "aavik-d-180-280-580-user-manual-vers01-2020",
            "type": "user-manual",
            "title": "Aavik d-180/280/580 user manual (vers01 2020)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2021/12/Aavik_d-180_280_580_usermanual_vers01_2020_web.pdf",
            "language": "EN",
            "fileSize": 952025
          },
          {
            "id": "aavik-d-180-280-580-handbuch-vers02-2021-ger",
            "type": "user-manual",
            "title": "Aavik d-180/280/580 Handbuch (vers02 2021 GER)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2021/12/aavik_d-180_280_580_usermanual_vers02_2021_ger_web.pdf",
            "language": "DE",
            "fileSize": 314843
          }
        ]
      },
      {
        "slug": "i-180-i-280-i-580",
        "name": "I-180 / I-280 / I-580",
        "category": "Integrated Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "aavik-i-180-280-580-user-manual-vers01-2020",
            "type": "user-manual",
            "title": "Aavik i-180/280/580 user manual (vers01 2020)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2021/12/Aavik_i-180_280_580_usermanual_vers01_2020_web.pdf",
            "language": "EN",
            "fileSize": 840947
          },
          {
            "id": "aavik-i-180-280-580-handbuch-vers02-2021-ger",
            "type": "user-manual",
            "title": "Aavik i-180/280/580 Handbuch (vers02 2021 GER)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2021/12/aavik_i-180_280_580_usermanual_vers02_2021_ger_web.pdf",
            "language": "DE",
            "fileSize": 618542
          }
        ]
      },
      {
        "slug": "i-188-i-288-i-588",
        "name": "I-188 / I-288 / I-588",
        "category": "Integrated Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "aavik-i-188-288-588-manual-eng",
            "type": "user-manual",
            "title": "Aavik I-188/288/588 manual (ENG)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2025/08/Aavik-I-188-288-588-manual_ENG_web.pdf",
            "language": "EN",
            "fileSize": 1020508
          },
          {
            "id": "aavik-i-188-288-588-manual-eng-rev-1-1",
            "type": "user-manual",
            "title": "Aavik I-188/288/588 manual (ENG rev 1-1)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2025/08/Aavik-I-188-288-588-manual_ENG-1-1_web.pdf",
            "language": "EN",
            "fileSize": 597146
          }
        ]
      },
      {
        "slug": "i-880",
        "name": "I-880",
        "category": "Integrated Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "aavik-i-880-manual-eng",
            "type": "user-manual",
            "title": "Aavik I-880 manual (ENG)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2022/11/Aavik-I-880-manual_ENG_web.pdf",
            "language": "EN",
            "fileSize": 1651979
          }
        ]
      },
      {
        "slug": "p-188-p-288-p-588",
        "name": "P-188 / P-288 / P-588",
        "category": "Power Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "aavik-p-188-288-588-manual-eng",
            "type": "user-manual",
            "title": "Aavik P-188/288/588 manual (ENG)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2025/08/Aavik-P-188-288-588-manual_ENG_web.pdf",
            "language": "EN",
            "fileSize": 745786
          }
        ]
      },
      {
        "slug": "p-280-p-580",
        "name": "P-280 / P-580",
        "category": "Power Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "aavik-p280-580-user-manual-vers01-2021",
            "type": "user-manual",
            "title": "Aavik P280/580 user manual (vers01 2021)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2022/02/Aavik_P280_580_usermanual_vers01_2021_WEB.pdf",
            "language": "EN",
            "fileSize": 435200
          },
          {
            "id": "aavik-p-280-english",
            "type": "user-manual",
            "title": "Aavik P-280 (English)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2023/01/Aavik-P-280-English.pdf",
            "language": "EN",
            "fileSize": 1884597
          }
        ]
      },
      {
        "slug": "p-880",
        "name": "P-880",
        "category": "Power Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "aavik-p-880-manual-eng",
            "type": "user-manual",
            "title": "Aavik P-880 manual (ENG)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2024/01/Aavik-P-880-manual_ENG_web.pdf",
            "language": "EN",
            "fileSize": 1431251
          }
        ]
      },
      {
        "slug": "r-180-r-280-r-580",
        "name": "R-180 / R-280 / R-580",
        "category": "Phono Stages",
        "status": "current",
        "documents": [
          {
            "id": "aavik-r-180-280-580-user-manual-vers01-2020",
            "type": "user-manual",
            "title": "Aavik r-180/280/580 user manual (vers01 2020)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2021/12/Aavik_r-180_280_580_usermanual_vers01_2020_web.pdf",
            "language": "EN",
            "fileSize": 368967
          },
          {
            "id": "aavik-r-180-280-580-handbuch-vers01-2020-ger",
            "type": "user-manual",
            "title": "Aavik r-180/280/580 Handbuch (vers01 2020 GER)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2021/12/aavik_r-180_280_580_usermanual_vers01_2020_ger_web.pdf",
            "language": "DE",
            "fileSize": 218405
          }
        ]
      },
      {
        "slug": "r-188-r-288-r-588-r-x88",
        "name": "R-188 / R-288 / R-588 (R-x88)",
        "category": "Phono Stages",
        "status": "current",
        "documents": [
          {
            "id": "aavik-r-x88-manual-eng",
            "type": "user-manual",
            "title": "Aavik R-x88 manual (ENG)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2025/11/Aavik-R-x88-manual_ENG_web.pdf",
            "language": "EN",
            "fileSize": 315323
          }
        ]
      },
      {
        "slug": "r-880",
        "name": "R-880",
        "category": "Phono Stages",
        "status": "current",
        "documents": [
          {
            "id": "aavik-r-880-manual-eng",
            "type": "user-manual",
            "title": "Aavik R-880 manual (ENG)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2025/06/Aavik-R-880-manual_ENG_web.pdf",
            "language": "EN",
            "fileSize": 845150
          }
        ]
      },
      {
        "slug": "s-180-s-280-s-580",
        "name": "S-180 / S-280 / S-580",
        "category": "Streamers",
        "status": "current",
        "documents": [
          {
            "id": "aavik-s-180-280-580-user-manual",
            "type": "user-manual",
            "title": "Aavik s-180/280/580 user manual",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2021/12/aavik_s-180_280_580_usermanual.pdf",
            "language": "EN",
            "fileSize": 638410
          },
          {
            "id": "aavik-s-180-280-580-handbuch-vers02-2021-ger",
            "type": "user-manual",
            "title": "Aavik s-180/280/580 Handbuch (vers02 2021 GER)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2021/12/aavik_s-180_280_580_usermanual_vers02_2021_ger_web1.pdf",
            "language": "DE",
            "fileSize": 300219
          }
        ]
      },
      {
        "slug": "sd-188-sd-288-sd-588",
        "name": "SD-188 / SD-288 / SD-588",
        "category": "Streamer / DAC",
        "status": "current",
        "documents": [
          {
            "id": "aavik-sd-188-288-588-manual-eng",
            "type": "user-manual",
            "title": "Aavik SD-188/288/588 manual (ENG)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2025/06/Aavik-SD-188-288-588-manual_ENG_web1.pdf",
            "language": "EN",
            "fileSize": 765150
          }
        ]
      },
      {
        "slug": "u-180-u-280-u-580",
        "name": "U-180 / U-280 / U-580",
        "category": "Unity Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "aavik-u180-280-580-user-manual-vers01-2021",
            "type": "user-manual",
            "title": "Aavik U180/280/580 user manual (vers01 2021)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2022/02/Aavik_U180_280_580_usermanual_vers01_2021_WEB.pdf",
            "language": "EN",
            "fileSize": 677238
          },
          {
            "id": "aavik-u-180-280-580-user-manual",
            "type": "user-manual",
            "title": "Aavik u-180/280/580 user manual",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2022/02/Aavik_u-180_280_580_usermanual_rest_web_01.pdf",
            "language": "EN",
            "fileSize": 2344612
          }
        ]
      },
      {
        "slug": "u-188-u-288-u-588",
        "name": "U-188 / U-288 / U-588",
        "category": "Unity Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "aavik-u-188-288-588-manual-eng",
            "type": "user-manual",
            "title": "Aavik U-188/288/588 manual (ENG)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2024/09/Aavik-U-188-288-588-manual_ENG_web.pdf",
            "language": "EN",
            "fileSize": 1293202
          }
        ]
      },
      {
        "slug": "u-380",
        "name": "U-380",
        "category": "Unity Amplifiers",
        "status": "legacy",
        "documents": [
          {
            "id": "aavik-u380-user-guide-02-2020",
            "type": "user-manual",
            "title": "Aavik U380 User Guide (02-2020)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2022/03/Aavik-U380-userGuide-pages-022020_2026edit.pdf",
            "language": "EN",
            "fileSize": 1505375
          },
          {
            "id": "aavik-u380-gb",
            "type": "user-manual",
            "title": "Aavik U380 (GB)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2022/03/Aavik_U380_GB.pdf",
            "language": "EN",
            "fileSize": 888092
          }
        ]
      }
    ]
  },
  {
    "slug": "acoustic-arts",
    "name": "Accustic Arts",
    "officialDomain": "accusticarts.de",
    "blurb": "German high-end electronics — CD players, DACs and amplifiers, handbuilt in Lauffen am Neckar.",
    "products": [
      {
        "slug": "amp-i",
        "name": "AMP I",
        "category": "Power Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "brosch-re-amp-i",
            "type": "brochure",
            "title": "Broschüre AMP I",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/ACCUSTIC-ARTS-AMP-I.pdf",
            "language": "DE",
            "fileSize": 283450
          }
        ]
      },
      {
        "slug": "amp-ii-mk4",
        "name": "AMP II MK4",
        "category": "Power Amplifiers",
        "status": "legacy",
        "documents": [
          {
            "id": "bedienungsanleitung-amp-ii-mk4",
            "type": "user-manual",
            "title": "Bedienungsanleitung AMP II - MK4",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/Bedienungsanleitung-AMP-II-MK4-deutsch.pdf",
            "language": "DE",
            "fileSize": 656475
          }
        ]
      },
      {
        "slug": "amp-iii-mk2",
        "name": "AMP III MK2",
        "category": "Power Amplifiers",
        "status": "legacy",
        "documents": [
          {
            "id": "bedienungsanleitung-amp-iii-mk2",
            "type": "user-manual",
            "title": "Bedienungsanleitung AMP III - MK2",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/Bedienungsanleitung-AMP-III-MK2-deutsch.pdf",
            "language": "DE",
            "fileSize": 260242
          }
        ]
      },
      {
        "slug": "amp-iv",
        "name": "AMP IV",
        "category": "Power Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "brosch-re-amp-iv",
            "type": "brochure",
            "title": "Broschüre AMP IV",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/ACCUSTIC-ARTS-AMP-IV.pdf",
            "language": "DE",
            "fileSize": 149581
          }
        ]
      },
      {
        "slug": "amp-vi",
        "name": "AMP VI",
        "category": "Power Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "brosch-re-amp-vi",
            "type": "brochure",
            "title": "Broschüre AMP VI",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/ACCUSTIC-ARTS-AMP-VI.pdf",
            "language": "DE",
            "fileSize": 124567
          }
        ]
      },
      {
        "slug": "drive-iv",
        "name": "DRIVE IV",
        "category": "CD/SACD Players & Transports",
        "status": "current",
        "documents": [
          {
            "id": "brosch-re-drive-iv-cd-transport",
            "type": "brochure",
            "title": "Broschüre DRIVE IV (CD transport)",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/ACCUSTIC-ARTS-DRIVE-IV.pdf",
            "language": "DE",
            "fileSize": 138283
          }
        ]
      },
      {
        "slug": "general-all-products",
        "name": "General (all products)",
        "category": "General / Company",
        "status": "current",
        "documents": [
          {
            "id": "warranty-terms",
            "type": "other",
            "title": "Warranty Terms",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/AA-warranty-terms.pdf",
            "language": "EN",
            "fileSize": 27939
          }
        ]
      },
      {
        "slug": "mono-ii-mk2",
        "name": "MONO II MK2",
        "category": "Power Amplifiers",
        "status": "legacy",
        "documents": [
          {
            "id": "bedienungsanleitung-mono-ii-mk2",
            "type": "user-manual",
            "title": "Bedienungsanleitung MONO II - MK2",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/Bedienungsanleitung-MONO-II-MK2-deutsch.pdf",
            "language": "DE",
            "fileSize": 214410
          }
        ]
      },
      {
        "slug": "mono-iii-mk2",
        "name": "MONO III MK2",
        "category": "Power Amplifiers",
        "status": "legacy",
        "documents": [
          {
            "id": "bedienungsanleitung-mono-iii-mk2",
            "type": "user-manual",
            "title": "Bedienungsanleitung MONO III - MK2",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/Bedienungsanleitung-MONO-III-MK2-deutsch.pdf",
            "language": "DE",
            "fileSize": 624626
          }
        ]
      },
      {
        "slug": "mono-iv",
        "name": "MONO IV",
        "category": "Power Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "brosch-re-produktblatt-mono-iv",
            "type": "brochure",
            "title": "Broschüre / Produktblatt MONO IV",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/Produktblatt_MONO-IV.pdf",
            "language": "DE",
            "fileSize": 1450579
          }
        ]
      },
      {
        "slug": "mono-vi",
        "name": "MONO VI",
        "category": "Power Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "brosch-re-mono-vi",
            "type": "brochure",
            "title": "Broschüre MONO VI",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/ACCUSTIC-ARTS-MONO-VI.pdf",
            "language": "DE",
            "fileSize": 115802
          }
        ]
      },
      {
        "slug": "mono-vi-signature",
        "name": "MONO VI Signature",
        "category": "Power Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "brosch-re-mono-vi-signature",
            "type": "brochure",
            "title": "Broschüre MONO VI Signature",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/Accustic-Arts-MONO-VI-Signature.pdf",
            "language": "DE",
            "fileSize": 1591927
          }
        ]
      },
      {
        "slug": "player-i",
        "name": "PLAYER I",
        "category": "CD/SACD Players & Transports",
        "status": "legacy",
        "documents": [
          {
            "id": "bedienungsanleitung-player-i",
            "type": "user-manual",
            "title": "Bedienungsanleitung PLAYER I",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/Bedienungsanleitung-PLAYER-I-deutsch.pdf",
            "language": "DE",
            "fileSize": 379520
          }
        ]
      },
      {
        "slug": "player-ii",
        "name": "PLAYER II",
        "category": "CD/SACD Players & Transports",
        "status": "legacy",
        "documents": [
          {
            "id": "bedienungsanleitung-player-ii",
            "type": "user-manual",
            "title": "Bedienungsanleitung PLAYER II",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/Bedienungsanleitung-PLAYER-II-deutsch.pdf",
            "language": "DE",
            "fileSize": 253652
          }
        ]
      },
      {
        "slug": "player-iii",
        "name": "PLAYER III",
        "category": "CD/SACD Players & Transports",
        "status": "current",
        "documents": [
          {
            "id": "brosch-re-player-iii",
            "type": "brochure",
            "title": "Broschüre PLAYER III",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/ACCUSTIC-ARTS-PLAYER-III.pdf",
            "language": "DE",
            "fileSize": 137024
          }
        ]
      },
      {
        "slug": "player-iv",
        "name": "PLAYER IV",
        "category": "CD/SACD Players & Transports",
        "status": "current",
        "documents": [
          {
            "id": "brosch-re-player-iv",
            "type": "brochure",
            "title": "Broschüre PLAYER IV",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/ACCUSTIC-ARTS-PLAYER-IV.pdf",
            "language": "DE",
            "fileSize": 151335
          }
        ]
      },
      {
        "slug": "power-i",
        "name": "POWER I",
        "category": "Integrated Amplifiers",
        "status": "legacy",
        "documents": [
          {
            "id": "bedienungsanleitung-power-i",
            "type": "user-manual",
            "title": "Bedienungsanleitung POWER I",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/Bedienungsanleitung-POWER-I-deutsch-.pdf",
            "language": "DE",
            "fileSize": 284405
          }
        ]
      },
      {
        "slug": "power-ii",
        "name": "POWER II",
        "category": "Integrated Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "brosch-re-power-ii",
            "type": "brochure",
            "title": "Broschüre POWER II",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/Accustic-Arts-POWER-II.pdf",
            "language": "DE",
            "fileSize": 2512362
          }
        ]
      },
      {
        "slug": "power-iii",
        "name": "POWER III",
        "category": "Integrated Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "brosch-re-datenblatt-power-iii",
            "type": "brochure",
            "title": "Broschüre / Datenblatt POWER III",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/Datenblatt_POWER-III.pdf",
            "language": "DE",
            "fileSize": 104086
          }
        ]
      },
      {
        "slug": "preamp-i",
        "name": "PREAMP I",
        "category": "Preamplifiers",
        "status": "current",
        "documents": [
          {
            "id": "brosch-re-preamp-i",
            "type": "brochure",
            "title": "Broschüre PREAMP I",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/ACCUSTIC-ARTS-PREAMP-I.pdf",
            "language": "DE",
            "fileSize": 235594
          }
        ]
      },
      {
        "slug": "preamp-v",
        "name": "PREAMP V",
        "category": "Preamplifiers",
        "status": "current",
        "documents": [
          {
            "id": "brosch-re-preamp-v",
            "type": "brochure",
            "title": "Broschüre PREAMP V",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/ACCUSTIC-ARTS-PREAMP-V.pdf",
            "language": "DE",
            "fileSize": 126226
          }
        ]
      },
      {
        "slug": "preamp-v-phono",
        "name": "PREAMP V PHONO",
        "category": "Preamplifiers",
        "status": "current",
        "documents": [
          {
            "id": "brosch-re-preamp-v-phono",
            "type": "brochure",
            "title": "Broschüre PREAMP V PHONO",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/ACCUSTIC-ARTS-PREAMP-V-PHONO.pdf",
            "language": "DE",
            "fileSize": 117782
          }
        ]
      },
      {
        "slug": "tube-dac-ii-mk3",
        "name": "TUBE DAC II MK3",
        "category": "DACs",
        "status": "legacy",
        "documents": [
          {
            "id": "bedienungsanleitung-tube-dac-ii-mk3",
            "type": "user-manual",
            "title": "Bedienungsanleitung TUBE DAC II - MK3",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/Bedienungsanleitung-TUBE-DAC-II-MK3-deutsch.pdf",
            "language": "DE",
            "fileSize": 1968161
          }
        ]
      },
      {
        "slug": "tube-phono-ii",
        "name": "TUBE PHONO II",
        "category": "Phono Stages",
        "status": "legacy",
        "documents": [
          {
            "id": "bedienungsanleitung-tube-phono-ii",
            "type": "user-manual",
            "title": "Bedienungsanleitung TUBE PHONO II",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/Bedienungsanleitung-TUBE-PHONO-II-deutsch.pdf",
            "language": "DE",
            "fileSize": 2619535
          }
        ]
      },
      {
        "slug": "tube-preamp-ii-mk2",
        "name": "TUBE PREAMP II MK2",
        "category": "Preamplifiers",
        "status": "legacy",
        "documents": [
          {
            "id": "bedienungsanleitung-tube-preamp-ii-mk2",
            "type": "user-manual",
            "title": "Bedienungsanleitung TUBE PREAMP II - MK2",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/Bedienungsanleitung-TUBE-PREAMP-II-MK2-deutsch.pdf",
            "language": "DE",
            "fileSize": 2636234
          }
        ]
      },
      {
        "slug": "tube-preamp-v",
        "name": "TUBE PREAMP V",
        "category": "Preamplifiers",
        "status": "current",
        "documents": [
          {
            "id": "brosch-re-tube-preamp-v",
            "type": "brochure",
            "title": "Broschüre TUBE PREAMP V",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/ACCUSTIC-ARTS-TUBE-PREAMP-V.pdf",
            "language": "DE",
            "fileSize": 129274
          }
        ]
      },
      {
        "slug": "tube-preamp-v-phono",
        "name": "TUBE PREAMP V PHONO",
        "category": "Preamplifiers",
        "status": "current",
        "documents": [
          {
            "id": "brosch-re-tube-preamp-v-phono",
            "type": "brochure",
            "title": "Broschüre TUBE PREAMP V PHONO",
            "format": "PDF",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/ACCUSTIC-ARTS-TUBE-PREAMP-V-PHONO.pdf",
            "language": "DE",
            "fileSize": 116418
          }
        ]
      },
      {
        "slug": "usb-xmos-audio-driver-cd-players",
        "name": "USB / XMOS Audio Driver (CD players)",
        "category": "Drivers & Software",
        "status": "current",
        "documents": [
          {
            "id": "xmos-stereo-usb-audio-class2-driver-2023-v3-34-0",
            "type": "software",
            "title": "XMOS Stereo USB Audio Class2 Driver 2023 v3.34.0",
            "format": "ZIP",
            "officialUrl": "https://www.accusticarts.de/wp-content/uploads/XMOS-Stereo-USB-Audio-Class2-Driver-2023_v3.34.0-1.zip",
            "language": "EN",
            "fileSize": 1422521
          }
        ]
      }
    ]
  },
  {
    "slug": "audes",
    "name": "Audes",
    "officialDomain": "audes.ee",
    "blurb": "Estonian manufacturer of loudspeakers and audio electronics.",
    "products": [
      {
        "slug": "excellence-amt-excellence-5-amt-excellence-3-amt",
        "name": "Excellence AMT (Excellence 5 AMT / Excellence 3 AMT)",
        "category": "Loudspeakers",
        "status": "current",
        "documents": [
          {
            "id": "brochure",
            "type": "brochure",
            "title": "Brochure",
            "format": "PDF",
            "officialUrl": "https://audes.ee/static/excellence_amt.pdf",
            "language": "EN",
            "fileSize": 734870
          }
        ]
      }
    ]
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
    "products": [
      {
        "slug": "bass-module-3-bm3",
        "name": "Bass Module 3 (BM3)",
        "category": "Subwoofers / Bass Modules",
        "status": "current",
        "documents": [
          {
            "id": "b-rresen-bm3-bass-module-3-user-guide-eng",
            "type": "other",
            "title": "Børresen BM3 (Bass Module 3) User Guide (ENG)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2026/03/Boerresen-BM3_Userguide_ENG_web.pdf",
            "language": "EN",
            "fileSize": 319885
          }
        ]
      },
      {
        "slug": "c1-c2-c3",
        "name": "C1 / C2 / C3",
        "category": "Compact / Standmount Loudspeakers",
        "status": "current",
        "documents": [
          {
            "id": "b-rresen-c1-c2-c3-user-guide-1-2-eng",
            "type": "other",
            "title": "Børresen C1 C2 C3 User Guide 1/2 (ENG)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2023/07/Boerresen-C1-C2-C3_Userguide_1-2_ENG_web.pdf",
            "language": "EN",
            "fileSize": 1546038
          },
          {
            "id": "b-rresen-c1-c2-c3-user-guide-eng",
            "type": "other",
            "title": "Børresen C1 C2 C3 User Guide (ENG)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2023/07/Boerresen-C1-C2-C3_Userguide_ENG_web.pdf",
            "language": "EN",
            "fileSize": 1600660
          },
          {
            "id": "b-rresen-c1-user-guide-eng",
            "type": "other",
            "title": "Børresen C1 User Guide (ENG)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2023/07/Boerresen-C1_Userguide_ENG_web.pdf",
            "language": "EN",
            "fileSize": 851683
          },
          {
            "id": "b-rresen-c3-english-brochure",
            "type": "brochure",
            "title": "Børresen C3 (English brochure)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2026/06/Boerresen-C3-English.pdf",
            "language": "EN",
            "fileSize": 1578113
          }
        ]
      },
      {
        "slug": "center-3",
        "name": "Center 3",
        "category": "Center Channel Loudspeakers",
        "status": "current",
        "documents": [
          {
            "id": "b-rresen-center-3-manual-eng",
            "type": "user-manual",
            "title": "Børresen Center 3 Manual (ENG)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2026/03/Boerresen-Center3-manual_ENG_web.pdf",
            "language": "EN",
            "fileSize": 575259
          }
        ]
      },
      {
        "slug": "m1-m2-m3-m6",
        "name": "M1 / M2 / M3 / M6",
        "category": "Floorstanding Loudspeakers",
        "status": "current",
        "documents": [
          {
            "id": "b-rresen-m1-m2-m3-m6-user-guide-eng",
            "type": "other",
            "title": "Børresen M1 M2 M3 M6 User Guide (ENG)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2024/12/Boerresen-M1-M2-M3-M6_Userguide_ENG_web.pdf",
            "language": "EN",
            "fileSize": 3135088
          }
        ]
      },
      {
        "slug": "t1-t3-t5",
        "name": "T1 / T3 / T5",
        "category": "Floorstanding Loudspeakers",
        "status": "current",
        "documents": [
          {
            "id": "b-rresen-t1-t3-t5-user-guide-eng",
            "type": "other",
            "title": "Børresen T1 T3 T5 User Guide (ENG)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2025/03/Boerresen-T1-T3-T5_Userguide_ENG_web.pdf",
            "language": "EN",
            "fileSize": 1660419
          }
        ]
      },
      {
        "slug": "x2",
        "name": "X2",
        "category": "Floorstanding Loudspeakers",
        "status": "current",
        "documents": [
          {
            "id": "b-rresen-x2-user-guide-1-2-eng",
            "type": "other",
            "title": "Børresen X2 User Guide 1/2 (ENG)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2024/04/Boerresen-X2_Userguide_1-2_ENG_web.pdf",
            "language": "EN",
            "fileSize": 2869886
          },
          {
            "id": "b-rresen-x2-english-brochure",
            "type": "brochure",
            "title": "Børresen X2 (English brochure)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2024/03/Boerresen-X2-English.pdf",
            "language": "EN",
            "fileSize": 2586567
          },
          {
            "id": "b-rresen-x2-english-brochure-rev-1",
            "type": "brochure",
            "title": "Børresen X2 (English brochure, rev 1)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2024/04/Boerresen-X2-English-1.pdf",
            "language": "EN",
            "fileSize": 2586567
          }
        ]
      },
      {
        "slug": "x3",
        "name": "X3",
        "category": "Floorstanding Loudspeakers",
        "status": "current",
        "documents": [
          {
            "id": "b-rresen-x3-user-guide-1-2-eng",
            "type": "other",
            "title": "Børresen X3 User Guide 1/2 (ENG)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2023/04/Boerresen-X3_Userguide_1-2_ENG_WEB.pdf",
            "language": "EN",
            "fileSize": 3225454
          }
        ]
      },
      {
        "slug": "z3",
        "name": "Z3",
        "category": "Floorstanding Loudspeakers",
        "status": "legacy",
        "documents": [
          {
            "id": "b-rresen-z3-danish-premium-speaker-english-brochure",
            "type": "brochure",
            "title": "Børresen Z3 - Danish Premium Speaker (English brochure)",
            "format": "PDF",
            "officialUrl": "https://audiogroupdenmark.com/wp-content/uploads/2023/04/Danish-Premium-Speaker_Borresen_Z3_English.pdf",
            "language": "EN",
            "fileSize": 702152
          }
        ]
      }
    ]
  },
  {
    "slug": "cayin",
    "name": "Cayin",
    "officialDomain": "cayin.com",
    "blurb": "Chinese manufacturer of valve (tube) amplifiers, CD players and headphone electronics.",
    "products": [
      {
        "slug": "cayin-general-catalogue",
        "name": "Cayin General Catalogue",
        "category": "Catalogues",
        "status": "current",
        "documents": [
          {
            "id": "cayin-katalog-2024-36-page-brochure-incl-mobile-audio",
            "type": "brochure",
            "title": "Cayin Katalog 2024 (36-page brochure, incl. Mobile Audio)",
            "format": "PDF",
            "officialUrl": "https://cayin.com/ca-inhalte/uploads/2023/04/Cayin_A4_Kat_HR_24_RZ_kl.pdf",
            "language": "DE",
            "fileSize": 28830153
          }
        ]
      },
      {
        "slug": "cp6",
        "name": "CP6",
        "category": "CD/SACD Players",
        "status": "current",
        "documents": [
          {
            "id": "cp6-users-manual-bedienungsanleitung-deutsch",
            "type": "user-manual",
            "title": "CP6 Users Manual Bedienungsanleitung deutsch",
            "format": "PDF",
            "officialUrl": "https://cayin.com/ca-inhalte/uploads/2026/07/CP6_Users_Manual_Bedienungsanleitung_deutsch.pdf",
            "language": "DE",
            "fileSize": 457506
          },
          {
            "id": "cp6-users-manual-englisch",
            "type": "user-manual",
            "title": "CP6 Users Manual englisch",
            "format": "PDF",
            "officialUrl": "https://cayin.com/ca-inhalte/uploads/2026/07/CP6_Users-Manual_englisch.pdf",
            "language": "EN",
            "fileSize": 3244298
          }
        ]
      },
      {
        "slug": "cs-150a",
        "name": "CS-150A",
        "category": "Integrated Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "cs-150a-bedienungsanleitung",
            "type": "user-manual",
            "title": "CS-150A Bedienungsanleitung",
            "format": "PDF",
            "officialUrl": "https://cayin.com/ca-inhalte/uploads/2023/04/CS-150A_bedienungsanleitung.pdf",
            "language": "DE",
            "fileSize": 1139332
          }
        ]
      },
      {
        "slug": "cs-6ph",
        "name": "CS-6PH",
        "category": "Phono Stages",
        "status": "current",
        "documents": [
          {
            "id": "cs-6ph-bedienungsanleitung",
            "type": "user-manual",
            "title": "CS-6PH Bedienungsanleitung",
            "format": "PDF",
            "officialUrl": "https://cayin.com/ca-inhalte/uploads/2025/08/CS-6PHdeutschManual.pdf",
            "language": "DE",
            "fileSize": 647530
          }
        ]
      },
      {
        "slug": "ha-300a-mk2",
        "name": "HA-300A MK2",
        "category": "Headphone Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "ha-300mk2-deutsch-bedienungsanleitung-manual",
            "type": "user-manual",
            "title": "HA-300MK2 Deutsch Bedienungsanleitung Manual",
            "format": "PDF",
            "officialUrl": "https://cayin.com/ca-inhalte/uploads/2025/10/HA-300MK2_deusch_bedieungsanleitung_Manual.pdf",
            "language": "DE",
            "fileSize": 2269292
          },
          {
            "id": "ha-300mk2-english-manual-20220412",
            "type": "user-manual",
            "title": "HA-300MK2 English Manual (20220412)",
            "format": "PDF",
            "officialUrl": "https://cayin.com/ca-inhalte/uploads/2025/10/HA-300MK2-English-Manual-20220412.pdf",
            "language": "EN",
            "fileSize": 1709914
          }
        ]
      },
      {
        "slug": "jazz-100",
        "name": "Jazz 100",
        "category": "Integrated Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "jazz-100-english-manual",
            "type": "user-manual",
            "title": "Jazz 100 English Manual",
            "format": "PDF",
            "officialUrl": "https://cayin.com/ca-inhalte/uploads/2024/12/Jazz-100-English-Manual.pdf",
            "language": "EN",
            "fileSize": 2438594
          }
        ]
      },
      {
        "slug": "n8ii",
        "name": "N8ii",
        "category": "Digital Audio Players",
        "status": "current",
        "documents": [
          {
            "id": "n8ii-bedienungsanleitung-deutsch-v3",
            "type": "user-manual",
            "title": "N8ii Bedienungsanleitung deutsch v3",
            "format": "PDF",
            "officialUrl": "https://www.cayin.com/ca-inhalte/uploads/2022/09/N8ii_Bedienungsanleitung_deutsch_v3.pdf",
            "language": "DE",
            "fileSize": 910428
          }
        ]
      },
      {
        "slug": "soul-170c",
        "name": "Soul 170C",
        "category": "Preamplifiers",
        "status": "current",
        "documents": [
          {
            "id": "soul-170c-deutsch-manual",
            "type": "user-manual",
            "title": "Soul 170C Deutsch Manual",
            "format": "PDF",
            "officialUrl": "https://cayin.com/ca-inhalte/uploads/2025/12/Soul_170C_Deutsch_Manual_de.pdf",
            "language": "DE",
            "fileSize": 3396510
          },
          {
            "id": "soul-170c-english-manual",
            "type": "user-manual",
            "title": "Soul 170C English Manual",
            "format": "PDF",
            "officialUrl": "https://cayin.com/ca-inhalte/uploads/2025/12/Soul_170C_English_Manual.pdf",
            "language": "EN",
            "fileSize": 3649468
          }
        ]
      },
      {
        "slug": "zingali-zero-series-quantum-array-twenty-evo-client-series",
        "name": "Zingali (Zero Series / Quantum Array / Twenty Evo / Client Series)",
        "category": "Speakers",
        "status": "current",
        "documents": [
          {
            "id": "zingali-lautsprecher-katalog-families",
            "type": "brochure",
            "title": "Zingali Lautsprecher Katalog (Families)",
            "format": "PDF",
            "officialUrl": "https://cayin.com/ca-inhalte/uploads/2023/06/Katalog-Zingali_Families_DE_EN_rev1.pdf",
            "language": "DE/EN",
            "fileSize": 11449491
          }
        ]
      }
    ]
  },
  {
    "slug": "chord",
    "name": "Chord Electronics",
    "officialDomain": "chordelectronics.co.uk",
    "blurb": "British designer of DACs, amplifiers and streamers, known for its proprietary FPGA digital audio.",
    "products": [
      {
        "slug": "2go",
        "name": "2go",
        "category": "Streamers",
        "status": "current",
        "documents": [
          {
            "id": "2go-user-manual-v1-6",
            "type": "user-manual",
            "title": "2go User Manual V1.6",
            "format": "PDF",
            "officialUrl": "https://chordelectronics.co.uk/wp-content/uploads/2020/02/2Go-user-manual-V1.6.pdf",
            "language": "en",
            "fileSize": 22209054
          },
          {
            "id": "get-started-with-2go",
            "type": "quick-start",
            "title": "Get Started with 2go",
            "format": "PDF",
            "officialUrl": "https://chordelectronics.co.uk/wp-content/uploads/2020/02/Get-started-with-2go.pdf",
            "language": "en",
            "fileSize": 2448118
          }
        ]
      },
      {
        "slug": "2yu",
        "name": "2yu",
        "category": "Streamers",
        "status": "current",
        "documents": [
          {
            "id": "2yu-user-manual-v1-1",
            "type": "user-manual",
            "title": "2yu User Manual V1.1",
            "format": "PDF",
            "officialUrl": "https://chordelectronics.co.uk/wp-content/uploads/2020/02/2yu-user-manual-V.1.1.pdf",
            "language": "en",
            "fileSize": 12188202
          }
        ]
      },
      {
        "slug": "chord-electronics-range-brochure",
        "name": "Chord Electronics (range brochure)",
        "category": "Company / General",
        "status": "current",
        "documents": [
          {
            "id": "product-brochure-june-2023",
            "type": "brochure",
            "title": "Product Brochure (June 2023)",
            "format": "PDF",
            "officialUrl": "https://chordelectronics.co.uk/wp-content/uploads/2023/06/Product-brochure-June-2023.pdf",
            "language": "en",
            "fileSize": 36410165
          }
        ]
      },
      {
        "slug": "dave",
        "name": "DAVE",
        "category": "DACs",
        "status": "current",
        "documents": [
          {
            "id": "dave-user-manual-v1-4",
            "type": "user-manual",
            "title": "DAVE User Manual V1.4",
            "format": "PDF",
            "officialUrl": "https://chordelectronics.co.uk/wp-content/uploads/2016/09/DAVE-User-manual-V1.4.pdf",
            "language": "en",
            "fileSize": 2818977
          },
          {
            "id": "dave-quick-start-guide",
            "type": "quick-start",
            "title": "DAVE Quick Start Guide",
            "format": "PDF",
            "officialUrl": "https://chordelectronics.co.uk/wp-content/uploads/2016/09/Dave-Quickstart.pdf",
            "language": "en",
            "fileSize": 483410
          },
          {
            "id": "dave-technology-presentation",
            "type": "brochure",
            "title": "DAVE Technology Presentation",
            "format": "PPTX",
            "officialUrl": "https://chordelectronics.co.uk/wp-content/uploads/2016/09/DAVE-Technology-Presentation.pptx",
            "language": "en",
            "fileSize": 1809774
          }
        ]
      },
      {
        "slug": "hugo-2",
        "name": "Hugo 2",
        "category": "DACs",
        "status": "current",
        "documents": [
          {
            "id": "hugo-2-user-manual-v2-3",
            "type": "user-manual",
            "title": "Hugo 2 User Manual V2.3",
            "format": "PDF",
            "officialUrl": "https://chordelectronics.co.uk/wp-content/uploads/2017/01/Hugo-2-user-manual-V2.3.pdf",
            "language": "en",
            "fileSize": 29111245
          },
          {
            "id": "chord-electronics-dac-driver-windows-10-11-2025",
            "type": "software",
            "title": "Chord Electronics DAC Driver (Windows 10 & 11, 2025)",
            "format": "ZIP",
            "officialUrl": "https://chordelectronics.co.uk/wp-content/uploads/2023/04/Chord-Electronics-DAC-Driver-Windows-10-and-11-2025.zip",
            "fileSize": 749739
          },
          {
            "id": "asio-driver-64-bit",
            "type": "software",
            "title": "ASIO Driver 64-bit",
            "format": "ZIP",
            "officialUrl": "https://chordelectronics.co.uk/wp-content/uploads/2018/07/SetupASIO64.msi_.zip",
            "fileSize": 752112
          },
          {
            "id": "asio-driver-32-bit",
            "type": "software",
            "title": "ASIO Driver 32-bit",
            "format": "ZIP",
            "officialUrl": "https://chordelectronics.co.uk/wp-content/uploads/2018/07/SetupASIO32.msi_.zip",
            "fileSize": 103603
          }
        ]
      },
      {
        "slug": "hugo-tt-2",
        "name": "Hugo TT 2",
        "category": "DACs",
        "status": "current",
        "documents": [
          {
            "id": "hugo-tt-2-manual-v2-1",
            "type": "user-manual",
            "title": "Hugo TT 2 Manual V2.1",
            "format": "PDF",
            "officialUrl": "https://chordelectronics.co.uk/wp-content/uploads/2023/04/A4-Manual-Hugo-TT-2-V2-1.pdf",
            "language": "en",
            "fileSize": 3834017
          },
          {
            "id": "hugo-tt-2-quick-start-guide",
            "type": "quick-start",
            "title": "Hugo TT 2 Quick Start Guide",
            "format": "PDF",
            "officialUrl": "https://chordelectronics.co.uk/wp-content/uploads/2018/05/Hugo-TT-2-quickstart.pdf",
            "language": "en",
            "fileSize": 380289
          }
        ]
      },
      {
        "slug": "mojo-original",
        "name": "Mojo (original)",
        "category": "Legacy",
        "status": "legacy",
        "documents": [
          {
            "id": "mojo-user-manual",
            "type": "user-manual",
            "title": "Mojo User Manual",
            "format": "PDF",
            "officialUrl": "https://chordelectronics.co.uk/wp-content/uploads/2016/09/Mojo-User-Manual.pdf",
            "language": "en",
            "fileSize": 404814
          }
        ]
      },
      {
        "slug": "mojo-2",
        "name": "Mojo 2",
        "category": "DACs",
        "status": "current",
        "documents": [
          {
            "id": "mojo-2-user-manual",
            "type": "user-manual",
            "title": "Mojo 2 User Manual",
            "format": "PDF",
            "officialUrl": "https://chordelectronics.co.uk/wp-content/uploads/2022/01/Mojo-2-4.4-user-manual.pdf",
            "language": "en",
            "fileSize": 3528151
          },
          {
            "id": "windows-10-768khz-driver",
            "type": "software",
            "title": "Windows 10 768kHz Driver",
            "format": "ZIP",
            "officialUrl": "https://chordelectronics.co.uk/wp-content/uploads/2017/01/Windows-10-768KHz-driver.zip",
            "fileSize": 2857571
          }
        ]
      },
      {
        "slug": "poly",
        "name": "Poly",
        "category": "Streamers",
        "status": "current",
        "documents": [
          {
            "id": "poly-user-manual-v3-3",
            "type": "user-manual",
            "title": "Poly User Manual v3.3",
            "format": "PDF",
            "officialUrl": "https://chordelectronics.co.uk/wp-content/uploads/2017/01/Poly-User-manual-v3.3.pdf",
            "language": "en",
            "fileSize": 4451083
          },
          {
            "id": "gofigure-app-manual-english",
            "type": "user-manual",
            "title": "GoFigure App Manual (English)",
            "format": "PDF",
            "officialUrl": "https://chordelectronics.co.uk/wp-content/uploads/2017/01/Gofigure-Manual-English.pdf",
            "language": "en",
            "fileSize": 6768920
          }
        ]
      },
      {
        "slug": "qutest",
        "name": "Qutest",
        "category": "DACs",
        "status": "current",
        "documents": [
          {
            "id": "qutest-user-manual-2-1",
            "type": "user-manual",
            "title": "Qutest User Manual 2.1",
            "format": "PDF",
            "officialUrl": "https://chordelectronics.co.uk/wp-content/uploads/2018/01/Qutest-User-manual-2.1.pdf",
            "language": "en",
            "fileSize": 2628754
          },
          {
            "id": "qutest-user-manual-dutch",
            "type": "user-manual",
            "title": "Qutest User Manual (Dutch)",
            "format": "PDF",
            "officialUrl": "https://chordelectronics.co.uk/wp-content/uploads/2018/01/Qutest-User-Manual-Dutch.pdf",
            "language": "nl",
            "fileSize": 2720282
          }
        ]
      }
    ]
  },
  {
    "slug": "davis",
    "name": "Davis Acoustics",
    "officialDomain": "davis-acoustics.com",
    "blurb": "French loudspeaker manufacturer, building its own drive units in Troyes.",
    "products": [
      {
        "slug": "ariane-9",
        "name": "Ariane 9",
        "category": "Loudspeakers",
        "status": "current",
        "documents": [
          {
            "id": "fiche-technique-ariane-9",
            "type": "datasheet",
            "title": "Fiche technique Ariane 9",
            "format": "PDF",
            "officialUrl": "https://davis-acoustics.com/wp-content/uploads/2025/06/Ariane-9-fiche-technique.pdf",
            "language": "FR",
            "fileSize": 195613
          }
        ]
      },
      {
        "slug": "courbet-4-s2",
        "name": "Courbet 4 S2",
        "category": "Loudspeakers",
        "status": "current",
        "documents": [
          {
            "id": "fiche-technique-data-sheet-courbet-4-s2",
            "type": "datasheet",
            "title": "Fiche technique / Data sheet Courbet 4 S2",
            "format": "PDF",
            "officialUrl": "https://davis-acoustics.com/wp-content/uploads/2026/06/COURBET-4-S2-fiche-technique-data-sheet.pdf",
            "language": "FR",
            "fileSize": 541772
          }
        ]
      },
      {
        "slug": "courbet-n8",
        "name": "Courbet N8",
        "category": "Loudspeakers",
        "status": "current",
        "documents": [
          {
            "id": "fiche-technique-courbet-n8",
            "type": "datasheet",
            "title": "Fiche technique Courbet N8",
            "format": "PDF",
            "officialUrl": "https://davis-acoustics.com/wp-content/uploads/2021/04/Courbet-8-1.pdf",
            "language": "FR",
            "fileSize": 4241259
          },
          {
            "id": "hifitest-standlautsprecher-davis-acoustics-courbet-n8-review",
            "type": "technical",
            "title": "HifiTest - Standlautsprecher Davis Acoustics Courbet N8 (review)",
            "format": "PDF",
            "officialUrl": "https://davis-acoustics.com/wp-content/uploads/2026/06/Courbet_no8_HIFITEST-1-2026.pdf",
            "language": "DE",
            "fileSize": 429094
          }
        ]
      },
      {
        "slug": "dhavani-mk2-d-max",
        "name": "Dhavani MK2 (D-Max)",
        "category": "Loudspeakers",
        "status": "current",
        "documents": [
          {
            "id": "fiche-technique-dhavani-mk2",
            "type": "datasheet",
            "title": "Fiche technique Dhavani MK2",
            "format": "PDF",
            "officialUrl": "https://davis-acoustics.com/wp-content/uploads/2020/08/Dhavani-mk2.pdf",
            "language": "FR",
            "fileSize": 2360403
          }
        ]
      },
      {
        "slug": "general-company-wide",
        "name": "General / Company-wide",
        "category": "Catalogues & General Manuals",
        "status": "current",
        "documents": [
          {
            "id": "manuel-de-l-utilisateur",
            "type": "user-manual",
            "title": "Manuel de l'utilisateur",
            "format": "PDF",
            "officialUrl": "https://davis-acoustics.com/wp-content/uploads/2025/10/Manuel-ulisateur-davis-acoustics_compressed.pdf",
            "language": "FR",
            "fileSize": 529126
          },
          {
            "id": "catalogue-2026-enceintes-haute-fidelite",
            "type": "brochure",
            "title": "Catalogue 2026 - Enceintes Haute-Fidelite",
            "format": "PDF",
            "officialUrl": "https://davis-acoustics.com/wp-content/uploads/2026/07/catalogue-2026-site-a-jour.pdf",
            "language": "FR",
            "fileSize": 4079490
          },
          {
            "id": "catalogue-home-cinema-et-integration",
            "type": "brochure",
            "title": "Catalogue Home Cinema et Integration",
            "format": "PDF",
            "officialUrl": "https://davis-acoustics.com/wp-content/uploads/2023/12/Catalogue-FR-Home-Cinema-ajour.pdf",
            "language": "FR",
            "fileSize": 7515810
          }
        ]
      },
      {
        "slug": "home-theater",
        "name": "HOME THEATER",
        "category": "DIY Speaker Kits",
        "status": "current",
        "documents": [
          {
            "id": "kit-home-theater",
            "type": "datasheet",
            "title": "Kit Home Theater",
            "format": "PDF",
            "officialUrl": "https://davis-acoustics.com/wp-content/uploads/2020/08/HOME-THEATER.pdf",
            "language": "FR",
            "fileSize": 381871
          }
        ]
      },
      {
        "slug": "klarence",
        "name": "KLARENCE",
        "category": "DIY Speaker Kits",
        "status": "current",
        "documents": [
          {
            "id": "kit-klarence",
            "type": "datasheet",
            "title": "Kit KLARENCE",
            "format": "PDF",
            "officialUrl": "https://davis-acoustics.com/wp-content/uploads/2020/08/KLARENCE.pdf",
            "language": "FR",
            "fileSize": 1536536
          }
        ]
      },
      {
        "slug": "kloe",
        "name": "KLOE",
        "category": "DIY Speaker Kits",
        "status": "current",
        "documents": [
          {
            "id": "kit-kloe",
            "type": "datasheet",
            "title": "Kit KLOE",
            "format": "PDF",
            "officialUrl": "https://davis-acoustics.com/wp-content/uploads/2020/08/KIT-KLOE2.pdf",
            "language": "FR",
            "fileSize": 1905760
          }
        ]
      },
      {
        "slug": "kristel",
        "name": "KRISTEL",
        "category": "DIY Speaker Kits",
        "status": "current",
        "documents": [
          {
            "id": "kit-kristel",
            "type": "datasheet",
            "title": "Kit KRISTEL",
            "format": "PDF",
            "officialUrl": "https://davis-acoustics.com/wp-content/uploads/2020/08/kristel.pdf",
            "language": "FR",
            "fileSize": 1592123
          }
        ]
      },
      {
        "slug": "krypton-10",
        "name": "Krypton 10",
        "category": "Loudspeakers",
        "status": "current",
        "documents": [
          {
            "id": "fiche-technique-data-sheet-krypton-10",
            "type": "datasheet",
            "title": "Fiche technique / Data sheet Krypton 10",
            "format": "PDF",
            "officialUrl": "https://davis-acoustics.com/wp-content/uploads/2025/11/fiche-technique-data-sheet-krypton-10-compressed.pdf",
            "language": "FR",
            "fileSize": 383119
          }
        ]
      },
      {
        "slug": "mani-mk2-d-max",
        "name": "Mani MK2 (D-Max)",
        "category": "Loudspeakers",
        "status": "current",
        "documents": [
          {
            "id": "fiche-technique-mani-mk2",
            "type": "datasheet",
            "title": "Fiche technique Mani MK2",
            "format": "PDF",
            "officialUrl": "https://davis-acoustics.com/wp-content/uploads/2020/08/Mani-mk2.pdf",
            "language": "FR",
            "fileSize": 3816820
          }
        ]
      },
      {
        "slug": "mv-15",
        "name": "MV 15",
        "category": "DIY Speaker Kits",
        "status": "current",
        "documents": [
          {
            "id": "kit-mv-15",
            "type": "datasheet",
            "title": "Kit MV 15",
            "format": "PDF",
            "officialUrl": "https://davis-acoustics.com/wp-content/uploads/2026/02/mv15-1-copie.pdf",
            "language": "FR",
            "fileSize": 2087441
          }
        ]
      },
      {
        "slug": "mv-414",
        "name": "MV 414",
        "category": "DIY Speaker Kits",
        "status": "current",
        "documents": [
          {
            "id": "kit-mv-414",
            "type": "datasheet",
            "title": "Kit MV 414",
            "format": "PDF",
            "officialUrl": "https://davis-acoustics.com/wp-content/uploads/2020/08/MV414.pdf",
            "language": "FR",
            "fileSize": 2618019
          }
        ]
      },
      {
        "slug": "mv-4a",
        "name": "MV 4A",
        "category": "DIY Speaker Kits",
        "status": "current",
        "documents": [
          {
            "id": "kit-mv-4a",
            "type": "datasheet",
            "title": "Kit MV 4A",
            "format": "PDF",
            "officialUrl": "https://davis-acoustics.com/wp-content/uploads/2024/08/mv4A-2-kit.pdf",
            "language": "FR",
            "fileSize": 5161581
          }
        ]
      },
      {
        "slug": "mv-707",
        "name": "MV 707",
        "category": "DIY Speaker Kits",
        "status": "current",
        "documents": [
          {
            "id": "kit-mv-707",
            "type": "datasheet",
            "title": "Kit MV 707",
            "format": "PDF",
            "officialUrl": "https://davis-acoustics.com/wp-content/uploads/2022/04/MV707-NEW.pdf",
            "language": "FR",
            "fileSize": 48498459
          }
        ]
      },
      {
        "slug": "stellar-heritage-flagship",
        "name": "Stellar (Heritage flagship)",
        "category": "Loudspeakers",
        "status": "current",
        "documents": [
          {
            "id": "fiche-technique-stellar-pdf-attachment-page",
            "type": "datasheet",
            "title": "Fiche technique Stellar (PDF attachment page)",
            "format": "PDF",
            "officialUrl": "https://davis-acoustics.com/nouvelle-fiche-technique-stellar-fr-final_compressed/",
            "language": "FR",
            "fileSize": 198891
          }
        ]
      }
    ]
  },
  {
    "slug": "esoteric",
    "name": "Esoteric",
    "officialDomain": "esoteric.jp",
    "blurb": "Japanese high-end from TEAC — reference disc players, DACs, clocks and amplifiers.",
    "products": [
      {
        "slug": "esoteric-brand",
        "name": "Esoteric (brand)",
        "category": "Catalogs / Drivers (brand-wide)",
        "status": "current",
        "documents": [
          {
            "id": "esoteric-full-brochure-mid-2025",
            "type": "brochure",
            "title": "Esoteric Full Brochure (mid-2025)",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/catalogs/esoteric/ebrochure_esoteric(en_mid2025)_20250808.pdf",
            "language": "EN",
            "fileSize": 5208051
          },
          {
            "id": "grandioso-se-models-brochure",
            "type": "brochure",
            "title": "Grandioso SE models Brochure",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/catalogs/esoteric/ebrochure_grandioso_se_e_vb.pdf",
            "language": "EN",
            "fileSize": 4264198
          },
          {
            "id": "esoteric-full-brochure-german",
            "type": "brochure",
            "title": "Esoteric Full Brochure (German)",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/catalogs/esoteric/esoteric_full_brochure_de_web.pdf",
            "language": "DE",
            "fileSize": 2698826
          },
          {
            "id": "esoteric-usb-audio-driver-windows-v1-0-36",
            "type": "software",
            "title": "Esoteric USB Audio Driver (Windows) V1.0.36",
            "format": "ZIP",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/usb_driver/win_esoteric_asio_usb_driver_v1036.zip",
            "language": "N/A",
            "fileSize": 13318776
          },
          {
            "id": "esoteric-usb-audio-driver-macintosh-v1-0-10",
            "type": "software",
            "title": "Esoteric USB Audio Driver (Macintosh) V1.0.10",
            "format": "ZIP",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/usb_driver/esoteric_usb_audio_v1_0_10.zip",
            "language": "N/A",
            "fileSize": 1070870
          },
          {
            "id": "installation-guide-for-the-esoteric-asio-usb-driver",
            "type": "user-manual",
            "title": "Installation guide for the Esoteric ASIO USB Driver",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/k-01xd/esoteric_asio_usb_drv_install_guide_e_vd.pdf",
            "language": "EN",
            "fileSize": 1305975
          }
        ]
      },
      {
        "slug": "f-01-f-02",
        "name": "F-01 / F-02",
        "category": "Integrated Amplifier",
        "status": "current",
        "documents": [
          {
            "id": "f-01-f-02-owner-s-manual",
            "type": "user-manual",
            "title": "F-01 / F-02 Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/f-01/f-01_f-02_om_efs_vd.pdf",
            "language": "EN, FR, ES",
            "fileSize": 2496942
          },
          {
            "id": "f-01-f-02-owner-s-manual-2",
            "type": "user-manual",
            "title": "F-01 / F-02 Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/f-01/f-01_f-02_om_gi_vc.pdf",
            "language": "DE, IT",
            "fileSize": 1706566
          },
          {
            "id": "f-01-f-02-brochure",
            "type": "brochure",
            "title": "F-01 / F-02 Brochure",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/catalogs/esoteric/ebrochure_f-01_f-02_e_vd.pdf",
            "language": "EN",
            "fileSize": 2806250
          },
          {
            "id": "f-01-i-f-firmware-v1-10-updater-with-driver",
            "type": "firmware",
            "title": "F-01 I/F Firmware V1.10 (updater with driver)",
            "format": "ZIP",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/f-01/f01_ifv110_updater_withdriver.zip",
            "language": "N/A",
            "fileSize": 4432778
          }
        ]
      },
      {
        "slug": "g-01xd",
        "name": "G-01XD",
        "category": "Master Clock Generator",
        "status": "current",
        "documents": [
          {
            "id": "g-01xd-owner-s-manual",
            "type": "user-manual",
            "title": "G-01XD Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/g-01xd/g-01xd_om_efs_va.pdf",
            "language": "EN, FR, ES",
            "fileSize": 1032755
          },
          {
            "id": "g-01xd-owner-s-manual-2",
            "type": "user-manual",
            "title": "G-01XD Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/g-01xd/g-01xd_om_gi_va2.pdf",
            "language": "DE, IT",
            "fileSize": 703500
          },
          {
            "id": "g-01xd-brochure",
            "type": "brochure",
            "title": "G-01XD Brochure",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/catalogs/esoteric/ebrochure_g-01xd_e_vb.pdf",
            "language": "EN",
            "fileSize": 960200
          }
        ]
      },
      {
        "slug": "grandioso-c1x",
        "name": "Grandioso C1X",
        "category": "Pre Amplifier",
        "status": "current",
        "documents": [
          {
            "id": "grandioso-c1x-owner-s-manual",
            "type": "user-manual",
            "title": "Grandioso C1X Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/c1x/c1x_om_efs_vd2.pdf",
            "language": "EN, FR, ES",
            "fileSize": 2560983
          },
          {
            "id": "grandioso-c1x-owner-s-manual-2",
            "type": "user-manual",
            "title": "Grandioso C1X Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/c1x/c1x_om_gi_vd.pdf",
            "language": "DE, IT",
            "fileSize": 1764462
          },
          {
            "id": "grandioso-c1x-brochure",
            "type": "brochure",
            "title": "Grandioso C1X Brochure",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/catalogs/esoteric/ebrochure_c1x_e_vb.pdf",
            "language": "EN",
            "fileSize": 2746369
          },
          {
            "id": "c1x-i-f-firmware-v1-11d-updater-with-driver",
            "type": "firmware",
            "title": "C1X I/F Firmware V1.11d (updater with driver)",
            "format": "ZIP",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/c1x/c1x_ifv111d_updater_e_withdriver.zip",
            "language": "N/A",
            "fileSize": 4390527
          }
        ]
      },
      {
        "slug": "grandioso-d1x-se",
        "name": "Grandioso D1X SE",
        "category": "D/A Converter",
        "status": "current",
        "documents": [
          {
            "id": "grandioso-d1x-se-owner-s-manual",
            "type": "user-manual",
            "title": "Grandioso D1X SE Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/d1x/d1x_om_efs_vh.pdf",
            "language": "EN, FR, ES",
            "fileSize": 1275004
          },
          {
            "id": "grandioso-d1x-se-owner-s-manual-2",
            "type": "user-manual",
            "title": "Grandioso D1X SE Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/d1x/d1x_om_gi_vg.pdf",
            "language": "DE, IT",
            "fileSize": 877203
          },
          {
            "id": "grandioso-d1x-firmware-update-manual",
            "type": "user-manual",
            "title": "Grandioso D1X Firmware Update Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/d1x/d1x_updater_om_e_vb.pdf",
            "language": "EN",
            "fileSize": 166085
          },
          {
            "id": "d1x-i-f-firmware-v2-31-updater-with-driver",
            "type": "firmware",
            "title": "D1X I/F Firmware V2.31 (updater with driver)",
            "format": "ZIP",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/d1x/d1x_ifv231_updater_withdriver.zip",
            "language": "N/A",
            "fileSize": 4422633
          }
        ]
      },
      {
        "slug": "grandioso-g1x",
        "name": "Grandioso G1X",
        "category": "Master Clock Generator",
        "status": "current",
        "documents": [
          {
            "id": "grandioso-g1x-owner-s-manual",
            "type": "user-manual",
            "title": "Grandioso G1X Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/g1x/g1x_om_efs_vb2.pdf",
            "language": "EN, FR, ES",
            "fileSize": 2130597
          },
          {
            "id": "grandioso-g1x-owner-s-manual-2",
            "type": "user-manual",
            "title": "Grandioso G1X Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/g1x/g1x_om_gi_vb.pdf",
            "language": "DE, IT",
            "fileSize": 1455202
          },
          {
            "id": "grandioso-g1x-brochure",
            "type": "brochure",
            "title": "Grandioso G1X Brochure",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/catalogs/esoteric/ebrochure_g1x_e_vb.pdf",
            "language": "EN",
            "fileSize": 1237004
          }
        ]
      },
      {
        "slug": "grandioso-k1x-se",
        "name": "Grandioso K1X SE",
        "category": "SACD/CD Player",
        "status": "current",
        "documents": [
          {
            "id": "grandioso-k1x-se-owner-s-manual",
            "type": "user-manual",
            "title": "Grandioso K1X SE Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/k1x/k1x_om_efs_vk.pdf",
            "language": "EN, FR, ES",
            "fileSize": 3392896
          },
          {
            "id": "grandioso-k1x-se-owner-s-manual-2",
            "type": "user-manual",
            "title": "Grandioso K1X SE Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/k1x/k1x_om_gi_vj.pdf",
            "language": "DE, IT",
            "fileSize": 2219428
          },
          {
            "id": "grandioso-k1x-firmware-update-manual",
            "type": "user-manual",
            "title": "Grandioso K1X Firmware Update Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/k1x/k1x_updater_om_e_vc.pdf",
            "language": "EN",
            "fileSize": 190720
          },
          {
            "id": "grandioso-k1x-se-brochure",
            "type": "brochure",
            "title": "Grandioso K1X SE Brochure",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/catalogs/esoteric/ebrochure_k1x_se_e_vb.pdf",
            "language": "EN",
            "fileSize": 3555870
          },
          {
            "id": "k1x-i-f-firmware-v3-30b-updater-with-driver",
            "type": "firmware",
            "title": "K1X I/F Firmware V3.30b (updater with driver)",
            "format": "ZIP",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/k1x/k1x_ifv330b_updater_withdriver.zip",
            "language": "N/A",
            "fileSize": 4727950
          }
        ]
      },
      {
        "slug": "grandioso-m1x",
        "name": "Grandioso M1X",
        "category": "Power Amplifier",
        "status": "current",
        "documents": [
          {
            "id": "grandioso-m1x-owner-s-manual",
            "type": "user-manual",
            "title": "Grandioso M1X Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/m1x/m1x_om_efs_vb2.pdf",
            "language": "EN, FR, ES",
            "fileSize": 1289321
          },
          {
            "id": "grandioso-m1x-owner-s-manual-2",
            "type": "user-manual",
            "title": "Grandioso M1X Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/m1x/m1x_om_gi_vb.pdf",
            "language": "DE, IT",
            "fileSize": 896436
          },
          {
            "id": "grandioso-m1x-brochure",
            "type": "brochure",
            "title": "Grandioso M1X Brochure",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/catalogs/esoteric/ebrochure_m1x_e_vb.pdf",
            "language": "EN",
            "fileSize": 3304745
          }
        ]
      },
      {
        "slug": "grandioso-n1",
        "name": "Grandioso N1",
        "category": "Network Player / Network DAC",
        "status": "current",
        "documents": [
          {
            "id": "grandioso-n1-owner-s-manual",
            "type": "user-manual",
            "title": "Grandioso N1 Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/n1/n1_om_efs_vb.pdf",
            "language": "EN, FR, ES",
            "fileSize": 6373603
          },
          {
            "id": "grandioso-n1-owner-s-manual-2",
            "type": "user-manual",
            "title": "Grandioso N1 Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/n1/n1_om_gi_vb.pdf",
            "language": "DE, IT",
            "fileSize": 4322319
          },
          {
            "id": "grandioso-n1-brochure",
            "type": "brochure",
            "title": "Grandioso N1 Brochure",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/catalogs/esoteric/ebrochure_n1_e_va.pdf",
            "language": "EN",
            "fileSize": 3953719
          },
          {
            "id": "n1-i-f-firmware-v1-20-updater-with-driver",
            "type": "firmware",
            "title": "N1 I/F Firmware V1.20 (updater with driver)",
            "format": "ZIP",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/n1/n1_ifv120_updater_withdriver.zip",
            "language": "N/A",
            "fileSize": 4450412
          }
        ]
      },
      {
        "slug": "grandioso-p1x-se",
        "name": "Grandioso P1X SE",
        "category": "SACD/CD Transport",
        "status": "current",
        "documents": [
          {
            "id": "grandioso-p1x-se-owner-s-manual",
            "type": "user-manual",
            "title": "Grandioso P1X SE Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/p1x/p1x_om_efs_vg.pdf",
            "language": "EN, FR, ES",
            "fileSize": 2904918
          },
          {
            "id": "grandioso-p1x-se-owner-s-manual-2",
            "type": "user-manual",
            "title": "Grandioso P1X SE Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/p1x/p1x_om_gi_vg.pdf",
            "language": "DE, IT",
            "fileSize": 1898677
          },
          {
            "id": "grandioso-p1x-se-d1x-se-brochure",
            "type": "brochure",
            "title": "Grandioso P1X SE / D1X SE Brochure",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/catalogs/esoteric/ebrochure_p1x_se_d1x_se_e_vb.pdf",
            "language": "EN",
            "fileSize": 5019697
          },
          {
            "id": "p1x-i-f-firmware-v2-40-updater-with-driver",
            "type": "firmware",
            "title": "P1X I/F Firmware V2.40 (updater with driver)",
            "format": "ZIP",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/p1x/p1x_ifv240_updater_withdriver.zip",
            "language": "N/A",
            "fileSize": 4420665
          }
        ]
      },
      {
        "slug": "grandioso-t1",
        "name": "Grandioso T1",
        "category": "Turntable",
        "status": "current",
        "documents": [
          {
            "id": "grandioso-t1-owner-s-manual",
            "type": "user-manual",
            "title": "Grandioso T1 Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/t1/t1_om_efs_vd.pdf",
            "language": "EN, FR, ES",
            "fileSize": 8297918
          },
          {
            "id": "grandioso-t1-owner-s-manual-2",
            "type": "user-manual",
            "title": "Grandioso T1 Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/t1/t1_om_gi_vd.pdf",
            "language": "DE, IT",
            "fileSize": 5556143
          },
          {
            "id": "ta-9d-tonearm-owner-s-manual",
            "type": "user-manual",
            "title": "TA-9D Tonearm Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/t1/ta-9d_om_efs_vc.pdf",
            "language": "EN, FR, ES",
            "fileSize": 1086382
          },
          {
            "id": "grandioso-t1-full-brochure",
            "type": "brochure",
            "title": "Grandioso T1 Full Brochure",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/catalogs/esoteric/ebrochure_t1_full_e_vb.pdf",
            "language": "EN",
            "fileSize": 6727333
          },
          {
            "id": "grandioso-t1-e1-brochure",
            "type": "brochure",
            "title": "Grandioso T1 / E1 Brochure",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/catalogs/esoteric/ebrochure_e1_t1_e_vb.pdf",
            "language": "EN",
            "fileSize": 8235318
          },
          {
            "id": "grandioso-t1-transportation-locking-screws-instructions",
            "type": "user-manual",
            "title": "Grandioso T1 Transportation Locking Screws Instructions",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/t1/t1_ins_efsgi_va2.pdf",
            "language": "EN, FR, ES, DE, IT",
            "fileSize": 588644
          }
        ]
      },
      {
        "slug": "k-01xd-k-03xd",
        "name": "K-01XD / K-03XD",
        "category": "SACD/CD Player",
        "status": "current",
        "documents": [
          {
            "id": "k-01xd-k-03xd-owner-s-manual",
            "type": "user-manual",
            "title": "K-01XD/K-03XD Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/k-01xd/k-01xd_k-03xd_om_efs_vd.pdf",
            "language": "EN, FR, ES",
            "fileSize": 3379055
          },
          {
            "id": "k-01xd-k-03xd-owner-s-manual-2",
            "type": "user-manual",
            "title": "K-01XD/K-03XD Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/k-01xd/k-01xd_k-03xd_om_gi_vd.pdf",
            "language": "DE, IT",
            "fileSize": 2200069
          },
          {
            "id": "k-01xd-k-03xd-brochure",
            "type": "brochure",
            "title": "K-01XD K-03XD Brochure",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/k-01xd/ebrochure_k-01xd_k-03xd_en.pdf",
            "language": "EN",
            "fileSize": 2234980
          },
          {
            "id": "i-f-firmware-updater-instruction-manual",
            "type": "user-manual",
            "title": "I/F Firmware Updater Instruction Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/k-01xd/if_fw_update_with_driver_om_e_vc.pdf",
            "language": "EN",
            "fileSize": 52453
          },
          {
            "id": "audio-firmware-v004-fpga-updater-with-driver",
            "type": "firmware",
            "title": "Audio Firmware V004 (FPGA updater with driver)",
            "format": "ZIP",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/k-01xd/fpga_updater_withdriver_k01xd_k03xd_digv004_dacv003_n.zip",
            "language": "N/A",
            "fileSize": 4622939
          },
          {
            "id": "k-01xd-i-f-firmware-v3-01-updater-with-driver",
            "type": "firmware",
            "title": "K-01XD I/F Firmware V3.01 (updater with driver)",
            "format": "ZIP",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/k-01xd/k01xd_ifv301_updater_withdriver.zip",
            "language": "N/A",
            "fileSize": 4448178
          },
          {
            "id": "esoteric-rs-232c-command-table-v1-5",
            "type": "datasheet",
            "title": "Esoteric RS-232C Command Table V1.5",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/k-01xd/esoteric_rs232c_command_table_rev1.5.pdf",
            "language": "EN",
            "fileSize": 154586
          }
        ]
      },
      {
        "slug": "n-05xd",
        "name": "N-05XD",
        "category": "Network Player / Network DAC",
        "status": "current",
        "documents": [
          {
            "id": "n-05xd-owner-s-manual",
            "type": "user-manual",
            "title": "N-05XD Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/n-05xd/n-05xd_om_efs_vh.pdf",
            "language": "EN, FR, ES",
            "fileSize": 2962742
          },
          {
            "id": "n-05xd-owner-s-manual-2",
            "type": "user-manual",
            "title": "N-05XD Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/n-05xd/n-05xd_om_gi_vg.pdf",
            "language": "DE, IT",
            "fileSize": 2051451
          },
          {
            "id": "n-05xd-additional-features-owner-s-manual-insert",
            "type": "user-manual",
            "title": "N-05XD additional features Owner's Manual (insert)",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/n-05xd/n-05xd_ins_jefsgi_va.pdf",
            "language": "EN, FR, ES, DE, IT",
            "fileSize": 115571
          },
          {
            "id": "n-05xd-s-05-brochure",
            "type": "brochure",
            "title": "N-05XD / S-05 Brochure",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/catalogs/esoteric/ebrochure_n-05xd_s-05_e_vb.pdf",
            "language": "EN",
            "fileSize": 7734431
          },
          {
            "id": "n-05xd-i-f-firmware-t2-15",
            "type": "firmware",
            "title": "N-05XD I/F Firmware T2.15",
            "format": "ZIP",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/n-05xd/n-05xd_ift215.zip",
            "language": "N/A",
            "fileSize": 4544622
          },
          {
            "id": "n-05xd-usb-with-mqa-v110502-updater",
            "type": "firmware",
            "title": "N-05XD USB with MQA V110502 (updater)",
            "format": "ZIP",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/n-05xd/usbv110502_updater.zip",
            "language": "N/A",
            "fileSize": 1338778
          }
        ]
      },
      {
        "slug": "n-05xe",
        "name": "N-05XE",
        "category": "Network Player / Network DAC",
        "status": "current",
        "documents": [
          {
            "id": "n-05xe-owner-s-manual",
            "type": "user-manual",
            "title": "N-05XE Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/n-05xe/n-05xe_om_efs_va.pdf",
            "language": "EN, FR, ES",
            "fileSize": 3282560
          },
          {
            "id": "n-05xe-owner-s-manual-2",
            "type": "user-manual",
            "title": "N-05XE Owner's Manual",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/n-05xe/n-05xe_om_gi_va.pdf",
            "language": "DE, IT",
            "fileSize": 2312653
          },
          {
            "id": "esoteric-05-series-comparison-chart-xd-vs-xe",
            "type": "datasheet",
            "title": "Esoteric 05 Series Comparison Chart (XD vs XE)",
            "format": "PDF",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/n-05xe/esoteric_05_xd_vs_xe_comparison_chart_2026.04.06.pdf",
            "language": "EN",
            "fileSize": 494328
          },
          {
            "id": "n-05xe-i-f-firmware-t1-02a-updater-with-driver",
            "type": "firmware",
            "title": "N-05XE I/F Firmware T1.02a (updater with driver)",
            "format": "ZIP",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/n-05xe/n-05xe_ift102a_updater_withdriver.zip",
            "language": "N/A",
            "fileSize": 4535570
          },
          {
            "id": "n-05xe-i-f-firmware-v1-01-updater-with-driver",
            "type": "firmware",
            "title": "N-05XE I/F Firmware V1.01 (updater with driver)",
            "format": "ZIP",
            "officialUrl": "https://www.esoteric.jp/downloads/products/esoteric/n-05xe/n-05xe_ifv101_updater_withdriver.zip",
            "language": "N/A",
            "fileSize": 4535198
          }
        ]
      }
    ]
  },
  {
    "slug": "eat",
    "name": "European Audio Team",
    "officialDomain": "europeanaudioteam.com",
    "blurb": "Turntables, tonearms and premium valves, handcrafted in Europe.",
    "products": [
      {
        "slug": "b-sharp",
        "name": "B-Sharp",
        "category": "Turntables",
        "status": "current",
        "documents": [
          {
            "id": "e-a-t-b-sharp-userguide-17032017",
            "type": "user-manual",
            "title": "E.A.T-B_Sharp_userguide_17032017",
            "format": "PDF",
            "officialUrl": "https://www.europeanaudioteam.com/c3/docs/e.a.t-b-sharp-userguide-17032017-d00000023.pdf",
            "language": "EN",
            "fileSize": 7608638
          },
          {
            "id": "b-sharp-bedienungsanleitung",
            "type": "user-manual",
            "title": "B-Sharp Bedienungsanleitung",
            "format": "PDF",
            "officialUrl": "https://www.europeanaudioteam.com/c3/docs/b-sharp-bedienungsanleitung-d00000024.pdf",
            "language": "DE",
            "fileSize": 1481664
          }
        ]
      },
      {
        "slug": "c-dur",
        "name": "C-Dur",
        "category": "Turntables",
        "status": "current",
        "documents": [
          {
            "id": "e-a-t-c-dur-userguide",
            "type": "user-manual",
            "title": "E.A.T. C-Dur userguide",
            "format": "PDF",
            "officialUrl": "https://www.europeanaudioteam.com/c3/docs/eat-c-dur-userguide-d00000213.pdf",
            "language": "EN",
            "fileSize": 1511309
          }
        ]
      },
      {
        "slug": "c-major",
        "name": "C-Major",
        "category": "Turntables",
        "status": "current",
        "documents": [
          {
            "id": "c-major-user-manual",
            "type": "user-manual",
            "title": "C-Major user manual",
            "format": "PDF",
            "officialUrl": "https://www.europeanaudioteam.com/c3/docs/c-major-user-manual-d00000025.pdf",
            "language": "EN",
            "fileSize": 8131642
          },
          {
            "id": "c-major-cutaway",
            "type": "datasheet",
            "title": "C-Major Cutaway",
            "format": "PDF",
            "officialUrl": "https://www.europeanaudioteam.com/c3/docs/c-major-cutaway-d00000026.pdf",
            "language": "EN",
            "fileSize": 1134677
          }
        ]
      },
      {
        "slug": "c-note-tonearm",
        "name": "C-Note Tonearm",
        "category": "Tonearms",
        "status": "current",
        "documents": [
          {
            "id": "eat-c-note-manual",
            "type": "user-manual",
            "title": "EAT C-Note Manual",
            "format": "PDF",
            "officialUrl": "https://www.europeanaudioteam.com/c3/docs/eat-c-note-manual-d00000205.pdf",
            "language": "EN",
            "fileSize": 672502
          }
        ]
      },
      {
        "slug": "c-sharp",
        "name": "C-Sharp",
        "category": "Turntables",
        "status": "current",
        "documents": [
          {
            "id": "user-manual-e-a-t-c-sharp",
            "type": "user-manual",
            "title": "User Manual E.A.T C-Sharp",
            "format": "PDF",
            "officialUrl": "https://www.europeanaudioteam.com/c3/docs/user-manual-e.a.t-c-sharp-d00000027.pdf",
            "language": "EN",
            "fileSize": 1272071
          }
        ]
      },
      {
        "slug": "e-flat",
        "name": "E-Flat",
        "category": "Turntables",
        "status": "legacy",
        "documents": [
          {
            "id": "e-flat-user-guide",
            "type": "user-manual",
            "title": "E-Flat User Guide",
            "format": "PDF",
            "officialUrl": "https://www.europeanaudioteam.com/c3/docs/e-flat-user-guide-d00000044.pdf",
            "language": "EN",
            "fileSize": 8323193
          }
        ]
      },
      {
        "slug": "e-glo-2",
        "name": "E-Glo 2",
        "category": "Phono Stages",
        "status": "current",
        "documents": [
          {
            "id": "e-a-t-e-glo-2-userguide",
            "type": "user-manual",
            "title": "E.A.T. E-Glo 2 userguide",
            "format": "PDF",
            "officialUrl": "https://www.europeanaudioteam.com/c3/docs/eat-e-glo-2-userguide-d00000218.pdf",
            "language": "EN",
            "fileSize": 440128
          }
        ]
      },
      {
        "slug": "e-glo-fb",
        "name": "E-Glo FB",
        "category": "Phono Stages",
        "status": "current",
        "documents": [
          {
            "id": "e-glo-fb-userguide",
            "type": "user-manual",
            "title": "E-Glo FB Userguide",
            "format": "PDF",
            "officialUrl": "https://www.europeanaudioteam.com/c3/docs/e-glo-fb-userguide-d00000220.pdf",
            "language": "EN",
            "fileSize": 381664
          }
        ]
      },
      {
        "slug": "e-glo-petit-2",
        "name": "E-Glo Petit 2",
        "category": "Phono Stages",
        "status": "current",
        "documents": [
          {
            "id": "eat-e-glo-petit-manual",
            "type": "user-manual",
            "title": "EAT E-Glo Petit Manual",
            "format": "PDF",
            "officialUrl": "https://www.europeanaudioteam.com/c3/docs/eat-e-glo-petit-manual-d00000206.pdf",
            "language": "EN",
            "fileSize": 283807
          }
        ]
      },
      {
        "slug": "f-note-tonearm",
        "name": "F-Note Tonearm",
        "category": "Tonearms",
        "status": "current",
        "documents": [
          {
            "id": "e-a-t-f-note-tonearm-user-guide",
            "type": "user-manual",
            "title": "E.A.T. F-Note Tonearm – User guide",
            "format": "PDF",
            "officialUrl": "https://www.europeanaudioteam.com/c3/docs/eat-f-note-tonearm-user-guide-d00000203.pdf",
            "language": "EN",
            "fileSize": 7941734
          }
        ]
      },
      {
        "slug": "forte",
        "name": "Forte",
        "category": "Turntables",
        "status": "current",
        "documents": [
          {
            "id": "eat-forte-userguide",
            "type": "user-manual",
            "title": "EAT Forte userguide",
            "format": "PDF",
            "officialUrl": "https://www.europeanaudioteam.com/c3/docs/eat-forte-userguide-d00000215.pdf",
            "language": "EN",
            "fileSize": 1890835
          }
        ]
      },
      {
        "slug": "forte-s",
        "name": "Forte S",
        "category": "Turntables",
        "status": "current",
        "documents": [
          {
            "id": "e-a-t-forte-s-userguide",
            "type": "user-manual",
            "title": "E.A.T. Forte S Userguide",
            "format": "PDF",
            "officialUrl": "https://www.europeanaudioteam.com/c3/docs/eat-forte-s-userguide-d00000221.pdf",
            "language": "EN",
            "fileSize": 1097473
          }
        ]
      },
      {
        "slug": "fortissimo",
        "name": "Fortissimo",
        "category": "Turntables",
        "status": "current",
        "documents": [
          {
            "id": "e-a-t-fortissimo-userguide",
            "type": "user-manual",
            "title": "E.A.T. Fortissimo userguide",
            "format": "PDF",
            "officialUrl": "https://www.europeanaudioteam.com/c3/docs/eat-fortissimo-userguide-d00000214.pdf",
            "language": "EN",
            "fileSize": 1075388
          }
        ]
      },
      {
        "slug": "fortissimo-s",
        "name": "Fortissimo S",
        "category": "Turntables",
        "status": "current",
        "documents": [
          {
            "id": "eat-fortissimo-s-userguide",
            "type": "user-manual",
            "title": "EAT Fortissimo S – Userguide",
            "format": "PDF",
            "officialUrl": "https://www.europeanaudioteam.com/c3/docs/eat-fortissimo-s-userguide-d00000212.pdf",
            "language": "EN",
            "fileSize": 1902733
          }
        ]
      },
      {
        "slug": "prelude",
        "name": "Prelude",
        "category": "Turntables",
        "status": "current",
        "documents": [
          {
            "id": "e-a-t-prelude-userguide",
            "type": "user-manual",
            "title": "E.A.T. Prelude Userguide",
            "format": "PDF",
            "officialUrl": "https://www.europeanaudioteam.com/c3/docs/eat-prelude-userguide-d00000216.pdf",
            "language": "EN",
            "fileSize": 3722943
          }
        ]
      }
    ]
  },
  {
    "slug": "merason",
    "name": "Merason",
    "officialDomain": "merason.com",
    "altDomains": [
      "squarespace.com"
    ],
    "blurb": "Swiss R-2R digital-to-analogue converters and electronics.",
    "products": [
      {
        "slug": "asio-driver-windows-all-usb-dac-models",
        "name": "ASIO Driver (Windows, all USB DAC models)",
        "category": "Accessories",
        "status": "current",
        "documents": [
          {
            "id": "asio-drivers-for-windows-7-to-windows-11-setup",
            "type": "software",
            "title": "ASIO drivers for Windows 7 to Windows 11 (setup)",
            "format": "EXE",
            "officialUrl": "https://merason.com/s/setup_w7_w10.exe",
            "language": "DE/EN",
            "fileSize": 2666752
          }
        ]
      },
      {
        "slug": "dac-1-mk-ii",
        "name": "DAC 1 Mk II",
        "category": "DACs",
        "status": "current",
        "documents": [
          {
            "id": "user-manual-merason-dac-1",
            "type": "user-manual",
            "title": "User manual Merason DAC 1",
            "format": "PDF",
            "officialUrl": "https://merason.com/s/user-manual-merason-dac1.pdf",
            "language": "EN",
            "fileSize": 5838147
          },
          {
            "id": "bedienungsanleitung-merason-dac-1-v22",
            "type": "user-manual",
            "title": "Bedienungsanleitung Merason DAC 1 (v22)",
            "format": "PDF",
            "officialUrl": "https://merason.com/s/bedienungsanleitung_merason_dac_1_v22.pdf",
            "language": "DE",
            "fileSize": 979562
          }
        ]
      },
      {
        "slug": "dac-2",
        "name": "DAC 2",
        "category": "DACs",
        "status": "current",
        "documents": [
          {
            "id": "merason-dac-2-brochure",
            "type": "brochure",
            "title": "Merason DAC 2 Brochure",
            "format": "PDF",
            "officialUrl": "https://merason.com/s/Merason-DAC2_brochure_en.pdf",
            "language": "EN",
            "fileSize": 1664926
          }
        ]
      },
      {
        "slug": "fr-rot",
        "name": "frérot",
        "category": "DACs",
        "status": "current",
        "documents": [
          {
            "id": "bedienungsanleitung-merason-fr-rot-v13",
            "type": "user-manual",
            "title": "Bedienungsanleitung Merason frérot (v13)",
            "format": "PDF",
            "officialUrl": "https://merason.com/s/bedienungsanleitung_merason_frerot_v13.pdf",
            "language": "DE",
            "fileSize": 173285
          }
        ]
      },
      {
        "slug": "reuss",
        "name": "Reuss",
        "category": "Integrated Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "bedienungsanleitung-merason-reuss-v02",
            "type": "user-manual",
            "title": "Bedienungsanleitung Merason Reuss (v02)",
            "format": "PDF",
            "officialUrl": "https://merason.com/s/manual_merason_reuss-v02-DE.pdf",
            "language": "DE",
            "fileSize": 193047
          }
        ]
      }
    ]
  },
  {
    "slug": "primare",
    "name": "Primare",
    "officialDomain": "primare.net",
    "blurb": "Swedish high-fidelity electronics built on the Prisma streaming and control platform — restrained, precise, and quietly engineered.",
    "products": [
      {
        "slug": "np5",
        "name": "NP5 Prisma MK2",
        "modelCode": "NP5",
        "category": "Network Player",
        "status": "current",
        "tagline": "A compact Prisma streaming bridge that gives any system a modern, high-resolution streaming front end.",
        "specs": [
          {
            "label": "Type",
            "value": "Network player · streaming bridge"
          },
          {
            "label": "Streaming",
            "value": "Prisma · AirPlay 2 · Chromecast built-in · Roon Ready · Spotify Connect"
          },
          {
            "label": "Digital output",
            "value": "RCA S/PDIF · Toslink optical"
          },
          {
            "label": "Resolution",
            "value": "up to 192 kHz / 24-bit · DSD128"
          },
          {
            "label": "Network",
            "value": "Ethernet · Wi-Fi"
          },
          {
            "label": "Dimensions",
            "value": "143 × 36 × 125 mm"
          }
        ],
        "documents": [
          {
            "id": "user-guide",
            "type": "user-manual",
            "title": "NP5 Prisma Network Player — User Guide",
            "language": "EN",
            "format": "PDF",
            "fileSize": 481242,
            "officialUrl": "https://primare.net/wp-content/uploads/2020/04/NP5-Prisma-User-Guide.pdf"
          },
          {
            "id": "quick-start",
            "type": "quick-start",
            "title": "NP5 Prisma Chromecast built-in — Quick Start Guide",
            "language": "EN",
            "version": "v2",
            "format": "PDF",
            "fileSize": 1561301,
            "officialUrl": "https://primare.net/wp-content/uploads/2020/05/Primare-quickguide-np5-v2.pdf"
          },
          {
            "id": "dimensions",
            "type": "datasheet",
            "title": "NP5 Prisma — Outside Dimensions Drawing",
            "language": "EN",
            "format": "PDF",
            "fileSize": 21357,
            "officialUrl": "https://primare.net/wp-content/uploads/2024/12/NP5_Prisma-outside-dimensions-drawing.pdf"
          },
          {
            "id": "design-brief",
            "type": "technical",
            "title": "NP5 Prisma MK2 — Design Brief",
            "language": "EN",
            "version": "Rev. 2024-02-13",
            "date": "2024-02-13",
            "format": "PDF",
            "fileSize": 238646,
            "officialUrl": "https://primare.net/wp-content/uploads/2022/01/NP5-Prisma-MK2-Design-Brief-Rev13022024.pdf"
          },
          {
            "id": "rs232-command-list",
            "type": "technical",
            "title": "NP5 Prisma MK2 — RS232 Command List",
            "language": "EN",
            "date": "2021-10-04",
            "format": "PDF",
            "fileSize": 119506,
            "officialUrl": "https://primare.net/wp-content/uploads/2020/08/NP5-Prisma-MK2-RS232-Command-list-2021-10-04.pdf"
          },
          {
            "id": "control-api",
            "type": "technical",
            "title": "Primare Prisma Control API — TCP/IP and RS232",
            "language": "EN",
            "date": "2025-06-13",
            "format": "PDF",
            "fileSize": 90398,
            "officialUrl": "https://primare.net/wp-content/uploads/2022/01/Primare-Prisma-API-TCPIP-and-RS232-2025-06-13.pdf"
          },
          {
            "id": "firmware-update-tool",
            "type": "firmware",
            "title": "Primare Prisma Firmware Update Tool (Windows)",
            "language": "EN",
            "format": "ZIP",
            "fileSize": 66277205,
            "officialUrl": "https://primare.net/wp-content/uploads/2018/03/Primare-Update-for-Windows.zip"
          }
        ]
      }
    ]
  },
  {
    "slug": "qln",
    "name": "QLN",
    "officialDomain": "qln.se",
    "blurb": "Swedish loudspeakers, handmade in Vetlanda.",
    "products": [
      {
        "slug": "prestige-five-gen-1",
        "name": "Prestige Five (Gen 1)",
        "category": "Speakers",
        "status": "legacy",
        "documents": [
          {
            "id": "prestige-five-user-manual",
            "type": "user-manual",
            "title": "Prestige Five User Manual",
            "format": "PDF",
            "officialUrl": "https://qln.se/wp-content/uploads/2020/04/user-manual-p5-webb.pdf",
            "language": "EN",
            "fileSize": 470313
          }
        ]
      },
      {
        "slug": "prestige-five-gen-2",
        "name": "Prestige Five Gen 2",
        "category": "Speakers",
        "status": "current",
        "documents": [
          {
            "id": "prestige-five-gen-2-user-manual",
            "type": "user-manual",
            "title": "Prestige Five Gen 2 User Manual",
            "format": "PDF",
            "officialUrl": "https://qln.se/wp-content/uploads/2026/01/user-manual-p5g2-webb.pdf",
            "language": "EN",
            "fileSize": 735974
          }
        ]
      },
      {
        "slug": "prestige-one",
        "name": "Prestige One",
        "category": "Speakers",
        "status": "current",
        "documents": [
          {
            "id": "prestige-one-user-manual",
            "type": "user-manual",
            "title": "Prestige One User Manual",
            "format": "PDF",
            "officialUrl": "https://qln.se/wp-content/uploads/2021/07/qln-user-manual-p1n-webb.pdf",
            "language": "EN",
            "fileSize": 123732
          }
        ]
      },
      {
        "slug": "prestige-three-gen-1",
        "name": "Prestige Three (Gen 1)",
        "category": "Speakers",
        "status": "legacy",
        "documents": [
          {
            "id": "prestige-three-user-manual",
            "type": "user-manual",
            "title": "Prestige Three User Manual",
            "format": "PDF",
            "officialUrl": "https://qln.se/wp-content/uploads/2019/03/user-manual-p3-webb.pdf",
            "language": "EN",
            "fileSize": 482359
          }
        ]
      },
      {
        "slug": "prestige-three-gen-2",
        "name": "Prestige Three Gen 2",
        "category": "Speakers",
        "status": "current",
        "documents": [
          {
            "id": "prestige-three-gen-2-user-manual",
            "type": "user-manual",
            "title": "Prestige Three Gen 2 User Manual",
            "format": "PDF",
            "officialUrl": "https://qln.se/wp-content/uploads/2025/12/user-manual-p3g2-webb.pdf",
            "language": "EN",
            "fileSize": 666051
          }
        ]
      },
      {
        "slug": "qln-one-v7",
        "name": "Qln One v7",
        "category": "Speakers",
        "status": "current",
        "documents": [
          {
            "id": "qln-one-v7-user-manual",
            "type": "user-manual",
            "title": "Qln One v7 User Manual",
            "format": "PDF",
            "officialUrl": "https://qln.se/wp-content/uploads/2026/04/qln-user-manual-one-v7-webb.pdf",
            "language": "EN",
            "fileSize": 174750
          }
        ]
      },
      {
        "slug": "reference-9",
        "name": "Reference 9",
        "category": "Speakers",
        "status": "current",
        "documents": [
          {
            "id": "reference-9-user-manual",
            "type": "user-manual",
            "title": "Reference 9 User Manual",
            "format": "PDF",
            "officialUrl": "https://qln.se/wp-content/uploads/2025/03/user-manual-r9-webb.pdf",
            "language": "EN",
            "fileSize": 559434
          }
        ]
      },
      {
        "slug": "signature-signature-5-3",
        "name": "Signature (Signature 5.3)",
        "category": "Speakers",
        "status": "current",
        "documents": [
          {
            "id": "signature-user-manual",
            "type": "user-manual",
            "title": "Signature User Manual",
            "format": "PDF",
            "officialUrl": "https://qln.se/wp-content/uploads/2022/11/qln-user-manual-s5-webb.pdf",
            "language": "EN",
            "fileSize": 182030
          }
        ]
      }
    ]
  },
  {
    "slug": "qualiton",
    "name": "Qualiton",
    "officialDomain": "qualiton.eu",
    "blurb": "Hungarian valve amplifiers and phono stages, handbuilt in Budapest.",
    "products": [
      {
        "slug": "300b",
        "name": "300B",
        "category": "Integrated Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "300b-user-s-manual",
            "type": "user-manual",
            "title": "300B User's Manual",
            "format": "PDF",
            "officialUrl": "https://qualiton.eu/downloads/manuals/300b/300B-FH-2024.pdf",
            "language": "EN",
            "fileSize": 1164648
          }
        ]
      },
      {
        "slug": "a20i",
        "name": "A20i",
        "category": "Integrated Amplifiers",
        "status": "legacy",
        "documents": [
          {
            "id": "a20i-user-s-manual",
            "type": "user-manual",
            "title": "A20i User's Manual",
            "format": "PDF",
            "officialUrl": "https://qualiton.eu/downloads/manuals/a20i/A20i-FH-2020.pdf",
            "language": "EN",
            "fileSize": 1880651
          }
        ]
      },
      {
        "slug": "a35",
        "name": "A35",
        "category": "Integrated Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "a35-user-s-manual",
            "type": "user-manual",
            "title": "A35 User's Manual",
            "format": "PDF",
            "officialUrl": "https://qualiton.eu/downloads/manuals/a35/A35-FH-2023.pdf",
            "language": "EN",
            "fileSize": 954299
          }
        ]
      },
      {
        "slug": "a50i",
        "name": "A50i",
        "category": "Integrated Amplifiers",
        "status": "legacy",
        "documents": [
          {
            "id": "a50i-user-s-manual",
            "type": "user-manual",
            "title": "A50i User's Manual",
            "format": "PDF",
            "officialUrl": "https://qualiton.eu/downloads/manuals/a50i/A50i-FH-2020.pdf",
            "language": "EN",
            "fileSize": 848174
          }
        ]
      },
      {
        "slug": "a75",
        "name": "A75",
        "category": "Integrated Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "a75-user-s-manual",
            "type": "user-manual",
            "title": "A75 User's Manual",
            "format": "PDF",
            "officialUrl": "https://qualiton.eu/downloads/manuals/a75/A75-FH-2022.pdf",
            "language": "EN",
            "fileSize": 1040135
          }
        ]
      },
      {
        "slug": "apr204",
        "name": "APR204",
        "category": "Preamplifiers",
        "status": "legacy",
        "documents": [
          {
            "id": "apr204-user-s-manual",
            "type": "user-manual",
            "title": "APR204 User's Manual",
            "format": "PDF",
            "officialUrl": "https://qualiton.eu/downloads/manuals/apr204/APR204-FH-2020.pdf",
            "language": "EN",
            "fileSize": 1389085
          }
        ]
      },
      {
        "slug": "apx200",
        "name": "APX200",
        "category": "Power Amplifiers",
        "status": "legacy",
        "documents": [
          {
            "id": "apx200-user-s-manual",
            "type": "user-manual",
            "title": "APX200 User's Manual",
            "format": "PDF",
            "officialUrl": "https://qualiton.eu/downloads/manuals/apx200/APX200-FH-2020.pdf",
            "language": "EN",
            "fileSize": 2026068
          }
        ]
      },
      {
        "slug": "c200",
        "name": "C200",
        "category": "Preamplifiers",
        "status": "current",
        "documents": [
          {
            "id": "c200-user-s-manual",
            "type": "user-manual",
            "title": "C200 User's Manual",
            "format": "PDF",
            "officialUrl": "https://qualiton.eu/downloads/manuals/c200/C200-FH-2022.pdf",
            "language": "EN",
            "fileSize": 1482142
          }
        ]
      },
      {
        "slug": "mc",
        "name": "MC",
        "category": "Step-Up Transformers",
        "status": "current",
        "documents": [
          {
            "id": "mc-step-up-transformer-user-s-manual-english",
            "type": "user-manual",
            "title": "MC Step-Up Transformer User's Manual (English)",
            "format": "PDF",
            "officialUrl": "https://qualiton.eu/downloads/manuals/mc/Qualiton%20mc%20felhaszn%C3%A1l%C3%B3i%20k%C3%A9zik%C3%B6nyv%20ANGOL.pdf",
            "language": "EN",
            "fileSize": 561540
          }
        ]
      },
      {
        "slug": "p200",
        "name": "P200",
        "category": "Power Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "p200-user-s-manual",
            "type": "user-manual",
            "title": "P200 User's Manual",
            "format": "PDF",
            "officialUrl": "https://qualiton.eu/downloads/manuals/p200/P200-FH-2021-WEB.pdf",
            "language": "EN",
            "fileSize": 1601822
          }
        ]
      },
      {
        "slug": "phono-mk-1",
        "name": "Phono MK 1",
        "category": "Phono Stages",
        "status": "legacy",
        "documents": [
          {
            "id": "phono-mk-1-user-s-manual-english",
            "type": "user-manual",
            "title": "Phono MK 1 User's Manual (English)",
            "format": "PDF",
            "officialUrl": "https://qualiton.eu/downloads/manuals/phono-mk-1/PHONO%20felhaszn%C3%A1l%C3%B3i%20k%C3%A9zik%C3%B6nyv%202%20angol.pdf",
            "language": "EN",
            "fileSize": 1048332
          }
        ]
      },
      {
        "slug": "phono-mk-2",
        "name": "Phono MK 2",
        "category": "Phono Stages",
        "status": "current",
        "documents": [
          {
            "id": "phono-mk-2-user-s-manual",
            "type": "user-manual",
            "title": "Phono MK 2 User's Manual",
            "format": "PDF",
            "officialUrl": "https://qualiton.eu/downloads/manuals/phono-mk-2/PHONO-FH-2023.pdf",
            "language": "EN",
            "fileSize": 339271
          }
        ]
      },
      {
        "slug": "x200-automatic-bias",
        "name": "X200 (Automatic Bias)",
        "category": "Integrated Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "x200-automatic-bias-user-s-manual",
            "type": "user-manual",
            "title": "X200 (Automatic Bias) User's Manual",
            "format": "PDF",
            "officialUrl": "https://qualiton.eu/downloads/manuals/x200/X200-AB-FH-2022.pdf",
            "language": "EN",
            "fileSize": 1470717
          }
        ]
      },
      {
        "slug": "x200-manual-bias",
        "name": "X200 (Manual Bias)",
        "category": "Integrated Amplifiers",
        "status": "legacy",
        "documents": [
          {
            "id": "x200-manual-bias-user-s-manual",
            "type": "user-manual",
            "title": "X200 (Manual Bias) User's Manual",
            "format": "PDF",
            "officialUrl": "https://qualiton.eu/downloads/manuals/x200/X200-FH-2021-WEB.pdf",
            "language": "EN",
            "fileSize": 1696676
          }
        ]
      }
    ]
  },
  {
    "slug": "soulnote",
    "name": "SOULNOTE",
    "officialDomain": "soulnote.co.jp",
    "altDomains": [
      "soulnote.link"
    ],
    "blurb": "Japanese electronics built on a no-feedback, non-oversampling design philosophy.",
    "products": [
      {
        "slug": "1-series-a-0-a-1-e-1-d-1-discontinued",
        "name": "1 Series (A-0/A-1/E-1/D-1, discontinued)",
        "category": "Catalogues / Brochures",
        "status": "legacy",
        "documents": [
          {
            "id": "1",
            "type": "brochure",
            "title": "1シリーズ総合カタログ",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/soulnote_catalog-1.pdf",
            "language": "JP",
            "fileSize": 5158582
          }
        ]
      },
      {
        "slug": "1-series-ver-2-a-1-e-1-d-1-ver-2-a-0-ver-2",
        "name": "1 Series ver.2 (A-1/E-1/D-1 ver.2, A-0 ver.2)",
        "category": "Catalogues / Brochures",
        "status": "current",
        "documents": [
          {
            "id": "1-ver-2",
            "type": "brochure",
            "title": "1シリーズ ver.2 総合カタログ",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/soulnote_catalog-1ver2.pdf",
            "language": "JP",
            "fileSize": 4679301
          }
        ]
      },
      {
        "slug": "2-series-a-2-d-2-e-2-discontinued",
        "name": "2 Series (A-2/D-2/E-2, discontinued)",
        "category": "Catalogues / Brochures",
        "status": "legacy",
        "documents": [
          {
            "id": "2",
            "type": "brochure",
            "title": "2シリーズ総合カタログ",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/soulnote_catalog-2.pdf",
            "language": "JP",
            "fileSize": 5173315
          }
        ]
      },
      {
        "slug": "2-series-ver-2-a-2-d-2-e-2-ver-2",
        "name": "2 Series ver.2 (A-2/D-2/E-2 ver.2)",
        "category": "Catalogues / Brochures",
        "status": "current",
        "documents": [
          {
            "id": "2-ver-2",
            "type": "brochure",
            "title": "2シリーズ ver.2 総合カタログ",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/soulnote_catalog-2ver2.pdf",
            "language": "JP",
            "fileSize": 8438475
          }
        ]
      },
      {
        "slug": "3-series-a-3-p-3-a-3core-m-3-e-3-d-3-z-3-x-3-b-3",
        "name": "3 Series (A-3, P-3, A-3core, M-3, E-3, D-3, Z-3, X-3, B-3)",
        "category": "Catalogues / Brochures",
        "status": "current",
        "documents": [
          {
            "id": "3",
            "type": "brochure",
            "title": "3シリーズ総合カタログ",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/soulnote_catalog4.pdf",
            "language": "JP",
            "fileSize": 23326241
          }
        ]
      },
      {
        "slug": "a-0",
        "name": "A-0",
        "category": "Integrated Amplifiers",
        "status": "legacy",
        "documents": [
          {
            "id": "a-0",
            "type": "user-manual",
            "title": "A-0 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/a0_usermanual.pdf",
            "language": "JP",
            "fileSize": 1032296
          }
        ]
      },
      {
        "slug": "a-0-ver-2",
        "name": "A-0 ver.2",
        "category": "Integrated Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "a-0-ver-2-user-manual-230v",
            "type": "user-manual",
            "title": "A-0 ver.2 User Manual (230V)",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/Products/A-0ver.2/a0e_ver2_usermanual.pdf",
            "language": "EN",
            "fileSize": 716939
          },
          {
            "id": "a-0-ver-2",
            "type": "user-manual",
            "title": "A-0 ver.2 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/a0_ver2_usermanual.pdf",
            "language": "JP",
            "fileSize": 834521
          }
        ]
      },
      {
        "slug": "a-1",
        "name": "A-1",
        "category": "Integrated Amplifiers",
        "status": "legacy",
        "documents": [
          {
            "id": "a-1-user-manual-230v",
            "type": "user-manual",
            "title": "A-1 User Manual (230V)",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/user_upload/A-1/a1e_usermanual.pdf",
            "language": "EN",
            "fileSize": 1266702
          },
          {
            "id": "a-1",
            "type": "user-manual",
            "title": "A-1 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/a1_usermanual.pdf",
            "language": "JP",
            "fileSize": 1568561
          }
        ]
      },
      {
        "slug": "a-1-ver-2",
        "name": "A-1 ver.2",
        "category": "Integrated Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "a-1-ver-2-user-manual-230v",
            "type": "user-manual",
            "title": "A-1 ver.2 User Manual (230V)",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/Products/A-1ver.2/a1e_ver2_usermanual.pdf",
            "language": "EN",
            "fileSize": 1131971
          },
          {
            "id": "a-1-ver-2",
            "type": "user-manual",
            "title": "A-1 ver.2 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/a1_ver2_usermanual.pdf",
            "language": "JP",
            "fileSize": 1224239
          }
        ]
      },
      {
        "slug": "a-2",
        "name": "A-2",
        "category": "Integrated Amplifiers",
        "status": "legacy",
        "documents": [
          {
            "id": "a-2-user-manual-230v",
            "type": "user-manual",
            "title": "A-2 User Manual (230V)",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/user_upload/A-2/a2e_usermanual.pdf",
            "language": "EN",
            "fileSize": 2896707
          },
          {
            "id": "a-2",
            "type": "user-manual",
            "title": "A-2 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/a2_usermanual.pdf",
            "language": "JP",
            "fileSize": 2962243
          }
        ]
      },
      {
        "slug": "a-2-ver-2",
        "name": "A-2 ver.2",
        "category": "Integrated Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "a-2-ver-2-user-manual-230v",
            "type": "user-manual",
            "title": "A-2 ver.2 User Manual (230V)",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/Products/A-2ver.2/a2e_ver2_usermanual.pdf",
            "language": "EN",
            "fileSize": 1226099
          },
          {
            "id": "a-2-ver-2",
            "type": "user-manual",
            "title": "A-2 ver.2 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/a2_ver2_usermanual.pdf",
            "language": "JP",
            "fileSize": 1313439
          }
        ]
      },
      {
        "slug": "a-3",
        "name": "A-3",
        "category": "Integrated Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "a-3-user-manual-230v",
            "type": "user-manual",
            "title": "A-3 User Manual (230V)",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/Products/A-3/a3e_usermanual.pdf",
            "language": "EN",
            "fileSize": 2467268
          },
          {
            "id": "a-3",
            "type": "user-manual",
            "title": "A-3 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/a3_usermanual.pdf",
            "language": "JP",
            "fileSize": 2579957
          }
        ]
      },
      {
        "slug": "a-3-core",
        "name": "A-3 CORE",
        "category": "Integrated Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "a-3-core-user-manual-230v",
            "type": "user-manual",
            "title": "A-3 core User Manual (230V)",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/Products/A-3CORE/a3coree_usermanual.pdf",
            "language": "EN",
            "fileSize": 934927
          },
          {
            "id": "a-3core",
            "type": "user-manual",
            "title": "A-3core 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/a3core_usermanual.pdf",
            "language": "JP",
            "fileSize": 1060572
          }
        ]
      },
      {
        "slug": "accessories-rbc-sbc-1-rcc-1-rsc-rar-rsb-1",
        "name": "Accessories (RBC/SBC-1/RCC-1/RSC/RAR/RSB-1)",
        "category": "Accessories",
        "status": "current",
        "documents": [
          {
            "id": "document",
            "type": "brochure",
            "title": "アクセサリーカタログ",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/sn_accessories_catalog.pdf",
            "language": "JP",
            "fileSize": 3804805
          }
        ]
      },
      {
        "slug": "b-3",
        "name": "B-3",
        "category": "Network / ZERO LINK Transports",
        "status": "current",
        "documents": [
          {
            "id": "b-3",
            "type": "user-manual",
            "title": "B-3 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/b3_usermanual.pdf",
            "language": "JP",
            "fileSize": 938559
          },
          {
            "id": "itfusbdsd-hidwriter-v0109-b-3-1st-2nd-lot",
            "type": "firmware",
            "title": "ItfUsbDsd-HidWriter v0109 (B-3 1st/2nd lot)",
            "format": "ZIP",
            "officialUrl": "https://www.soulnote.co.jp/usb_driver/ItfUsbDsd-HidWriter%20v0109.zip",
            "language": "JP",
            "fileSize": 856732
          },
          {
            "id": "soulnote-b-3-updater-1st-lot",
            "type": "firmware",
            "title": "SOULNOTE B-3 Updater (1st lot)",
            "format": "ZIP",
            "officialUrl": "https://www.soulnote.co.jp/usb_driver/SOULNOTE%20B-3%20Updater.zip",
            "language": "JP",
            "fileSize": 159467
          }
        ]
      },
      {
        "slug": "c-1",
        "name": "C-1",
        "category": "Integrated Amplifiers",
        "status": "legacy",
        "documents": [
          {
            "id": "c-1",
            "type": "user-manual",
            "title": "C-1 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/c1_usermanual.pdf",
            "language": "JP",
            "fileSize": 1614394
          }
        ]
      },
      {
        "slug": "classic-series-da3-0-sa1-0b-sa4-0b-ct1-0-sd2-0b",
        "name": "Classic Series (da3.0, sa1.0B, sa4.0B, ct1.0, sd2.0B)",
        "category": "Catalogues / Brochures",
        "status": "legacy",
        "documents": [
          {
            "id": "document",
            "type": "brochure",
            "title": "総合カタログ",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/soulnote_catalog.pdf",
            "language": "JP",
            "fileSize": 1837895
          }
        ]
      },
      {
        "slug": "d-1",
        "name": "D-1",
        "category": "D/A Converters",
        "status": "legacy",
        "documents": [
          {
            "id": "d-1",
            "type": "user-manual",
            "title": "D-1 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/d1_usermanual.pdf",
            "language": "JP",
            "fileSize": 1186435
          }
        ]
      },
      {
        "slug": "d-1-ver-2",
        "name": "D-1 ver.2",
        "category": "D/A Converters",
        "status": "current",
        "documents": [
          {
            "id": "d-1-ver-2-user-manual-230v",
            "type": "user-manual",
            "title": "D-1 ver.2 User Manual (230V)",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/Products/D-1ver.2/d1e_ver2_usermanual.pdf",
            "language": "EN",
            "fileSize": 753909
          },
          {
            "id": "d-1-ver-2",
            "type": "user-manual",
            "title": "D-1 ver.2 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/d1_ver2_usermanual.pdf",
            "language": "JP",
            "fileSize": 895506
          }
        ]
      },
      {
        "slug": "d-1n",
        "name": "D-1N",
        "category": "D/A Converters",
        "status": "legacy",
        "documents": [
          {
            "id": "d-1n-user-manual-230v",
            "type": "user-manual",
            "title": "D-1N User Manual (230V)",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/Products/D-1N/d1ne_usermanual.pdf",
            "language": "EN",
            "fileSize": 1306213
          },
          {
            "id": "d-1n",
            "type": "user-manual",
            "title": "D-1N 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/d1n_usermanual.pdf",
            "language": "JP",
            "fileSize": 1563488
          }
        ]
      },
      {
        "slug": "d-2",
        "name": "D-2",
        "category": "D/A Converters",
        "status": "legacy",
        "documents": [
          {
            "id": "d-2-user-manual-230v",
            "type": "user-manual",
            "title": "D-2 User Manual (230V)",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/user_upload/D-2/d2e_usermanual.pdf",
            "language": "EN",
            "fileSize": 800829
          },
          {
            "id": "d-2",
            "type": "user-manual",
            "title": "D-2 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/d2_usermanual.pdf",
            "language": "JP",
            "fileSize": 846853
          }
        ]
      },
      {
        "slug": "d-2-ver-2",
        "name": "D-2 ver.2",
        "category": "D/A Converters",
        "status": "current",
        "documents": [
          {
            "id": "d-2-ver-2-user-manual-230v",
            "type": "user-manual",
            "title": "D-2 ver.2 User Manual (230V)",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/Products/D-2ver.2/d2e_ver2_usermanual.pdf",
            "language": "EN",
            "fileSize": 755097
          },
          {
            "id": "d-2-ver-2",
            "type": "user-manual",
            "title": "D-2 ver.2 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/d2_ver2_usermanual.pdf",
            "language": "JP",
            "fileSize": 916327
          }
        ]
      },
      {
        "slug": "d-3",
        "name": "D-3",
        "category": "D/A Converters",
        "status": "current",
        "documents": [
          {
            "id": "d-3-user-manual-230v",
            "type": "user-manual",
            "title": "D-3 User Manual (230V)",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/Products/D-3_for_230V/d-3e2_usermanual.pdf",
            "language": "EN",
            "fileSize": 2755039
          },
          {
            "id": "d-3",
            "type": "user-manual",
            "title": "D-3 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/d-3_usermanual.pdf",
            "language": "JP",
            "fileSize": 2136276
          }
        ]
      },
      {
        "slug": "e-1",
        "name": "E-1",
        "category": "Phono Equalizers",
        "status": "legacy",
        "documents": [
          {
            "id": "e-1-user-manual-230v",
            "type": "user-manual",
            "title": "E-1 User Manual (230V)",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/user_upload/E-1/e1e_usermanual.pdf",
            "language": "EN",
            "fileSize": 984541
          },
          {
            "id": "e-1",
            "type": "user-manual",
            "title": "E-1 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/e1_usermanual.pdf",
            "language": "JP",
            "fileSize": 995289
          }
        ]
      },
      {
        "slug": "e-1-ver-2",
        "name": "E-1 ver.2",
        "category": "Phono Equalizers",
        "status": "current",
        "documents": [
          {
            "id": "e-1-ver-2-user-manual-230v",
            "type": "user-manual",
            "title": "E-1 ver.2 User Manual (230V)",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/Products/E-1ver.2/e1e_ver2_usermanual.pdf",
            "language": "EN",
            "fileSize": 723662
          },
          {
            "id": "e-1-ver-2",
            "type": "user-manual",
            "title": "E-1 ver.2 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/e1_ver2_usermanual.pdf",
            "language": "JP",
            "fileSize": 844365
          }
        ]
      },
      {
        "slug": "e-2",
        "name": "E-2",
        "category": "Phono Equalizers",
        "status": "legacy",
        "documents": [
          {
            "id": "e-2-user-manual-230v",
            "type": "user-manual",
            "title": "E-2 User Manual (230V)",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/user_upload/E-2/e2e_usermanual.pdf",
            "language": "EN",
            "fileSize": 1173753
          },
          {
            "id": "e-2",
            "type": "user-manual",
            "title": "E-2 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/e2_usermanual.pdf",
            "language": "JP",
            "fileSize": 1273089
          }
        ]
      },
      {
        "slug": "e-2-ver-2",
        "name": "E-2 ver.2",
        "category": "Phono Equalizers",
        "status": "current",
        "documents": [
          {
            "id": "e-2-ver-2-user-manual-230v",
            "type": "user-manual",
            "title": "E-2 ver.2 User Manual (230V)",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/Products/E-2ver.2/e2e_ver2_usermanual.pdf",
            "language": "EN",
            "fileSize": 763119
          },
          {
            "id": "e-2-ver-2",
            "type": "user-manual",
            "title": "E-2 ver.2 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/e2_ver2_usermanual.pdf",
            "language": "JP",
            "fileSize": 850013
          }
        ]
      },
      {
        "slug": "e-3",
        "name": "E-3",
        "category": "Phono Equalizers",
        "status": "current",
        "documents": [
          {
            "id": "e-3-user-manual-230v",
            "type": "user-manual",
            "title": "E-3 User Manual (230V)",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/Products/E-3/e3e_usermanual.pdf",
            "language": "EN",
            "fileSize": 1882304
          },
          {
            "id": "e-3",
            "type": "user-manual",
            "title": "E-3 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/e3_usermanual.pdf",
            "language": "JP",
            "fileSize": 1990228
          }
        ]
      },
      {
        "slug": "m-3",
        "name": "M-3",
        "category": "Power Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "m-3-user-manual-230v",
            "type": "user-manual",
            "title": "M-3 User Manual (230V)",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/Products/M-3X/M-3/m3e_usermanual.pdf",
            "language": "EN",
            "fileSize": 1126904
          },
          {
            "id": "m-3",
            "type": "user-manual",
            "title": "M-3 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/m3_usermanual.pdf",
            "language": "JP",
            "fileSize": 1284741
          }
        ]
      },
      {
        "slug": "m-3x",
        "name": "M-3X",
        "category": "Power Amplifiers",
        "status": "current",
        "documents": [
          {
            "id": "m-3x-user-manual-230v",
            "type": "user-manual",
            "title": "M-3X User Manual (230V)",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/Products/M-3X/m3xe_usermanual.pdf",
            "language": "EN",
            "fileSize": 1136585
          },
          {
            "id": "m-3x",
            "type": "user-manual",
            "title": "M-3X 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/m3x_usermanual.pdf",
            "language": "JP",
            "fileSize": 1245675
          },
          {
            "id": "m-3x-2",
            "type": "brochure",
            "title": "M-3X カタログ",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/soulnote_catalog_m3x.pdf",
            "language": "JP",
            "fileSize": 1964861
          }
        ]
      },
      {
        "slug": "p-3",
        "name": "P-3",
        "category": "Preamplifiers",
        "status": "current",
        "documents": [
          {
            "id": "p-3-user-manual-230v",
            "type": "user-manual",
            "title": "P-3 User Manual (230V)",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/Products/P-3/p3e_usermanual.pdf",
            "language": "EN",
            "fileSize": 1354499
          },
          {
            "id": "p-3",
            "type": "user-manual",
            "title": "P-3 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/p3_usermanual.pdf",
            "language": "JP",
            "fileSize": 1464925
          }
        ]
      },
      {
        "slug": "rar-series-audio-rack",
        "name": "RAR Series (Audio Rack)",
        "category": "Accessories",
        "status": "current",
        "documents": [
          {
            "id": "rar",
            "type": "user-manual",
            "title": "RARシリーズ 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/rar_usermanual.pdf",
            "language": "JP",
            "fileSize": 7686281
          }
        ]
      },
      {
        "slug": "s-3-firmware",
        "name": "S-3 Firmware",
        "category": "Software, Drivers & Firmware",
        "status": "legacy",
        "documents": [
          {
            "id": "s-3",
            "type": "user-manual",
            "title": "S-3 ファームウェア 設定方法",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/usb_driver/s3_firmware_setting_manual.pdf",
            "language": "JP",
            "fileSize": 219277
          },
          {
            "id": "soulnote-s-3-updater-main-v0068",
            "type": "firmware",
            "title": "SOULNOTE S-3 Updater (main_v0068)",
            "format": "ZIP",
            "officialUrl": "https://www.soulnote.co.jp/usb_driver/SOULNOTE%20S-3%20Updater.zip",
            "language": "JP",
            "fileSize": 158567
          }
        ]
      },
      {
        "slug": "s-3-reference",
        "name": "S-3 Reference",
        "category": "SACD/CD Players",
        "status": "legacy",
        "documents": [
          {
            "id": "s-3-reference-user-manual-230v",
            "type": "user-manual",
            "title": "S-3 Reference User Manual (230V)",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/Products/S-3_Reference/s3e_ref_usermanual.pdf",
            "language": "EN",
            "fileSize": 2187064
          },
          {
            "id": "s-3",
            "type": "user-manual",
            "title": "S-3 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/s3_usermanual.pdf",
            "language": "JP",
            "fileSize": 2804278
          }
        ]
      },
      {
        "slug": "soulnote-audio-player",
        "name": "SOULNOTE Audio Player",
        "category": "Software, Drivers & Firmware",
        "status": "current",
        "documents": [
          {
            "id": "soulnote-audio-player-for-windows-v1-5-2-0",
            "type": "software",
            "title": "SOULNOTE Audio Player for Windows v1.5.2.0",
            "format": "ZIP",
            "officialUrl": "https://www.soulnote.link/fileadmin/Downloads/SOULNOTE_Audio_Player_Win__v1.5.2.0.zip",
            "language": "EN",
            "fileSize": 1909469
          },
          {
            "id": "soulnote-audio-player-for-mac-v1-5-4-0",
            "type": "software",
            "title": "SOULNOTE Audio Player for Mac v1.5.4.0",
            "format": "ZIP",
            "officialUrl": "https://www.soulnote.link/fileadmin/Downloads/SOULNOTE_Audio_Player_Mac__v1.5.4.0.zip",
            "language": "EN",
            "fileSize": 1044785
          },
          {
            "id": "soulnote-audio-player-windows-v1-5-2-0",
            "type": "software",
            "title": "SOULNOTE Audio Player Windows用 v1.5.2.0",
            "format": "ZIP",
            "officialUrl": "https://www.soulnote.co.jp/usb_driver/SOULNOTE%20Audio%20Player(Win)%20v1.5.2.0.zip",
            "language": "JP",
            "fileSize": 1909469
          },
          {
            "id": "soulnote-audio-player-mac-v1-5-4-0",
            "type": "software",
            "title": "SOULNOTE Audio Player Mac用 v1.5.4.0",
            "format": "ZIP",
            "officialUrl": "https://www.soulnote.co.jp/usb_driver/SOULNOTE%20Audio%20Player(Mac)%20v1.5.4.0.zip",
            "language": "JP",
            "fileSize": 1044785
          },
          {
            "id": "soulnote-audio-player-manual",
            "type": "user-manual",
            "title": "SOULNOTE Audio Player Manual",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/Downloads/soulnote_audioplayer_manual_en.pdf",
            "language": "EN",
            "fileSize": 112036
          },
          {
            "id": "soulnote-audio-player",
            "type": "user-manual",
            "title": "SOULNOTE Audio Player 使用方法",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/usb_driver/soulnote_audioplayer_manual.pdf",
            "language": "JP",
            "fileSize": 163657
          },
          {
            "id": "soulnote-audio-player-software-license-agreement",
            "type": "other",
            "title": "SOULNOTE Audio Player Software License Agreement",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/Downloads/soulnote_software_license_agreement_en.pdf",
            "language": "EN",
            "fileSize": 48240
          },
          {
            "id": "soulnote-audio-player-2",
            "type": "other",
            "title": "SOULNOTE Audio Player ソフトウェア使用許諾契約書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/usb_driver/soulnote_audioplayer_agreement.pdf",
            "language": "JP",
            "fileSize": 154415
          }
        ]
      },
      {
        "slug": "usb-audio-driver-d-1-d-1n-d-2-s-3-d-3-z-3-b-3",
        "name": "USB Audio Driver (D-1/D-1N/D-2/S-3/D-3/Z-3/B-3)",
        "category": "Software, Drivers & Firmware",
        "status": "current",
        "documents": [
          {
            "id": "windows-usb-audio-driver-ver-1-0-22-77",
            "type": "software",
            "title": "Windows USB Audio Driver Ver 1.0.22.77",
            "format": "ZIP",
            "officialUrl": "https://www.soulnote.link/fileadmin/Downloads/soulnote_usb_audio_driver_win.zip",
            "language": "EN",
            "fileSize": 7028158
          },
          {
            "id": "windows-ver1-0-22-77",
            "type": "software",
            "title": "Windows用ドライバー Ver1.0.22.77",
            "format": "ZIP",
            "officialUrl": "https://www.soulnote.co.jp/usb_driver/soulnote_usb_audio_driver_win.zip",
            "language": "JP",
            "fileSize": 7028158
          },
          {
            "id": "software-licence-agreement",
            "type": "other",
            "title": "Software Licence Agreement",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/Downloads/D-1ver2_D-1N_D-2_D-2ver2_S-3_d-3_z-3_Softwear_Licence_Agreement_en_260710.pdf",
            "language": "EN",
            "fileSize": 101484
          },
          {
            "id": "document",
            "type": "other",
            "title": "ソフトウェア使用許諾契約書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/usb_driver/soulnote_software_license_agreement.pdf",
            "language": "JP",
            "fileSize": 102158
          },
          {
            "id": "document-2",
            "type": "user-manual",
            "title": "設定方法／アンインストール方法",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/usb_driver/driver_software_setting_manual2.pdf",
            "language": "JP",
            "fileSize": 380090
          }
        ]
      },
      {
        "slug": "x-3",
        "name": "X-3",
        "category": "Clock Generators",
        "status": "current",
        "documents": [
          {
            "id": "x-3-user-manual-230v",
            "type": "user-manual",
            "title": "X-3 User Manual (230V)",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/Products/X-3/x-3e_usermanual.pdf",
            "language": "EN",
            "fileSize": 872614
          },
          {
            "id": "x-3",
            "type": "user-manual",
            "title": "X-3 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/x-3_usermanual.pdf",
            "language": "JP",
            "fileSize": 982867
          }
        ]
      },
      {
        "slug": "z-3",
        "name": "Z-3",
        "category": "Network / ZERO LINK Transports",
        "status": "current",
        "documents": [
          {
            "id": "z-3-user-manual-230v",
            "type": "user-manual",
            "title": "Z-3 User Manual (230V)",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/Products/Z-3/z-3e_usermanual.pdf",
            "language": "EN",
            "fileSize": 1228362
          },
          {
            "id": "z-3",
            "type": "user-manual",
            "title": "Z-3 取扱説明書",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/image/SOULNOTE/z-3_usermanual.pdf",
            "language": "JP",
            "fileSize": 1357238
          }
        ]
      },
      {
        "slug": "z-3-diretta-driver",
        "name": "Z-3 Diretta Driver",
        "category": "Software, Drivers & Firmware",
        "status": "current",
        "documents": [
          {
            "id": "windows-diretta-asio-driver-ver-1-99",
            "type": "software",
            "title": "Windows Diretta ASIO Driver Ver 1.99",
            "format": "ZIP",
            "officialUrl": "https://www.soulnote.link/fileadmin/Downloads/soulnote_diretta_asio_driver_win.zip",
            "language": "EN",
            "fileSize": 7516419
          },
          {
            "id": "windows-ver1-99",
            "type": "software",
            "title": "Windows用ドライバー Ver1.99",
            "format": "ZIP",
            "officialUrl": "https://www.soulnote.co.jp/usb_driver/soulnote_diretta_asio_driver_win.zip",
            "language": "JP",
            "fileSize": 7516419
          },
          {
            "id": "z-3-software-licence-agreement",
            "type": "other",
            "title": "Z-3 Software Licence Agreement",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.link/fileadmin/Downloads/z-3_Softwear_Licence_Agreement_en_260710__002_.pdf",
            "language": "EN",
            "fileSize": 96090
          },
          {
            "id": "z-3-diretta",
            "type": "other",
            "title": "ソフトウェア使用許諾契約書 (Z-3 Diretta)",
            "format": "PDF",
            "officialUrl": "https://www.soulnote.co.jp/usb_driver/soulnote_software_license_agreement_z-3.pdf",
            "language": "JP",
            "fileSize": 100968
          }
        ]
      }
    ]
  },
  {
    "slug": "van-den-hul",
    "name": "Van den Hul",
    "officialDomain": "vandenhul.com",
    "blurb": "Dutch maker of cables, phono cartridges and interconnects.",
    "products": [
      {
        "slug": "general-hi-fi",
        "name": "General Hi-Fi",
        "category": "General / Support Documentation",
        "status": "current",
        "documents": [
          {
            "id": "van-den-hul-hi-fi-tips-and-hints",
            "type": "user-manual",
            "title": "van den Hul Hi-Fi Tips and Hints",
            "format": "PDF",
            "officialUrl": "https://www.vandenhul.com/wp-content/uploads/2020/05/van_den_Hul_Hi-Fi_Tips_and_Hints.pdf",
            "language": "EN",
            "fileSize": 324624
          }
        ]
      },
      {
        "slug": "interconnects-and-loudspeaker-cables-general",
        "name": "Interconnects and Loudspeaker Cables (general)",
        "category": "General / Support Documentation",
        "status": "current",
        "documents": [
          {
            "id": "interconnects-and-loudspeaker-cables-faqs",
            "type": "other",
            "title": "Interconnects and Loudspeaker Cables: FAQs",
            "format": "PDF",
            "officialUrl": "https://www.vandenhul.com/wp-content/uploads/2019/09/Cable_FAQ.pdf",
            "language": "EN",
            "fileSize": 459817
          }
        ]
      },
      {
        "slug": "phono-cartridges-general",
        "name": "Phono Cartridges (general)",
        "category": "General / Support Documentation",
        "status": "current",
        "documents": [
          {
            "id": "phono-cartridges-faqs",
            "type": "other",
            "title": "Phono Cartridges: FAQs",
            "format": "PDF",
            "officialUrl": "https://www.vandenhul.com/wp-content/uploads/2019/09/Phono_FAQ.pdf",
            "language": "EN",
            "fileSize": 449979
          }
        ]
      }
    ]
  },
  {
    "slug": "vienna-acoustics",
    "name": "Vienna Acoustics",
    "officialDomain": "vienna-acoustics.com",
    "blurb": "Austrian loudspeakers, handcrafted in Vienna.",
    "products": [
      {
        "slug": "mozart-infinity",
        "name": "Mozart Infinity",
        "category": "Speakers",
        "status": "current",
        "documents": [
          {
            "id": "mozart-infinity-instruction-manual-2023-10",
            "type": "user-manual",
            "title": "Mozart Infinity - instruction manual (2023-10)",
            "format": "PDF",
            "officialUrl": "https://www.vienna-acoustics.com/wordpress/wp-content/uploads/2023/10/Mozart-Infinity_-instruction-manual-2023-10.pdf",
            "language": "EN",
            "fileSize": 2675110
          }
        ]
      }
    ]
  }
];
