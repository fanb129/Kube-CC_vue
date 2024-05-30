<template>
  <div style="display: inline" v-if="role > 1">
    <span>所属用户：</span>
    <el-select v-model="uid" filterable placeholder="请选择" :disabled="role < 2" >
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
import {getAllUser, getUserList} from "@/api/user";
import {mapGetters} from "vuex";

export default {
  name: 'UserSelector',
  props: ['defaultGid', 'defaultUid'],
  computed: {
    ...mapGetters([
      'role',
      'u_id',
      'name',
    ])
  },
  created() {
    this.options.push({id:this.u_id, nickname: this.name, role: this.role})
  },
  data() {
    return {
      uid: this.defaultUid,
      g_id: this.defaultGid,
      options: []
    }
  },
  methods: {
    change() {
      this.$forceUpdate()
      this.$emit('nsList', this.uid)
    },
    getAllUser: function() {
      getUserList(this.g_id).then((res) => {
        this.options = res.user_list
        if(this.g_id == 0){
          this.options.push({id:'',nickname:'所有用户', role: 3})
        }
        //this.options.push({id:'999999',nickname:'请选择', role: 1})
        // if(this.g_id == 0){
        // } else {
        //   for(let i=0;i<this.options.length;i++){
        //     if(this.options[i].id!=''&&this.options[i].gid != this.g_id&&this.options[i].id != this.u_id){
        //       this.options.splice(i,1)
        //       i = i-1
        //     }
        //   }
        // }
      })
    },
  }
}
</script>

<style scoped>

</style>
