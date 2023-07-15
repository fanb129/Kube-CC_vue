<template>
  <div class="monitor">
    <div class="selector">
      <!-- <GroupSelector ref="GroupSelector" :default-uid="adid" @nsList="changeGid" />
      <UserSelector ref="UserSelector" :default-gid="gid" :default-uid="uid" @nsList="changeUid" /> -->
      <p>这是超管按钮的地方</p>
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
import { getNsList, getUserNsTotal } from '@/api/namespace'
// import UserSelector from '@/components/Selector/UserSelector'
// import GroupSelector from '@/components/Selector/GroupSelector.vue'

export default {
  // components: { UserSelector, GroupSelector },
  data() {
    return {
      // 饼图
      uid: '',
      ns_length: '',
      ns_list: [],
      cpu_ns_list: [],
      gpu_ns_list: [],
      memory_ns_list: [],
      pvc_ns_list: [],
      storage_ns_list: [],
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
          this.getUserNsTotal(this.uid)
          this.draw_cpu()
          this.draw_gpu()
          this.draw_memory()
          this.draw_pvc()
          this.draw_storage()
        })
        this.cur_res_ns.forEach(_ => {
          this.getNsList(this.uid)
          this.draw_cpu_ns()
          this.draw_gpu_ns()
          this.draw_memory_ns()
          this.draw_pvc_ns()
          this.draw_storage_ns()
        })
      }, 500)
    },
    draw_cpu() {
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
                value: 70
              }
            ]
          }
        ]
      }
      setInterval(function() {
        CPU.setOption({
          series: [
            {
              data: [
                {
                  value: +(Math.random() * 100).toFixed(2)
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
                value: 70,
                name: GPU
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
                  value: +(Math.random() * 100).toFixed(2)
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
                value: 70,
                name: Memory
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
                  value: +(Math.random() * 100).toFixed(2)
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
                value: 70,
                name: Pvc
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
                  value: +(Math.random() * 100).toFixed(2)
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
                value: 70,
                name: Storage
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
                  value: +(Math.random() * 100).toFixed(2)
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
      // 初始化Echarts实例
      const CPU_NS = this.$echarts.init(document.getElementById('CPU_NS'))
      // 绘制图表
      var option = {
        tooltip: {
          trigger: 'item'
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
            data: this.cpu_ns_list
            // data: [
            //   { value: 1048, name: 'Search Engine' },
            //   { value: 735, name: 'Direct' },
            //   { value: 580, name: 'Email' },
            //   { value: 484, name: 'Union Ads' },
            //   { value: 300, name: 'Video Ads' }
            // ]
          }
        ]
      }
      // 防止越界，重绘canvas
      window.onresize = CPU_NS.resize
      CPU_NS.setOption(option)// 设置option
    },
    draw_gpu_ns() {
      // 初始化Echarts实例
      const GPU_NS = this.$echarts.init(document.getElementById('GPU_NS'))
      // 绘制图表
      var option = {
        tooltip: {
          trigger: 'item'
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
            data: this.gpu_ns_list
            // data: [
            //   { value: 1048, name: 'Search Engine' },
            //   { value: 735, name: 'Direct' },
            //   { value: 580, name: 'Email' },
            //   { value: 484, name: 'Union Ads' },
            //   { value: 300, name: 'Video Ads' }
            // ]
          }
        ]
      }
      // 防止越界，重绘canvas
      window.onresize = GPU_NS.resize
      GPU_NS.setOption(option)// 设置option
    },
    draw_memory_ns() {
      // 初始化Echarts实例
      const Memory_NS = this.$echarts.init(document.getElementById('Memory_NS'))
      // 绘制图表
      var option = {
        tooltip: {
          trigger: 'item'
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
            data: this.memory_ns_list
            // data: [
            //   { value: 1048, name: 'Search Engine' },
            //   { value: 735, name: 'Direct' },
            //   { value: 580, name: 'Email' },
            //   { value: 484, name: 'Union Ads' },
            //   { value: 300, name: 'Video Ads' }
            // ]
          }
        ]
      }
      // 防止越界，重绘canvas
      window.onresize = Memory_NS.resize
      Memory_NS.setOption(option)// 设置option
    },
    draw_pvc_ns() {
      // 初始化Echarts实例
      const Pvc_NS = this.$echarts.init(document.getElementById('Pvc_NS'))
      // 绘制图表
      var option = {
        tooltip: {
          trigger: 'item'
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
            data: this.pvc_ns_list
            // data: [
            //   { value: 1048, name: 'Search Engine' },
            //   { value: 735, name: 'Direct' },
            //   { value: 580, name: 'Email' },
            //   { value: 484, name: 'Union Ads' },
            //   { value: 300, name: 'Video Ads' }
            // ]
          }
        ]
      }
      // 防止越界，重绘canvas
      window.onresize = Pvc_NS.resize
      Pvc_NS.setOption(option)// 设置option
    },
    draw_storage_ns() {
      // 初始化Echarts实例
      const Storage_NS = this.$echarts.init(document.getElementById('Storage_NS'))
      // 绘制图表
      var option = {
        tooltip: {
          trigger: 'item'
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
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ]
          }
        ]
      }
      // 防止越界，重绘canvas
      window.onresize = Storage_NS.resize
      Storage_NS.setOption(option)// 设置option
    },
    // changeGid: function(g_id) {
    //   this.gid = g_id
    //   this.$refs.UserSelector.u_id = ''
    //   this.$refs.UserSelector.g_id = this.gid
    //   this.$refs.UserSelector.getUserList()
    // },
    // changeUid: function(u_id) {
    //   this.uid = u_id
    //   this.$refs.NsSelector.u_id = this.uid
    //   this.$refs.NsSelector.getNsList()
    //   this.getDeployList()
    // },
    // 饼图数据
    getNsList: function(u_id) {
      getNsList(u_id).then((res) => {
        this.ns_length = res.length
        // console.log(this.ns_length)
        for (let i = 0; i < this.ns_length; i++) {
          this.ns_list.push(res.ns_list[i])
        }
        for (let i = 0; i < this.ns_length; i++) {
          this.cpu_ns_list.push({ name: this.ns_list[i].Name, value: this.ns_list[i].Resources.UsedCpuValue })
        }
        // console.log(JSON.parse(JSON.stringify(this.cpu_ns_list)))
        for (let i = 0; i < this.ns_length; i++) {
          this.gpu_ns_list.push({ name: this.ns_list[i].Name, value: this.ns_list[i].Resources.UsedCpuValue })
        }
        for (let i = 0; i < this.ns_length; i++) {
          this.memory_ns_list.push({ name: this.ns_list[i].Name, value: this.ns_list[i].Resources.UsedCpuValue })
        }
        for (let i = 0; i < this.ns_length; i++) {
          this.pvc_ns_list.push({ name: this.ns_list[i].Name, value: this.ns_list[i].Resources.UsedCpuValue })
        }
        for (let i = 0; i < this.ns_length; i++) {
          this.storage_ns_list.push({ name: this.ns_list[i].Name, value: this.ns_list[i].Resources.UsedCpuValue })
        }
      })
    },
    // 仪表盘数据
    getUserNsTotal: function(u_id) {
      getUserNsTotal(u_id).then((res) => {

      })
    }
  }
}
</script>