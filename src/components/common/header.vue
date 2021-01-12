<template>
  <div>
    <div class="ui-header-shrink">
      <el-button @click="toggleSide"><i :class="isSide?'el-icon-s-unfold':'el-icon-s-fold'"></i></el-button>
    </div>
    <div class="ui-header-user">
      <el-menu class="ui-header-menu" mode="horizontal" router>
        <div v-if="newsTotal!==0 && newsTotal<99" class="ui-header-badge">{{newsTotal}}</div>
        <div v-if="newsTotal>99" class="ui-header-badge">99+</div>
        <el-submenu class="ui-header-user-none" index="news_menu">
          <template slot="title"><i class="ion-md-notifications"></i></template>
          <div class="ui-user-news">
            <div class="ui-user-news-header"><i class="ion-ios-arrow-forward"></i>系统消息
              <el-button>更多</el-button>
            </div>
            <div class="ui-user-news-content">
              <ul v-if="newsDate.length!==0">
                <li v-for="(item,index) in newsDate" :key="index">
                  <a href="javascript:void(0);" @click="openNews(item.id)">
                    <i v-if="item.news_class===1" class="ion-md-notifications primary"></i>
                    <i v-if="item.news_class===2" class="ion-md-chatbubbles success"></i>
                    <i v-if="item.news_class===3" class="ion-md-information-circle warning"></i>
                    <p class="title">{{item.title}}</p>
                    <p class="content">{{item.content}}</p>
                  </a>
                </li>
              </ul>
              <div class="ui-user-news-nothing" v-else>没有任何消息</div>
            </div>
          </div>
        </el-submenu>
        <el-menu-item @click="getFullScreen"><i :class="isScreenFull?'ion-md-contract':'ion-md-expand'"></i>
        </el-menu-item>
        <el-submenu index="user_menu">
          <template slot="title"><img :src="loginUserImages">{{loginUserTitle}}</template>
          <div class="ui-user-menu">
            <el-menu-item index="/user-config"><i class="ion-ios-paper"></i>用户设置</el-menu-item>
            <el-menu-item @click="getLogout"><i class="ion-ios-contacts"></i>注销用户</el-menu-item>
            <el-menu-item index="/system-news"><i class="ion-ios-help-circle"></i>系统介绍</el-menu-item>
            <el-menu-item index="/bug-upload"><i class="ion-ios-mail"></i>BUG反馈</el-menu-item>
            <el-menu-item index="/about"><i class="ion-ios-grid"></i>关于我们</el-menu-item>
          </div>
        </el-submenu>
        <el-menu-item><i class="el-icon-menu"></i></el-menu-item>
      </el-menu>
    </div>
    <!-- 消息通知 start -->
    <el-dialog class="ui-news-dialog" :visible.sync="newsDialog" width="60%" @closed="newsClose">
      <h4 v-html="newsTitle"></h4>
      <div class="ui-news-dialog-content" v-html="newsContent"></div>
      <span v-html="newsDate"></span>
    </el-dialog>
    <!-- 消息通知 end -->
  </div>
</template>
<script>
  // 引入全屏组件
  import screen_full from 'screenfull'
  import {ApiLogin, ApiData} from '@/axios/axios'

  export default {
    data() {
      return {
        // 消息通知栏
        newsDialog: false,
        newsTitle: "",
        newsContent: "",
        newsDate: "",
        newsData: "",
        newsTotal: 0,
        // 侧边收缩
        isSide: this.$store.state.side_state,
        // 全屏
        isScreenFull: false,
        // 登录用户头像
        loginUserImages: "../../../static/images/user.png",
        // 登录用户名
        loginUserTitle: "admin"
      }
    },
    created() {
      this.getAdminData()
      this.getNewsList()
    },
    mounted() {
      window.onresize = () => {
        this.isScreenFull = screen_full.isFullscreen
      }
    },
    methods: {
      // 退出系统用户
      getLogout() {
        this.$confirm("是否退出系统？", "系统提示", {
          confirmButtonText: "退出",
          cancelButtonText: "返回",
          type: 'info'
        }).then(() => {
          let url = "/api/login/admin_logout/"
          ApiLogin(url).then((response) => {
            this.$message.warning(response)
            this.$router.push({path: '/login/'})
          })
        })
      },
      // 全屏
      getFullScreen() {
        if (!screen_full.isEnabled) {     //判断一下浏览器是否支持全屏显示
          this.$message({
            message: "该浏览器无法进入全屏状态",
            type: "警告"
          })
          return false
        }
        screen_full.toggle()
      },
      // 侧边栏收缩
      toggleSide() {
        this.isSide = !this.isSide
        if (this.isSide === true) {
          this.$store.state.side_state = true
          this.$store.state.side_width = "65px"
          this.$store.state.side_class = "ui-side-logo ui-side-small"
        } else {
          this.$store.state.side_state = false
          this.$store.state.side_width = "300px"
          this.$store.state.side_class = "ui-side-logo"
        }
      },
      // 引入登录管理员信息
      getAdminData() {
        let url = "/api/get/login_title/"
        ApiData(url).then((response) => {
          this.loginUserTitle = response.data[0]['user_name']
          if (response.data[0]['avatar']) {
            this.loginUserImages = this.$api_url + "/resource/upload" + response.data[0]['avatar']
          }
        })
      },
      // 消息列表
      getNewsList() {
        let url = "/api/get/news_list/"
        ApiData(url).then((response) => {
          this.newsDate = response.data
          this.newsTotal = response.total
        })
      },
      // 打开消息
      openNews(id) {
        let url = "/api/get/news_data/"
        let params = {"id": id}
        ApiData(url, params).then((response) => {
          this.newsDialog = true
          this.newsTitle = "<i class=\"ion-ios-arrow-forward\"></i>" + response.title
          this.newsContent = response.content
          this.newsDate = response.date
        })
      },
      // 关闭信息
      newsClose() {
        this.newsDialog = false
        this.getNewsList()
      }
    }
  }
</script>
