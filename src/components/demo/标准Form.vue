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
            <h2><i class="ion-ios-arrow-forward"></i>Form 表单</h2>
            <p>对平台的权限相关信息进行添加、修改。</p>
          </div>
          <!-- Form start -->
          <el-form class="ui-container-content" ref="formContent" :model="formContent" :label-position="labelPosition" :label-width="labelWidth" :rules="rules">
            <div class="ui-container-form">
              <h4>用户管理</h4>
              <div class="ui-container-form-content">
                <el-row>
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
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="角色说明" prop="role_content">
                      <el-input type="textarea" v-model="formContent.role_content" rows="15"
                                placeholder="请输入角色说明"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="角色说明" prop="role_content">
                      <el-input type="textarea" v-model="formContent.role_content" rows="15"
                                placeholder="请输入角色说明"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div class="ui-container-form-footer">
                <el-button type="primary"><i class="ion-ios-add-circle"></i>提交</el-button>
                <el-button><i class="ion-ios-refresh"></i>重置</el-button>
              </div>
            </div>
          </el-form>
          <!-- Form end -->
        </div>
      </el-main>
      <!-- 内容栏 end -->
    </el-container>
  </el-container>
</template>
<script>
  export default {
    data() {
      return {
        // Form表单设置
        labelPosition: 'top',
        labelWidth: '100px',
        formContent: {
          role_title: '',
          role_code: '',
          role_content: '',
          role_power: ''
        }
      }
    }
  }
</script>
