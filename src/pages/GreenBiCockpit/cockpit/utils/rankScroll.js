/**
 * 排名列表滚动速度配置
 *
 * 切换方式：改 RANK_SCROLL_MODE 即可（'pixel' | 'row' | 'cycle'）
 * 各模式参数均已定义，未启用的模式参数可忽略。
 *
 * ── pixel ── 固定像素速度，列表越长一轮越久
 * ── row   ── 固定每条数据耗时，每条经过视口的节奏一致
 * ── cycle ── 固定一轮动画时长，所有列表相同秒数滚完一遍
 */

/** @typedef {'pixel' | 'row' | 'cycle'} RankScrollMode */

// ========== 切换模式（改这一行） ==========
export const RANK_SCROLL_MODE = 'pixel'

// ========== 通用 ==========
export const RANK_SCROLL_MIN_DURATION = 24

// ========== 模式 A：pixel ==========
export const RANK_SCROLL_SPEED = 26

// ========== 模式 B：row ==========
export const RANK_SCROLL_SECONDS_PER_ROW = 2.8

// ========== 模式 C：cycle ==========
export const RANK_SCROLL_CYCLE_DURATION = 36

/**
 * @param {object} params
 * @param {RankScrollMode} params.mode
 * @param {number} params.scrollDistance
 * @param {number} params.listLength
 * @param {number} [params.speed]
 * @param {number} [params.secondsPerRow]
 * @param {number} [params.cycleDuration]
 * @param {number} [params.minDuration]
 */
export function calcRankScrollDuration({
  mode = RANK_SCROLL_MODE,
  scrollDistance,
  listLength,
  speed = RANK_SCROLL_SPEED,
  secondsPerRow = RANK_SCROLL_SECONDS_PER_ROW,
  cycleDuration = RANK_SCROLL_CYCLE_DURATION,
  minDuration = RANK_SCROLL_MIN_DURATION
}) {
  let durationSec

  switch (mode) {
    case 'row':
      durationSec = listLength * secondsPerRow
      break
    case 'cycle':
      durationSec = cycleDuration
      break
    case 'pixel':
    default:
      durationSec = scrollDistance / speed
      break
  }

  return Math.max(minDuration, durationSec)
}

export function buildRankScrollTrack(list, visibleCount) {
  if (list.length <= visibleCount) return list
  return list.concat(list)
}

export function canRankScroll(list, visibleCount) {
  return list.length > visibleCount
}

export function createRankItemStyle(itemHeight) {
  if (!itemHeight) return {}
  return { height: `${itemHeight}px` }
}

export function createRankTrackStyle({
  canScroll,
  scrollDistance,
  itemHeight,
  listLength = 0,
  mode = RANK_SCROLL_MODE,
  speed = RANK_SCROLL_SPEED,
  secondsPerRow = RANK_SCROLL_SECONDS_PER_ROW,
  cycleDuration = RANK_SCROLL_CYCLE_DURATION,
  minDuration = RANK_SCROLL_MIN_DURATION
}) {
  const style = {}
  if (itemHeight) {
    style['--rank-scroll-item-height'] = `${itemHeight}px`
  }
  if (!canScroll || !scrollDistance) return style

  const durationSec = calcRankScrollDuration({
    mode,
    scrollDistance,
    listLength,
    speed,
    secondsPerRow,
    cycleDuration,
    minDuration
  })

  style['--rank-scroll-distance'] = `${scrollDistance}px`
  style['--rank-scroll-duration'] = `${durationSec}s`
  return style
}

export function measureRankItemHeight(viewport, visibleCount, trackSelector = '.rank-scroll-track') {
  if (!viewport || !viewport.clientHeight) return 0

  const track = viewport.querySelector(trackSelector)
  const gap = track
    ? parseFloat(window.getComputedStyle(track).rowGap || window.getComputedStyle(track).gap || '0')
    : 0

  return (viewport.clientHeight - gap * (visibleCount - 1)) / visibleCount
}

export function measureRankScrollDistance(viewport, trackSelector = '.rank-scroll-track') {
  const track = viewport && viewport.querySelector(trackSelector)
  if (!track || !track.scrollHeight) return 0
  return track.scrollHeight / 2
}
