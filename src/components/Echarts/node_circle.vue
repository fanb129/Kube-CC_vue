<template>
  <el-table
    :data="nodes"
    stripe
    style="width: 100%"
  >
    <el-table-column
      label="Node"
      width="130"
    >
      <template slot-scope='scope'>
        <span style="font-size: large">{{ scope.row.node }}</span>
      </template>
    </el-table-column>

    <el-table-column
      label="CPU"
    >
      <template slot-scope='scope'>
        <div :id="'cpu'+scope.row.node" style="width: 300px;height: 300px" />
      </template>
    </el-table-column>
    <el-table-column
      label="Memory"
    >
      <template slot-scope='scope'>
        <div :id="'memory'+scope.row.node" style="width: 300px;height: 300px" />
        <div style="width: 300px;text-align: center">
          <span style="font-size: large">{{ scope.row.usedMemory }} G / {{ scope.row.totalMemory }} G</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="Storage"
    >
      <template slot-scope='scope'>
        <div :id="'storage'+scope.row.node" style="width: 300px;height: 300px" />
        <div style="width: 300px;text-align: center">
          <span style="font-size: large">{{ scope.row.usedStorage }} G / {{ scope.row.totalStorage }} G</span>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      nodes: [{
        node: 'master',
        cpu: '40',
        usedMemory: 7.7,
        totalMemory: 15.8,
        usedStorage: 43.1,
        totalStorage: 79.2
      },
      {
        node: 'node01',
        cpu: '78',
        usedMemory: 14.1,
        totalMemory: 15.8,
        usedStorage: 34.4,
        totalStorage: 49.7
      },
      {
        node: 'node02',
        cpu: '32',
        usedMemory: 14.1,
        totalMemory: 15.8,
        usedStorage: 34.4,
        totalStorage: 49.7
      }]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      setTimeout(_ => {
        this.nodes.forEach(e => {
          this.drawCpu(e.node, e.cpu)
          this.drawMemory(e.node, parseInt(e.usedMemory / e.totalMemory * 100))
          this.drawStorage(e.node, parseInt(e.usedStorage / e.totalStorage * 100))
        })
      }, 1000)
    },
    drawCpu(node, value) {
      // 基于刚刚准备好的 DOM 容器，初始化 EChart 实例
      const cpu = this.$echarts.init(document.getElementById('cpu' + node))
      // 绘制图表
      cpu.setOption({
        // title: { text: 'CPU' },
        series: [
          {
            type: 'gauge',
            axisLine: {
              lineStyle: {
                width: 30,
                color: [
                  [0.3, '#67e0e3'],
                  [0.7, '#37a2da'],
                  [1, '#fd666d']
                ]
              }
            },
            pointer: {
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              distance: -30,
              length: 8,
              lineStyle: {
                color: '#fff',
                width: 2
              }
            },
            splitLine: {
              distance: -30,
              length: 30,
              lineStyle: {
                color: '#fff',
                width: 4
              }
            },
            axisLabel: {
              color: 'auto',
              distance: 40,
              fontSize: 15
            },
            detail: {
              valueAnimation: true,
              formatter: '{value} %',
              color: 'auto',
              fontSize: 20
            },
            data: [
              {
                value: value
              }
            ]
          }
        ]
      })
    },
    drawMemory(node, value) {
      // 基于刚刚准备好的 DOM 容器，初始化 EChart 实例
      const cpu = this.$echarts.init(document.getElementById('memory' + node))
      // 绘制图表
      cpu.setOption({
        // title: { text: 'memory' },
        series: [
          {
            type: 'gauge',
            axisLine: {
              lineStyle: {
                width: 30,
                color: [
                  [0.3, '#67e0e3'],
                  [0.7, '#37a2da'],
                  [1, '#fd666d']
                ]
              }
            },
            pointer: {
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              distance: -30,
              length: 8,
              lineStyle: {
                color: '#fff',
                width: 2
              }
            },
            splitLine: {
              distance: -30,
              length: 30,
              lineStyle: {
                color: '#fff',
                width: 4
              }
            },
            axisLabel: {
              color: 'auto',
              distance: 40,
              fontSize: 15
            },
            detail: {
              valueAnimation: true,
              formatter: '{value} %',
              color: 'auto',
              fontSize: 20
            },
            data: [
              {
                value: value
              }
            ]
          }
        ]
      })
    },
    drawStorage(node, value) {
      // 基于刚刚准备好的 DOM 容器，初始化 EChart 实例
      const cpu = this.$echarts.init(document.getElementById('storage' + node))
      // 绘制图表
      cpu.setOption({
        // title: { text: 'storage' },
        series: [
          {
            type: 'gauge',
            axisLine: {
              lineStyle: {
                width: 30,
                color: [
                  [0.3, '#67e0e3'],
                  [0.7, '#37a2da'],
                  [1, '#fd666d']
                ]
              }
            },
            pointer: {
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              distance: -30,
              length: 8,
              lineStyle: {
                color: '#fff',
                width: 2
              }
            },
            splitLine: {
              distance: -30,
              length: 30,
              lineStyle: {
                color: '#fff',
                width: 4
              }
            },
            axisLabel: {
              color: 'auto',
              distance: 40,
              fontSize: 15
            },
            detail: {
              valueAnimation: true,
              formatter: '{value} %',
              color: 'auto',
              fontSize: 20
            },
            data: [
              {
                value: value
              }
            ]
          }
        ]
      })
    }

  }
}
</script>
