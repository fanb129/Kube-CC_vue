<template>
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body width="600px">
    <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
      <el-form-item label="Master">
        <el-input-number v-model="form.master_replicas" :min="1" :max="3" style="width: 300px" placeholder="范围：1-3之间" @change="change" />
      </el-form-item>
      <el-form-item label="Worker">
        <el-input-number v-model="form.worker_replicas" :min="2" :max="10" style="width: 300px" placeholder="范围：2-10之间" @change="change" />
      </el-form-item>
      <el-form-item label="name" prop="name" style="width: 400px">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="CPU" prop="cpu" style="width: 400px">
        <el-input v-model="form.cpu" placeholder="示例:5" />
      </el-form-item>
      <el-form-item label="memory" prop="memory" style="width: 400px">
        <el-input v-model="form.memory" placeholder="示例:10Gi" />
      </el-form-item>
      <el-form-item label="storage" prop="memory" style="width: 400px">
        <el-input v-model="form.storage" placeholder="示例:10Gi" />
      </el-form-item>
      <el-form-item label="pvc" prop="memory" style="width: 400px">
        <el-input v-model="form.pvc" placeholder="示例:10Gi" />
      </el-form-item>
      <el-form-item label="gpu" prop="memory" style="width: 400px">
        <el-input v-model="form.gpu" placeholder="示例:5Gi" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">更新</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { infoSpark, updateSpark } from '@/api/app/spark'
import { mapGetters } from 'vuex'

export default {
  name: 'UpdateSpark',
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  data() {
    return {
      // 弹出层标题
      title: '更新 Spark',
      // 是否显示弹出层
      open: false,
      userPage: 1,
      userTotal: 0,
      /* options: [{
        id: '',
        role: '',
        username: '',
        nickname: ''
      }],*/
      u_id: this.u_id,
      form: {
        name: '',
        cpu: '',
        memory: '',
        storage: '',
        pvc: '',
        gpu: '',
        master_replicas: '',
        worker_replicas: '',
        expired_time: ''
      },
      formRules: {
        name: [{ required: true, trigger: 'blur' }],
        // u_id: [{ required: true, trigger: 'blur' }],
        cpu: [{ required: true, trigger: 'blur' }],
        memory: [{ required: true, trigger: 'blur' }],
        storage: [{ required: true, trigger: 'blur' }],
        pvc: [{ required: true, trigger: 'blur' }],
        gpu: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  methods: {
    init(name, uid, master, worker, cpu, memory, storage, pvc, gpu) {
      this.form.name = name
      this.form.master_replicas = master
      this.form.worker_replicas = worker
      this.form.cpu = cpu
      this.form.memory = memory
      this.form.storage = storage
      this.form.pvc = pvc
      this.form.gpu = gpu
      this.open = true
      this.$nextTick(() => {
        this.form.name = name
        this.form.master_replicas = master
        this.form.worker_replicas = worker
        this.form.cpu = cpu
        this.form.memory = memory
        this.form.storage = storage
        this.form.pvc = pvc
        this.form.gpu = gpu
        this.open = true
      })
    },

    info(name) {
      infoSpark(name).then(res => {
        this.form = res.Form
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    onSubmit() {
      console.log('submit!')
      this.$refs.form.validate(valid => {
        if (valid) {
          updateSpark({
            name: this.form.name,
            u_id: parseInt(this.form.u_id),
            master_replicas: parseInt(this.form.master_replicas),
            worker_replicas: parseInt(this.form.worker_replicas),
            cpu: this.form.cpu,
            memory: this.form.memory,
            storage: this.form.storage,
            pvc: this.form.pvc,
            gpu: this.form.gpu
          }).then((res) => {
            if (res.code === 1) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.open = false
              // 调用主页面的getNsList方法刷新主页面
              this.$parent.getSparkList()
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
    /*    changeUserPageNum: function(val) {
      this.userPage = val
      this.getUserList()
    },
    getUserList: function() {
      getUserList(this.userPage).then((res) => {
        this.userPage = res.page
        this.userTotal = parseInt(res.total / 10) + (res.total % 10 === 0 ? 0 : 1)
        this.options = res.user_list
        this.options.push({ nickname: '', id: '0', username: 'Null', role: 0 })
        // console.log(res)
      })
    },*/
    change() {
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped>

</style>
