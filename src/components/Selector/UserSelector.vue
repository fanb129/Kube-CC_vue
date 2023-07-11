<template>
  <div style="display: inline">
    <span>所属用户：</span>
    <el-select v-model="u_id" filterable placeholder="请选择" :disabled="role < 2" @change="change">
      <el-option
        v-for="item,index in options"
        :key="index"
        :label="item.nickname"
        :value="item.id"
        :disabled="role < item.role">
      </el-option>
      <el-pagination background layout="prev, pager, next" :current-page="userPage" :page-size="1" :total="userTotal"
                     @current-change="changeUserPageNum"></el-pagination>
    </el-select>
  </div>
</template>

<script>
import {getUserList} from "@/api/user";
import {mapGetters} from "vuex";

export default {
  name: 'UserSelector',
  props: ['defaultGid','defaultUid'],
  computed: {
    ...mapGetters([
      'role',
      // 'u_id'
    ])
  },
  created() {
    //this.getUserList(this.g_id)
  },
  data(){
    return {
      u_id: this.defaultUid,
      g_id: this.defaultGid,
      userPage: 1,
      userTotal: 0,
      options: [{
        id: '',
        nickname: '',
        role: '',
        gid: ''
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
        this.userTotal = parseInt(res.total / 10) + (res.total % 10 === 0 ? 0 : 1)
        this.options = res.user_list
        // Terminal.log(res)
        this.options.push({id:'',nickname:'All User',role: 3})
        console.log(this.options)
        for(let i=0;i<this.options.length;i++){
          if(this.options[i].gid != this.g_id){
            this.options.splice(i,1)
            i=i-1
          }
        }
        //console.log(this.options)
      })
    },
  }
}
</script>

<style scoped>

</style>
