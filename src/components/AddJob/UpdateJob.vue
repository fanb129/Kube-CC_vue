<template>
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body width="60%">
    <dynamic-form
      ref="dynamic-form"
      v-model="form"
      :descriptors="descriptors"
    >
      <template slot="operations">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" plain @click="resetFields">重置</el-button>
        <el-button type="primary" @click="validate">提交</el-button>
      </template>
    </dynamic-form>
  </el-dialog>
</template>

<script>
import NsSelectorNoNil from '@/components/Selector/NsSelectorNoNil'
// import UserSelectorNoNil from '@/components/Selector/UserSelectorNoNil'
import { mapGetters } from 'vuex'
import {addJob, infoJob} from "@/api/app/job";

export default {
  name: 'UpdateDeploy',
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  data: function() {
    return {
      descriptors: {
        name: { type: 'string', disabled: true },
        namespace: { type: 'string', disabled: true },
        completions: { type: 'integer', required: true, min: 1 },
        parallelism: { type: 'integer', required: true, min: 1 },
        image: { type: 'string', required: true },
        command: { type: 'array', defaultField: { type: 'string'}},
        args: { type: 'array', defaultField: { type: 'string'}},
      },
      ns: '',
      name: '',
      // 弹出层标题
      title: '一次性应用',
      // 是否显示弹出层
      open: false,
      form: {
        name: '',
        namespace: '',
        completions: 0,
        parallelism: 0,
        image: '',
        command:[],
        args: [],
      }
    }
  },
  methods: {
    resetFields() {
      this.$refs['dynamic-form'].resetFields()
    },
    async validate() {
      const valid = await this.$refs['dynamic-form'].validate()
      if (this.form.namespace !== '' && valid) {
        addJob(this.form).then(res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.open = false
            // 调用主页面的方法刷新主页面
            // this.$parent.get()
            this.$parent.getDeployList()
          }
        })
      } else {
        this.$message.error('请完整填写表单')
      }
    },
    init(ns, name) {
      this.open = true
      this.$nextTick(() => {
        this.info(ns,name)
        this.open = true
      })
    },
    info(ns,name){
      infoJob(ns,name).then(res => {
        this.form = res.Form
      })
    },
    // 取消按钮
    cancel() {
      this.resetFields()
      this.open = false
      // this.reset()
    }
  }
}
</script>

<style scoped>

</style>
