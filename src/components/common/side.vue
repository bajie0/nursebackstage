<template>
  <div class="ui-side">
    <div :class="this.$store.state.side_class">
      <img src="../../assets/logo.png">
      <span>{{sideTitle}}</span>
    </div>
    <el-menu class="ui-side-menu" :default-active="this.$store.state.side_select" router :collapse="this.$store.state.side_state">
      <div v-for="(item,index) in sideContent" :key="index">
        <div v-if="item.path !== null">
          <el-menu-item :index=item.path>
            <i :class=item.iconName></i>
            <span slot="title">{{item.name}}</span>
          </el-menu-item>
        </div>
        <div v-else>
          <el-menu-item class="ui-side-title">{{item.name}}</el-menu-item>
        </div>
        <div v-for="(item1,index1) in item.children" :key="index1">
          <div v-if="item1.children !== undefined">
            <el-submenu :key="index1" :index="item1.path">
              <template slot="title">
                <i :class="item1.iconName"></i>
                <span slot="title">{{item1.name}}</span>
              </template>
              <el-menu-item v-for="(item2,index2) in item1.children" :key="index2" :index="item1.path+item2.path">
                {{item2.name}}
              </el-menu-item>
            </el-submenu>
          </div>
          <div v-else>
            <div v-if="item1.path !== undefined">
              <el-menu-item :index="item1.path">
                <i :class="item1.iconName"></i>
                <span slot="title">{{item1.name}}</span>
              </el-menu-item>
            </div>
            <div v-else>
              <el-menu-item class="ui-side-title">{{item1.name}}</el-menu-item>
            </div>
          </div>
        </div>
      </div>
    </el-menu>
  </div>
</template>

<script>
  import {ApiData} from "@/axios/axios"

  export default {
    data() {
      return {
        // 侧边栏目Title
        sideTitle: "家庭护士后台管理",
        // 侧边栏数据
        sideContent: []
      }
    },
    created() {
      this.getSide()
    },
    methods: {
      // 引入侧边栏JSON
      getSide() {
        let url = "/api/get/side_tree/"
        ApiData(url).then((response) => {
          this.sideContent = response.data[0].children
        })
      }
    }
  }
</script>
