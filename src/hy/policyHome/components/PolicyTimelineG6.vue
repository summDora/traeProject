<template>
  <div class="policy-timeline-g6">
    <div ref="scrollWrap" class="timeline-scroll" @scroll="onScroll">
      <div class="timeline-inner" :style="{ width: innerWidth + 'px' }">
        <div ref="g6Container" class="g6-container" :style="{ height: graphHeight + 'px' }" />
        <div class="cards-row">
          <div
            v-for="slot in cardSlots"
            :key="slot.id"
            class="card-slot"
            :style="{ width: slot.width + 'px', left: slot.offset + 'px' }"
          >
            <div
              v-if="slot.policy"
              class="policy-card"
              :class="{ active: activeId === slot.id }"
              @click="selectPoint(slot.id)"
            >
              <div class="card-badge" :style="{ background: slot.policy.badgeColor }">
                {{ slot.policy.region }}
              </div>
              <div class="card-content">{{ slot.policy.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import G6 from '@antv/g6'

const CONNECTOR_LEN = 36
const EVENT_RADIUS = 14
const YEAR_RADIUS = 26

function waveY(index, baseY, amplitude) {
  return baseY + Math.sin(index * 0.85) * amplitude
}

function buildWavePath(positions) {
  if (positions.length < 2) return ''
  let d = `M ${positions[0].x} ${positions[0].y}`
  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1]
    const curr = positions[i]
    const cpx = (prev.x + curr.x) / 2
    const cpy = (prev.y + curr.y) / 2
    d += ` Q ${cpx} ${cpy} ${curr.x} ${curr.y}`
  }
  return d
}

const ANCHOR_EVERY = 5

/** 单条装饰线配置 */
const DECOR_LINE = {
  phase: 0.6,
  widthMin: 1,
  widthMax: 2.2,
  opacity: 0.32,
  color: '0, 210, 240'
}

/** 提取每 5 个节点的锚点（装饰线必经，与主时间轴重合） */
function getDecorAnchors(nodePositions) {
  const anchors = []
  for (let i = 0; i < nodePositions.length; i += ANCHOR_EVERY) {
    anchors.push({ x: nodePositions[i].x, y: nodePositions[i].y, index: i })
  }
  const last = nodePositions.length - 1
  if (anchors[anchors.length - 1].index !== last) {
    anchors.push({ x: nodePositions[last].x, y: nodePositions[last].y, index: last })
  }
  return anchors
}

/** 锚点之间生成独立水波纹路径（不跟随主波浪，仅锚点处重合） */
function buildDecorLinePoints(nodePositions) {
  const anchors = getDecorAnchors(nodePositions)
  if (anchors.length < 2) return anchors.map(a => ({ x: a.x, y: a.y }))

  const points = []

  anchors.forEach((start, a) => {
    if (a === anchors.length - 1) {
      points.push({ x: start.x, y: start.y })
      return
    }

    const end = anchors[a + 1]
    const steps = Math.max(28, (end.index - start.index) * 10)

    for (let s = 0; s <= steps; s++) {
      if (a > 0 && s === 0) continue

      const t = s / steps
      const x = start.x + (end.x - start.x) * t
      const baseY = start.y + (end.y - start.y) * t
      const envelope = Math.sin(t * Math.PI)
      const seed = start.index * 0.63 + end.index * 0.37 + DECOR_LINE.phase

      const ripple = (
        Math.sin(t * Math.PI * 2.1 + seed) * 20
        + Math.sin(t * Math.PI * 3.6 + seed * 1.4) * 11
        + Math.cos(t * Math.PI * 1.3 + seed * 0.7) * 9
      ) * envelope

      points.push({ x, y: baseY + ripple })
    }
  })

  return points
}

function getDecorLineWidthAt(i, total) {
  const t = 0.5
    + 0.5 * Math.sin(i * 0.16 + DECOR_LINE.phase)
    + 0.2 * Math.cos(i * 0.32 + DECOR_LINE.phase * 1.2)
  const normalized = Math.max(0, Math.min(1, t))
  return DECOR_LINE.widthMin + (DECOR_LINE.widthMax - DECOR_LINE.widthMin) * normalized
}

function buildDecorWidths(points) {
  const widths = points.map((_, i) => getDecorLineWidthAt(i, points.length))
  for (let i = 1; i < widths.length; i++) {
    widths[i] = widths[i] * 0.35 + widths[i - 1] * 0.65
  }
  for (let i = widths.length - 2; i >= 0; i--) {
    widths[i] = widths[i] * 0.35 + widths[i + 1] * 0.65
  }
  return widths
}

