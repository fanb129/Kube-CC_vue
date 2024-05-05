<template>
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body width="600px">
    <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
      <el-form-item label="镜像">
        <el-input disabled="true" v-model="form.image_name" />
      </el-form-item>

      <el-form-item label="类型" prop="kind">
        <el-radio v-model="form.kind" label='1'>公共</el-radio>
        <el-radio v-model="form.kind" label='2'>私有</el-radio>
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="2" placeholder="请输入内容" maxlength="256" show-word-limit/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">更新</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import {updateImage} from '@/api/docker';

export default {
  name: 'UpdateImage',
  data() {
    return {
      // 弹出层标题
      title: '编辑镜像信息',
      // 是否显示弹出层
      open: false,
      form: {
        image_name: '',
        id: 0,
        kind: '',
        description: ''
      },
      formRules: {
        id: [{ required: true, message: '系统错误，无法获取id',trigger: 'blur' }],
        kind: [{ required: true, message: '请选择镜像类型', trigger: 'blur' }]
      }
    }
  },
  methods: {
    init(id,kind,description,name,tag) {
      this.open = true
      this.form.id = id
      this.form.kind = kind+""
      this.form.description = description
      this.form.image_name = name + ':' + tag
      this.$nextTick(() => {
        this.open = true
        this.form.id = id
        this.form.kind = kind+""
        this.form.description = description
        this.form.image_name = name + ':' + tag
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
          this.form.kind = parseInt(this.form.kind)
          updateImage(this.form).then((res) => {
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
    }
  }
}
</script>

<style scoped>

</style>
