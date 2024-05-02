<template>
  <el-drawer
    :title="title"
    :visible.sync="open"
    direction="btt"
  >
    <div class="drawer-content">
      {{ log }}
    </div>
  </el-drawer>
</template>

<script>

import { podLog } from '@/api/pod'

export default {
  name: 'PodLog',
  data() {
    return {
      // 弹出层标题
      title: 'Log',
      // 是否显示弹出层
      open: false,
      ns: '',
      name: '',
      log: ''
    }
  },
  methods: {
    init(ns,name) {
      this.open = true
      this.$nextTick(() => {
        this.getPodLog(ns,name)
        this.open = true
      })
    },
    getPodLog(ns,name){
      podLog(ns,name).then((res) => {
        this.log = res.log
        this.name = res.name
        this.ns = res.ns
        this.title = this.name + '-Log'
      })
    }
  }
}
</script>

<style>
.drawer-content {
  overflow-y: auto;
  white-space: pre-wrap;
  height: 400px;
}
</style>
