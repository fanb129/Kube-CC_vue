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
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getUserList } from '@/api/user'
import {addSpark, infoSpark, updateSpark} from '@/api/app/spark'
import { mapGetters } from 'vuex'

export default {
  name: 'AddSpark',
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  created() {
    this.form.u_id = this.u_id
  },
  data() {
    return {
      // 弹出层标题
      title: '创建 Spark',
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
      form: {
        u_id: '',
        name: '',
        cpu: '',
        memory: '',
        storage: '',
        pvc: '',
        master_replicas: '',
        worker_replicas: '',
        // expired_time: ''
      },
      formRules: {
        name: [{ required: true, trigger: 'blur' }],
        // u_id: [{ required: true, trigger: 'blur' }],
        cpu: [{ required: true, trigger: 'blur' }],
        memory: [{ required: true, trigger: 'blur' }],
        storage: [{ required: true, trigger: 'blur' }],
        pvc: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  methods: {
    init() {
      this.open = true
      this.$nextTick(() => {
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
          addSpark({
            u_id: this.form.u_id+'',
            name: this.form.name,
            cpu: this.form.cpu,
            memory: this.form.memory,
            storage: this.form.storage,
            pvc: this.form.pvc,
            master_replicas: parseInt(this.form.master_replicas),
            worker_replicas: parseInt(this.form.worker_replicas),
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
    change() {
      this.$forceUpdate()
    }

  }
}
</script>

<style scoped>

</style>
