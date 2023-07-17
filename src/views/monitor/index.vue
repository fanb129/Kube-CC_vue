<template>
  <div class="monitor">
    <div class="selector">
      <p>当前用户的资源使用监控</p>
    </div>
    <div class="dashboard">
      <el-table :data="cur_res" stripe style="width: 100%">
        <el-table-column label="当前CPU使用率" align="center">
          <template slot-scope="scope">
            <div :id="scope.row.cpu" style="width: 180px;height: 180px" />
          </template>
        </el-table-column>
        <el-table-column label="当前GPU使用率" align="center">
          <template slot-scope="scope">
            <div :id="scope.row.gpu" style="width: 180px;height: 180px" />
          </template>
        </el-table-column>
        <el-table-column label="当前内存使用率" align="center">
          <template slot-scope="scope">
            <div :id="scope.row.memory" style="width: 180px;height: 180px" />
          </template>
        </el-table-column>
        <el-table-column label="当前存储使用率" align="center">
          <template slot-scope="scope">
            <div :id="scope.row.pvc" style="width: 180px;height: 180px" />
          </template>
        </el-table-column>
        <el-table-column label="当前缓存使用率" align="center">
          <template slot-scope="scope">
            <div :id="scope.row.storage" style="width: 180px;height: 180px" />
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="cur_res_ns" stripe style="width: 100%">
        <el-table-column label="当前CPU工作空间占比" align="center">
          <template slot-scope="scope">
            <div :id="scope.row.cpu_ns" style="width: 220px;height: 200px" />
          </template>
        </el-table-column>
        <el-table-column label="当前GPU工作空间占比" align="center">
          <template slot-scope="scope">
            <div :id="scope.row.gpu_ns" style="width: 220px;height: 200px" />
          </template>
        </el-table-column>
        <el-table-column label="当前内存工作空间占比" align="center">
          <template slot-scope="scope">
            <div :id="scope.row.memory_ns" style="width: 220px;height: 200px" />
          </template>
        </el-table-column>
        <el-table-column label="当前存储工作空间占比" align="center">
          <template slot-scope="scope">
            <div :id="scope.row.pvc_ns" style="width: 220px;height: 200px" />
          </template>
        </el-table-column>
        <el-table-column label="当前缓存工作空间占比" align="center">
          <template slot-scope="scope">
            <div :id="scope.row.storage_ns" style="width: 220px;height: 200px" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { allkindNs, totalNs } from '@/api/namespace'

