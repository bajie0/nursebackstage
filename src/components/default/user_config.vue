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
            <h2><i class="ion-ios-arrow-forward"></i>管理员基础设置</h2>
            <p>对已登录管理员的信息、密码、系统进行基础设置。</p>
          </div>
          <!-- Form start -->
          <div class="ui-container-content-division">
            <el-form class="ui-container-form-division" ref="formContent" :model="formContent"
                     :label-position="labelPosition" :label-width="labelWidth">
              <el-tabs :tab-position="formPosition">
                <el-tab-pane label="基础设置">
                  <span slot="label">基础设置<p>个人账户信息设置</p></span>
                  <h4>基础设置</h4>
                  <div class="ui-container-form-content">
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-form-item label="管理员编号" prop="admin_code">
                          <el-input v-model="formContent.admin_code" placeholder="请选择管理员编号" :disabled="true"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8" style="position: relative">
                        <el-upload class="avatar-uploader ui-upload-avatar" :action="upload_url"
                                   :headers="{'token':this.$cookies.get('token')}" :show-file-list="false"
                                   :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                          <img v-if="imageUrl" :src="imageUrl" class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-form-item label="管理员姓名" prop="admin_title">
                          <el-input v-model="formContent.admin_title" placeholder="请选择管理员姓名"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-form-item label="用户名" prop="admin_user_name">
                          <el-input v-model="formContent.admin_user_name" placeholder="请选择用户名"
                                    :disabled="true"></el-input>
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
                          <el-input type="textarea" v-model="formContent.admin_content" rows="7" placeholder="请输入管理员说明"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="安全设置">
                  <span slot="label">安全设置<p>密码、邮箱等设置</p></span>
                  <h4>安全设置</h4>
                  <div class="ui-container-form-content">
                    <div class="ui-user-list">
                      <span>账户密码</span>
                      <p>绑定手机和邮箱，并设置密码，帐号更安全</p>
                      <el-link type="text" @click="edit_pass = true">修改</el-link>
                    </div>
                    <div class="ui-user-list">
                      <span>绑定手机</span>
                      <p>已绑定手机号：+86185****0000</p>
                      <el-link>修改</el-link>
                    </div>
                    <div class="ui-user-list">
                      <span>密保问题</span>
                      <p>未设置密保问题，密保问题可有效保护账户安全</p>
                      <el-link>修改</el-link>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="消息通知">
                  <span slot="label">消息通知<p>各种消息通知的设置</p></span>
                  <h4>消息通知</h4>
                  <div class="ui-container-form-content">
                    <div class="ui-user-list">
                      <span>系统通知</span>
                      <p>平台向您发消息时的通知</p>
                      <el-switch v-model="system_switch" @change="systemSwitch($event)"></el-switch>
                    </div>
                    <div class="ui-user-list">
                      <span>审批通知</span>
                      <p>平台向您发审批时的通知</p>
                      <el-switch v-model="approval_switch" @change="approvalSwitch($event)"></el-switch>
                    </div>
                    <div class="ui-user-list">
                      <span>IM消息</span>
                      <p>IM平台向您发私人消息时的通知</p>
                      <el-switch v-model="im_switch" @change="imSwitch($event)"></el-switch>
                    </div>
                    <div class="ui-user-list">
                      <span>短信设置</span>
                      <p>平台是否默认向您绑定的手机号，发送相关消息时的通知</p>
                      <el-switch v-model="message_switch" @change="messageSwitch($event)"></el-switch>
                    </div>
                    <div class="ui-user-list">
                      <span>邮件设置</span>
                      <p>平台是否默认向您绑定的电子邮箱，发送相关消息时的通知</p>
                      <el-switch v-model="mail_switch" @change="mailSwitch($event)"></el-switch>
                    </div>
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
    <el-dialog class="ui-edit-pass" title="修改管理员密码" :visible.sync="edit_pass" width="30%" center>
      <el-form ref="formPassContent" :model="formPassContent" :label-position="labelPosition" :rules="formPassRules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="原始密码" prop="pass_word_primary">
              <el-input v-model="formPassContent.pass_word_primary" placeholder="请输入原始密码" show-password></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="密码" prop="pass_word_new">
              <el-input v-model="formPassContent.pass_word_new" placeholder="请输入密码" show-password></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="确认密码" prop="pass_word_confirm">
              <el-input v-model="formPassContent.pass_word_confirm" placeholder="请输入确认密码" show-password></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onPassReset('formPassContent')">取 消</el-button>
        <el-button type="primary" @click="formPassSubmit('formPassContent')">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>
