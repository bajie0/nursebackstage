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
            <h2><i class="ion-ios-arrow-forward"></i>角色管理</h2>
            <p>对平台的角色相关信息进行删除、审核、导入、导出等系统操作。</p>
            <div class="ui-container-header-group">
              <el-button v-if="page_create===true" type="primary" class="ui-header-group-add" @click="operate_add()"><i class="ion-ios-add-circle"></i>新增</el-button>
              <el-button v-if="page_upload===true" class="ui-header-group-btn" @click="operate_upload()"><i class="ion-ios-cloud-upload"></i>导入</el-button>
              <el-dropdown v-if="page_download===true" @command="operate_download">
                <el-button><i class="ion-ios-cloud-download"></i>导出</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="operate_download_all">批量导出</el-dropdown-item>
                  <el-dropdown-item command="operate_download_part">导出所选</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown v-if="page_state===true" @command="operate_approval">
                <el-button><i class="ion-ios-switch"></i>审核</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="operate_approval_on">批量审核</el-dropdown-item>
                  <el-dropdown-item command="operate_approval_off">批量反审</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button v-if="page_delete===true" class="ui-header-group-btn" @click="operate_delete()"><i class="ion-ios-trash"></i>删除
              </el-button>
            </div>
          </div>
          <!-- Table start -->
          <div class="ui-container-content">
            <div :class="more_link?'ui-container-table-search height':'ui-container-table-search'">
              <el-row>
                <el-col :span="6">
                  <div class="ui-container-table-search-quick">
                    <i class="ion-ios-search"></i>
                    <el-input v-model="search_input" placeholder="角色标题 / 角色编码..." @input="searchQuick" clearable></el-input>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="ui-container-table-shrink">
                    <el-button @click="MoreLink">更多<i :class="more_link?'ion-ios-arrow-up':'ion-ios-arrow-down'"></i>
                    </el-button>
                  </div>
                </el-col>
                <el-col :span="14">
                  <el-radio-group v-model="display_mode" class="ui-table-display-mode" @change="displayMode">
                    <el-radio-button label="panel"><i class="ion-ios-keypad"></i>面板模式</el-radio-button>
                    <el-radio-button label="list"><i class="ion-ios-list"></i>列表模式</el-radio-button>
                  </el-radio-group>
                </el-col>
              </el-row>
              <el-form class="ui-container-table-more" ref="searchForm" :model="searchForm" :label-position="labelSearchPosition" :label-width="labelSearchWidth">
                <el-divider>更多查询选项</el-divider>
                <el-row :gutter="20">
                  <el-col :span="6">
                    <el-form-item label="角色编码" prop="role_code">
                      <el-input v-model="searchForm.role_code" placeholder="请选择角色编码"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="角色标题" prop="role_title">
                      <el-input v-model="searchForm.role_title" placeholder="请选择角色标题"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="审核状态" prop="role_state">
                      <el-select v-model="searchForm.role_state" placeholder="请选择审核状态">
                        <el-option label="通过" value="1"></el-option>
                        <el-option label="待审" value="0"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <div class="ui-container-table-more-button">
                      <el-button type="primary" @click="searchSubmit"><i class="ion-ios-search"></i>查询</el-button>
                      <el-button @click="searchReset('searchForm')"><i class="ion-ios-refresh"></i>重置</el-button>
                    </div>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div :class="table_list?'ui-container-table-content':'ui-container-table-content ui-none'">
              <div class="ui-container-table-list">
                <el-table :data="tableData" height="100%" style="width: 100%" @selection-change="selection_change" tooltip-effect="dark" v-loading="loading">
                  <el-table-column fixed type="selection" width="40"></el-table-column>
                  <el-table-column type="expand" width="40">
                    <template slot-scope="props">
                      <el-form label-position="left" inline class="ui-table-expand">
                        <el-form-item label="角色编码">
                          <span>{{ props.row.role_code }}</span>
                        </el-form-item>
                        <el-form-item label="角色标题">
                          <span>{{ props.row.role_title }}</span>
                        </el-form-item>
                        <el-form-item label="权限明细">
                          <span v-for="(item,index) in props.row.role_power" :key="index">
                            {{item}}<br>
                          </span>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column prop="role_code" label="角色编码" width="300" sortable></el-table-column>
                  <el-table-column prop="role_title" label="角色标题"></el-table-column>
                  <el-table-column prop="role_state" label="审核状态" width="100" :filters="power_state" :filter-method="stateTag" v-if="page_state===true">
                    <template slot-scope="role_state">
                      <el-switch v-model="role_state.row.role_state" :active-value="true" :inactive-value="false" active-text inactive-text @change="changeSwitch($event,role_state.row.id)"></el-switch>
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="120" v-if="page_patch===true || page_delete===true">
                    <template slot-scope="scope">
                      <el-button v-if="page_patch===true" class="ui-primary" @click="handle_edit(scope.row)">编辑</el-button>
                      <el-button v-if="page_delete===true" class="ui-primary" @click="handle_delete(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div :class="table_list?'ui-container-table-panel ui-none':'ui-container-table-panel'">
              <el-row :gutter="20">
                <div v-if="tableData.length<=0" class="ui-table-panel-no">暂无数据</div>
                <el-col :span="8" v-for="(item,index) in tableData" :key="index" v-else>
                  <div class="ui-table-panel">
                    <div class="ui-table-panel-header">
                      <h3><i class="ion-ios-arrow-forward"></i>{{item.role_title}}</h3>
                    </div>
                    <div class="ui-table-panel-content">
                      <el-form label-position="left" inline class="ui-table-expand">
                        <el-form-item label="角色编码">
                          <span>{{ item.role_code }}</span>
                        </el-form-item>
                        <el-form-item label="审核状态" v-if="page_state===true">
                          <span>
                            <el-switch v-model="item.role_state" :active-value="true" :inactive-value="false" active-text inactive-text @change="changeSwitch($event,item.id)"></el-switch>
                          </span>
                        </el-form-item>
                      </el-form>
                    </div>
                    <ul class="ui-table-panel-footer" v-if="page_patch===true || page_delete===true">
                      <li v-if="page_patch===true">
                        <el-link @click="handle_panel_edit(item.id)"><i class="ion-ios-create"></i>编辑</el-link>
                      </li>
                      <li v-if="page_delete===true">
                        <el-link @click="handle_panel_delete(item.id)"><i class="ion-ios-trash"></i>删除</el-link>
                      </li>
                    </ul>
                  </div>
                </el-col>
              </el-row>
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
    <!-- 批量上传 start -->
    <el-drawer class="ui-upload" title="批量导入数据" :visible.sync="upload_all" :direction="upload_all_direction" :with-header="false" :before-close="uploadClose">
      <div class="ui-upload-header">
        <h2><i class="ion-ios-arrow-forward"></i>批量导入数据</h2>
        <p>对初始化数据进行批量导入。</p>
      </div>
      <div class="ui-upload-content">
        <h4>01.模板</h4>
        <a href="../../../static/template/角色模板.xlsx">
          <img src="../../../static/images/xls.png">
          <p>点击下载模板文件</p>
        </a>
        <span>
          <p>1、红色标题为必须输入内容；</p>
          <p>2、编码类列作为唯一值，如有重复则系统会提示错误；</p>
        </span>
        <h4>02.选择文件</h4>
        <el-upload drag :action="this.upload_url" :headers="{'token':this.$cookies.get('token')}" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <h4>03.上传反馈</h4>
        <el-input type="textarea" rows="11" v-model="upload_content"></el-input>
      </div>
    </el-drawer>
    <!-- 批量上传 end -->
  </el-container>