export default {
  // components: { UserSelector, GroupSelector },
  data() {
    return {
      // 饼图
      uid: '',
      ns_length: '',
      ns_list: [],
      cpu_ratio: '',
      gpu_ratio: '',
      memory_ratio: '',
      pvc_ratio: '',
      storage_ratio: '',
      cpu_ns_list: [
        {
          name: '',
          value: ''
        }
      ],
      gpu_ns_list: [
        {
          name: '',
          value: ''
        }
      ],
      memory_ns_list: [
        {
          name: '',
          value: ''
        }
      ],
      pvc_ns_list: [
        {
          name: '',
          value: ''
        }
      ],
      storage_ns_list: [
        {
          name: '',
          value: ''
        }
      ],
      cpu_ns_ratio: [
        {
          cpu: '',
          used_cpu: ''
        }
      ],
      gpu_ns_ratio: [
        {
          gpu: '',
          used_gpu: ''
        }
      ],
      memory_ns_ratio: [
        {
          memory: '',
          used_memory: ''
        }
      ],
      pvc_ns_ratio: [
        {
          pvc: '',
          used_pvc: ''
        }
      ],
      storage_ns_ratio: [
        {
          storage: '',
          used_storage: ''
        }
      ],
      cur_res: [
        {
          cpu: 'CPU',
          gpu: 'GPU',
          memory: 'Memory',
          pvc: 'Pvc', // 持久存储
          storage: 'Storage' // 临时存储
        }
      ],
      cur_res_ns: [
        {
          cpu_ns: 'CPU_NS',
          gpu_ns: 'GPU_NS',
          memory_ns: 'Memory_NS',
          pvc_ns: 'Pvc_NS', // 持久存储
          storage_ns: 'Storage_NS' // 临时存储
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  // 钩子函数，挂载初始化函数
  created() {
    this.uid = this.$route.query.u_id || this.u_id
    this.init()
  },
  methods: {
    init() {
      setTimeout(_ => {
        this.cur_res.forEach(_ => {
          // 获取仪表盘数据及加载图表
          this.totalNs(this.uid)
        })
        this.cur_res_ns.forEach(_ => {
          // 获取饼图数据及加载图表
          this.allkindNs(this.uid)
        })
      }, 500)
    },
    // 饼图数据
    allkindNs: function(u_id) {
      allkindNs(u_id).then((res) => {
        this.ns_length = res.length
        // console.log(this.ns_length)
        for (let i = 0; i < this.ns_length; i++) {
          this.ns_list.push(res.ns_list[i])
        }
        for (let i = 0; i < this.ns_length; i++) {
          this.cpu_ns_list.push({ name: this.ns_list[i].name, value: this.ns_list[i].used_cpu_value })
          this.cpu_ns_ratio.push({ cpu: this.ns_list[i].cpu, used_cpu: this.ns_list[i].used_cpu })
        }
        // console.log('test3')
        // console.log(JSON.parse(JSON.stringify(this.cpu_ns_list)))
        // console.log(JSON.parse(JSON.stringify(this.cpu_ns_ratio)))
        for (let i = 0; i < this.ns_length; i++) {
          this.gpu_ns_list.push({ name: this.ns_list[i].name, value: this.ns_list[i].used_gpu_value })
          this.gpu_ns_ratio.push({ gpu: this.ns_list[i].gpu, used_gpu: this.ns_list[i].used_gpu })
        }
        for (let i = 0; i < this.ns_length; i++) {
          this.memory_ns_list.push({ name: this.ns_list[i].name, value: this.ns_list[i].used_memory_value })
          this.memory_ns_ratio.push({ memory: this.ns_list[i].memory, used_memory: this.ns_list[i].used_memory })
        }
        for (let i = 0; i < this.ns_length; i++) {
          this.pvc_ns_list.push({ name: this.ns_list[i].name, value: this.ns_list[i].used_pvc_value })
          this.pvc_ns_ratio.push({ pvc: this.ns_list[i].pvc, used_pvc: this.ns_list[i].used_pvc })
        }
        for (let i = 0; i < this.ns_length; i++) {
          this.storage_ns_list.push({ name: this.ns_list[i].name, value: this.ns_list[i].used_storage_value })
          this.storage_ns_ratio.push({ storage: this.ns_list[i].storage, used_storage: this.ns_list[i].used_storage })
        }
        // 加载Echarts图表
        this.draw_cpu_ns()
        this.draw_gpu_ns()
        this.draw_memory_ns()
        this.draw_pvc_ns()
        this.draw_storage_ns()
      })
    },
    // 仪表盘数据
    totalNs: function(u_id) {
      totalNs(u_id).then((res) => {
        this.cpu_ratio = res.cpu_ratio
        // console.log(this.cpu_ratio)
        this.gpu_ratio = res.gpu_ratio
        this.memory_ratio = res.memory_ratio
        this.pvc_ratio = res.pvc_ratio
        this.storage_ratio = res.storage_ratio
        // 加载Echarts图表
        this.draw_cpu()
        this.draw_gpu()
        this.draw_memory()
        this.draw_pvc()
        this.draw_storage()
      })
    },
    // Echarts图表初始化
    draw_cpu() {
      var _this = this
      // 初始化Echarts实例
      const CPU = this.$echarts.init(document.getElementById('CPU'))
      // 绘制图表
      var option = {
        series: [
          {
            radius: '95%',
            center: ['50%', '55%'],
            type: 'gauge',
            axisLine: {
              lineStyle: {
                width: 20,
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
              length: 20, // 小区域距离
              lineStyle: {
                color: '#fff',
                width: 2
              }
            },
            splitLine: {
              distance: -30,
              length: 20, // 距离
              lineStyle: {
                color: '#fff',
                width: 20// 仪表盘不同区域的距离
              }
            },
            axisLabel: {
              color: 'inherit',
              distance: 33,
              fontSize: 10// 仪表盘一圈数字字号
            },
            detail: {
              valueAnimation: true,
              formatter: '{value} %',
              color: 'inherit',
              fontSize: 14
            },
            title: {
              valueAnimation: true,
              show: true
            },
            data: [
              {
                value: _this.cpu_ratio
              }
            ]
          }
        ]
      }
      setInterval(() => {
        // console.log("test")
        CPU.setOption({
          series: [
            {
              data: [
                {
                  value: ((Math.random() * 2 + _this.cpu_ratio)).toFixed(2) // 在实际数据附近波动显示
                }
              ]
            }
          ]
        })
      }, 2000)
      // 防止越界，重绘canvas
      window.onresize = CPU.resize
      CPU.setOption(option)// 设置option
    },
    draw_gpu() {
      var _this = this
      // 初始化Echarts实例
      const GPU = this.$echarts.init(document.getElementById('GPU'))
      // 绘制图表
      var option = {
        series: [
          {
            radius: '95%',
            center: ['50%', '55%'],
            type: 'gauge',
            axisLine: {
              lineStyle: {
                width: 20,
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
              length: 20, // 小区域距离
              lineStyle: {
                color: '#fff',
                width: 2
              }
            },
            splitLine: {
              distance: -30,
              length: 20, // 距离
              lineStyle: {
                color: '#fff',
                width: 20// 仪表盘不同区域的距离
              }
            },
            axisLabel: {
              color: 'inherit',
              distance: 33,
              fontSize: 10// 仪表盘一圈数字字号
            },
            detail: {
              valueAnimation: true,
              formatter: '{value} %',
              color: 'inherit',
              fontSize: 14
            },
            title: {
              valueAnimation: true,
              show: true
            },
            data: [
              {
                value: _this.gpu_ratio
              }
            ]
          }
        ]
      }
      setInterval(function() {
        GPU.setOption({
          series: [
            {
              data: [
                {
                  value: ((Math.random() * 2 + _this.gpu_ratio)).toFixed(2)
                }
              ]
            }
          ]
        })
      }, 2000)
      // 防止越界，重绘canvas
      window.onresize = GPU.resize
      GPU.setOption(option)// 设置option
    },
    draw_memory() {
      var _this = this
      // 初始化Echarts实例
      const Memory = this.$echarts.init(document.getElementById('Memory'))
      // 绘制图表
      var option = {
        series: [
          {
            radius: '95%',
            center: ['50%', '55%'],
            type: 'gauge',
            axisLine: {
              lineStyle: {
                width: 20,
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
              length: 20, // 小区域距离
              lineStyle: {
                color: '#fff',
                width: 2
              }
            },
            splitLine: {
              distance: -30,
              length: 20, // 距离
              lineStyle: {
                color: '#fff',
                width: 20// 仪表盘不同区域的距离
              }
            },
            axisLabel: {
              color: 'inherit',
              distance: 33,
              fontSize: 10// 仪表盘一圈数字字号
            },
            detail: {
              valueAnimation: true,
              formatter: '{value} %',
              color: 'inherit',
              fontSize: 14
            },
            title: {
              valueAnimation: true,
              show: true
            },
            data: [
              {
                value: _this.memory_ratio
              }
            ]
          }
        ]
      }
      setInterval(function() {
        Memory.setOption({
          series: [
            {
              data: [
                {
                  value: ((Math.random() * 2 + _this.memory_ratio)).toFixed(2)
                }
              ]
            }
          ]
        })
      }, 2000)
      // 防止越界，重绘canvas
      window.onresize = Memory.resize
      Memory.setOption(option)// 设置option
    },
    draw_pvc() {
      var _this = this
      // 初始化Echarts实例
      const Pvc = this.$echarts.init(document.getElementById('Pvc'))
      // 绘制图表
      var option = {
        series: [
          {
            radius: '95%',
            center: ['50%', '55%'],
            type: 'gauge',
            axisLine: {
              lineStyle: {
                width: 20,
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
              length: 20, // 小区域距离
              lineStyle: {
                color: '#fff',
                width: 2
              }
            },
            splitLine: {
              distance: -30,
              length: 20, // 距离
              lineStyle: {
                color: '#fff',
                width: 20// 仪表盘不同区域的距离
              }
            },
            axisLabel: {
              color: 'inherit',
              distance: 33,
              fontSize: 10// 仪表盘一圈数字字号
            },
            detail: {
              valueAnimation: true,
              formatter: '{value} %',
              color: 'inherit',
              fontSize: 14
            },
            title: {
              valueAnimation: true,
              show: true
            },
            data: [
              {
                value: _this.pvc_ratio
              }
            ]
          }
        ]
      }
      setInterval(function() {
        Pvc.setOption({
          series: [
            {
              data: [
                {
                  value: ((Math.random() * 2 + _this.pvc_ratio)).toFixed(2)
                }
              ]
            }
          ]
        })
      }, 2000)
      // 防止越界，重绘canvas
      window.onresize = Pvc.resize
      Pvc.setOption(option)// 设置option
    },
    draw_storage() {
      var _this = this
      // 初始化Echarts实例
      const Storage = this.$echarts.init(document.getElementById('Storage'))
      // 绘制图表
      var option = {
        series: [
          {
            radius: '95%',
            center: ['50%', '55%'],
            type: 'gauge',
            axisLine: {
              lineStyle: {
                width: 20,
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
              length: 20, // 小区域距离
              lineStyle: {
                color: '#fff',
                width: 2
              }
            },
            splitLine: {
              distance: -30,
              length: 20, // 距离
              lineStyle: {
                color: '#fff',
                width: 20// 仪表盘不同区域的距离
              }
            },
            axisLabel: {
              color: 'inherit',
              distance: 33,
              fontSize: 10// 仪表盘一圈数字字号
            },
            detail: {
              valueAnimation: true,
              formatter: '{value} %',
              color: 'inherit',
              fontSize: 14
            },
            title: {
              valueAnimation: true,
              show: true
            },
            data: [
              {
                value: _this.storage_ratio
              }
            ]
          }
        ]
      }
      setInterval(function() {
        Storage.setOption({
          series: [
            {
              data: [
                {
                  value: ((Math.random() * 2 + _this.storage_ratio)).toFixed(2)
                }
              ]
            }
          ]
        })
      }, 2000)
      // 防止越界，重绘canvas
      window.onresize = Storage.resize
      Storage.setOption(option)// 设置option
    },
    draw_cpu_ns() {
      var _this = this
      // 初始化Echarts实例
      const CPU_NS = this.$echarts.init(document.getElementById('CPU_NS'))
      // 绘制图表
      var option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove|click',
          confine: true,
          textStyle: {
            align: 'left'
          },
          // formatter: '工作空间: {b} <br/> 已用/配额: ' + _this.cpu_ns_ratio.cpu + '/' + _this.cpu_ns_ratio.used_cpu
          // formatter: function(_this, cpu_ns_ratio) {
          //   return '工作空间: {b} <br/> 已用/配额: ' + cpu_ns_ratio.cpu + '/' + cpu_ns_ratio.used_cpu
          // }
          formatter: function(data) {
            // console.log(data)
            var Name = data.name.split('-')[0]
            return '工作空间：' + Name + '<br/>' + '已经使用：' + data.value + '</br>' + '占已使用的：' + data.percent.toFixed(1) + '%'
          }
        },
        legend: { // 图例
          show: false,
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center',
              fontSize: 15
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold'
              }
            },
            labelLine: { // 引导线
              show: false
            },
            data: _this.cpu_ns_list
          }
        ]
      }

      /*
       * 获取属于当前用户全部类型的工作空间，每次页面刷新即可重新获取。不需要动态获取*/
      // setInterval(() => {
      //   // console.log("test")
      //   CPU_NS.setOption({
      //     series: [
      //       {
      //         data: _this.cpu_ns_list
      //       }
      //     ]
      //   })
      // }, 2000)

      // 防止越界，重绘canvas
      window.onresize = CPU_NS.resize
      CPU_NS.setOption(option)// 设置option
    },
    draw_gpu_ns() {
      var _this = this
      // 初始化Echarts实例
      const GPU_NS = this.$echarts.init(document.getElementById('GPU_NS'))
      // 绘制图表
      var option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove|click',
          confine: true,
          textStyle: {
            align: 'left'
          },
          formatter: function(data) {
            var Name = data.name.split('-')[0]
            return '工作空间：' + Name + '<br/>' + '已经使用：' + data.value + '</br>' + '占已使用的：' + data.percent.toFixed(1) + '%'
          }
        },
        legend: {
          show: false,
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center',
              fontSize: 15
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: _this.gpu_ns_list
          }
        ]
      }

      // setInterval(() => {
      //   // console.log("test")
      //   CPU_NS.setOption({
      //     series: [
      //       {
      //         data: _this.gpu_ns_list
      //       }
      //     ]
      //   })
      // }, 2000)

      // 防止越界，重绘canvas
      window.onresize = GPU_NS.resize
      GPU_NS.setOption(option)// 设置option
    },
    draw_memory_ns() {
      var _this = this
      // 初始化Echarts实例
      const Memory_NS = this.$echarts.init(document.getElementById('Memory_NS'))
      // 绘制图表
      var option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove|click',
          confine: true,
          textStyle: {
            align: 'left'
          },
          formatter: function(data) {
            var Name = data.name.split('-')[0]
            return '工作空间：' + Name + '<br/>' + '已经使用：' + data.value + '</br>' + '占已使用的：' + data.percent.toFixed(1) + '%'
          }
        },
        legend: {
          show: false,
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center',
              fontSize: 15
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: _this.memory_ns_list
          }
        ]
      }

      // setInterval(() => {
      //   // console.log("test")
      //   CPU_NS.setOption({
      //     series: [
      //       {
      //         data: _this.memory_ns_list
      //       }
      //     ]
      //   })
      // }, 2000)

      // 防止越界，重绘canvas
      window.onresize = Memory_NS.resize
      Memory_NS.setOption(option)// 设置option
    },
    draw_pvc_ns() {
      var _this = this
      // 初始化Echarts实例
      const Pvc_NS = this.$echarts.init(document.getElementById('Pvc_NS'))
      // 绘制图表
      var option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove|click',
          confine: true,
          textStyle: {
            align: 'left'
          },
          formatter: function(data) {
            var Name = data.name.split('-')[0]
            return '工作空间：' + Name + '<br/>' + '已经使用：' + data.value + '</br>' + '占已使用的：' + data.percent.toFixed(1) + '%'
          }
        },
        legend: {
          show: false,
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center',
              fontSize: 15
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: _this.pvc_ns_list
          }
        ]
      }

      // setInterval(() => {
      //   // console.log("test")
      //   CPU_NS.setOption({
      //     series: [
      //       {
      //         data: _this.pvc_ns_list
      //       }
      //     ]
      //   })
      // }, 2000)

      // 防止越界，重绘canvas
      window.onresize = Pvc_NS.resize
      Pvc_NS.setOption(option)// 设置option
    },
    draw_storage_ns() {
      var _this = this
      // 初始化Echarts实例
      const Storage_NS = this.$echarts.init(document.getElementById('Storage_NS'))
      // 绘制图表
      var option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove|click',
          confine: true,
          textStyle: {
            align: 'left'
          },
          formatter: function(data) {
            var Name = data.name.split('-')[0]
            return '工作空间：' + Name + '<br/>' + '已经使用：' + data.value + '</br>' + '占已使用的：' + data.percent.toFixed(1) + '%'
          }
        },
        legend: {
          show: false,
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center',
              fontSize: 15
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: _this.storage_ns_list
          }
        ]
      }

      // setInterval(() => {
      //   // console.log("test")
      //   CPU_NS.setOption({
      //     series: [
      //       {
      //         data: _this.storage_ns_list
      //       }
      //     ]
      //   })
      // }, 600000)

      // 防止越界，重绘canvas
      window.onresize = Storage_NS.resize
      Storage_NS.setOption(option)// 设置option
    }
  }
}
</script>