<script>
  import {
    ApiData,
    ApiPatch,
    ApiState,
  } from '@/axios/axios'

  export default {
    data() {
      // 自定义密码验证
      var pass_verification = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入确认密码'));
        } else if (value !== this.formPassContent.pass_word_new) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        input_state: false,
        // 头像上传初始化
        imageUrl: '',
        // 头像上传url
        upload_url: this.$api_url + "/api/upload/avatar/",
        // Tabs设置
        formPosition: "right",
        // Form表单设置
        labelPosition: 'top',
        labelWidth: '100px',
        formContent: {
          admin_code: '',
          admin_title: '',
          admin_user_name: '',
          admin_phone: '',
          admin_mail: '',
          admin_content: '',
          avatar_upload: ''
        },
        // 账户密码表单设置
        formPassContent: {
          pass_word_primary: '',
          pass_word_new: '',
          pass_word_confirm: ''
        },
        // Form验证
        formPassRules: {
          pass_word_primary: [
            {required: true, message: "请输入原始密码", trigger: 'blur'}
          ],
          pass_word_new: [
            {required: true, message: "请输入密码", trigger: 'blur'}
          ],
          pass_word_confirm: [
            {required: true, validator: pass_verification, trigger: 'blur'}
          ]
        },
        // 系统通知
        system_switch: true,
        // 审批通知
        approval_switch: true,
        // IM消息
        im_switch: false,
        // 短信设置
        message_switch: true,
        // 邮件设置
        mail_switch: false,
        // 修改管理员密码
        edit_pass: false,
      }
    },
    created() {
      this.getAdminData()
      this.getStateData()
    },
    methods: {
      formSubmit(formContent) {
        this.$refs[formContent].validate((valid) => {
          if (valid) {
            let url = "/api/patch/login_admin/"
            ApiPatch(url, this.formContent).then((response) => {
              this.$message.success(response)
            })
          }
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
        let url = "/api/get/login_title/"
        ApiData(url).then((response) => {
          this.formContent.admin_code = response.data[0]['code']
          this.formContent.admin_title = response.data[0]['title']
          this.formContent.admin_user_name = response.data[0]['user_name']
          this.formContent.admin_phone = response.data[0]['phone']
          this.formContent.admin_mail = response.data[0]['mail']
          this.formContent.admin_content = response.data[0]['content']
          this.formContent.avatar_upload = response.data[0]['avatar']
          if (response.data[0]['avatar']) {
            this.imageUrl = this.$api_url + "/resource/upload" + response.data[0]['avatar']
          }
        })
      },
      // 引入编辑管理员State
      getStateData() {
        let url = "/api/get/login_state/"
        ApiData(url).then((response) => {
          this.system_switch = response.data[0]['system']
          this.approval_switch = response.data[0]['approval']
          this.im_switch = response.data[0]['im']
          this.message_switch = response.data[0]['message']
          this.mail_switch = response.data[0]['mail']
        })
      },
      // 系统通知 - 开关
      systemSwitch($event) {
        let url = "/api/state/system_state/"
        let params = {"state": $event}
        ApiState(url, params).then((response) => {
          this.$message.success(response)
        })
      },
      // 审批通知 - 开关
      approvalSwitch($event) {
        let url = "/api/state/approval_state/"
        let params = {"state": $event}
        ApiState(url, params).then((response) => {
          this.$message.success(response)
        })
      },
      // IM消息 - 开关
      imSwitch($event) {
        let url = "/api/state/im_state/"
        let params = {"state": $event}
        ApiState(url, params).then((response) => {
          this.$message.success(response)
        })
      },
      // 短信设置 - 开关
      messageSwitch($event) {
        let url = "/api/state/message_state/"
        let params = {"state": $event}
        ApiState(url, params).then((response) => {
          this.$message.success(response)
        })
      },
      // 邮件设置 - 开关
      mailSwitch($event) {
        let url = "/api/state/mail_state/"
        let params = {"state": $event}
        ApiState(url, params).then((response) => {
          this.$message.success(response)
        })
      },
      // 重置修改密码Form表单
      onPassReset(formPassContent) {
        this.$refs[formPassContent].resetFields()
        this.edit_pass = false
      },
      // 修改密码Form表单提交
      formPassSubmit(formPassContent) {
        this.$refs[formPassContent].validate((valid) => {
          if (valid) {
            let url = "/api/patch/edit_pass_word/"
            ApiPatch(url, this.formPassContent).then((response) => {
              this.edit_pass = false
              this.$alert(response, "密码修改结果", {
                dangerouslyUseHTMLString: true
              })
            })
          }
        })
      },
    }
  }
</script>
