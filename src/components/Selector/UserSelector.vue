<template>
  <div style="display: inline">
    <span>所属用户：</span>
    <el-select v-model="u_id" filterable placeholder="请选择" :disabled="role < 2" @change="change">
      <el-option
        v-for="item,index in options"
        :key="index"
        :label="item.nickname"
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
  </div>
</template>

<script>
import { getUserList } from '@/api/user'
import { mapGetters } from 'vuex'

export default {
  name: 'UserSelector',
  props: ['defaultUid'],
  computed: {
    ...mapGetters([
      'role'
      // 'u_id'
    ])
  },
  created() {
    this.getUserList()
  },
  data() {
    return {
      u_id: this.defaultUid,
      userPage: 1,
      userTotal: 0,
      options: [{
        id: '',
        nickname: '',
        role: ''
      }]
    }
  },
  methods: {
    change() {
      this.$forceUpdate()
      this.$emit('nsList', this.u_id)
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
        // Terminal.log(res)
        this.options.push({ id: '', nickname: 'All User', role: 3 })
      })
    }
  }
}
</script>

<style scoped>

</style>
