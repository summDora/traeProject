import { DESIGN_WIDTH, DESIGN_HEIGHT } from '../utils/chartTheme'

/**
 * adaptive
 *   - F11：与最初一致，按当前 innerWidth × innerHeight 做 contain（min），居中，overflow 隐藏
 *   - 普通窗口：缩放比例按 F11 视口（宽 + screen.availHeight）锁定，不因地址栏变矮而缩小；
 *     视口装不下时 overflow-y 滚动
 */
export const COCKPIT_SCALE_MODE = 'adaptive'

let resizeRaf = null
let resizeEmitTimer = null
let fullscreenMq = null

const BROWSER_CHROME_HEIGHT = 72

function supportsZoom() {
  return typeof CSS !== 'undefined' && CSS.supports('zoom', '1')
}

function isLikelyFullscreen() {
  if (typeof window.matchMedia === 'function') {
    if (window.matchMedia('(display-mode: fullscreen)').matches) return true
  }
  const chromeHeight = window.screen.height - window.innerHeight
  return chromeHeight < BROWSER_CHROME_HEIGHT
}

function getScaleViewport(fullscreen) {
  const width = window.innerWidth
  if (fullscreen) {
    return { width, height: window.innerHeight }
  }
  return {
    width,
    height: window.screen.availHeight || window.innerHeight
  }
}

function resolveScale(scaleX, scaleY) {
  if (COCKPIT_SCALE_MODE === 'cover') {
    return Math.max(scaleX, scaleY)
  }
  if (COCKPIT_SCALE_MODE === 'widthFirst') {
    return scaleX
  }
  return Math.min(scaleX, scaleY)
}

export default {
  data() {
    return {
      scale: 1,
      useZoom: supportsZoom(),
      isFullscreen: false
    }
  },
  mounted() {
    this.updateScale()
    window.addEventListener('resize', this.updateScale, { passive: true })

    if (typeof window.matchMedia === 'function') {
      fullscreenMq = window.matchMedia('(display-mode: fullscreen)')
      if (fullscreenMq.addEventListener) {
        fullscreenMq.addEventListener('change', this.updateScale)
      } else if (fullscreenMq.addListener) {
        fullscreenMq.addListener(this.updateScale)
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateScale)
    if (fullscreenMq) {
      if (fullscreenMq.removeEventListener) {
        fullscreenMq.removeEventListener('change', this.updateScale)
      } else if (fullscreenMq.removeListener) {
        fullscreenMq.removeListener(this.updateScale)
      }
      fullscreenMq = null
    }
    if (resizeRaf) {
      cancelAnimationFrame(resizeRaf)
      resizeRaf = null
    }
    if (resizeEmitTimer) {
      clearTimeout(resizeEmitTimer)
      resizeEmitTimer = null
    }
  },
  methods: {
    updateScale() {
      if (resizeRaf) cancelAnimationFrame(resizeRaf)
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = null
        this.applyScale()
      })
    },
    applyScale() {
      const fullscreen = isLikelyFullscreen()
      const { width, height } = getScaleViewport(fullscreen)
      const scaleX = width / DESIGN_WIDTH
      const scaleY = height / DESIGN_HEIGHT

      this.isFullscreen = fullscreen
      this.scale = resolveScale(scaleX, scaleY)

      if (resizeEmitTimer) clearTimeout(resizeEmitTimer)
      // 等 F11 过渡结束后再通知图表 reflow，避免读到中间态尺寸
      resizeEmitTimer = setTimeout(() => {
        resizeEmitTimer = null
        window.dispatchEvent(new Event('resize'))
      }, 160)
    }
  }
}
