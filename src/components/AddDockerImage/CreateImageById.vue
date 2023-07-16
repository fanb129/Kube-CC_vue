<template>
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body width="600px">
    <el-form ref="form" :model="form" :rules="formRules" label-width="160px">
      <el-form-item label="Image ID" prop="ImageId">
        <el-input v-model="form.parent" />
      </el-form-item>
      <el-form-item label="repository username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="repository passwd" prop="repository_passwd">
        <el-input v-model="form.passwd" />
      </el-form-item>
      <el-form-item label="Image Tag" prop="ImageTag">
        <el-input v-model="form.tag" />
      </el-form-item>
      <el-form-item label="Kind">

        <el-select v-model="form.kind" placeholder="请选择镜像权限">
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
import { createImageById } from '@/api/docker'
import { mapGetters } from 'vuex'

export default {
  name: 'CreateImage',
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  data() {
    return {
      // 弹出层标题
      title: 'Add Image',
      // 是否显示弹出层
      open: false,
      userPage: 1,
      userTotal: 0,
      options: [{
        id: '',
        role: '',
        username: '',
        nickname: ''
      }],
      // 添加表单
      form: {
        parent: '',
        username: '',
        passwd: '',
        uid: [],
        tag: '',
        kind: ''
      },
      formRules: {
        uid: [{ required: true, trigger: 'blur' }],
        parent: [{ required: true, trigger: 'blur' }],
        username: [{ required: true, trigger: 'blur' }],
        passwd: [{ required: true, trigger: 'blur' }],
        tag: [{ required: true, trigger: 'blur' }],
        kind: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  methods: {
    init() {
      this.open = true
      this.form.uid = this.u_id
      this.$nextTick(() => {
        this.getUserList()
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
          createImageById({
            // TODO 添加其他与镜像相关的操作
            parent: this.form.parent,
            username: this.form.username,
            passwd: this.form.passwd,
            tag: this.form.tag,
            uid: this.form.uid,
            kind: parseInt(this.form.kind)
          }).then((res) => {
            if (res.code === 1) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.open = false
              // 调用主页面的getNsList方法刷新主页面
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
