import { DESIGN_WIDTH } from '../utils/designUnits'
import { applyCockpitTheme } from '../utils/chartTheme'

/** 监听视口宽度变化，驱动 vw 布局与图表 option 重算 */
export default {
  data() {
    return {
      viewportWidth: typeof window !== 'undefined' ? window.innerWidth : DESIGN_WIDTH
    }
  },
  mounted() {
    this.onViewportResize()
    window.addEventListener('resize', this.onViewportResize, { passive: true })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onViewportResize)
  },
  methods: {
    onViewportResize() {
      this.viewportWidth = window.innerWidth
      applyCockpitTheme(this.viewportWidth)
    },
    d(value) {
      return Math.round(value * this.viewportWidth / DESIGN_WIDTH)
    },
    ds(value) {
      return `${this.d(value)}px`
    }
  }
}
