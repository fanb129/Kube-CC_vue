<template>
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body width="600px">
    <el-form ref="form" :model="form" :rules="formRules" label-width="160px">
      <el-form-item label="Old Repository Name" prop="OLdRepositoryName">
        <el-input v-model="form.old_repository_name" />
      </el-form-item>
      <el-form-item label="Old Tag" prop="OldTag">
        <el-input v-model="form.old_tag" />
      </el-form-item>
      <el-form-item label="New Repository Name" prop="NewRepositoryName">
        <el-input v-model="form.new_repository_name" />
      </el-form-item>
      <el-form-item label="New Tag" prop="NewTag">
        <el-input v-model="form.new_tag" />
      </el-form-item>
      <el-form-item v-if="role >= 2" label="用户">
        <el-select v-model="form.u_id" filterable multiple placeholder="请选择应用此更改的用户" @change="change">
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
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getUserList } from '@/api/user'
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
        old_repository_name: '',
        old_tag: '',
        u_id: [],
        new_repository_name: '',
        new_tag: ''
      },
      formRules: {
        u_id: [{ required: true, trigger: 'blur' }],
        old_repository_nane: [{ required: true, trigger: 'blur' }],
        old_tag: [{ required: true, trigger: 'blur' }],
        new_repository_name: [{ required: true, trigger: 'blur' }],
        new_tag: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  methods: {
    init(old_repository_name, old_tag, new_repository_name, new_tag) {
      this.form.old_repository_name = old_repository_name
      this.form.old_tag = old_tag
      this.form.new_repository_name = new_repository_name
      this.form.new_tag = new_tag
      this.open = true
      this.$nextTick(() => {
        this.getUserList()
        this.form.old_repository_name = old_repository_name
        this.form.old_tag = old_tag
        this.form.new_repository_name = new_repository_name
        this.form.new_tag = new_tag
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
            u_id: this.form.u_id,
            old_repository_name: this.form.old_repository_name,
            old_tag: this.form.old_tag,
            new_repository_name: this.form.new_repository_name,
            new_tag: this.form.new_tag
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
