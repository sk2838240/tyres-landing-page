/**
 * Tyre size catalogue for the "Search by Size" finder.
 *
 * MAINTENANCE: this list contains only VALID combinations (a real width, aspect
 * ratio and rim diameter that exist as a production tyre). Edit it so it matches
 * the sizes you can actually order and fit. Keep it conservative — every entry
 * must be orderable. Customers whose size is missing can still use the
 * "My size isn't listed" escape hatch in the finder, so never use this list to
 * block a lead.
 *
 * Format: "<width>/<aspect ratio> R<rim diameter>" e.g. "225/55 R16".
 */

export type TyreSize = {
  width: number
  height: number
  rim: number
}

const CATALOGUE = [
  // 13 inch
  '155/65 R13',
  '165/60 R13',
  '165/70 R13',
  '175/70 R13',
  // 14 inch
  '165/65 R14',
  '175/65 R14',
  '185/60 R14',
  '185/65 R14',
  '185/70 R14',
  '195/70 R14',
  '195/75 R14',
  '205/75 R14',
  // 15 inch
  '185/55 R15',
  '185/60 R15',
  '185/65 R15',
  '195/50 R15',
  '195/55 R15',
  '195/60 R15',
  '195/65 R15',
  '195/75 R15',
  '205/65 R15',
  '205/70 R15',
  '215/45 R15',
  '215/50 R15',
  '215/55 R15',
  '215/70 R15',
  '225/45 R15',
  '225/50 R15',
  '225/55 R15',
  '225/60 R15',
  '225/70 R15',
  '235/75 R15',
  '245/70 R15',
  '255/70 R15',
  '265/70 R15',
  '285/70 R15',
  // 16 inch
  '205/45 R16',
  '205/50 R16',
  '205/55 R16',
  '205/60 R16',
  '205/65 R16',
  '215/45 R16',
  '215/50 R16',
  '215/55 R16',
  '215/60 R16',
  '215/65 R16',
  '215/75 R16',
  '225/50 R16',
  '225/55 R16',
  '225/60 R16',
  '225/65 R16',
  '225/75 R16',
  '235/40 R16',
  '235/45 R16',
  '235/50 R16',
  '235/55 R16',
  '245/40 R16',
  '245/45 R16',
  '245/50 R16',
  '245/55 R16',
  '245/75 R16',
  '265/75 R16',
  // 17 inch
  '215/40 R17',
  '215/45 R17',
  '215/50 R17',
  '215/55 R17',
  '225/45 R17',
  '225/50 R17',
  '225/55 R17',
  '225/60 R17',
  '225/65 R17',
  '235/45 R17',
  '235/50 R17',
  '235/55 R17',
  '235/60 R17',
  '235/65 R17',
  '245/45 R17',
  '245/50 R17',
  '245/55 R17',
  '245/60 R17',
  '245/65 R17',
  '245/70 R17',
  '255/45 R17',
  '255/50 R17',
  '255/55 R17',
  '255/60 R17',
  '255/65 R17',
  '265/65 R17',
  '265/70 R17',
  '275/55 R17',
  '275/65 R17',
  // 18 inch
  '225/40 R18',
  '225/45 R18',
  '225/50 R18',
  '225/55 R18',
  '225/60 R18',
  '235/45 R18',
  '235/50 R18',
  '235/55 R18',
  '235/60 R18',
  '245/40 R18',
  '245/45 R18',
  '245/50 R18',
  '255/40 R18',
  '255/45 R18',
  '255/55 R18',
  '255/60 R18',
  '265/50 R18',
  '265/55 R18',
  '265/60 R18',
  '275/40 R18',
  '275/45 R18',
  '275/50 R18',
  '275/55 R18',
  '275/60 R18',
  '275/65 R18',
  '285/50 R18',
  '285/60 R18',
  // 19 inch
  '225/45 R19',
  '235/40 R19',
  '235/45 R19',
  '235/50 R19',
  '235/55 R19',
  '245/40 R19',
  '245/45 R19',
  '245/50 R19',
  '255/35 R19',
  '255/40 R19',
  '255/45 R19',
  '255/50 R19',
  '255/55 R19',
  '265/45 R19',
  '265/50 R19',
  '265/55 R19',
  '275/45 R19',
  '275/55 R19',
  '285/40 R19',
  '285/55 R19',
  // 20 inch
  '225/35 R20',
  '235/35 R20',
  '245/35 R20',
  '245/40 R20',
  '255/30 R20',
  '255/35 R20',
  '255/40 R20',
  '255/45 R20',
  '255/50 R20',
  '255/55 R20',
  '265/45 R20',
  '265/50 R20',
  '265/55 R20',
  '275/40 R20',
  '275/45 R20',
  '275/50 R20',
  '275/55 R20',
  '285/40 R20',
  '285/50 R20',
  '295/35 R20',
  '295/40 R20',
  // 21 inch
  '275/35 R21',
  '275/40 R21',
  '275/45 R21',
  '285/35 R21',
  '285/40 R21',
  '295/30 R21',
  '295/35 R21',
  '305/30 R21',
  '305/35 R21',
  '315/30 R21',
  // 22 inch
  '285/30 R22',
  '295/30 R22',
  '305/25 R22',
  '305/30 R22',
  '315/25 R22',
  '315/30 R22',
  // 23 inch
  '275/35 R23',
  '285/35 R23',
  '285/40 R23',
  '295/30 R23',
  '295/35 R23',
  '305/30 R23',
  '305/35 R23',
  '315/30 R23',
  '315/35 R23',
  '325/30 R23',
]

const SIZE_PATTERN = /^\s*(\d{3})\s*\/\s*(\d{2}(?:\.\d)?)\s*[rR]\s*(\d{2})\s*$/

export function parseSize(input: string): TyreSize | null {
  const match = SIZE_PATTERN.exec(input)
  if (!match) return null
  return {
    width: Number(match[1]),
    height: Number(match[2]),
    rim: Number(match[3]),
  }
}

export const TYRE_SIZES: TyreSize[] = CATALOGUE.map(parseSize).filter((size): size is TyreSize => size !== null)

export function formatSize(size: TyreSize): string {
  return `${size.width}/${size.height} R${size.rim}`
}

export const TYRE_WIDTHS: number[] = [...new Set(TYRE_SIZES.map((size) => size.width))].sort((a, b) => a - b)

export function heightsForWidth(width: number): number[] {
  return [...new Set(TYRE_SIZES.filter((size) => size.width === width).map((size) => size.height))].sort((a, b) => a - b)
}

export function rimsFor(width: number, height: number): number[] {
  return [
    ...new Set(
      TYRE_SIZES.filter((size) => size.width === width && size.height === height).map((size) => size.rim),
    ),
  ].sort((a, b) => a - b)
}
