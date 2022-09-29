<template>
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body width="60%">
    <span style="color: red; text-align: center; font-size: large">只允许修改spec内容，切勿修改labels标签!!!</span>
    <yaml-editor v-model="yamlValue" :read-only="readOnly" style="height: 43vh; margin-bottom: 1%;"></yaml-editor>
    <div>
<!--      <el-button type="primary" @click="changeRead">Edit</el-button>-->
      <el-button type="primary" @click="applyYaml">Apply</el-button>
      <el-button @click="cancel">Cancel</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {yaml2json, json2yaml} from "@/utils/yaml";
import { applyYaml, createYaml } from "@/api/yaml";
import YamlEditor from '@/components/YamlEditor/index.vue';
import {getPodYaml} from "@/api/pod";
import {getDeployYaml} from "@/api/deploy";
import {getServiceYaml} from "@/api/service";

export default {
  name: 'YamlApply',
  components: {YamlEditor},
  props: ['name', 'ns', 'kind'],
  data() {
    return {
      readOnly: false,
      yamlValue: '',
      // 弹出层标题
      title: this.kind + ' Yaml',
      // 是否显示弹出层
      open: false,
    }
  },
  methods: {
    init() {
      this.getYaml(this.kind)
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
    // changeRead() {
    //   this.readOnly = false
    // },
    getYaml(kind) {
      if (kind === 'Deploy'){
        getDeployYaml(this.name,this.ns).then(res => {
          const jsonValue = res.info
          jsonValue['kind'] = this.kind
          this.yamlValue = json2yaml(jsonValue).data
        })
      } else if (kind === 'Service'){
        getServiceYaml(this.name,this.ns).then(res => {
          const jsonValue = res.info
          jsonValue['kind'] = this.kind
          this.yamlValue = json2yaml(jsonValue).data
        })
      } else if (kind === 'Pod'){
        getPodYaml(this.name, this.ns).then(res => {
          const jsonValue = res.info
          jsonValue['kind'] = this.kind
          this.yamlValue = json2yaml(jsonValue).data
        })
      }
    },
    applyYaml() {
      console.log(yaml2json(this.yamlValue,false).data)
      applyYaml({yaml: yaml2json(this.yamlValue,false).data,kind: this.kind,name: this.name, ns: this.ns}).then(res => {
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
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
