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
            <p>对平台的管理员相关信息进行添加、修改。</p>
          </div>
          <!-- Form start -->
          <div class="ui-container-content-division">
            <el-form class="ui-container-form-division" ref="formContent" :model="formContent" :label-position="labelPosition" :label-width="labelWidth" :rules="rules">
              <el-tabs :tab-position="formPosition">
                <el-tab-pane label="基础信息">
                  <span slot="label">基础信息<p>管理员标题、编号、分类等信息</p></span>
                  <h4>基础信息</h4>
                  <div class="ui-container-form-content">
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-form-item label="管理员编号" prop="admin_code">
                          <el-input v-model="formContent.admin_code" placeholder="请选择管理员编号"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="管理员姓名" prop="admin_title">
                          <el-input v-model="formContent.admin_title" placeholder="请选择管理员姓名"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8" style="position: relative">
                        <el-upload class="avatar-uploader ui-upload-avatar" :action="upload_url" :headers="{'token':this.$cookies.get('token')}" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                          <img v-if="imageUrl" :src="imageUrl" class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-form-item label="用户名" prop="admin_user_name">
                          <el-input v-model="formContent.admin_user_name" placeholder="请选择用户名"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-form-item label="密码" prop="admin_pass_word">
                          <el-input v-model="formContent.admin_pass_word" placeholder="请选择密码" show-password :disabled="input_state"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="确认密码" prop="admin_pass_word_confirm">
                          <el-input v-model="formContent.admin_pass_word_confirm" placeholder="请选择确认密码" show-password :disabled="input_state"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-form-item label="联系电话" prop="admin_phone">
                          <el-input v-model="formContent.admin_phone" placeholder="请选择联系电话"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="电子邮箱" prop="admin_mail">
                          <el-input v-model="formContent.admin_mail" placeholder="请选择电子邮箱"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <el-form-item label="管理员说明" prop="admin_content">
                          <el-input type="textarea" v-model="formContent.admin_content" rows="6" placeholder="请输入管理员说明"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="角色信息">
                  <span slot="label">角色信息<p>管理员角色分配信息</p></span>
                  <h4>角色信息</h4>
                  <div class="ui-container-form-content">
                    <el-row :gutter="20">
                      <el-col :span="12" class="ui-form-tree">
                        <div class="ui-form-tree-search">
                          <i class="ion-ios-search ui-tree-icon"></i>
                          <el-input placeholder="请输入角色标题检索" v-model="filterRole"></el-input>
                        </div>
                        <el-tree :data="role_data" show-checkbox default-expand-all :filter-node-method="filterRoleNode" node-key="id" ref="role_tree" highlight-current @check="checkChangeRole" :props="defaultRoleProps" :default-checked-keys="filterRoleDefault"></el-tree>
                      </el-col>
                    </el-row>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-form>
          </div>
          <div class="ui-container-footer-division">
            <el-button type="primary" @click="formSubmit('formContent')"><i class="ion-ios-add-circle"></i>提交</el-button>
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
      // 自定义密码验证
      var pass_verification = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入确认密码'))
        } else if (value !== this.formContent.admin_pass_word) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      };

      return {
        // Form表单Title
        header_title: "新增管理员",
        // Form表单提交url
        form_url: "/api/create/admin/",
        input_state: false,
        // 头像上传初始化
        imageUrl: '',
        // 头像上传url
        upload_url: this.$api_url+"/api/upload/avatar/",
        // Tabs设置
        formPosition: "right",
        // Form表单设置
        labelPosition: 'top',
        labelWidth: '100px',
        formContent: {
          admin_code: '',
          admin_title: '',
          admin_user_name: '',
          admin_pass_word: '',
          admin_pass_word_confirm: '',
          admin_phone: '',
          admin_mail: '',
          admin_content: '',
          admin_role: '',
          admin_organize: '',
          avatar_upload: ''
        },
        // Form验证
        rules: {
          admin_code: [
            {required: true, message: "请输入管理员编号", trigger: 'blur'}
          ],
          admin_user_name: [
            {required: true, message: "请输入管理员姓名", trigger: 'blur'}
          ],
          admin_pass_word: [
            {required: true, message: "请输入密码", trigger: 'blur'}
          ],
          admin_pass_word_confirm: [
            {required: true, validator: pass_verification, trigger: 'blur'}
          ]
        },
        // 角色数据
        role_data: [],
        // 角色树形框初始值
        filterRole: '',
        defaultRoleProps: {
          children: 'children',
          label: 'label'
        },
        // 角色树形框默认选中
        filterRoleDefault: []
      }
    },
    watch: {
      // 角色树形框搜索
      filterRole(val) {
        this.$refs.role_tree.filter(val);
      }
    },
    created() {
      this.getRoleJson()
      if (this.$route.params.admin_id) {
        this.header_title = "修改管理员"
        this.form_url = "/api/patch/admin/?id="+this.$route.params.admin_id
        this.getAdminData()
        this.rules.admin_pass_word[0].required = false
        this.rules.admin_pass_word_confirm[0].required = false
        this.rules.admin_pass_word_confirm[0].validator = null
        this.input_state = true
      } else {
        this.header_title = "新增管理员"
        this.form_url = "/api/create/admin/"
      }
      this.getPageAuthority()
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
      // 角色树形框选中事件
      checkChangeRole() {
        let tree_data = this.$refs.role_tree.getCheckedKeys()
        let tree_text = ""
        for (var i = 0; i < tree_data.length; i++) {
          tree_text = tree_text + tree_data[i] + ","
        }
        tree_text = tree_text.substring(0, tree_text.lastIndexOf(','))
        this.formContent.admin_role = tree_text
      },
      // 角色树形框搜索
      filterRoleNode(value, role_data) {
        if (!value) return true;
        return role_data.label.indexOf(value) !== -1;
      },
      // 引入角色json
      getRoleJson() {
        let url = "/api/get/role_tree/"
        ApiData(url).then((response) => {
          this.role_data = response.data
        })
      },
      // 头像上传默认
      handleAvatarSuccess(res, file) {
        this.formContent.avatar_upload = res.data
        this.imageUrl = URL.createObjectURL(file.raw)
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error("上传头像图片只能是 JPG 格式!");
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        this.formContent.avatar_upload = file
        return isJPG && isLt2M;
      },
      // 引入编辑管理员Form
      getAdminData() {
        let url = "/api/get/admin_form/?id=" + this.$route.params.admin_id
        ApiData(url).then((response) => {
          this.formContent.admin_code = response.form_data[0]['admin_code']
          this.formContent.admin_title = response.form_data[0]['admin_title']
          this.formContent.admin_user_name = response.form_data[0]['admin_user_name']
          this.formContent.admin_phone = response.form_data[0]['admin_phone']
          this.formContent.admin_mail = response.form_data[0]['admin_mail']
          this.formContent.admin_content = response.form_data[0]['admin_content']
          this.formContent.avatar_upload = response.form_data[0]['avatar_upload']
          if (response.form_data[0]['avatar_upload']) {
            this.imageUrl = this.$api_url + "/resource/upload" + response.form_data[0]['avatar_upload']
          }
          this.filterRoleDefault = response.form_data[0]['admin_role']
          for (var i = 0; i < response.form_data[0]['admin_role'].length; i++) {
            this.formContent.admin_role = this.formContent.admin_role + "," + response.form_data[0]['admin_role'][i]
          }
          this.formContent.admin_role = this.formContent.admin_role.substr(1)
        })
      }
    }
  }
</script>
