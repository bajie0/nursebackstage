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
						<p>对平台的耗材相关信息进行添加操作。</p>
					</div>
					<div class="margin20 paddinglr50">
						<el-form ref="suppliesform" :model="formdata" label-width="80px" label-position="top" :show-message="false">
							<el-row :gutter="20">
								<el-col :span="8">
									<el-form-item label="耗材名称" required="" prop="title">
										<el-input v-model="formdata.title"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="耗材单位" required="" prop="unit">
										<el-input v-model="formdata.unit"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="3">
									<el-form-item label="耗材单价" required="" prop="price">
										<div class="inner-left">
											<el-input v-model="formdata.price" type="number"></el-input>
											<div class="paddinglr10">元</div>
										</div>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="8">
									<el-form-item label="耗材与规格绑定" prop="list">
										<el-select filterable v-model="formdata.list" multiple placeholder="请选择">
											<div slot="empty" class="inner-justify padding20">
												<div>
													当前还没有规格
												</div>
												<el-button type="primary" size="mini" @click="tospecification">新增规格</el-button>
											</div>
											<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
											</el-option>
										</el-select>
									</el-form-item>
								</el-col>
							</el-row>
							<el-button type="primary" @click="save">保存</el-button>
							<el-button @click="reset">重置</el-button>
						</el-form>
					</div>
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
				// Form表单Title
				header_title: "新增耗材",
				//耗材数据
				formdata: {
					title: '',
					unit: '',
					price: '',
					//选择绑定的规格数组
					list: []
				},
				//规格列表json
				options: []
				
			}
		},
		created() {
			this.getspecification()
		},
		methods: {
			//跳转到新增规格页面
			tospecification(){
				this.$router.push('/specification/add_specification')
			},
			//获取所有的规格名称列表
			getspecification(){
				//调用获取数据接口
				
				
			},
			//保存
			save() {
				if (!this.formdata.title) {
					return this.$message.error('耗材名称不能为空')
				}
				if (!this.formdata.unit) {
					return this.$message.error('耗材单位不能为空')
				}
				if (!this.formdata.price) {
					return this.$message.error('耗材单价不能为空')
				}
				this.$message({
					message: '保存成功',
					type: 'success'
				});
				this.$refs.suppliesform.resetFields()
			},
			//重置
			reset() {
				this.$refs.suppliesform.resetFields()
			}
		}
	}
</script>
