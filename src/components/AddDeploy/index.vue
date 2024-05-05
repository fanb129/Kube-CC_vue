<template>
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body width="60%">
    <!--    <el-form ref="service" :model="service" label-width="100px">-->
    <!--      <span>Metadata</span>-->
    <!--      <el-form-item label="Name">-->
    <!--        <el-input v-model="service.metadata.name"></el-input>-->
    <!--      </el-form-item>-->
    <!--    &lt;!&ndash;      <el-form-item label="Namespace">&ndash;&gt;-->
    <div style="margin-bottom: 10px">
      <NsSelectorNoNil ref="NsSelector" v-model="form.namespace" :default-uid="uid" :default-ns="ns" @nsList="changeNs" style="margin-right: 50px"/>
      <ImageSelector ref="ImageSelector" v-model="form.image" @nsList="changeImage" />
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
import ImageSelector from '@/components/Selector/ImageSelector';
// import UserSelectorNoNil from '@/components/Selector/UserSelectorNoNil'
import { mapGetters } from 'vuex'
import { addDeploy } from '@/api/app/deploy'

export default {
  name: 'AddDeploy',
  components: { NsSelectorNoNil,ImageSelector },
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  data: function() {
    return {
      descriptors: {
        name: { type: 'string', required: true, label: '应用名称' },
        replicas: { type: 'integer', required: true, min: 1, label: '开发环境数' },
        // image: { type: 'string', required: true },
        command: { type: 'array', defaultField: { type: 'string' }, label: '命令'},
        args: { type: 'array', defaultField: { type: 'string' }, label: '参数'},
        ports: { type: 'array', defaultField: { type: 'integer' }, label: '端口'},
        env: {
          type: 'object',
          defaultField: { type: 'string', required: true },
          label: '环境变量'
        },
        cpu: { type: 'string', required: true },
        memory: { type: 'string', required: true, label: '内存' },
        storage: { type: 'string', required: true, label: '临时存储' },
        pvc_storage: { type: 'string', label: '永久存储' },
        storage_class_name: { type: 'string' },
        gpu: { type: 'string' }
      },
      ns: '',
      uid: '',
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
        addDeploy(this.form).then(res => {
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
    changeNs: function(ns) {
      this.ns = ns
      this.form.namespace = ns
    },
    changeImage: function(image) {
      this.form.image = image
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
      // this.reset()
    }
  }
}
</script>

<style scoped>

</style>