function buildRibbonPath(points, widths) {
  if (points.length < 2) return ''

  const upper = []
  const lower = []

  points.forEach((p, i) => {
    const prev = points[Math.max(0, i - 1)]
    const next = points[Math.min(points.length - 1, i + 1)]
    const dx = next.x - prev.x
    const dy = next.y - prev.y
    const len = Math.hypot(dx, dy) || 1
    const nx = -dy / len
    const ny = dx / len
    const hw = widths[i] / 2
    upper.push({ x: p.x + nx * hw, y: p.y + ny * hw })
    lower.push({ x: p.x - nx * hw, y: p.y - ny * hw })
  })

  let d = `M ${upper[0].x} ${upper[0].y}`
  for (let i = 1; i < upper.length; i++) d += ` L ${upper[i].x} ${upper[i].y}`
  for (let i = lower.length - 1; i >= 0; i--) d += ` L ${lower[i].x} ${lower[i].y}`
  return `${d} Z`
}

function buildSmoothCenterPath(points) {
  if (points.length < 2) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cpx = (prev.x + curr.x) / 2
    const cpy = (prev.y + curr.y) / 2
    d += ` Q ${cpx} ${cpy} ${curr.x} ${curr.y}`
  }
  return d
}


/** 绘制唯一装饰线：窄线 + 柔和光晕 + 实心填充 */
function drawDecorLine(group, nodePositions) {
  if (nodePositions.length < 2) return

  const points = buildDecorLinePoints(nodePositions)
  const widths = buildDecorWidths(points)
  const centerPath = buildSmoothCenterPath(points)
  const ribbonPath = buildRibbonPath(points, widths)
  if (!centerPath || !ribbonPath) return

  const glowColor = `rgba(${DECOR_LINE.color}, 1)`

  group.addShape('path', {
    attrs: {
      path: centerPath,
      stroke: `rgba(${DECOR_LINE.color}, ${DECOR_LINE.opacity * 0.12})`,
      lineWidth: 16,
      lineCap: 'round',
      lineJoin: 'round',
      shadowColor: glowColor,
      shadowBlur: 22
    },
    name: 'decor-glow-outer'
  })

  group.addShape('path', {
    attrs: {
      path: centerPath,
      stroke: `rgba(${DECOR_LINE.color}, ${DECOR_LINE.opacity * 0.2})`,
      lineWidth: 8,
      lineCap: 'round',
      lineJoin: 'round',
      shadowColor: glowColor,
      shadowBlur: 12
    },
    name: 'decor-glow-mid'
  })

  group.addShape('path', {
    attrs: {
      path: ribbonPath,
      fill: `rgba(${DECOR_LINE.color}, ${DECOR_LINE.opacity * 0.82})`,
      stroke: 'transparent',
      shadowColor: glowColor,
      shadowBlur: 6
    },
    name: 'decor-fill'
  })

  group.addShape('path', {
    attrs: {
      path: centerPath,
      stroke: `rgba(190, 248, 255, ${Math.min(DECOR_LINE.opacity * 1.4, 0.75)})`,
      lineWidth: 1,
      lineCap: 'round',
      lineJoin: 'round'
    },
    name: 'decor-core'
  })
}

