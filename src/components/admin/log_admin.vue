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
        <div class="ui-container" v-if="page_get===true">
          <div class="ui-container-header">
            <h2><i class="ion-ios-arrow-forward"></i>管理员登录日志</h2>
            <p>对平台的管理员，登录系统进行日志记录管理。</p>
          </div>
          <!-- Table start -->
          <div class="ui-container-content">
            <div :class="more_link?'ui-container-table-search height':'ui-container-table-search'">
              <el-row>
                <el-col :span="6">
                  <div class="ui-container-table-search-quick">
                    <i class="ion-ios-search"></i>
                    <el-input v-model="search_input" placeholder="管理员姓名 / 管理员编码 / 用户名..." @input="searchQuick" clearable></el-input>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="ui-container-table-shrink">
                    <el-button @click="MoreLink">更多<i :class="more_link?'ion-ios-arrow-up':'ion-ios-arrow-down'"></i>
                    </el-button>
                  </div>
                </el-col>
              </el-row>
              <el-form class="ui-container-table-more" ref="searchForm" :model="searchForm" :label-position="labelSearchPosition" :label-width="labelSearchWidth">
                <el-divider>更多查询选项</el-divider>
                <el-row :gutter="20">
                  <el-col :span="6">
                    <el-form-item label="管理员编码" prop="admin_code">
                      <el-input v-model="searchForm.admin_code" placeholder="请输入管理员编码"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="管理员姓名" prop="admin_title">
                      <el-input v-model="searchForm.admin_title" placeholder="请输入管理员姓名"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="管理员用户名" prop="admin_user_name">
                      <el-input v-model="searchForm.admin_user_name" placeholder="请输入管理员用户名"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="登录状态" prop="login_state">
                      <el-select v-model="searchForm.login_state" placeholder="请选择登录状态">
                        <el-option label="登录成功" value="1"></el-option>
                        <el-option label="登录失败" value="0"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="联系电话" prop="admin_phone">
                      <el-input v-model="searchForm.admin_phone" placeholder="请输入联系电话"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="电子邮件" prop="admin_mail">
                      <el-input v-model="searchForm.admin_mail" placeholder="请输入电子邮件"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="上次登录时间" prop="admin_last_time">
                      <el-date-picker v-model="searchForm.admin_last_time" type="daterange" range-separator="至" start-placeholder="上次登录开始时间" end-placeholder="上次登录结束时间"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="24">
                    <div class="ui-container-table-more-button">
                      <el-button type="primary" @click="searchSubmit"><i class="ion-ios-search"></i>查询</el-button>
                      <el-button @click="searchReset('searchForm')"><i class="ion-ios-refresh"></i>重置</el-button>
                    </div>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div class="ui-container-table-content">
              <div class="ui-container-table-list">
                <el-table :data="tableData" height="100%" style="width: 100%" @selection-change="selection_change" tooltip-effect="dark" v-loading="loading">
                  <el-table-column fixed type="selection" width="60"></el-table-column>
                  <el-table-column prop="login_state" label="登录状态" width="130" :filters="login_state" :filter-method="stateTag">
                    <template slot-scope="login_state">
                      <div v-if="login_state.row.login_state === 0">
                        <el-tag type="danger" disable-transitions>登录失败</el-tag>
                      </div>
                      <div v-if="login_state.row.login_state === 1">
                        <el-tag type="success" disable-transitions>登录成功</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="user_name" label="用户名" width="150"></el-table-column>
                  <el-table-column prop="last_time" label="上次登录时间" width="200"></el-table-column>
                  <el-table-column prop="login_ip" label="登录IP地址" width="200"></el-table-column>
                  <el-table-column prop="login_content" label="登录日志"></el-table-column>
                </el-table>
              </div>
            </div>
            <div class="ui-container-table-page">
              <el-pagination @size-change="size_change" @current-change="current_change" :current-page="table_page" :page-sizes="page_sizes" :page-size="page_size" layout="sizes, prev, pager, next, jumper, total" :total="table_total" background></el-pagination>
            </div>
          </div>
          <!-- Table end -->
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
        // 页面权限
        page_get: false,
        // Form表单设置
        labelSearchPosition: 'top',// 文字朝向
        labelSearchWidth: '100px',// label宽度
        searchForm: {
          table_page: "",
          page_size: "",
          search_input: "",
          // 更多查询
          admin_code: "",
          admin_title: "",
          admin_user_name: "",
          login_state: "",
          admin_phone: "",
          admin_mail: "",
          admin_last_time: ""
        },
        // 更多
        more_link: false,
        // 快捷搜索
        search_input: '',
        // Table数据
        tableData: [],
        multipleSelection: [],
        multipleTable: '',
        // 加载中组件
        loading: true,
        // 分页栏目-当前页
        table_page: 1,
        // 分页栏目-数据总量
        table_total: 4000,
        // 分页-每页数量条数
        page_sizes: [20, 50, 100, 200],
        // 分页-分页条数
        page_size: 20,
        // 审核筛选
        login_state: [{text: '登录成功', value: 1}, {text: '登录失败', value: 0}],
      }
    },
    created() {
      this.getTableJson(this.searchForm)
      this.getPageAuthority()
    },
    methods: {
      // 01.搜索栏目 - 更多
      MoreLink() {
        this.more_link = !this.more_link
      },
      // 02.更多Form查询
      searchSubmit() {
        this.getTableJson()
        this.more_link = !this.more_link
      },
      // 03.更多Form重置
      searchReset(searchForm) {
        this.$refs[searchForm].resetFields()
        this.getTableJson()
        this.more_link = !this.more_link
      },
      // 04.快捷Form查询
      searchQuick() {
        this.getTableJson(this.table_page, this.page_size, this.searchForm, this.search_input)
      },
      // 05.全选数据
      selection_change(val) {
        this.multipleTable = []
        this.multipleSelection = val
        for (var i = 0; i < this.multipleSelection.length; i++) {
          this.multipleTable = this.multipleTable + ',' + this.multipleSelection[i]['id']
        }
        if (this.multipleTable.length === 0) {
          this.multipleTable = ""
        } else {
          this.multipleTable = this.multipleTable.substr(1)
        }
      },
      // 06.分页栏目-分页数
      size_change(val) {
        this.page_size = val
        this.getTableJson()
      },
      // 07.分页栏目-跳转页
      current_change(val) {
        this.table_page = val
        this.getTableJson()
      },
      // 08.引入TableJson
      getTableJson() {
        let url = "/api/get/log_admin_list/"
        this.searchForm.table_page = this.table_page
        this.searchForm.page_size = this.page_size
        this.searchForm.quick_search = this.search_input
        ApiData(url, this.searchForm).then((response) => {
          this.tableData = response.data
          this.page_size = response.page_size
          this.table_total = response.table_total
          this.table_page = response.table_page
          this.loading = false
        })
      },
      // 09.登录状态 - 筛选
      stateTag(value, row) {
        return row.login_state === value;
      },
      // 19.页面权限验证
      getPageAuthority() {
        if (this.$store.state.power_list.indexOf("HandleManageAdminLogAdminGet") !== -1) {
          this.page_get = true
        }
      }
    }
  }
</script>
