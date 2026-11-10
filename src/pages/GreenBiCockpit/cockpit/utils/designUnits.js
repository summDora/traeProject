export const DESIGN_WIDTH = 1920
export const DESIGN_HEIGHT = 1080

/** 设计稿 px → 当前视口等比 px（数值） */
export function dpx(value, viewportWidth = typeof window !== 'undefined' ? window.innerWidth : DESIGN_WIDTH) {
  return Math.round(value * viewportWidth / DESIGN_WIDTH)
}

/** 设计稿 px → 当前视口等比 px（字符串，用于 fontSize 等） */
export function dpxStr(value, viewportWidth = typeof window !== 'undefined' ? window.innerWidth : DESIGN_WIDTH) {
  return `${dpx(value, viewportWidth)}px`
}

/** 设计稿 px → vw 字符串（可用于 inline style） */
export function dvw(value) {
  return `${(value / DESIGN_WIDTH * 100).toFixed(6)}vw`
}
