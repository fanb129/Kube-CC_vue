<template>
  <div style="display: inline">
    <span>所属用户：</span>
    <el-select v-model="u_id" filterable placeholder="请选择" @change="change">
      <el-option
        v-for="item,index in options"
        :key="index"
        :label="item.nickname"
        :value="item.id">
      </el-option>
      <el-pagination background layout="prev, pager, next" :current-page="userPage" :page-size="1" :total="userTotal"
                     @current-change="changeUserPageNum"></el-pagination>
    </el-select>
  </div>
</template>

<script>
import {getUserList} from "@/api/user";

export default {
  name: 'UserSelector',
  props: ['defaultUid'],
  created() {
    this.getUserList()
  },
  data(){
    return {
      u_id: this.defaultUid,
      userPage: 1,
      userTotal: 0,
      options: [{
        id: '',
        nickname: ''
      }]
    }
  },
  methods: {
    change() {
      this.$forceUpdate()
      this.$emit('nsList',this.u_id)
    },
    changeUserPageNum: function (val) {
      this.userPage = val
      this.getUserList()
    },
    getUserList: function () {
      getUserList(this.userPage).then((res) => {
        this.userPage = res.page
        this.userTotal = res.total
        this.options = res.user_list
        // Terminal.log(res)
        this.options.push({id:'',nickname:'All User'})
      })
    },
  }
}
</script>

<style scoped>

</style>
