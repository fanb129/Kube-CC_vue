<template>
  <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body width="60%">
    <!--    <el-form ref="service" :model="service" label-width="100px">-->
    <!--      <span>Metadata</span>-->
    <!--      <el-form-item label="Name">-->
    <!--        <el-input v-model="service.metadata.name"></el-input>-->
    <!--      </el-form-item>-->
    <!--    &lt;!&ndash;      <el-form-item label="Namespace">&ndash;&gt;-->
    <div>
      <!--      <UserSelectorNoNil ref="UserSelector" :default-uid="uid" @nsList="changeUid" />-->
      <NsSelectorNoNil ref="NsSelector" v-model="form.namespace" :default-uid="uid" :default-ns="ns" @nsList="changeNs" />
    </div>
    <!--      </el-form-item>-->
    <!--      <el-form-item label="Labels">-->
    <!--        <el-input v-model="service.metadata.labels"></el-input>-->
    <!--      </el-form-item>-->
    <!--    </el-form>-->
    <!--    <div>-->
    <!--      <el-button type="primary" @click="createYaml">Create</el-button>-->
    <!--      <el-button @click="cancel">Cancel</el-button>-->
    <!--    </div>-->

    <dynamic-form
      ref="dynamic-form"
      v-model="form"
      :descriptors="descriptors"
    >
      <template slot="operations">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" plain @click="resetFields">重置</el-button>
        <el-button type="primary" @click="validate">提交</el-button>
      </template>
    </dynamic-form>
  </el-dialog>
</template>

<script>
import NsSelectorNoNil from '@/components/Selector/NsSelectorNoNil'
// import UserSelectorNoNil from '@/components/Selector/UserSelectorNoNil'
import { mapGetters } from 'vuex'
import {addJob} from "@/api/app/job";
export default {
  name: 'AddJob',
  components: { NsSelectorNoNil },
  computed: {
    ...mapGetters([
      'role',
      'u_id'
    ])
  },
  data: function() {
    return {
      descriptors: {
        name: { type: 'string', required: true },
        completions: { type: 'integer', required: true, min: 1 },
        parallelism: { type: 'integer', required: true, min: 1 },
        image: { type: 'string', required: true },
        command: { type: 'array', defaultField: { type: 'string'}},
        args: { type: 'array', defaultField: { type: 'string'}}
      },
      ns: '',
      uid: '',
      // 弹出层标题
      title: '一次性任务',
      // 是否显示弹出层
      open: false,
      form: {
        name: '',
        namespace: '',
        completions: 0,
        parallelism: 0,
        image: '',
        command:[],
        args: [],
      }
    }
  },
  methods: {
    resetFields() {
      this.$refs['dynamic-form'].resetFields()
    },
    async validate() {
      const valid = await this.$refs['dynamic-form'].validate()
      if (this.form.namespace !== '' && valid) {
        addJob(this.form).then(res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.open = false
            // 调用主页面的方法刷新主页面
            // this.$parent.get()
            this.$parent.getDeployList()
          }
        })
      } else {
        this.$message.error('请完整填写表单')
      }
    },
    changeNs: function(ns) {
      this.ns = ns
      this.form.namespace = ns
    },
    init() {
      this.open = true
      this.$nextTick(() => {
        this.$refs.NsSelector.u_id = this.u_id
        this.$refs.NsSelector.getNsList()
        this.open = true
      })
    },
    // 取消按钮
    cancel() {
      this.resetFields()
      this.open = false
      // this.reset()
    }
  }
}
</script>

<style scoped>

</style>
