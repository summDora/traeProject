import {
  buildRankScrollTrack,
  canRankScroll,
  createRankItemStyle,
  createRankTrackStyle,
  measureRankItemHeight,
  measureRankScrollDistance
} from '../utils/rankScroll'

/** 排名列表连续滚动：各实例传入不同的 visibleCount，行高会自动按视口分别计算 */
export default {
  methods: {
    buildRankScrollTrack,
    canRankScroll,
    createRankItemStyle,
    createRankTrackStyle,
    measureRankScrollArea(viewportRef, visibleCount, list, itemHeightKey, scrollDistanceKey) {
      const viewport = this.$refs[viewportRef]
      this[itemHeightKey] = measureRankItemHeight(viewport, visibleCount)
      this.$nextTick(() => {
        this[scrollDistanceKey] = canRankScroll(list, visibleCount)
          ? measureRankScrollDistance(viewport)
          : 0
      })
    },
    resetRankScrollArea(viewportRef, visibleCount, list, itemHeightKey, scrollDistanceKey) {
      this[scrollDistanceKey] = 0
      this.$nextTick(() => {
        this.measureRankScrollArea(viewportRef, visibleCount, list, itemHeightKey, scrollDistanceKey)
      })
    }
  }
}