function registerNodes(G6Lib) {
  G6Lib.registerNode('timeline-year', {
    draw(cfg, group) {
      const { year, active } = cfg
      const color = active ? '#ffd700' : '#00d4ff'

      group.addShape('circle', {
        attrs: {
          x: 0, y: 0, r: YEAR_RADIUS + 8,
          fill: active ? 'rgba(255,215,0,0.15)' : 'rgba(0,212,255,0.12)',
          shadowColor: color, shadowBlur: 20
        },
        name: 'outer-glow'
      })

      group.addShape('circle', {
        attrs: {
          x: 0, y: 0, r: YEAR_RADIUS,
          fill: 'rgba(0, 30, 60, 0.85)',
          stroke: color,
          lineWidth: 2,
          shadowColor: color,
          shadowBlur: 14
        },
        name: 'ring'
      })

      group.addShape('circle', {
        attrs: {
          x: 0, y: 0, r: YEAR_RADIUS - 6,
          stroke: color,
          lineWidth: 1,
          opacity: 0.5
        },
        name: 'inner-ring'
      })

      group.addShape('text', {
        attrs: {
          x: 0, y: 0,
          text: year,
          fill: color,
          fontSize: 16,
          fontWeight: 700,
          textAlign: 'center',
          textBaseline: 'middle'
        },
        name: 'year-text'
      })

      return group.addShape('circle', {
        attrs: { x: 0, y: 0, r: YEAR_RADIUS + 4, fill: 'transparent', cursor: 'pointer' },
        name: 'hit-area'
      })
    },
    setState(name, value, item) {
      if (name !== 'active') return
      const group = item.getContainer()
      const color = value ? '#ffd700' : '#00d4ff'
      ;['ring', 'inner-ring', 'year-text'].forEach(n => {
        const shape = group.find(el => el.get('name') === n)
        if (shape) shape.attr('stroke' in shape.attr() ? { stroke: color, fill: n === 'year-text' ? color : shape.attr('fill') } : { fill: color })
      })
      const ring = group.find(el => el.get('name') === 'ring')
      if (ring) ring.attr({ stroke: color, shadowColor: color })
      const yearText = group.find(el => el.get('name') === 'year-text')
      if (yearText) yearText.attr({ fill: color })
    }
  }, 'circle')

  G6Lib.registerNode('timeline-event', {
    draw(cfg, group) {
      const { seq, active } = cfg
      const color = active ? '#ffb800' : '#ffd700'

      group.addShape('circle', {
        attrs: {
          x: 0, y: 0, r: EVENT_RADIUS + 5,
          fill: 'rgba(255, 215, 0, 0.2)',
          shadowColor: color,
          shadowBlur: 12
        },
        name: 'glow'
      })

      group.addShape('circle', {
        attrs: {
          x: 0, y: 0, r: EVENT_RADIUS,
          fill: active ? '#ffb800' : '#ffd700',
          stroke: '#fff8dc',
          lineWidth: 1.5,
          shadowColor: color,
          shadowBlur: 10
        },
        name: 'dot'
      })

      group.addShape('text', {
        attrs: {
          x: 0, y: 0,
          text: seq,
          fill: '#1a1a00',
          fontSize: 12,
          fontWeight: 700,
          textAlign: 'center',
          textBaseline: 'middle'
        },
        name: 'seq-text'
      })

      group.addShape('line', {
        attrs: {
          x1: 0, y1: EVENT_RADIUS + 2,
          x2: 0, y2: EVENT_RADIUS + CONNECTOR_LEN,
          stroke: 'rgba(0, 212, 255, 0.45)',
          lineWidth: 1
        },
        name: 'connector'
      })

      return group.addShape('circle', {
        attrs: { x: 0, y: 0, r: EVENT_RADIUS + 8, fill: 'transparent', cursor: 'pointer' },
        name: 'hit-area'
      })
    },
    setState(name, value, item) {
      if (name !== 'active') return
      const group = item.getContainer()
      const dot = group.find(el => el.get('name') === 'dot')
      if (dot) {
        dot.attr({
          fill: value ? '#ffb800' : '#ffd700',
          shadowBlur: value ? 16 : 10
        })
      }
    }
  }, 'circle')
}

