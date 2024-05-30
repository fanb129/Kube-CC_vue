<template>
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body width="600px">
    <el-form ref="form" :model="form" :rules="formRules" label-width="100px ">
      <el-form-item label="HdfsMaster">
        <el-input-number v-model="form.hdfs_master_replicas" :min="1" :max="3" style="width: 240px" placeholder="范围：1-3之间" @change="change" />
      </el-form-item>
      <el-form-item label="Datanode">
        <el-input-number v-model="form.datanode_replicas" :min="2" :max="10" style="width: 240px" placeholder="范围：2-10之间" @change="change" />
      </el-form-item>
      <el-form-item label="YarnMaster">
        <el-input-number v-model="form.yarn_master_replicas" :min="1" :max="3" style="width: 240px" placeholder="范围：1-3之间" @change="change" />
      </el-form-item>
      <el-form-item label="YarnNode">
        <el-input-number v-model="form.yarn_node_replicas" :min="2" :max="10" style="width: 240px" placeholder="范围：2-10之间" @change="change" />
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
import { getUserList } from '@/api/user'
import { updateHadoop } from '@/api/app/hadoop'
import { mapGetters } from 'vuex'

export default {
  name: 'UpdateHadoop',
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  data() {
    return {
      // 弹出层标题
      title: 'Update Hadoop',
      // 是否显示弹出层
      open: false,
      userPage: 1,
      userTotal: 0,
      /* options: [{
        id: '',
        username: '',
        nickname: '',
        role: ''
      }],*/
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
    init(name, cpu, memory, storage, pvc_storage, gpu) {
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
    onSubmit() {
      console.log('submit!')
      this.$refs.form.validate(valid => {
        if (valid) {
          updateHadoop(
            {
              name: this.form.name,
              hdfs_master_replicas: parseInt(this.form.hdfs_master_replicas),
              datanode_replicas: parseInt(this.form.datanode_replicas),
              yarn_master_replicas: parseInt(this.form.yarn_master_replicas),
              yarn_node_replicas: parseInt(this.form.yarn_node_replicas),
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
              this.$parent.getHadoopList()
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
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
