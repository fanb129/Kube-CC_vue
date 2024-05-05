<template>
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body width="600px">
    <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
      <div>
        <p style="color: red;">注意：拉取私有仓库中的镜像时需要填写账号密码</p>
        <p>拉取源镜像</p>
      </div>
      <el-form-item label="镜像名" prop="pull_image.name">
        <el-input v-model="form.pull_image.name" style="width: 400px" />
      </el-form-item>
      <el-form-item label="标签" prop="pull_image.tag">
        <el-input v-model="form.pull_image.tag" style="width: 400px" />
      </el-form-item>
      <el-form-item label="账号" prop="pull_image.username">
        <el-input v-model="form.pull_image.username" style="width: 400px" />
      </el-form-item>
      <el-form-item label="密码" prop="pull_image.password">
        <el-input v-model="form.pull_image.password" style="width: 400px" />
      </el-form-item>

      <div>
        <p>另存为</p>
      </div>
      <el-form-item label="镜像名" prop="target_image.name">
        <el-input v-model="form.target_image.name" style="width: 400px">
          <template slot="prepend"> {{ sealosHub }}
          </template>
        </el-input></el-form-item>

      <el-form-item label="标签" prop="target_image.tag">
        <el-input v-model="form.target_image.tag" style="width: 400px" />
      </el-form-item>

      <el-form-item label="类型" prop="target_image.kind">
        <el-radio v-model="form.target_image.kind" label='1'>公共</el-radio>
        <el-radio v-model="form.target_image.kind" label='2'>私有</el-radio>
      </el-form-item>

      <el-form-item label="描述" prop="target_image.description">
        <el-input v-model="form.target_image.description" type="textarea" :rows="2" placeholder="请输入内容" maxlength="256" show-word-limit />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { pullImage } from '@/api/docker'

export default {
  name: 'PullImage',
  computed: {
    ...mapGetters([
      'u_id'
    ])
  },
  created() {
    this.form.target_image.uid = this.u_id
  },
  data() {
    return {
      sealosHub: 'sealos.hub:5000/',
      // 弹出层标题
      title: '拉取镜像',
      // 是否显示弹出层
      open: false,
      form: {
        pull_image: {
          name: '',
          tag: '',
          username: '',
          password: ''
        },
        target_image: {
          name: '',
          tag: '',
          description: '',
          uid: '',
          kind: '2'
        }
      },
      formRules: {
        pull_image: {
          name: [{ required: true, message: '请输入镜像名称', trigger: 'blur' }],
          tag: [{ required: true, message: '请输入标签', trigger: 'blur' }]
        },
        target_image: {
          name: [{ required: true, message: '请输入镜像名称', trigger: 'blur' }],
          tag: [{ required: true, message: '请输入标签', trigger: 'blur' }],
          kind: [{ required: true, message: '请选择镜像类型', trigger: 'blur' }]
        }
      }
    }
  },
  methods: {
    init() {
      this.open = true
      this.$nextTick(() => {
        // this.getUserList()
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
          this.form.target_image.name = this.sealosHub + this.form.target_image.name
          this.form.target_image.kind = parseInt(this.form.target_image.kind)
          pullImage(this.form).then((res) => {
            if (res.code === 1) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.open = false
              // 调用主页面的getImageList方法刷新主页面
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
    }
  }
}
</script>

<style scoped>

</style>
