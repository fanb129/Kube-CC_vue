<template>
  <div>
    <yaml-editor v-model="yamlValue" :read-only="false" style="height: 88vh" />
    <div>
      <el-button type="primary" @click="applyYaml">apply</el-button>
      <el-button type="primary" @click="createYaml">create</el-button>
    </div>
  </div>
</template>

<script>
import YamlEditor from '@/components/YamlEditor/index.vue';
import {applyYaml, createYaml } from "@/api/yaml";
import {yaml2json} from "@/utils/yaml";

export default {
  name: 'YamlEditorDemo',
  components: { YamlEditor },
  data() {
    return {
      yamlValue: '',
    };
  },
  methods:{
    applyYaml() {
      console.log(yaml2json(this.yamlValue,false).data)
      applyYaml({yaml: yaml2json(this.yamlValue,false).data}).then(res => {
        if (res.code === 1) {
          this.$message({
            type: 'success',
            message: res.msg
          })
        }
      })
    },
    createYaml(){
      console.log(this.yamlValue)
      createYaml({yaml: yaml2json(this.yamlValue,false).data}).then(res => {
        if (res.code === 1) {
          this.$message({
            type: 'success',
            message: res.msg
          })
        }
      })
    }
  }
};
</script>

