<template>
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body width="600px">
    <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" style="width: 400px" />
      </el-form-item>
      <el-form-item label="uid" prop="uid">
        <el-input v-model="form.u_id" style="width: 400px" />
      </el-form-item>
      <el-form-item label="CPU" prop="cpu">
        <el-input v-model="form.cpu" placeholder="示例:5" style="width: 200px"/>
      </el-form-item>
      <el-form-item label="内存" prop="memory">
        <el-input v-model="form.memory" placeholder="示例:10Gi" style="width: 200px" /> Gi
      </el-form-item>
      <el-form-item label="存储" prop="storage">
        <el-input v-model="form.storage" placeholder="示例:20Gi" style="width: 200px"/> Gi
      </el-form-item>
      <el-form-item label="持久存储" prop="pvc_storage">
        <el-input v-model="form.pvc_storage" placeholder="示例:20Gi" style="width: 200px"/> Gi
      </el-form-item>
      <el-form-item label="Gpu" prop="gpu">
        <el-input v-model="form.gpu" placeholder="示例:5Gi" style="width: 200px"/> Gi
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { addNs } from '@/api/namespace'
import { mapGetters } from 'vuex'

export default {
  name: 'AddNamespace',
  computed: {
    ...mapGetters([
      'u_id'
    ])
  },
  data() {
    return {
      // 弹出层标题
      title: '工作空间',
      // 是否显示弹出层
      open: false,
      form: {
        u_id: this.u_id,
        name: '',
        cpu: '',
        memory: '',
        storage: '',
        pvc_storage: '',
        gpu: ''
      },
      formRules: {
        name: [{ required: true, trigger: 'blur' }],
        u_id: [{ required: true, trigger: 'blur' }],
        cpu: [{ required: true, trigger: 'blur' }],
        memory: [{ required: true, trigger: 'blur' }],
        storage: [{ required: true, trigger: 'blur' }],
        pvc_storage: [{ required: true, trigger: 'blur' }],
        gpu: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  methods: {
    created() {
      this.form.u_id = this.u_id
    },
    init() {
      this.open = true
      this.$nextTick(() => {
        this.getUserList()
        this.open = true
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    onSubmit: function() {
      console.log('submit!')
      this.$refs.form.validate(valid => {
        if (valid) {
          addNs({
            name: this.form.name,
            u_id: parseInt(this.form.u_id),
            cpu: this.form.cpu,
            memory: this.form.memory,
            storage: this.form.storage,
            pvc_storage: this.form.pvc_storage,
            gpu: this.form.gpu
          }).then((res) => {
            if (res.code === 1) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.open = false
              // 调用主页面的getNsList方法刷新主页面
              this.$parent.getNsList()
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
