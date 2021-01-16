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
            <p>对平台的权限相关信息进行添加、修改。</p>
          </div>
          <!-- Form start -->
          <div class="ui-container-content-division">
            <el-form class="ui-container-form-division" ref="formContent" :model="formContent" :label-position="labelPosition" :label-width="labelWidth" :rules="rules">
              <el-tabs :tab-position="formPosition">
                <el-tab-pane label="基础信息">
                  <span slot="label">基础信息<p>权限标题、编号、分类等信息</p></span>
                  <h4>基础信息</h4>
                  <div class="ui-container-form-content">
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <el-form-item label="权限分类" prop="power_type">
                          <el-radio-group v-model="formContent.power_type" size="medium">
                            <el-radio-button :label="1">系统级</el-radio-button>
                            <el-radio-button :label="2">页面级</el-radio-button>
                            <el-radio-button :label="3">功能级</el-radio-button>
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-form-item label="上级权限" prop="power_parent">
                          <el-select v-model="formContent.power_parent" placeholder="请选择上级权限" filterable clearable>
                            <div v-for="item_one in power_data" :key="item_one.id">
                              <el-option :key="item_one.id" :value="item_one.id" :label="'|- '+item_one.label"></el-option>
                              <div v-for="item_two in item_one.children" :key="item_two.id">
                                <el-option :key="item_two.id" :value="item_two.id" :label="'|---- '+item_two.label"></el-option>
                                <div v-for="item_three in item_two.children" :key="item_three.id">
                                  <el-option :key="item_three.id" :value="item_three.id" :label="'|------ '+item_three.label"></el-option>
                                  <div v-for="item_four in item_three.children" :key="item_four.id">
                                    <el-option :key="item_four.id" :value="item_four.id" :label="'|-------- '+item_four.label"></el-option>
                                    <div v-for="item_five in item_four.children" :key="item_five.id">
                                      <el-option :key="item_five.id" :value="item_five.id" :label="'|---------- '+item_five.label"></el-option>
                                      <div v-for="item_six in item_five.children" :key="item_six.id">
                                        <el-option :key="item_six.id" :value="item_six.id" :label="'|------------ '+item_six.label"></el-option>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-form-item label="权限标题" prop="power_title">
                          <el-input v-model="formContent.power_title" placeholder="请选择权限标题"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="权限编码" prop="power_code">
                          <el-input v-model="formContent.power_code" placeholder="请选择权限编码"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="3">
                        <el-form-item label="排序" prop="power_sort">
                          <el-input v-model="formContent.power_sort" placeholder="请选择排序"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-form-item label="导航路径" prop="power_path">
                          <el-input v-model="formContent.power_path" placeholder="请选择导航路径"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="导航图标" prop="power_icon">
                          <el-input v-model="formContent.power_icon" placeholder="请选择导航图标"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <el-form-item label="权限说明" prop="power_content">
                          <el-input type="textarea" v-model="formContent.power_content" rows="7"
                                    placeholder="请输入权限说明"></el-input>
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
        header_title: "新增权限",
        // Form表单提交url
        form_url: "/api/create/power/",
        formPosition: "right",
        // Form表单设置
        labelPosition: 'top',
        labelWidth: '100px',
        formContent: {
          power_type: '3',
          power_parent: '',
          power_title: '',
          power_code: '',
          power_content: '',
          power_path: '',
          power_icon: '',
          power_sort: '0'
        },
        // Form验证
        rules: {
          power_title: [
            {required: true, message: "请输入权限标题", trigger: 'blur'}
          ],
          power_code: [
            {required: true, message: "请输入权限编码", trigger: 'blur'}
          ]
        },
        // 上级权限
        power_data: []
      }
    },
    created() {
      this.getPowerJson()
      if (this.$route.query.id) {
        this.header_title = "修改权限"
        this.form_url = "/api/patch/power/?id=" + this.$route.query.id
        this.getPowerData()
      } else {
        this.header_title = "新增权限"
        this.form_url = "/api/create/power/"
      }
	  console.log(this.form_url)
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
      // 引入权限json
      getPowerJson() {
        let url = "/api/get/power_tree/"
        ApiData(url).then((response) => {
          this.power_data = response.data
        })
      },
      // 引入编辑权限Form
      getPowerData() {
        let url = "/api/get/power_form/"
        ApiData(url,{
					id:this.$route.query.id
				}).then((response) => {
          this.formContent.power_type = response.form_data[0]['power_type']
          this.formContent.power_parent = response.form_data[0]['power_parent']
          this.formContent.power_title = response.form_data[0]['power_title']
          this.formContent.power_code = response.form_data[0]['power_code']
          this.formContent.power_content = response.form_data[0]['power_content']
          this.formContent.power_path = response.form_data[0]['power_path']
          this.formContent.power_icon = response.form_data[0]['power_icon']
          this.formContent.power_sort = response.form_data[0]['power_sort']
        })
      }
    }
  }
</script>
