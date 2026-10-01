export type Rect = {
  left: number
  top: number
  width: number
  height: number
}

/** Final kettle image slot inside the popup sheet (relative to .device-search) */
export const POPUP_IMAGE_RECT: Rect = {
  left: 8 + (377 - 280) / 2, // 56.5
  top: 59 + 204, // sheet top 59 + image top 204
  width: 280,
  height: 280,
}

export const POPUP_SHEET = {
  left: 8,
  top: 59,
  width: 377,
  height: 785,
} as const

export const MORPH_MS = 520
export const PAUSE_BEFORE_POPUP_MS = 1000
