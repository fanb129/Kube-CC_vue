<template>
  <div style="display: inline">
    <span>所属用户：</span>
    <el-select v-model="u_id" filterable placeholder="请选择" :disabled="role < 2" >
      <el-option
        v-for="item,index in options"
        :key="index"
        :label="item.nickname"
        :value="item.id"
        :disabled="role < item.role"
        @click.native="change(item.id)"
      />
      <!-- <el-pagination
        background
        layout="prev, pager, next"
        :current-page="userPage"
        :page-size="1"
        :total="userTotal"
        @current-change="changeUserPageNum"
      /> -->
    </el-select>
  </div>
</template>

<script>
import {getUserList, getAllUser} from "@/api/user";
import {mapGetters} from "vuex";

export default {
  name: 'UserSelector',
  props: ['defaultGid', 'defaultUid'],
  computed: {
    ...mapGetters([
      'role'
      // 'u_id'
    ])
  },
  created() {
    // this.getUserList(this.g_id)
    // this.u_id = this.defaultUid
    // this.g_id = this.defaultGid
    //this.change()
  },
  data() {
    return {
      u_id: this.defaultUid,
      g_id: this.defaultGid,
      userPage: 1,
      userTotal: 0,
      options: [{
        id: '',
        nickname: '该组所有用户',
        role: '3',
        gid: ''
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
    getAllUser: function() {
      getAllUser().then((res) => {
        this.options = res.all_user_list
        this.options.push({id:'',nickname:'该组所有用户', role: 3})
        //this.options.push({id:'999999',nickname:'请选择', role: 1})
        if(this.g_id == ''){
        } else {
          for(let i=0;i<this.options.length;i++){
            if(this.options[i].id!=''&&this.options[i].gid != this.g_id){
              this.options.splice(i,1)
              i = i-1
            }
          }
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
