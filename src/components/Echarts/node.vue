<template>
  <div>
    <div id="cpu" :style="{width: '900px', height: '300px'}"></div>
    <div id="memory" :style="{width: '900px', height: '300px'}"></div>
    <div id="storage" :style="{width: '900px', height: '300px'}"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      x: ['master', 'node01', 'node02'],
      legend: ['Allocatable','Capacity'],
      yCpu: [
        {
          name: 'Allocatable',
          type: 'bar',
          data: [2, 2, 2]
        },
        {
          name: 'Capacity',
          type: 'bar',
          data: [2, 2, 2]
        }
      ],
      yMemory: [
        {
          name: 'Allocatable',
          type: 'bar',
          data: [3.75, 1.76, 1.78]
        },
        {
          name: 'Capacity',
          type: 'bar',
          data: [3.86, 1.86, 1.86]
        }
      ],
      yStorage: [
        {
          name: 'Allocatable',
          type: 'bar',
          data: [76, 28, 26]
        },
        {
          name: 'Capacity',
          type: 'bar',
          data: [100, 50, 50]
        }
      ]
    }
  },
  mounted() {
    this.drawLineCpu()
    this.drawLineMemory()
    this.drawLineStorage()
  },
  methods: {
    drawLineCpu() {
      // 基于刚刚准备好的 DOM 容器，初始化 EChart 实例
      const cpu = this.$echarts.init(document.getElementById('cpu'))
      // 绘制图表
      cpu.setOption({
        title: { text: 'CPU' },
        tooltip: {},
        legend: {
          data: this.legend
        },
        xAxis: {
          data: this.x
        },
        yAxis: {},
        series: this.yCpu
      })
    },
    drawLineMemory() {
      // 基于刚刚准备好的 DOM 容器，初始化 EChart 实例
      const memory = this.$echarts.init(document.getElementById('memory'))
      // 绘制图表
      memory.setOption({
        title: { text: 'Memory' },
        tooltip: {},
        legend: {
          data: this.legend
        },
        xAxis: {
          data: this.x
        },
        yAxis: {},
        series: this.yMemory
      })
    },
    drawLineStorage() {
      // 基于刚刚准备好的 DOM 容器，初始化 EChart 实例
      const storage = this.$echarts.init(document.getElementById('storage'))
      // 绘制图表
      storage.setOption({
        title: { text: 'Storage' },
        tooltip: {},
        legend: {
          data: this.legend
        },
        xAxis: {
          data: this.x
        },
        yAxis: {},
        series: this.yStorage
      })
    }
  }
}
</script>
