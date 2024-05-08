<template>
  <el-drawer
    :title="title"
    :visible.sync="open"
    direction="ltr"
  >
    <p class="drawer-content">
      {{ log }}
    </p>
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
  overflow-x: auto;
  white-space: pre-wrap;
  max-height: 98vh;
  /*max-width: 50vh;*/
  width: auto;
  margin-bottom: 2vh;
}
</style>
