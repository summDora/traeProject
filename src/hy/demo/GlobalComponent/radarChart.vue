<template>
  <!-- <div class="content"> -->
  <div class="chart" id="radarChart"></div>
  <!-- </div> -->
</template>

<script>
import {
  queryLibrary, //指标分类库 清单获取接口
} from '/src/api/moXingGuanli.js'
export default {
  name: 'radarChart',
  props: {},
  data() {
    return {
      radarChart: null,

      radarOption: {
        tooltip: {
          trigger: 'item',
        },

        legend: {
          bottom: 10,
          icon: 'circle',
          data: ['评价结果', '达标线'],
          itemWidth: 10,
          itemHeight: 10,
        },
        radar: {
          // 圆心相对容器的百分比
          center: ['50%', '50%'], // 正中
          // 半径可以是像素或百分比，越小留白越多
          radius: '65%', // 这里留了约 35% 的四周空白
          indicator: [
            //要加自动换行
            { name: '开发质量', max: 6500 },
            { name: '经济效益', max: 6500 },
            { name: '共享效益', max: 6500 },
            { name: '实用效果', max: 6500 },
            { name: '运行水平', max: 6500 },
          ],
        },
        series: [
          {
            name: 'rander',
            type: 'radar',
            data: [
              {
                value: [300, 400, 4500, 290, 6000],
                name: '评价结果',
                itemStyle: {
                  color: 'rgba(0,154,150,1)',
                },
                areaStyle: {
                  color: 'rgba(0,154,150,0.2)',
                },
              },
              {
                value: [60, 60, 60, 60, 60],
                name: '达标线',
                itemStyle: {
                  color: 'rgba(255,146,158,1)',
                },
                areaStyle: {
                  color: 'rgba(255,146,158,0.2)',
                },
              },
            ],
          },
        ],
      },
    }
  },
  mounted() {
    this.radarChart = this.$echarts.init(document.getElementById('radarChart'))
    window.addEventListener('resize', () => {
      this.reloadCharts()
    })
  },
  methods: {
    initRadar(array) {
      this.m_apiFn(queryLibrary, {})
        .then(data => {
          if (data.statusCode == '200') {
            let scoreColumns = data.result.criterionClassify
            const { nameArray, valueArray } = this.transformData(scoreColumns, array)
            console.log(nameArray, valueArray, 'nameArray and valueArray')
            this.radarOption.radar.indicator = nameArray
            this.radarOption.series[0].data[0].value = valueArray
            this.$nextTick(() => {
              this.getData()
            })
          } else {
            this.$message.error(data.result)
          }
        })
        .catch()
    },
    getData() {
      this.radarChart.setOption(this.radarOption)
    },
    reloadCharts() {
      this.radarChart && this.radarChart.resize()
    },
    transformData(classifyArr, scoreMap) {
      // 1️⃣ 先根据 sort 排序（如果已经排好序可省略这一步）
      const sorted = [...classifyArr].sort((a, b) => a.sort - b.sort)

      const nameArray = []
      const valueArray = []

      // 2️⃣ 逐条处理
      sorted.forEach(item => {
        // ① name 部分
        nameArray.push({ name: item.name, max: 100 })

        // ② 把大写下划线转成小驼峰 + "Score"
        //    示例：DEVELOPMENT_QUALITY → developmentQualityScore
        // const camelKey = item.code.toLowerCase().replace(/_([a-z])/g, (_, c) => c.toUpperCase()) + 'Score'
        const camelKey = item.scoreName

        // ③ 取对应的分数（若不存在返回 null）
        const val = Object.prototype.hasOwnProperty.call(scoreMap, camelKey) ? scoreMap[camelKey] : null

        valueArray.push(val)
      })

      return { nameArray, valueArray }
    },
  },
}
</script>

<style lang="less" scoped>
// .content{
//     height: 100%;
.chart {
  height: 100%;
}
// }
</style>
