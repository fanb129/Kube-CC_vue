<template>
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body width="600px">
    <el-form ref="form" :model="form" :rules="formRules" label-width="160px">
      <el-form-item label="Old Repository Name" prop="OLdRepositoryName">
        <el-input v-model="form.image_old_name" />
      </el-form-item>
      <el-form-item label="Old Tag" prop="OldTag">
        <el-input v-model="form.image_old_tag" />
      </el-form-item>
      <el-form-item label="New Repository Name" prop="NewRepositoryName">
        <el-input v-model="form.image_new_name" />
      </el-form-item>
      <el-form-item label="New Tag" prop="NewTag">
        <el-input v-model="form.image_new_tag" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { CreateImageByTag } from '@/api/docker'
import { mapGetters } from 'vuex'

export default {
  name: 'UpdateImage',
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  data() {
    return {
      // 弹出层标题
      title: 'Update Image Tag',
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
        image_old_name: '',
        image_old_tag: '',
        image_new_name: '',
        image_new_tag: ''
      },
      formRules: {
        image_old_name: [{ required: true, trigger: 'blur' }],
        image_old_tag: [{ required: true, trigger: 'blur' }],
        image_new_name: [{ required: true, trigger: 'blur' }],
        image_new_tag: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  methods: {
    init(old_repository_name, old_tag, new_repository_name, new_tag) {
      this.open = true
      this.$nextTick(() => {
        this.getImageList()
        this.open = true
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
          CreateImageByTag({
            image_old_name: this.form.image_old_name,
            image_old_tag: this.form.image_old_tag,
            image_new_name: this.form.image_new_name,
            image_new_tag: this.form.image_new_tag
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
