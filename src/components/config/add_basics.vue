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
            <p>对平台的全局字典相关信息进行添加、修改。</p>
          </div>
          <!-- Form start -->
          <div class="ui-container-content-division">
            <el-form class="ui-container-form-division" ref="formContent" :model="formContent" :label-position="labelPosition" :label-width="labelWidth" :rules="rules">
              <el-tabs :tab-position="formPosition">
                <el-tab-pane label="基础信息">
                  <span slot="label">基础信息<p>全局字典标题、编号、分类等信息</p></span>
                  <h4>基础信息</h4>
                  <div class="ui-container-form-content">
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <el-form-item label="全局字典分类" prop="basics_type">
                          <el-radio-group v-model="formContent.basics_type" size="medium">
                            <el-radio-button :label="1">分类级</el-radio-button>
                            <el-radio-button :label="2">数据级</el-radio-button>
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-form-item label="上级全局字典" prop="basics_parent">
                          <el-select v-model="formContent.basics_parent" placeholder="请选择上级全局字典" filterable>
                            <el-option v-for="item_one in basics_data" :key="item_one.id" :value="item_one.id" :label="item_one.label"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-form-item label="全局字典标题" prop="basics_title">
                          <el-input v-model="formContent.basics_title" placeholder="请选择全局字典标题"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="全局字典编码" prop="basics_code">
                          <el-input v-model="formContent.basics_code" placeholder="请选择全局字典编码"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <el-form-item label="全局字典说明" prop="basics_content">
                          <el-input type="textarea" v-model="formContent.basics_content" rows="12" placeholder="请输入全局字典说明"></el-input>
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
        header_title: "新增全局字典",
        // Form表单提交url
        form_url: "/api/create/basics/",
        formPosition: "right",
        // Form表单设置
        labelPosition: 'top',
        labelWidth: '100px',
        formContent: {
          basics_type: '2',
          basics_parent: '',
          basics_title: '',
          basics_code: '',
          basics_content: ''
        },
        // Form验证
        rules: {
          basics_title: [
            {required: true, message: "请输入全局字典标题", trigger: 'blur'}
          ],
          basics_code: [
            {required: true, message: "请输入全局字典编码", trigger: 'blur'}
          ]
        },
        // 上级权限
        basics_data: []
      }
    },
    created() {
      this.getBasicsJson()
      if (this.$route.params.basics_id) {
        this.header_title = "修改全局字典"
        this.form_url = "/api/patch/basics/?id="+this.$route.params.basics_id
        this.getBasicsData()
      } else {
        this.header_title = "新增全局字典"
        this.form_url = "/api/create/basics/"
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
      // 引入上级字典json
      getBasicsJson() {
        let url = "/api/get/basics_select/"
        ApiData(url).then((response) => {
          this.basics_data = response.data
        })
      },
      // 引入编辑全局字典Form
      getBasicsData() {
        let url = "/api/get/basics_form/?id=" + this.$route.params.basics_id
        ApiData(url).then((response) => {
          this.formContent.basics_type = response.form_data[0]['basics_type']
          this.formContent.basics_parent = response.form_data[0]['basics_parent']
          this.formContent.basics_title = response.form_data[0]['basics_title']
          this.formContent.basics_code = response.form_data[0]['basics_code']
          this.formContent.basics_content = response.form_data[0]['basics_content']
        })
      }
    }
  }
</script>
