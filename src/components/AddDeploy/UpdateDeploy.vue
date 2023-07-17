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
// eslint-disable-next-line no-unused-vars
import NsSelectorNoNil from '@/components/Selector/NsSelectorNoNil'
// import UserSelectorNoNil from '@/components/Selector/UserSelectorNoNil'
import { mapGetters } from 'vuex'
import { infoDeploy, updateDeploy } from '@/api/app/deploy'

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
        replicas: { type: 'integer', required: true, min: 1 },
        image: { type: 'string', required: true },
        command: { type: 'array', defaultField: { type: 'string' }},
        args: { type: 'array', defaultField: { type: 'string' }},
        ports: { type: 'array', defaultField: { type: 'integer' }},
        env: {
          type: 'object',
          defaultField: { type: 'string', required: true }
        },
        cpu: { type: 'string', required: true },
        memory: { type: 'string', required: true },
        storage: { type: 'string', required: true },
        pvc_storage: { type: 'string' },
        storage_class_name: { type: 'string' },
        gpu: { type: 'string' }
      },
      ns: '',
      name: '',
      // 弹出层标题
      title: '无状态应用',
      // 是否显示弹出层
      open: false,
      form: {
        name: '',
        namespace: '',
        replicas: 0,
        image: '',
        command: [],
        args: [],
        ports: [],
        env: {},
        cpu: '',
        memory: '',
        storage: '',
        pvc_storage: '',
        storage_class_name: '',
        gpu: ''
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
        updateDeploy(this.form).then(res => {
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
        this.info(ns, name)
        this.open = true
      })
    },
    info(ns, name) {
      infoDeploy(ns, name).then(res => {
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
