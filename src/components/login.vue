<template>
	<div class="ui-login-body">
		<div class="ui-login-shadow"></div>
		<div class="ui-login-form">
			<div class="ui-login-logo">
				<img src="@/assets/logo.png">
				<span>系统登录</span>
				<p>System login</p>
			</div>
			<el-form ref="formLogin" :model="formLogin" :label-position="labelPosition" :rules="rules" class="ui-login-content">
				<el-row>
					<el-col :span="16" :offset="4">
						<el-form-item prop="user_name">
							<i class="ion-ios-contact"></i>
							<el-input v-model="formLogin.user_name" placeholder="请输入用户名 / 手机号"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="16" :offset="4">
						<el-form-item prop="pass_word">
							<i class="ion-ios-lock"></i>
							<el-input v-model="formLogin.pass_word" placeholder="请输入密码" show-password></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="16" :offset="4">
						<el-button type="primary" @click="formSubmit('formLogin')">登录</el-button>
					</el-col>
					<el-col :span="16" :offset="4">
						<el-link>注册新用户</el-link>
						<el-link>忘记密码？</el-link>
					</el-col>
				</el-row>
			</el-form>
			<div class="ui-login-footer">
				<p>Copyright © 2020 临汾市人民医院 .All Rights Reserved.Designed by</p>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		ApiLogin,
		ApiData
	} from '@/axios/axios'
	import "../../static/css/login.css"
	import cookies from "vue-cookies"

	export default {
		data() {
			return {
				// 验证码初始值
				captchaCode: '',
				// Form表单设置
				labelPosition: 'top',
				// Form表单
				formLogin: {
					user_name: 'Aaron_admin',
					pass_word: 'WANG_1986@0302'
				},
				// Form验证
				rules: {
					user_name: [{
						required: true,
						message: "请输入用户名 / 手机号",
						trigger: 'blur'
					}],
					pass_word: [{
						required: true,
						message: "请输入密码",
						trigger: 'blur'
					}]
				},
			}
		},
		methods: {
			// 保存用户名
			saveusername() {
				this.$store.state.$username = this.formLogin.user_name
			},
			// Form表单提交
			formSubmit(formLogin) {
				this.$refs[formLogin].validate((valid) => {
					if (valid) {
						let url = "/api/login/admin_login/"
						ApiLogin(url, this.formLogin).then((response) => {
							if (response.code === 200) {
								this.$message.success(response.message)
								cookies.set('token', response.token)
								this.saveusername()
								this.$router.push("/index")
							} else {
								this.$message.error(response.message)
							}
						})
					}
				})
			}
		}
	}
</script>
