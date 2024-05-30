<template>
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body width="60%">
    <div>
      <NsSelectorNoNil ref="NsSelector" v-model="form.namespace" :default-uid="uid" :default-ns="ns" @nsList="changeNs" />
    </div>

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
import { addStatefulSet } from '@/api/app/statefulSet'
import { mapGetters } from 'vuex'

export default {
  name: 'AddStatefulSet',
  components: { NsSelectorNoNil },
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  data: function() {
    return {
      descriptors: {
        name: { type: 'string', required: true },
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
      uid: '',
      title: '有状态应用',
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
      if (this.form.metadata.namespace !== '' && valid) {
        addStatefulSet(this.form).then(res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.open = false
            this.$parent.getStatefulSetList()
          }
        })
      } else {
        this.$message.error('请完整填写表单')
      }
    },
    changeNs: function(ns) {
      this.ns = ns
      this.form.namespace = ns
    },
    init() {
      this.open = true
      this.$nextTick(() => {
        this.$refs.NsSelector.u_id = this.u_id
        this.$refs.NsSelector.getNsList()
        this.open = true
      })
    },
    // 取消按钮
    cancel() {
      this.resetFields()
      this.open = false
    }
  }
}
</script>

<style scoped>

</style>
