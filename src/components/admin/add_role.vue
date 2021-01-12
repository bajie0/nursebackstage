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
          <div class="ui-container-header">
            <h2><i class="ion-ios-arrow-forward"></i>{{header_title}}</h2>
            <p>对平台的角色相关信息进行添加、修改。</p>
          </div>
          <!-- Form start -->
          <div class="ui-container-content-division">
            <el-form class="ui-container-form-division" ref="formContent" :model="formContent" :label-position="labelPosition" :label-width="labelWidth" :rules="rules">
              <el-tabs :tab-position="formPosition">
                <el-tab-pane label="基础信息">
                  <span slot="label">基础信息<p>角色标题、编号、分类等信息</p></span>
                  <h4>基础信息</h4>
                  <div class="ui-container-form-content">
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-form-item label="角色标题" prop="role_title">
                          <el-input v-model="formContent.role_title" placeholder="请选择角色标题"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="角色编码" prop="role_code">
                          <el-input v-model="formContent.role_code" placeholder="请选择角色编码"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <el-form-item label="角色说明" prop="role_content">
                          <el-input type="textarea" v-model="formContent.role_content" rows="15"
                                    placeholder="请输入角色说明"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="权限信息">
                  <span slot="label">权限信息<p>角色权限分配信息</p></span>
                  <h4>权限信息</h4>
                  <div class="ui-container-form-content">
                    <el-row :gutter="20">
                      <el-col :span="12" class="ui-form-tree">
                        <div class="ui-form-tree-search">
                          <i class="ion-ios-search ui-tree-icon"></i>
                          <el-input placeholder="请输入权限标题检索" v-model="filterPower"></el-input>
                        </div>
                        <el-tree :data="power_data" show-checkbox default-expand-all
                                 :filter-node-method="filterPowerNode" node-key="id" ref="power_tree"
                                 :default-checked-keys="filterPowerDefault" highlight-current @check="checkChangePower"
                                 :props="defaultPowerProps"></el-tree>
                      </el-col>
                    </el-row>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-form>
          </div>
          <div class="ui-container-footer-division">
            <el-button type="primary" @click="formSubmit('formContent')"><i class="ion-ios-add-circle"></i>提交
            </el-button>
            <el-button @click="onReset('formContent')"><i class="ion-ios-refresh"></i>重置</el-button>
          </div>
          <!-- Form end -->
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
  } from '@/axios/axios'

  export default {
    data() {
      return {
        // Form表单Title
        header_title: "新增角色",
        // Form表单提交url
        form_url: "/api/create/role/",
        formPosition: "right",
        // Form表单设置
        labelPosition: 'top',
        labelWidth: '100px',
        formContent: {
          role_title: '',
          role_code: '',
          role_content: '',
          role_power: ''
        },
        // Form验证
        rules: {
          role_title: [
            {required: true, message: "请输入角色标题", trigger: 'blur'}
          ],
          role_code: [
            {required: true, message: "请输入角色编码", trigger: 'blur'}
          ]
        },
        // 权限数据
        power_data: [],
        // 权限树形框初始值
        filterPower: '',
        defaultPowerProps: {
          children: 'children',
          label: 'label'
        },
        // 权限树形框默认选中
        filterPowerDefault: []
      }
    },
    watch: {
      // 权限树形框搜索
      filterPower(val) {
        this.$refs.power_tree.filter(val);
      }
    },
    created() {
      this.getPowerJson()
      if (this.$route.params.role_id) {
        this.header_title = "修改角色"
        this.form_url = "/api/patch/role/?id=" + this.$route.params.role_id
        this.getRoleData()
      } else {
        this.header_title = "新增角色"
        this.form_url = "/api/create/role/"
      }
    },
    methods: {
      // Form表单提交
      formSubmit(formContent) {
        this.$refs[formContent].validate((valid) => {
          if (valid) {
            let url = this.form_url
            ApiCreate(url, this.formContent).then((response) => {
              this.$message.success(response)
            })
          }
        })
      },
      // 重置Form表单
      onReset(formContent) {
        this.$refs[formContent].resetFields();
      },
      // 权限树形框选中事件
      checkChangePower() {
        let tree_data = this.$refs.power_tree.getCheckedKeys()
        let tree_text = ""
        for (var i = 0; i < tree_data.length; i++) {
          tree_text = tree_text + tree_data[i] + ","
        }
        tree_text = tree_text.substring(0, tree_text.lastIndexOf(','))
        this.formContent.role_power = tree_text
      },
      // 权限树形框搜索
      filterPowerNode(value, power_data) {
        if (!value) return true;
        return power_data.label.indexOf(value) !== -1;
      },
      // 引入权限json
      getPowerJson() {
        let url = "/api/get/power_tree/"
        ApiData(url).then((response) => {
          this.power_data = response.data
        })
      },
      // 引入编辑角色Form
      getRoleData() {
        let url = "/api/get/role_form/?id=" + this.$route.params.role_id
        ApiData(url).then((response) => {
          this.formContent.role_title = response.form_data[0]['role_title']
          this.formContent.role_code = response.form_data[0]['role_code']
          this.formContent.role_content = response.form_data[0]['role_content']
          this.filterPowerDefault = response.form_data[0]['role_power']
          for (var i = 0; i < response.form_data[0]['role_power'].length; i++) {
            this.formContent.role_power = this.formContent.role_power + "," + response.form_data[0]['role_power'][i]
          }
          this.formContent.role_power = this.formContent.role_power.substr(1)
        })
      }
    }
  }
</script>