export default {
  name: 'PolicyTimelineG6',
  props: {
    points: { type: Array, required: true },
    value: { type: String, default: '' },
    pointSpacing: { type: Number, default: 200 },
    paddingX: { type: Number, default: 100 }
  },
  data() {
    const firstEvent = this.points.find(p => p.type === 'event')
    return {
      graph: null,
      activeId: this.value || (firstEvent && firstEvent.id) || '',
      nodePositions: []
    }
  },
  computed: {
    innerWidth() {
      const count = this.points.length
      if (count <= 1) return this.pointSpacing + this.paddingX * 2
      return this.paddingX * 2 + (count - 1) * this.pointSpacing
    },
    graphHeight() {
      return 130
    },
    cardSlots() {
      return this.points
        .map((point, index) => {
          if (point.type !== 'event') return null
          const x = this.paddingX + index * this.pointSpacing
          return {
            id: point.id,
            offset: x - 90,
            width: 180,
            policy: point.policy
          }
        })
        .filter(Boolean)
    }
  },
  watch: {
    value(val) {
      if (val && val !== this.activeId) {
        this.activeId = val
        this.syncActiveState()
      }
    },
    points: {
      deep: true,
      handler() { this.renderGraph() }
    },
    activeId(val) {
      this.$emit('input', val)
      this.$emit('change', val)
      this.syncActiveState()
    }
  },
  mounted() {
    registerNodes(G6)
    this.renderGraph()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    if (this.graph) {
      this.graph.destroy()
      this.graph = null
    }
  },
  methods: {
    getNodePositions() {
      const baseY = 58
      const amplitude = 22
      return this.points.map((_, index) => ({
        x: this.paddingX + index * this.pointSpacing,
        y: waveY(index, baseY, amplitude)
      }))
    },
    renderGraph() {
      if (!this.$refs.g6Container || !this.points.length) return

      if (this.graph) {
        this.graph.destroy()
        this.graph = null
      }

      this.nodePositions = this.getNodePositions()

      const nodes = this.points.map((point, index) => ({
        id: point.id,
        type: point.type === 'year' ? 'timeline-year' : 'timeline-event',
        x: this.nodePositions[index].x,
        y: this.nodePositions[index].y,
        year: point.year,
        seq: point.seq,
        active: point.id === this.activeId
      }))

      this.graph = new G6.Graph({
        container: this.$refs.g6Container,
        width: this.innerWidth,
        height: this.graphHeight,
        renderer: 'canvas',
        fitView: false,
        animate: false,
        modes: { default: [] }
      })

      this.graph.data({ nodes, edges: [] })
      this.graph.render()
      this.drawWaveLine()
      this.graph.on('node:click', evt => {
        const model = evt.item.getModel()
        if (model.type === 'timeline-event') {
          this.selectPoint(model.id)
        }
      })
      this.syncActiveState()
    },
    drawWaveLine() {
      if (!this.graph || this.nodePositions.length < 2) return

      const canvas = this.graph.get('canvas')
      const group = canvas.addGroup({ name: 'wave-line-group' })

      drawDecorLine(group, this.nodePositions)

      const path = buildWavePath(this.nodePositions)

      group.addShape('path', {
        attrs: {
          path,
          stroke: 'rgba(0, 212, 255, 0.2)',
          lineWidth: 8,
          lineCap: 'round'
        },
        name: 'wave-glow'
      })

      group.addShape('path', {
        attrs: {
          path,
          stroke: 'l(0) 0:#007799 0.5:#00ffff 1:#007799',
          lineWidth: 2.5,
          lineCap: 'round',
          shadowColor: 'rgba(0, 255, 255, 0.9)',
          shadowBlur: 10
        },
        name: 'wave-path'
      })

      group.toBack()
    },
    syncActiveState() {
      if (!this.graph) return
      this.graph.getNodes().forEach(node => {
        this.graph.setItemState(node, 'active', node.get('id') === this.activeId)
      })
    },
    selectPoint(id) {
      this.activeId = id
      const index = this.points.findIndex(p => p.id === id)
      if (index >= 0) this.scrollToIndex(index)
    },
    scrollToIndex(index) {
      const wrap = this.$refs.scrollWrap
      if (!wrap) return
      const targetX = this.paddingX + index * this.pointSpacing - wrap.clientWidth / 2
      wrap.scrollTo({ left: Math.max(0, targetX), behavior: 'smooth' })
    },
    onScroll() {},
    handleResize() {
      this.renderGraph()
    }
  }
}
</script>

<style scoped>
.policy-timeline-g6 {
  margin-top: 0;
  border-top: 1px solid rgba(0, 212, 255, 0.12);
  padding-top: 12px;
}

.timeline-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 6px;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 212, 255, 0.45) rgba(255, 255, 255, 0.04);
}

.timeline-scroll::-webkit-scrollbar {
  height: 5px;
}

.timeline-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 3px;
}

.timeline-scroll::-webkit-scrollbar-thumb {
  background: rgba(0, 212, 255, 0.4);
  border-radius: 3px;
}

.timeline-inner {
  position: relative;
  min-width: 100%;
}

.g6-container {
  pointer-events: auto;
}

.cards-row {
  position: relative;
  height: 130px;
  margin-top: -4px;
}

.card-slot {
  position: absolute;
  top: 0;
  flex-shrink: 0;
}

.policy-card {
  background: rgba(0, 25, 50, 0.75);
  border: 1px solid rgba(0, 212, 255, 0.22);
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.policy-card:hover,
.policy-card.active {
  border-color: rgba(0, 212, 255, 0.45);
  box-shadow: 0 0 18px rgba(0, 212, 255, 0.12);
}

.policy-card.active {
  border-color: rgba(255, 215, 0, 0.5);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.1);
}

.card-badge {
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(90deg, #006688, #008899);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-content {
  padding: 10px;
  font-size: 11px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.82);
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 72px;
}
</style>
