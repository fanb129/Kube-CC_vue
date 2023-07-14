<template>
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body width="600px">
    <el-form ref="form" :model="form" :rules="formRules" label-width="160px">
      <el-form-item label="Image ID" prop="ImageId">
        <el-input v-model="form.imageid" />
      </el-form-item>
      <el-form-item label="repository username">
        <el-input v-model="form.repository_username" />
      </el-form-item>
      <el-form-item label="repository passwd" prop="repository_passwd">
        <el-input v-model="form.repository_passwd" />
      </el-form-item>
      <el-form-item label="用户">
        <el-select v-model="form.u_id" filterable multiple placeholder="请选择分配用户" @change="change">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.username + '\t' + item.nickname"
            :value="item.id"
            :disabled="role < item.role"
          />
          <el-pagination
            background
            layout="prev, pager, next"
            :current-page="userPage"
            :page-size="1"
            :total="userTotal"
            @current-change="changeUserPageNum"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Image Tag" prop="ContainerId">
        <el-input v-model="form.containerid" />
      </el-form-item>
      <el-form-item label="Kind">

        <el-select v-model="form.Kind" filterable multiple placeholder="请选择镜像权限">
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
import { getUserList } from '@/api/user'
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
        ImageId: '',
        repository_username: '',
        repository_passwd: '',
        u_id: [],
        Image_tag: '',
        Kind: ''
      },
      formRules: {
        u_id: [{ required: true, trigger: 'blur' }],
        ContainerId: [{ required: true, trigger: 'blur' }],
        ImageId: [{ required: true, trigger: 'blur' }],
        MemUsageAndLimit: [{ required: true, trigger: 'blur' }],
        NetAndIo: [{ required: true, trigger: 'blur' }],
        BlockAndIo: [{ required: true, trigger: 'blur' }],
        ImageCPU: [{ required: true, trigger: 'blur' }],
        ImageName: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  methods: {
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
    onSubmit() {
      console.log('submit!')
      this.$refs.form.validate(valid => {
        if (valid) {
          createImageById({
            // TODO 添加其他与镜像相关的操作
            u_id: this.form.u_id,
            Repository_Username: this.form.repository_username,
            Repository_Passwd: this.form.repository_passwd,
            ImageId: this.form.ImageId,
            Image_tag: this.form.Image_tag,
            Kind: parseInt(this.form.Kind)
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
    changeUserPageNum: function(val) {
      this.userPage = val
      this.getUserList()
    },
    getUserList: function() {
      getUserList(this.userPage).then((res) => {
        this.userPage = res.page
        this.userTotal = parseInt(res.total / 10) + (res.total % 10 === 0 ? 0 : 1)
        this.options = res.user_list
        this.options.push({ nickname: '', id: '0', username: 'Null', role: '0' })
        // console.log(res)
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
