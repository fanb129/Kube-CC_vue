<template>
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body width="600px">
    <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" style="width: 400px" />
      </el-form-item>
      <el-form-item label='CPU' prop="cpu">
        <el-input v-model="form.cpu" placeholder="示例:5"></el-input>
      </el-form-item>
      <el-form-item label='内存' prop="memory">
        <el-input v-model="form.memory" placeholder="示例:10Gi"></el-input>
      </el-form-item>
      <el-form-item label='存储' prop="storage">
        <el-input v-model="form.storage" placeholder="示例:20Gi"></el-input>
      </el-form-item>
      <el-form-item label='持久存储' prop="pvc_storage">
        <el-input v-model="form.pvc_storage" placeholder="示例:20Gi"></el-input>
      </el-form-item>
      <el-form-item label='Gpu' prop="gpu">
        <el-input v-model="form.gpu" placeholder="示例:5Gi"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">更新</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { updateNs } from '@/api/namespace'

export default {
  name: 'AddNamespace',
  data() {
    return {
      // 弹出层标题
      title: '工作空间',
      // 是否显示弹出层
      open: false,
      form: {
        name: '',
        cpu: '',
        memory: '',
        storage: '',
        pvc_storage: '',
        gpu: ''
      },
      formRules: {
        name: [{ required: true, trigger: 'blur' }],
        // u_id: [{ required: true, trigger: 'blur' }],
        cpu: [{ required: true, trigger: 'blur' }],
        memory: [{ required: true, trigger: 'blur' }],
        storage: [{ required: true, trigger: 'blur' }],
        pvc_storage: [{ required: true, trigger: 'blur' }],
        gpu: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  methods: {
    init(name,cpu,memory,storage,pvc_storage,gpu) {
      this.open = true
      this.form.name = name
      this.form.cpu = cpu
      this.form.memory = memory
      this.form.storage = storage
      this.form.pvc_storage = pvc_storage
      this.form.gpu = gpu
      this.$nextTick(() => {
        this.open = true
        this.form.name = name
        this.form.cpu = cpu
        this.form.memory = memory
        this.form.storage = storage
        this.form.pvc_storage = pvc_storage
        this.form.gpu = gpu
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
          updateNs({
            name: this.form.name,
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
    },
  }
}
</script>

<style scoped>

</style>
