<template>
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body width="60%">
    <yaml-editor v-model="yamlValue" :read-only="readOnly" style="height: 43vh; margin-bottom: 1%;"></yaml-editor>
    <div>
      <el-button type="primary" @click="createYaml">Create</el-button>
      <el-button @click="cancel">Cancel</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {yaml2json} from "@/utils/yaml";
import { createYaml } from "@/api/yaml";
import YamlEditor from '@/components/YamlEditor/index.vue';


export default {
  name: 'YamlCreate',
  components: {YamlEditor},
  props: ['kind'],
  data() {
    return {
      readOnly: false,
      yamlValue: '',
      // 弹出层标题
      title: 'Add ' + this.kind + ' Yaml',
      // 是否显示弹出层
      open: false,
    }
  },
  methods: {
    init() {
      this.open = true
      // this.$nextTick(() => {
      //   this.open = true
      // })
    },
    // 取消按钮
    cancel() {
      this.open = false
      // this.reset()
    },
    createYaml(){
      console.log(this.yamlValue)
      createYaml({yaml: yaml2json(this.yamlValue,false).data}).then(res => {
        if (res.code === 1) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.open = false
          // 调用主页面的方法刷新主页面
          // this.$parent.get()
          if (this.kind === 'Deploy'){
            this.$parent.getDeployList()
          } else if (this.kind === 'Service'){
            this.$parent.getServiceList()
          } else if (this.kind === 'Pod'){
            this.$parent.getPodList()
          }
          this.yamlValue = ''
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
