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
            <p>对平台的组织相关信息进行添加、修改。</p>
          </div>
          <!-- Form start -->
          <div class="ui-container-content-division">
            <el-form class="ui-container-form-division" ref="formContent" :model="formContent" :label-position="labelPosition" :label-width="labelWidth" :rules="rules">
              <el-tabs :tab-position="formPosition">
                <el-tab-pane label="基础信息">
                  <span slot="label">基础信息<p>组织标题、编号、类型等信息</p></span>
                  <h4>基础信息</h4>
                  <div class="ui-container-form-content">
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-form-item label="组织标题" prop="organize_title">
                          <el-input v-model="formContent.organize_title" placeholder="请选择组织标题"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="组织编码" prop="organize_code">
                          <el-input v-model="formContent.organize_code" placeholder="请选择组织编码"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="16">
                        <el-form-item label="联系地址" prop="organize_address">
                          <el-input v-model="formContent.organize_address" placeholder="请选择组织标题"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="邮编" prop="organize_postcode">
                          <el-input v-model="formContent.organize_postcode" placeholder="请选择组织编码"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-form-item label="联系电话" prop="organize_phone">
                          <el-input v-model="formContent.organize_phone" placeholder="请选择联系电话"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="办公电话" prop="organize_office">
                          <el-input v-model="formContent.organize_office" placeholder="请选择办公电话"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="电子邮箱" prop="organize_mail">
                          <el-input v-model="formContent.organize_mail" placeholder="请选择电子邮箱"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <el-form-item label="备注信息" prop="power_content">
                          <el-input type="textarea" v-model="formContent.organize_content" rows="11" placeholder="请输入备注信息"></el-input>
                        </el-form-item>
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
      return {
        // Form表单Title
        header_title: "新增组织",
        // Form表单提交url
        form_url: "/api/create/organize/",
        formPosition: "right",
        // Form表单设置
        labelPosition: 'top',
        labelWidth: '100px',
        formContent: {
          organize_title:'',
          organize_code:'',
          organize_address:'',
          organize_postcode:'',
          organize_phone:'',
          organize_office:'',
          organize_mail:'',
          organize_content:''
        },
        // Form验证
        rules: {
          organize_title: [
            {required: true, message: "请输入组织标题", trigger: 'blur'}
          ],
          organize_code: [
            {required: true, message: "请输入组织编码", trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      if (this.$route.params.organize_id) {
        this.header_title = "修改组织"
        this.form_url = "/api/patch/organize/?id=" + this.$route.params.organize_id
        this.getOrganizeData()
      } else {
        this.header_title = "新增组织"
        this.form_url = "/api/create/organize/"
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
      // 引入编辑组织Form
      getOrganizeData() {
        let url = "/api/get/organize_form/?id=" + this.$route.params.organize_id
        ApiData(url).then((response) => {
          this.formContent.organize_title = response.form_data[0]['organize_title']
          this.formContent.organize_code = response.form_data[0]['organize_code']
          this.formContent.organize_address = response.form_data[0]['organize_address']
          this.formContent.organize_postcode = response.form_data[0]['organize_postcode']
          this.formContent.organize_phone = response.form_data[0]['organize_phone']
          this.formContent.organize_office = response.form_data[0]['organize_office']
          this.formContent.organize_mail = response.form_data[0]['organize_mail']
          this.formContent.organize_content = response.form_data[0]['organize_content']
        })
      }
    }
  }
</script>
