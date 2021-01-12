<template>
  <el-container>
    <!-- 侧边栏 start -->
    <el-aside :width="this.$store.state.side_width">
      <Side></Side>
    </el-aside>
    <!-- 侧边栏 end -->
    <el-container>
      <!-- 置顶栏 start -->
      <el-header>
        <Header></Header>
      </el-header>
      <!-- 置顶栏 end -->
      <!-- 内容栏 start -->
      <el-main>
        <div class="ui-container">

        </div>
      </el-main>
      <!-- 内容栏 end -->
    </el-container>
  </el-container>
</template>
<script>
  import {
    ApiData,
    ApiCreate,
    ApiPatch,
    ApiDelete,
    ApiUpload,
    ApiDownload,
    ApiState
  } from '@/axios/axios'

  export default {
    data() {
      return {
      }
    }
  }
</script>