</template>
<script>
  import {
    ApiData,
    ApiDelete,
    ApiUpload,
    ApiDownload,
    ApiState
  } from '@/axios/axios'
  import XLSX from 'xlsx'

  export default {
    data() {
      return {
        // 页面权限
        page_get: false,
        page_create: false,
        page_patch: false,
        page_state: false,
        page_delete: false,
        page_upload: false,
        page_download: false,
        // 批量导入侧边栏
        upload_all: false,
        upload_all_direction: "rtl",
        // 批量导入组件
        upload_content: "",
        upload_url: "",
        FileUrl: '',
        // Form表单设置
        labelSearchPosition: 'top',// 文字朝向
        labelSearchWidth: '100px',// label宽度
        searchForm: {
          table_page: "",
          page_size: "",
          search_input: "",
          // 更多查询
          role_code: "",
          role_title: "",
          role_state: ""
        },
        // 列表显示方式
        // display_mode:panel   table_list:false   table_panel:false   面板显示
        // display_mode:list    table_list:true   table_panel:true   列表显示
        display_mode: "list",
        table_list: true,
        table_panel: true,
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
        power_state: [{text: '通过', value: true}, {text: '待审', value: false}],
      }
    },
    created() {
      this.getTableJson(this.searchForm)
      this.getPageAuthority()
    },
    methods: {
      // 切换模式
      displayMode(data) {
        this.display_mode = data
        this.table_list = !this.table_list
        this.table_panel = !this.table_panel
      },
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
				console.log(val)
        this.multipleTable = []
        this.multipleSelection = val
        for (var i = 0; i < this.multipleSelection.length; i++) {
          this.multipleTable = this.multipleTable + ',' + this.multipleSelection[i]['id']
		  console.log(this.multipleTable)
        }
        if (this.multipleTable.length === 0) {
          this.multipleTable = ""
        } else {
          this.multipleTable = this.multipleTable.substr(1)
		  console.log(this.multipleTable)
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
        let url = "/api/get/role_list/"
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
      // 09.Table数据 - 编辑操作
      handle_edit(row) {
        window.location.href = "/admin/patch-role/" + row.id
      },
      handle_panel_edit(row) {
        window.location.href = "/admin/patch-role/" + row
      },
      // 10.Table数据 - 删除操作
      handle_delete(row) {
        this.$confirm("是否删除该数据？", "系统提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let url = "/api/delete/role/"
          let params = {"id": row.id}
          ApiDelete(url, params).then((response) => {
            this.$message.success(response)
            this.getTableJson()
          })
        });
      },
      handle_panel_delete(id) {
        this.$confirm("是否删除该数据？", "系统提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let url = "/api/delete/role/"
          let params = {"id": id}
          ApiDelete(url, params).then((response) => {
            this.$message.success(response)
            this.getTableJson()
          })
        });
      },
      // 11.Table数据 - 开关操作
      changeSwitch($event, row) {
        let url = "/api/state/role/"
        let params = {"id": row, "state": $event}
        ApiState(url, params).then((response) => {
          this.$message.success(response)
          this.getTableJson()
        })
      },
      // 12.打开新增页面
      operate_add(){
        this.$router.push("/admin/add-role")
      },
      // 13.批量上传
      operate_upload() {
        this.upload_all = true
        this.upload_content = ""
        this.upload_url = this.$api_url + "/api/upload/role/"
      },
      handleAvatarSuccess(res, file) {
        this.FileUrl = URL.createObjectURL(file.raw)
        this.$message.success(res.message)
        this.upload_content = res.data
      },
      beforeAvatarUpload(file) {
        const isJPG = file.name.substr(file.name.lastIndexOf(".") + 1) === "xlsx"
        const isLt2M = file.size / 1024 / 1024 < 5
        if (!isJPG) {
          this.$message.error("上传文件只能是xlsx格式!")
        }
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过5MB!')
        }
        return isJPG && isLt2M;
      },
      // 13.03.关闭上传
      uploadClose(){
        this.getTableJson()
        this.upload_all=false
      },
      // 14.批量下载
      operate_download(command) {
        if (command === 'operate_download_all') {
          this.$confirm("是否导出全部数据？", "系统提示", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            let url = "/api/download/role_all/"
            ApiDownload(url).then((response) => {
              this.$message.success(response.message)
              window.location.href = this.$api_url + response.path
            })
          })
        }
        if (command === 'operate_download_part') {
          if (this.multipleTable.length === 0) {
            this.$message.warning("请选择需要导出的数据")
          } else {
            this.$confirm("是否导出所选数据？", "系统提示", {
              confirmButtonText: "确认",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              let url = "/api/download/role_part/"
              let params = {"id": this.multipleTable}
              ApiDownload(url, params).then((response) => {
                this.$message.success(response.message)
                window.location.href = this.$api_url + response.path
              })
            })
          }
        }
      },
      // 15.批量审核
      operate_approval(command) {
        if (command === 'operate_approval_on') {
          if (this.multipleTable.length === 0) {
            this.$message.warning("请选择需要审核的数据")
          } else {
            this.$confirm("是否审核所选数据？", "系统提示", {
              confirmButtonText: "确认",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              let url = "/api/state/role_on/"
              let params = {"id": this.multipleTable}
              ApiState(url, params).then((response) => {
                this.$message.success(response)
                this.getTableJson()
              })
            })
          }
        }
        if (command === 'operate_approval_off') {
          if (this.multipleTable.length === 0) {
            this.$message.warning("请选择需要反审的数据")
          } else {
            this.$confirm("是否反审所选数据？", "系统提示", {
              confirmButtonText: "确认",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              let url = "/api/state/role_off/"
              let params = {"id": this.multipleTable}
              ApiState(url, params).then((response) => {
                this.$message.success(response)
                this.getTableJson()
              })
            })
          }
        }
      },
      // 16.批量删除
      operate_delete() {
        if (this.multipleTable.length === 0) {
          this.$message.warning("请选择需要删除的数据")
        } else {
          this.$confirm("是否删除所选数据？", "系统提示", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            let url = "/api/delete/role_all/"
            let params = {"id": this.multipleTable}
            ApiDelete(url, params).then((response) => {
              this.$message.success(response)
              this.getTableJson()
            })
          })
        }
      },
      // 17.审核状态 - 筛选
      stateTag(value, row) {
        return row.role_state === value;
      },
      // 18.页面权限验证
      getPageAuthority() {
        if (this.$store.state.power_list.indexOf("HandleManageAdminRoleCreate") !== -1) {
          this.page_create = true
        }
        if (this.$store.state.power_list.indexOf("HandleManageAdminRoleGet") !== -1) {
          this.page_get = true
        }
        if (this.$store.state.power_list.indexOf("HandleManageAdminRolePatch") !== -1) {
          this.page_patch = true
        }
        if (this.$store.state.power_list.indexOf("HandleManageAdminRoleDelete") !== -1) {
          this.page_delete = true
        }
        if (this.$store.state.power_list.indexOf("HandleManageAdminRoleState") !== -1) {
          this.page_state = true
        }
        if (this.$store.state.power_list.indexOf("HandleManageAdminRoleUpload") !== -1) {
          this.page_upload = true
        }
        if (this.$store.state.power_list.indexOf("HandleManageAdminRoleDownload") !== -1) {
          this.page_download = true
        }
      }
    }
  }
</script>
