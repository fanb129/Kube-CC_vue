<template>
  <div style="display: inline; margin-left: 2%">
    <span>Image：</span>
    <el-select v-model="image_id" filterable placeholder="请选择" @change="change">
      <el-option
        v-for="item, index in options"
        :key="index"
        :label="item.image_name"
        :value="item.image_id"
      />
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="Page"
        :page-size="1"
        :total="Total"
        @current-change="changeImagePageNum"
      />
    </el-select>
  </div>
</template>

<script>

import { getImageList } from '@/api/docker'

export default {
  name: 'ImageSelector',
  props: ['defaultImageId', 'defaultUid'],
  data() {
    return {
      user_id: this.defaultUid,
      image_id: this.defaultImageId,
      Page: 1,
      Total: 0,
      options: [{
        id: '',
        image_name: '',
        uid: ''
      }]
    }
  },
  created() {
    this.getImageList()
  },
  methods: {
    change() {
      this.$forceUpdate()
      this.$emit('ImageList', this.image_id)
    },
    changeImagePageNum: function(val) {
      this.Page = val
      this.getImageList()
    },
    getImageList: function() {
      getImageList(this.Page).then((res) => {
        this.Page = res.page
        console.log(this.Page)
        this.Total = parseInt(res.total / 10) + (res.total % 10 === 0 ? 0 : 1)
        this.options = res.image_list_all
        this.options.push({ id: '', image_name: 'All Images' })
        console.log(this.options)
      })
    }
  }
}
</script>

<style scoped>

</style>
