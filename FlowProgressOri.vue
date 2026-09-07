<template>
  <svg class="flow-progress" :viewBox="`0 0 ${W} ${H}`" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="rejectArrow" viewBox="0 0 10 10" refX="8" refY="5"
              markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill="#f5222d" />
      </marker>
    </defs>

    <!-- 相邻节点连线 -->
    <line v-for="(lk, i) in links" :key="i"
          :x1="lk.x1" :y1="CY" :x2="lk.x2" :y2="CY"
          :stroke="lk.color" stroke-width="5" stroke-linecap="round" />

    <!-- 驳回回退折线 -->
    <template v-if="rejectTo != null">
      <path :d="rejectPath" class="reject" marker-end="url(#rejectArrow)" />
      <text :x="rejectLabelX" y="22" text-anchor="middle" class="reject-label">驳回 → 节点{{ rejectTo }}</text>
    </template>

    <!-- 节点 -->
    <g v-for="n in nodes" :key="n.id">
      <circle :cx="cx(n.id)" :cy="CY" :r="R" :fill="COLORS[n.status]" />
      <text :x="cx(n.id)" :y="CY + 6" text-anchor="middle" fill="#fff" font-size="18" font-weight="700">{{ n.id }}</text>
      <text :x="cx(n.id)" :y="CY + R + 24" text-anchor="middle" font-size="15" font-weight="600" fill="#333">{{ n.name }}</text>
      <text :x="cx(n.id)" :y="CY + R + 44" text-anchor="middle" font-size="13" :fill="COLORS[n.status]">{{ STATUS_TEXT[n.status] }}</text>
    </g>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

/* ========== props（节点数据全部由外部传入） ==========
   nodes:      [{ id, name, status }]
               status: 'todo'未开始 | 'doing'进行中 | 'done'完成 | 'rejected'驳回
   rejectFrom: 被驳回节点的 id（可空）
   rejectTo:   回退目标节点的 id（可空，非空时画驳回折线） */
const props = defineProps({
  nodes: { type: Array, required: true },
  rejectFrom: { type: [Number, String], default: null },
  rejectTo: { type: [Number, String], default: null },
})

const W = 1000      // viewBox 宽度（svg 自适应缩放，改高度比例也行）
const H = 200
const R = 28        // 节点圆半径
const CY = 110      // 节点圆心 Y
const COLORS = { todo: '#c0c4cc', doing: '#ffb300', done: '#2f6bff', rejected: '#f5222d' }
const STATUS_TEXT = { todo: '未开始', doing: '进行中', done: '完成', rejected: '已驳回' }

/* id → 数组下标（id 不连续也兼容） */
const idxMap = computed(() => {
  const m = {}
  props.nodes.forEach((n, i) => (m[n.id] = i))
  return m
})
const cx = (id) => ((idxMap.value[id] ?? 0) + 0.5) * (W / props.nodes.length)

/* 相邻连线：颜色取前一个节点状态（done 蓝 / doing 黄 / 其余灰） */
const links = computed(() =>
  props.nodes.slice(0, -1).map((node, i) => {
    const next = props.nodes[i + 1]
    return {
      x1: cx(node.id) + R,
      x2: cx(next.id) - R,
      color: node.status === 'done' ? COLORS.done
            : node.status === 'doing' ? COLORS.doing
            : COLORS.todo,
    }
  })
)

/* 驳回折线：from 顶部向上 → 横 → 向下 → to 顶部 */
const rejectPath = computed(() => {
  if (props.rejectTo == null) return ''
  return `M ${cx(props.rejectFrom)} ${CY - R} L ${cx(props.rejectFrom)} 34 L ${cx(props.rejectTo)} 34 L ${cx(props.rejectTo)} ${CY - R}`
})
const rejectLabelX = computed(() =>
  props.rejectTo == null ? 0 : (cx(props.rejectFrom) + cx(props.rejectTo)) / 2
)
</script>

<style scoped>
.flow-progress { width: 100%; height: auto; display: block; }
.reject { stroke: #f5222d; stroke-width: 2.5; stroke-dasharray: 7 5; fill: none; stroke-linejoin: round; }
.reject-label { font-size: 13px; fill: #f5222d; font-weight: 600; }
</style>
