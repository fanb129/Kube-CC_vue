<template>
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body width="600px">
    <el-form ref="form" :model="form" :rules="formRules" label-width="160px">
      <el-form-item label="Repository Name" prop="RepositoryName">
        <el-input v-model="form.image_name" />
      </el-form-item>
      <el-form-item label="Image Tag">
        <el-input v-model="form.tag" />
      </el-form-item>
      <el-form-item label="Kind">
        <el-select v-model="form.Kind" placeholder="请选择镜像权限">
          <el-option label="公有" value="1" />
          <el-option label="私有" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { PullPublic } from '@/api/docker'
import { mapGetters } from 'vuex'

export default {
  name: 'PullPublic',
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  data() {
    return {
      // 弹出层标题
      title: 'PullPublic',
      // 是否显示弹出层
      open: false,
      userPage: 1,
      userTotal: 0,
      imagePage: 1,
      imageTotal: 0,
      options: [{
        id: '',
        role: '',
        username: '',
        nickname: ''
      }],
      imagedata: [],
      // 添加表单
      form: {
        image_name: '',
        tag: '',
        uid: [],
        Kind: ''
      },
      formRules: { // uid 后端是uint型 ，kind是int
        uid: [{ required: true, trigger: 'blur' }],
        image_name: [{ required: true, trigger: 'blur' }],
        tag: [{ required: true, trigger: 'blur' }],
        Kind: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  methods: {
    init() {
      this.open = true
      this.form.uid = this.u_id
      this.$nextTick(() => {
        this.getImageList()
        this.open = true
        this.form.uid = this.u_id
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
          PullPublic({
            image_name: this.form.image_name,
            tag: this.form.tag,
            Kind: parseInt(this.form.Kind),
            uid: parseInt(this.form.uid)
          }).then((res) => {
            if (res.code === 1) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.open = false
              this.$parent.getImageList()
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
